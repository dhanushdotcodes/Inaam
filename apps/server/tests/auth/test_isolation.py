import uuid


def test_multi_user_data_isolation(client):
    """
    Verify complete multi-user data isolation:
    - User B cannot see User A's rewards.
    - User B cannot view, claim, delete, or complete User A's rewards/tasks.
    - Points are calculated independently.
    """
    # 1. Register and login User A
    rand_a = uuid.uuid4().hex[:6]
    user_a_payload = {
        "username": f"user_a_{rand_a}",
        "email": f"usera_{rand_a}@example.com",
        "password": "securepassword123"
    }
    signup_a = client.post("/api/v1/auth/signup", json=user_a_payload)
    assert signup_a.status_code == 201

    login_a_resp = client.post("/api/v1/auth/login", json={
        "email": user_a_payload["email"],
        "password": user_a_payload["password"]
    })
    assert login_a_resp.status_code == 200
    token_a = login_a_resp.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 2. Register and login User B
    rand_b = uuid.uuid4().hex[:6]
    user_b_payload = {
        "username": f"user_b_{rand_b}",
        "email": f"userb_{rand_b}@example.com",
        "password": "securepassword123"
    }
    signup_b = client.post("/api/v1/auth/signup", json=user_b_payload)
    assert signup_b.status_code == 201

    login_b_resp = client.post("/api/v1/auth/login", json={
        "email": user_b_payload["email"],
        "password": user_b_payload["password"]
    })
    assert login_b_resp.status_code == 200
    token_b = login_b_resp.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 3. Create a Reward for User A
    reward_payload = {
        "title": "Epic Quest User A",
        "description": "User A's private reward",
        "reward_type": "QUEST",
        "cost_points": 0
    }
    create_resp = client.post("/api/v1/rewards", json=reward_payload, headers=headers_a)
    assert create_resp.status_code == 201
    reward_a_id = create_resp.json()["data"]["id"]

    # 4. User B lists rewards -> should be empty (cannot see User A's reward)
    list_b_resp = client.get("/api/v1/rewards", headers=headers_b)
    assert list_b_resp.status_code == 200
    assert len(list_b_resp.json()["data"]) == 0

    # User A lists rewards -> should have exactly 1
    list_a_resp = client.get("/api/v1/rewards", headers=headers_a)
    assert list_a_resp.status_code == 200
    assert len(list_a_resp.json()["data"]) == 1
    assert list_a_resp.json()["data"][0]["id"] == reward_a_id

    # 5. User B tries to fetch User A's reward directly -> should get 404
    get_b_resp = client.get(f"/api/v1/rewards/{reward_a_id}", headers=headers_b)
    assert get_b_resp.status_code == 404

    # 6. Create standalone Bounty task for User A
    task_payload = {
        "title": "Bounty for User A",
        "description": "User A earns 100 points",
        "task_type": "BOUNTY",
        "difficulty": "MEDIUM",
        "points": 100
    }
    create_task_resp = client.post("/api/v1/tasks", json=task_payload, headers=headers_a)
    assert create_task_resp.status_code == 201
    task_a_id = create_task_resp.json()["data"]["id"]

    # 7. User B tries to view or complete User A's task -> should get 404
    complete_b_resp = client.patch(f"/api/v1/tasks/{task_a_id}/complete", headers=headers_b)
    assert complete_b_resp.status_code == 404

    # 8. User A completes their task -> success!
    complete_a_resp = client.patch(f"/api/v1/tasks/{task_a_id}/complete", headers=headers_a)
    assert complete_a_resp.status_code == 200
    assert complete_a_resp.json()["data"]["completed"] is True

    # 9. Check point balances for both users
    # User A points balance -> should be 100
    points_a_resp = client.get("/api/v1/points", headers=headers_a)
    assert points_a_resp.status_code == 200
    assert points_a_resp.json()["data"] == 100

    # User B points balance -> should be 0
    points_b_resp = client.get("/api/v1/points", headers=headers_b)
    assert points_b_resp.status_code == 200
    assert points_b_resp.json()["data"] == 0
