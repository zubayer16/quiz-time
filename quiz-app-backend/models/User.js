const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const quizResultSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  answers: [
    {
      type: Number,
      required: true,
    },
  ],
  submittedAt: {
    type: String,
    required: true,
  },
});

// Define the User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  score: { type: Number, default: 0 },
  quizResults: [quizResultSchema],
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving the user
//UserSchema.pre('save', async function (next) {
//if (!this.isModified('password')) return next(); // Only hash if password is modified
//this.password = await bcrypt.hash(this.password, 10); // Hash password with bcrypt
//next();
//});

// Compare the entered password with the hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  console.log("Entered password:", enteredPassword); // Log entered password
  console.log("Stored hashed password:", this.password); // Log hashed password
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log("Password comparison result:", isMatch); // Log comparison result
  return isMatch;
};

// Export the User model
module.exports = mongoose.model("User", UserSchema);
