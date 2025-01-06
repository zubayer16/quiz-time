const mongoose = require("mongoose");
const fs = require("fs");

// MongoDB connection string
const mongoURI = "mongodb://localhost:27017/quiz-app"; // Update this to match your environment

// Define the schema
const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  cluster: Number,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
    },
  ],
});

const ClusteredQuestion = mongoose.model("ClusteredQuestion", questionSchema);

async function loadData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Load the JSON file
    const rawData = fs.readFileSync(
      "precomputed_cluster_questions.json",
      "utf-8"
    );
    const clusters = JSON.parse(rawData);

    // Transform data and insert into MongoDB
    const documents = Object.keys(clusters).map((key) => ({
      title: "",
      description: "",
      cluster: parseInt(key),
      questions: clusters[key].map((q) => {
        const correctAnswerIndex = ["A", "B", "C", "D"].indexOf(q.answer);
        return {
          question: q.prompt,
          options: [q.A, q.B, q.C, q.D],
          correctAnswer: correctAnswerIndex + 1,
        };
      }),
    }));

    await ClusteredQuestion.insertMany(documents);
    console.log("Data successfully loaded into MongoDB");
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    mongoose.disconnect();
  }
}

loadData();
