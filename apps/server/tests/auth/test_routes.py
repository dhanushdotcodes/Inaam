import uuid


def test_login_missing_payload(client):
    """
    Test login failure when payload is missing.
    """
    response = client.post("/api/v1/auth/login", json={})
    assert response.status_code == 422  # Validation error



def test_signup_success(client):
    """
    Test successful user signup.
    """
    rand = uuid.uuid4().hex[:6]
    username = f"user_{rand}"
    email = f"user_{rand}@example.com"
    password = "securepassword123"

    payload = {
        "username": username,
        "email": email,
        "password": password
    }

    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 201
    
    body = response.json()
    assert body["message"] == "success"
    assert body["error"] is None
    
    data = body["data"]
    assert "id" in data
    assert data["username"] == username
    assert data["email"] == email
    assert "password" not in data


def test_signup_duplicate_email(client):
    """
    Test signup failure when email is already registered.
    """
    rand1 = uuid.uuid4().hex[:6]
    rand2 = uuid.uuid4().hex[:6]
    
    email = f"shared_{rand1}@example.com"
    
    # Sign up first user
    user1_payload = {
        "username": f"user_{rand1}",
        "email": email,
        "password": "password123"
    }
    resp1 = client.post("/api/v1/auth/signup", json=user1_payload)
    assert resp1.status_code == 201

    # Sign up second user with same email
    user2_payload = {
        "username": f"user_{rand2}",
        "email": email,
        "password": "password123"
    }
    resp2 = client.post("/api/v1/auth/signup", json=user2_payload)
    assert resp2.status_code == 400
    assert resp2.json()["detail"] == "Email already registered"


def test_signup_duplicate_username(client):
    """
    Test signup failure when username is already taken.
    """
    rand1 = uuid.uuid4().hex[:6]
    rand2 = uuid.uuid4().hex[:6]
    
    username = f"shared_{rand1}"
    
    # Sign up first user
    user1_payload = {
        "username": username,
        "email": f"user_{rand1}@example.com",
        "password": "password123"
    }
    resp1 = client.post("/api/v1/auth/signup", json=user1_payload)
    assert resp1.status_code == 201

    # Sign up second user with same username
    user2_payload = {
        "username": username,
        "email": f"user_{rand2}@example.com",
        "password": "password123"
    }
    resp2 = client.post("/api/v1/auth/signup", json=user2_payload)
    assert resp2.status_code == 400
    assert resp2.json()["detail"] == "Username already taken"


def test_signup_validation_failure(client):
    """
    Test signup validation error with invalid fields.
    """
    # Username too short, invalid email format, password too short
    payload = {
        "username": "ab",
        "email": "invalidemail",
        "password": "123"
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 422


def test_email_login_success(client):
    """
    Test successful login via email and password.
    """
    rand = uuid.uuid4().hex[:6]
    username = f"user_{rand}"
    email = f"user_{rand}@example.com"
    password = "securepassword123"

    # Register user
    signup_payload = {
        "username": username,
        "email": email,
        "password": password
    }
    signup_resp = client.post("/api/v1/auth/signup", json=signup_payload)
    assert signup_resp.status_code == 201

    # Login user
    login_payload = {
        "email": email,
        "password": password
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
    user_data = data["user"]
    assert user_data["username"] == username
    assert user_data["email"] == email


def test_email_login_incorrect_password(client):
    """
    Test login failure with incorrect password.
    """
    rand = uuid.uuid4().hex[:6]
    email = f"user_{rand}@example.com"
    
    # Register user
    signup_payload = {
        "username": f"user_{rand}",
        "email": email,
        "password": "securepassword123"
    }
    signup_resp = client.post("/api/v1/auth/signup", json=signup_payload)
    assert signup_resp.status_code == 201

    # Login with wrong password
    login_payload = {
        "email": email,
        "password": "wrongpassword"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_email_login_nonexistent_user(client):
    """
    Test login failure for nonexistent email.
    """
    login_payload = {
        "email": f"nonexistent_{uuid.uuid4().hex[:6]}@example.com",
        "password": "password123"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

