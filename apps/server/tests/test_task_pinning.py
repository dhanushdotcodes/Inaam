import uuid

def test_task_pinning_limit(client):
    """
    Test task pinning limits (max 3 active pinned tasks):
    1. Create 4 tasks.
    2. Pin 3 tasks successfully.
    3. Attempting to pin the 4th task should be blocked (400).
    4. Unpin one task -> Pinning the 4th task should now succeed.
    5. Attempting to create a task already pinned when at limit should be blocked (400).
    6. Complete one of the pinned tasks -> Creating/updating a task to pinned should now succeed.
    """
    # 1. Register and login
    rand = uuid.uuid4().hex[:6]
    user_payload = {
        "username": f"user_pin_{rand}",
        "email": f"userpin_{rand}@example.com",
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

    # 2. Create 4 standalone tasks
    task_ids = []
    for i in range(4):
        payload = {
            "title": f"Test Task {i}",
            "description": "Pin test task",
            "difficulty": "MEDIUM",
            "points": 100,
            "pinned": False
        }
        create_resp = client.post("/api/v1/tasks", json=payload, headers=headers)
        assert create_resp.status_code == 201
        task_ids.append(create_resp.json()["data"]["id"])

    # 3. Pin 3 tasks successfully
    for i in range(3):
        update_resp = client.put(f"/api/v1/tasks/{task_ids[i]}", json={"pinned": True}, headers=headers)
        assert update_resp.status_code == 200
        assert update_resp.json()["data"]["pinned"] is True

    # 4. Attempt to pin the 4th task -> should fail (400)
    failed_update = client.put(f"/api/v1/tasks/{task_ids[3]}", json={"pinned": True}, headers=headers)
    assert failed_update.status_code == 400
    assert "limit" in failed_update.json()["detail"].lower() or "pin" in failed_update.json()["detail"].lower()

    # 5. Unpin one task (task 0)
    unpin_resp = client.put(f"/api/v1/tasks/{task_ids[0]}", json={"pinned": False}, headers=headers)
    assert unpin_resp.status_code == 200
    assert unpin_resp.json()["data"]["pinned"] is False

    # 6. Now pinning the 4th task should succeed
    success_update = client.put(f"/api/v1/tasks/{task_ids[3]}", json={"pinned": True}, headers=headers)
    assert success_update.status_code == 200
    assert success_update.json()["data"]["pinned"] is True

    # 7. Attempt to create a 5th task already pinned -> should fail (400)
    new_pinned_payload = {
        "title": "Create Pinned Failed",
        "description": "Should fail",
        "difficulty": "MEDIUM",
        "points": 100,
        "pinned": True
    }
    failed_create = client.post("/api/v1/tasks", json=new_pinned_payload, headers=headers)
    assert failed_create.status_code == 400

    # 8. Complete one of the active pinned tasks (task 1)
    complete_resp = client.patch(f"/api/v1/tasks/{task_ids[1]}/complete", headers=headers)
    assert complete_resp.status_code == 200
    assert complete_resp.json()["data"]["completed"] is True

    # 9. Now creating a task already pinned should succeed
    success_create = client.post("/api/v1/tasks", json=new_pinned_payload, headers=headers)
    assert success_create.status_code == 201
    assert success_create.json()["data"]["pinned"] is True
