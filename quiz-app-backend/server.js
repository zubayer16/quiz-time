require("dotenv").config({ path: "/app/.env" }); // Load .env from the parent folder
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const path = require("path"); // Added for path management
const fs = require("fs");
const csv = require("csv-parser");
const schema = require("./graphql/schema"); // Path to schema.js in the sibling graphql folder

const app = express();
const REST_PORT = 3001; // Port for REST API
const GRAPHQL_PORT = process.env.PORT || 5001; // Port for GraphQL, from .env

app.use(cors());

// MongoDB Connection
const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/quiz-app"; // Use .env for MONGO_URI
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => {
    console.log("Connecting to MongoDB at:", process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Load the dataset
let questions = [];
const datasetPath = path.join(__dirname, "datasets", "test.csv"); // Updated to use absolute path
fs.createReadStream(datasetPath) // Ensure test.csv is correctly placed
  .pipe(csv())
  .on("data", (row) => {
    questions.push({
      question: row.prompt,
      options: [row.A, row.B, row.C, row.D], // The four options
      correctAnswer: row.answer, // The correct answer
    });
  })
  .on("end", () => {
    console.log("Dataset loaded successfully");
  })
  .on("error", (err) => {
    console.error("Error loading dataset:", err.message);
  });

// REST API Endpoint to serve questions
app.get("/questions", (req, res) => {
  const { amount = 10 } = req.query;

  // Limit the number of questions
  const limitedQuestions = questions.slice(0, parseInt(amount, 10));

  res.json(limitedQuestions);
});

// REST API Server
app.listen(REST_PORT, () => {
  console.log(`REST API is running on http://localhost:${REST_PORT}`);
});

// GraphQL Endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema, // Use the schema imported from ../graphql/schema.js
    graphiql: true, // Enable GraphiQL interface in browser
  })
);

// GraphQL Server
app.listen(GRAPHQL_PORT, () => {
  console.log(`GraphQL server is running on http://localhost:${GRAPHQL_PORT}`);
});
