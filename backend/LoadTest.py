import random
import string
from locust import HttpUser, task, between
import time

class LoadTest(HttpUser):
    wait_time = between(1, 3)
    auth_token = None
    registered_user = None

    @task
    def register_user(self):
        username = f"user_{self.generate_random_string()}_{int(time.time())}"
        formData = {
            "username": username,
            "password": "asdasd"
        }
        response = self.client.post("/register", json=formData)
        
        if response.status_code != 201:
            print(f"Register failed. Response: {response.content}")
        
        # Store the registered user's credentials
        self.registered_user = {"username": username, "password": "asdasd"}

    @task
    def login_user(self):
        if not self.registered_user:
            print("No registered user. Skipping login.")
            return

        formData = {
            "username": self.registered_user["username"],
            "password": self.registered_user["password"]
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

        if response.status_code != 200:
            print(f"Get User Profile failed. Response: {response.content}")

    @task
    def get_transportations(self):
        if not self.auth_token:
            print("Authentication token is not available. Skipping task.")
            return

        headers = {"Authorization": f"Bearer {self.auth_token}"}
        response = self.client.get("/transportations", headers=headers)

        if response.status_code != 200:
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

        if response.status_code != 201:
            print(f"Submit Transportation failed. Response: {response.content}")

    def generate_random_string(self, length=16):
        # Generate a random string of specified length
        return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))
