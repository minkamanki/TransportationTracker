from locust import HttpUser, task, between
import time

class LoadTest(HttpUser):
    wait_time = between(1, 3)
    auth_token = None
    
    @task
    def register_user(self):
        username = f"user_{int(time.time())}"
        formData = {
            "username": username,
            "password": "asdasd"
        }
        response = self.client.post("/register", json=formData)
        print(f"Request Headers: {response.request.headers}")
        print(f"Response Content: {response.content}")

    @task
    def login_user(self):
        formData = {
            "username": "LoadUser",
            "password": "password"
        }
        response = self.client.post("/login", json=formData)
        
        if response.status_code == 200:
            # Extract and save the authentication token
            self.auth_token = response.json().get("token")
        else:
            print(f"Login failed. Response: {response.content}")
            
    @task
    def get_user_profile(self):
        if not self.auth_token:
            print("Authentication token is not available. Skipping task.")
            return

        headers = {"Authorization": f"Bearer {self.auth_token}"}
        response = self.client.get("/profile", headers=headers)

        if response.status_code == 200:
            print(f"Get User Profile Response: {response.content}")
        else:
            print(f"Get User Profile failed. Response: {response.content}")

    @task
    def get_transportations(self):
        if not self.auth_token:
            print("Authentication token is not available. Skipping task.")
            return

        # Use the username from the login task or replace it with the desired username
        username = "LoadUser"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        response = self.client.get(f"/transportations/{username}", headers=headers)

        if response.status_code == 200:
            print(f"Get Transportations Response: {response.content}")
        else:
            print(f"Get Transportations failed. Response: {response.content}")
            
    @task
    def submit_transportation(self):
        if not self.auth_token:
            print("Authentication token is not available. Skipping task.")
            return

        # Sample transportation data
        transportation_data = {
            "vehicle": "Car",
            "amount": 10,
            "measurement": "miles"
        }

        headers = {"Authorization": f"Bearer {self.auth_token}"}
        response = self.client.post("/submit-transportation", json=transportation_data, headers=headers)

        if response.status_code == 201:
            print(f"Submit Transportation Response: {response.content}")
        else:
            print(f"Submit Transportation failed. Response: {response.content}")
