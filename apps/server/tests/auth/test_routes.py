import hashlib
import base64
from core.config import settings


def test_login_success(client, monkeypatch):
    """
    Test successful login with a valid secret key.
    """
    test_key = "test_password_123"
    # Generate hash for the test key
    test_hash = base64.b64encode(hashlib.sha256(test_key.encode()).digest()).decode()
    
    # Mock the SECRET_KEY setting to match our test hash
    monkeypatch.setattr(settings, "SECRET_KEY", test_hash)
    
    response = client.post("/api/v1/auth/login", json={"key": test_key})
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_key(client, monkeypatch):
    """
    Test login failure with an invalid secret key.
    """
    test_hash = "some_random_hash_that_wont_match"
    monkeypatch.setattr(settings, "SECRET_KEY", test_hash)
    
    response = client.post("/api/v1/auth/login", json={"key": "wrong_key"})
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid secret key"


def test_login_missing_payload(client):
    """
    Test login failure when payload is missing.
    """
    response = client.post("/api/v1/auth/login", json={})
    assert response.status_code == 422  # Validation error
