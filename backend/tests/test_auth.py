from fastapi import HTTPException
from fastapi.testclient import TestClient

from main import app
from app.routers import auth


def test_login_returns_signed_bearer_token():
    response = TestClient(app).post("/api/auth/login", data={"username": "admin", "password": "secret"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    assert auth.jwt.decode(response.json()["access_token"], auth.SECRET_KEY, algorithms=[auth.ALGORITHM])["sub"] == "admin"


def test_login_rejects_invalid_credentials():
    response = TestClient(app).post("/api/auth/login", data={"username": "admin", "password": "wrong"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}


def test_login_requires_form_fields():
    response = TestClient(app).post("/api/auth/login", data={"username": "admin"})
    assert response.status_code == 422


def test_login_function_rejects_direct_bad_credentials():
    import pytest
    with pytest.raises(HTTPException) as error:
        auth.login(username="someone", password="secret")
    assert error.value.status_code == 401
