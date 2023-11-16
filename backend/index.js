const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv"); // Import dotenv
dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8089"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);

const TransportationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicle: String,
  amount: Number,
  measurement: String,
});

const Transportation = mongoose.model("Transportation", TransportationSchema);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Create a JWT token
    const token = jwt.sign({ username }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the JWT token and retrieve user information
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const { username } = decodedToken;

    // You can fetch additional user profile information from your database if needed

    res.status(200).json({ username });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Token expired or invalid" });
  }
});

app.get("/user", async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization;

    // Verify and decode the token to get the username
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const username = decodedToken.username;

    // Find the user based on the decoded username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Remove sensitive information (e.g., password) before sending the user data
    const userData = {
      username: user.username,
      // Add any other user properties you want to include
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/submit-transportation", async (req, res) => {
  try {
    // Extract the form data from the request body
    const { vehicle, amount, measurement } = req.body;

    const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the JWT token and retrieve user information
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const { username } = decodedToken;

    // Find the user based on the decoded username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new instance of the Transportation model with the user's ID
    const transportation = new Transportation({
      user: user._id, // Store the user's ID
      vehicle,
      amount,
      measurement,
    });

    await transportation.save();

    // Respond with a success message or other relevant response
    res
      .status(201)
      .json({ message: "Transportation data submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/transportations/:user", async (req, res) => {
  const username = req.params.user; // Get the username from the URL parameter

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transportations = await Transportation.find({ user: user._id });

    res.status(200).json(transportations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
