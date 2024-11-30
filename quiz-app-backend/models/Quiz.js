const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuestionSchema],
});

module.exports = mongoose.model('Quiz', QuizSchema);
