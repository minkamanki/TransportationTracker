import React, { useEffect, useState } from "react";
import axios from "axios";

function ProfilePage() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:8000";
  const [transportationData, setTransportationData] = useState([]);
  const [vehicle, setVehicle] = useState("airplane");
  const [amount, setAmount] = useState(0);
  const [measurement, setMeasurement] = useState("hours");
  const [error, setError] = useState(null);

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
          setUserId(response.data.id);
        })
        .catch((err) => {
          // Handle errors, e.g., token expired or unauthorized
          console.error(err);
        });
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      vehicle,
      amount,
      measurement,
    };

    //REMOVE LATER
    setTransportationData([...transportationData, formData]);

    // Make a POST request to send the form data to the backend
    axios
      .post(`${API_URL}/submit-transportation`, {formData, userId}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Data submitted successfully:", response.data);

        setVehicle("airplane");
        setAmount(0);
        setMeasurement("hours");
        setError(null);
      })
      .catch((err) => {
        console.error("Error submitting data:", err);
        setError("Error submitting data. Please try again.");
      });
  };

  return (
    <div>
      {token && userName !== "" ? (
        <div>
          <h1>Welcome, {userName}!</h1>
          {transportationData.length > 0 ? (
            <div>
              <h3>Your Transportations:</h3>
              <ul>
                {transportationData.map((dataItem, i) => (
                  <li key={i}>{dataItem.vehicle} {dataItem.amount} {dataItem.measurement}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>You have no transportation data.</p>
          )}

          <h3>Add New Transportation:</h3>
          <form onSubmit={handleSubmit}>
            <label>The means of transportation:</label>
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            >
              <option value="airplane">Airplane</option>
              <option value="bike">Bike</option>
              <option value="boat">Boat</option>
              <option value="bus">Bus</option>
              <option value="car">Car</option>
              <option value="helicopter">Helicopter</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="scooter">Scooter</option>
              <option value="subway">Subway</option>
              <option value="train">Train</option>
              <option value="tram">Tram</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="walk">Walk</option>
            </select>
            <label>Give transportation details:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter new data"
            />
            <select
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
            >
              <option value="hours">Hours</option>
              <option value="mins">Minutes</option>
              <option value="km">Kilometers</option>
              <option value="meters">Meters</option>
              <option value="miles">Miles</option>
            </select>
            <button type="submit">Submit</button>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <h1>Please log in to view your profile.</h1>
      )}
    </div>
  );
}

export default ProfilePage;
