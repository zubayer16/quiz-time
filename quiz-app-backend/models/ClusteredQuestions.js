const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

const clusteredQuestionSchema = new mongoose.Schema({
  title: String,
  desciption: String,
  cluster: Number,
  questions: [questionSchema],
});

module.exports = mongoose.model("ClusteredQuestion", clusteredQuestionSchema);
