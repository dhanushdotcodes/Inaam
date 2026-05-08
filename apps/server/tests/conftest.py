import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """
    Returns a FastAPI TestClient for the application.
    """
    with TestClient(app) as c:
        yield c
