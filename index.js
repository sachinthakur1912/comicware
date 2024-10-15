// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import custom modules
const connectDb = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");

// Initialize express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDb();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes for book-related endpoints
app.use("/api/book", bookRoutes);

// Define the port to run the server on
const PORT = process.env.PORT || 5001;

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
