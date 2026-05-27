import uuid
from datetime import datetime, timezone, timedelta

def test_task_analytics(client):
    """
    Test the task completion analytics endpoint:
    - User registers and logs in.
    - User completes a task -> Points transaction created.
    - User gets analytics -> stats count the completed task correctly for today.
    - Invalid days parameter -> bad request.
    """
    # 1. Register and login
    rand = uuid.uuid4().hex[:6]
    user_payload = {
        "username": f"user_analytics_{rand}",
        "email": f"useranalytics_{rand}@example.com",
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

    # 2. Verify empty analytics (all days zero-filled)
    analytics_resp = client.get("/api/v1/tasks/analytics?days=7", headers=headers)
    assert analytics_resp.status_code == 200
    data = analytics_resp.json()["data"]
    assert data["total_days"] == 7
    completed_data = data["completed_data"]
    assert len(completed_data) == 7
    for key, day_data in completed_data.items():
        assert day_data["completed_tasks"] == 0

    # 3. Create and complete a task
    task_payload = {
        "title": "Analytics Task",
        "description": "To be counted",
        "difficulty": "MEDIUM",
        "points": 500
    }
    create_resp = client.post("/api/v1/tasks", json=task_payload, headers=headers)
    assert create_resp.status_code == 201
    task_id = create_resp.json()["data"]["id"]

    complete_resp = client.patch(f"/api/v1/tasks/{task_id}/complete", headers=headers)
    assert complete_resp.status_code == 200

    # 4. Check analytics again
    analytics_resp = client.get("/api/v1/tasks/analytics?days=7", headers=headers)
    assert analytics_resp.status_code == 200
    data = analytics_resp.json()["data"]
    completed_data = data["completed_data"]
    
    # The last day (day_7) should represent today
    today_data = completed_data["day_7"]
    assert today_data["completed_tasks"] == 1
    
    # All previous days should remain 0
    for i in range(1, 7):
        assert completed_data[f"day_{i}"]["completed_tasks"] == 0

    # 5. Check 14 days and 30 days query parameters
    for days in [14, 30]:
        resp = client.get(f"/api/v1/tasks/analytics?days={days}", headers=headers)
        assert resp.status_code == 200
        assert resp.json()["data"]["total_days"] == days
        assert len(resp.json()["data"]["completed_data"]) == days
        # The last day in the range (day_N) should show the task completion
        assert resp.json()["data"]["completed_data"][f"day_{days}"]["completed_tasks"] == 1

    # 6. Test invalid days query parameter (should fail)
    invalid_resp = client.get("/api/v1/tasks/analytics?days=10", headers=headers)
    assert invalid_resp.status_code == 400
    assert "Days parameter must be 7, 14, or 30" in invalid_resp.json()["detail"]
