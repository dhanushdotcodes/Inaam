import uuid


def test_daily_bonuses(client):
    """
    Test daily bonus points system:
    - User completes tasks under 2000 points today -> No bonus.
    - User crosses 2000 points today -> Receives +300 bonus.
    - User crosses 3000 points today -> Receives +500 bonus.
    - User crosses 4000 points today -> Receives +1000 bonus.
    - User crosses 5000 points today -> Receives +2000 bonus.
    - Bonuses are compounding sequentially.
    - BONUS transactions do not count towards the threshold.
    """
    # 1. Register and login
    rand = uuid.uuid4().hex[:6]
    user_payload = {
        "username": f"user_bonus_{rand}",
        "email": f"userbonus_{rand}@example.com",
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

    # Helper function to create a task
    def create_task(title: str, points: int):
        resp = client.post(
            "/api/v1/tasks",
            json={
                "title": title,
                "description": "Task for daily bonus testing",
                "task_type": "BOUNTY",
                "difficulty": "EXTREME",
                "points": points
            },
            headers=headers
        )
        assert resp.status_code == 201
        return resp.json()["data"]["id"]

    # Helper to complete a task
    def complete_task(task_id: str, tz_offset: int = 0):
        resp = client.patch(
            f"/api/v1/tasks/{task_id}/complete?tz_offset={tz_offset}",
            headers=headers
        )
        assert resp.status_code == 200
        return resp.json()["data"]

    # 2. Complete tasks under 2,000 points threshold
    # Let's earn 1500 points today
    task1_id = create_task("Task 1", 1500)
    complete_task(task1_id)

    # Check total points -> should be exactly 1500 (no bonus yet)
    points_resp = client.get("/api/v1/points", headers=headers)
    assert points_resp.status_code == 200
    assert points_resp.json()["data"] == 1500

    # Check transactions -> only 1 EARNED
    tx_resp = client.get("/api/v1/transactions", headers=headers)
    assert tx_resp.status_code == 200
    txs = tx_resp.json()["data"]
    assert len(txs) == 1
    assert txs[0]["type"] == "EARNED"
    assert txs[0]["points"] == 1500

    # 3. Cross the 2,000 points threshold
    # Create and complete a task for 600 points.
    # Total earned points today becomes 1500 + 600 = 2100.
    # This should trigger the 2,000 milestone bonus (+300 points).
    task2_id = create_task("Task 2", 600)
    complete_task(task2_id)

    # Check total points -> should be 2100 + 300 = 2400 points
    points_resp = client.get("/api/v1/points", headers=headers)
    assert points_resp.json()["data"] == 2400

    # Check transactions -> 2 EARNED, 1 BONUS
    tx_resp = client.get("/api/v1/transactions", headers=headers)
    txs = tx_resp.json()["data"]
    assert len(txs) == 3
    tx_types = [tx["type"] for tx in txs]
    assert "BONUS" in tx_types
    
    # Verify the specific bonus transaction details
    bonus_tx = next(tx for tx in txs if tx["type"] == "BONUS")
    assert bonus_tx["points"] == 300
    assert "Daily Milestone: 2,000 Points Reached!" in bonus_tx["description"]

    # 4. Cross the 3,000 and 4,000 thresholds with a single large task
    # Currently: 2100 earned points today.
    # Let's earn another 2000 points today (total earned points today = 4100).
    # This crosses both 3,000 (awards +500) and 4,000 (awards +1000).
    task3_id = create_task("Task 3", 2000)
    complete_task(task3_id)

    # Check total points -> 4100 (earned) + 300 (2k bonus) + 500 (3k bonus) + 1000 (4k bonus) = 5900
    points_resp = client.get("/api/v1/points", headers=headers)
    assert points_resp.json()["data"] == 5900

    # 5. Verify that BONUS points are not counted towards the daily earned threshold
    # Total earned so far today is 4,100 points.
    # Let's create and complete a task for 500 points.
    # Total earned points today becomes 4,100 + 500 = 4,600 points.
    # Since 4,600 < 5,000, no 5K bonus should be triggered.
    task4_id = create_task("Task 4", 500)
    complete_task(task4_id)

    # Check total points -> 4600 (earned) + 1800 (bonuses) = 6400 points
    points_resp = client.get("/api/v1/points", headers=headers)
    assert points_resp.json()["data"] == 6400

    # 6. Complete task crossing the 5,000 points threshold
    # Total earned so far is 4,600 points.
    # Complete another task of 500 points -> earned becomes 5,100.
    # This should trigger the 5,000 milestone bonus (+2000 points).
    # Total points should be: 5100 (earned) + 3800 (all bonuses) = 8900
    task5_id = create_task("Task 5", 500)
    complete_task(task5_id)

    points_resp = client.get("/api/v1/points", headers=headers)
    assert points_resp.json()["data"] == 8900

    # Verify transaction count is exactly 9 (5 completed tasks + 4 milestone bonuses)
    tx_resp = client.get("/api/v1/transactions", headers=headers)
    txs = tx_resp.json()["data"]
    assert len(txs) == 9
    
    # Validate each milestone bonus is awarded exactly once
    bonuses = [tx for tx in txs if tx["type"] == "BONUS"]
    assert len(bonuses) == 4
    bonus_points = [b["points"] for b in bonuses]
    assert sorted(bonus_points) == [300, 500, 1000, 2000]
