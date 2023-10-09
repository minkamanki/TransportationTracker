/*import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfilePage() {
  const token = localStorage.getItem("token"); // Get the authentication token from localStorage
  const [user, setUser] = useState(null); // Store the user's data
  const [transportationData, setTransportationData] = useState([]);
  const [newData, setNewData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const api_url = "http://localhost:8000";
  useEffect(() => {
    // Check if the user is authenticated
    if (!token) {
      // User is not authenticated, you can handle this as needed (e.g., redirect to login)
      setIsLoading(false);
      return;
    }

    // Retrieve the user's data (modify the endpoint as per your backend)
    axios.get(`${api_url}/user`, {
      headers: {
        Authorization: `Bearer ${token}`, // Set the token in the request headers
      },
    })
      .then((response) => {
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.response.data.message);
        setIsLoading(false);
      });

    // Retrieve transportation data (modify the endpoint as per your backend)
    axios.get(`${api_url}/transportation`, {
      headers: {
        Authorization: `Bearer ${token}`, // Set the token in the request headers
      },
    })
      .then((response) => {
        setTransportationData(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  }, [token]);

  // Handle form submission for adding new data
  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the new data to the server (modify the endpoint as per your backend)
    axios.post(`${api_url}/transportation`, { newData }, {
      headers: {
        Authorization: `Bearer ${token}`, // Set the token in the request headers
      },
    })
      .then(() => {
        // Refresh the transportation data on successful submission
        axios.get(`${api_url}/transportation`, {
          headers: {
            Authorization: `Bearer ${token}`, // Set the token in the request headers
          },
        })
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!token) {
    return <p>You are not logged in. Please log in to view your profile.</p>;
  }

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

      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default ProfilePage;
*/
import React, { useEffect, useState } from "react";
import axios from "axios";

function ProfilePage() {
  const [userName, setUserName] = useState("");
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:3000/";

  useEffect(() => {
    // Check if the user is authenticated (i.e., token exists)
    if (token) {
      axios
        .get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserName(response.data.username);
        })
        .catch((err) => {
          // Handle errors, e.g., token expired or unauthorized
          console.error(err);
        });
    }
  }, [token]);

  return (
    <div>
      {token ? (
        <div>
          <h1>Welcome, {userName}!</h1>
          {/* Display other profile information here */}
        </div>
      ) : (
        <h1>Please log in to view your profile.</h1>
      )}
    </div>
  );
}

export default ProfilePage;
