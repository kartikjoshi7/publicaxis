from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello PublicAxis"}
    print("Health check successful!")

if __name__ == "__main__":
    test_health_check()
