import uuid

def test_uncomplete_task(client):
    """
    Test uncompleting standalone tasks and reward objectives:
    - User completes a task -> Points are awarded and transaction created.
    - User uncompletes the task -> Points are deducted, transaction is deleted.
    """
    # 1. Register and login
    rand = uuid.uuid4().hex[:6]
    user_payload = {
        "username": f"user_uncomplete_{rand}",
        "email": f"useruncomplete_{rand}@example.com",
        "password": "securepassword123"
    }
    signup = client.post("/api/v1/auth/signup", json=user_payload)
    assert signup.status_code == 201

    login_resp = client.post("/api/v1/auth/login", json={
        "email": user_payload["email"],
        "password": user_payload["password"]
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create standalone task
    task_payload = {
        "title": "Test Undo Task",
        "description": "Undo test",
        "difficulty": "MEDIUM",
        "points": 500
    }
    create_resp = client.post("/api/v1/tasks", json=task_payload, headers=headers)
    assert create_resp.status_code == 201
    task_id = create_resp.json()["data"]["id"]

    # 3. Complete standalone task
    complete_resp = client.patch(f"/api/v1/tasks/{task_id}/complete", headers=headers)
    assert complete_resp.status_code == 200
    assert complete_resp.json()["data"]["completed"] is True

    # Verify point balance is 500
    points_resp = client.get("/api/v1/points", headers=headers)
    assert points_resp.status_code == 200
    assert points_resp.json()["data"] == 500

    # Verify transaction list has 1 EARNED
    tx_resp = client.get("/api/v1/transactions", headers=headers)
    assert tx_resp.status_code == 200
    txs = tx_resp.json()["data"]
    assert len(txs) == 1
    assert txs[0]["type"] == "EARNED"
    assert txs[0]["task_id"] == task_id

    # 4. Uncomplete standalone task
    uncomplete_resp = client.patch(f"/api/v1/tasks/{task_id}/incomplete", headers=headers)
    assert uncomplete_resp.status_code == 200
    assert uncomplete_resp.json()["data"]["completed"] is False
    assert uncomplete_resp.json()["data"]["completed_at"] is None

    # Verify points reverted to 0
    points_resp = client.get("/api/v1/points", headers=headers)
    assert points_resp.json()["data"] == 0

    # Verify transactions are deleted
    tx_resp = client.get("/api/v1/transactions", headers=headers)
    txs = tx_resp.json()["data"]
    assert len(txs) == 0

