const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../model/User");
const UserProgress = require("../model/UserProgress");

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({ username, email, password: hashedPassword });
    await newUser.save();

    // Create default progress
    const progress = new UserProgress({
      userId: newUser._id,
      testResults: [],
      stats: {
        totalTests: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        bestWpm: 0,
        totalTime: 0,
      },
    });
    await progress.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ error: "Server error during login" });
  }
});

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await Users.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// Save test result
router.post("/test-result", verifyToken, async (req, res) => {
  try {
    const { wpm, accuracy, errors, time, difficulty, timeLimit } = req.body;

    const testResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      wpm,
      accuracy,
      errors,
      time,
      difficulty,
      timeLimit,
    };

    let progress = await UserProgress.findOne({ userId: req.userId });
    if (!progress) {
      progress = new UserProgress({
        userId: req.userId,
        testResults: [],
      });
    }

    progress.testResults.push(testResult);
    progress.testResults = progress.testResults.slice(-100); // Keep last 100

    // Update stats
    const results = progress.testResults;
    progress.stats = {
      totalTests: results.length,
      averageWpm: Math.round(
        results.reduce((sum, r) => sum + r.wpm, 0) / results.length
      ),
      averageAccuracy: Math.round(
        results.reduce((sum, r) => sum + r.accuracy, 0) / results.length
      ),
      bestWpm: Math.max(...results.map((r) => r.wpm)),
      totalTime: results.reduce((sum, r) => sum + r.time, 0),
    };

    await progress.save();
    res.json({ success: true, testResult });
  } catch (error) {
    res.status(500).json({ error: "Failed to save test result" });
  }
});

// Get test results
router.get("/test-results", verifyToken, async (req, res) => {
  try {
    const progress = await UserProgress.findOne({ userId: req.userId });
    res.json({ testResults: progress?.testResults || [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to get test results" });
  }
});

// Get user progress
router.get("/", verifyToken, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.userId });

    if (!progress) {
      progress = new UserProgress({
        userId: req.userId,
        testResults: [],
        stats: {
          totalTests: 0,
          averageWpm: 0,
          averageAccuracy: 0,
          bestWpm: 0,
          totalTime: 0,
        },
      });
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to get progress" });
  }
});

// Clear all user data
router.delete("/clear-data", verifyToken, async (req, res) => {
  try {
    await UserProgress.findOneAndDelete({ userId: req.userId });
    res.json({ success: true, message: "All data cleared successfully" });
  } catch (error) {
    console.error("Error clearing data:", error);
    res.status(500).json({ error: "Failed to clear data" });
  }
});

module.exports = router;