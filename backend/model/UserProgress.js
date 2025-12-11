const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  testResults: [{
    id: String,
    timestamp: Number,
    wpm: Number,
    accuracy: Number,
    errors: Number,
    time: Number,
    difficulty: String,
    timeLimit: Number
  }],
  achievements: [{
    id: String,
    title: String,
    description: String,
    icon: String,
    unlocked: Boolean,
    unlockedAt: Number
  }],
  stats: {
    totalTests: { type: Number, default: 0 },
    averageWpm: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    bestWpm: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 }
  }
});

const userProgress = mongoose.model("UserProgress", userProgressSchema);
module.exports = userProgress;