import React, { useState, useEffect } from "react";
import AuthService from "./services/authService"; // Import your authentication service
import axios from "axios";

function ProfilePage() {
  const user = AuthService.getCurrentUser(); // Get the current user from local storage
  const [transportationData, setTransportationData] = useState([]);
  const [newData, setNewData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transportation data when the component mounts
  useEffect(() => {
    // Retrieve transportation data (modify the endpoint as per your backend)
    axios.get("/api/transportation")
      .then((response) => {
        setTransportationData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.response.data.message);
        setIsLoading(false);
      });
  }, []);

  // Handle form submission for adding new data
  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the new data to the server (modify the endpoint as per your backend)
    axios.post("/api/transportation", { newData })
      .then(() => {
        // Refresh the transportation data on successful submission
        axios.get("/api/transportation")
          .then((response) => {
            setTransportationData(response.data);
            setNewData(""); // Clear the input field
          })
          .catch((error) => {
            setError(error.response.data.message);
          });
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  };

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>

      {transportationData.length > 0 ? (
        <div>
          <h3>Your Transportation Data:</h3>
          <ul>
            {transportationData.map((dataItem) => (
              <li key={dataItem.id}>{dataItem.data}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>You have no transportation data.</p>
      )}

      <h3>Add New Transportation Data:</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newData}
          onChange={(e) => setNewData(e.target.value)}
          placeholder="Enter new data"
        />
        <button type="submit">Submit</button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default ProfilePage;
