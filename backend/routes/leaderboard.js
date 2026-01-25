const express = require("express");
const UserProgress = require("../model/UserProgress");
const Users = require("../model/User");

const router = express.Router();

// Get global leaderboard
router.get("/", async (req, res) => {
  try {
    const { difficulty = "all", timeframe = "all", limit = 50 } = req.query;

    // Get all user progress with their test results
    const allProgress = await UserProgress.find({}).populate('userId', 'username');

    // Flatten all test results with user info
    let allResults = [];
    
    allProgress.forEach(progress => {
      if (progress.userId && progress.testResults) {
        progress.testResults.forEach(result => {
          allResults.push({
            id: result.id,
            userId: progress.userId._id,
            username: progress.userId.username,
            wpm: result.wpm,
            accuracy: result.accuracy,
            difficulty: result.difficulty,
            time: result.time,
            timestamp: result.timestamp
          });
        });
      }
    });

    // Filter by difficulty
    if (difficulty !== "all") {
      allResults = allResults.filter(r => r.difficulty === difficulty);
    }

    // Filter by timeframe
    const now = Date.now();
    if (timeframe === "today") {
      const todayStart = new Date().setHours(0, 0, 0, 0);
      allResults = allResults.filter(r => r.timestamp >= todayStart);
    } else if (timeframe === "week") {
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      allResults = allResults.filter(r => r.timestamp >= weekAgo);
    } else if (timeframe === "month") {
      const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
      allResults = allResults.filter(r => r.timestamp >= monthAgo);
    }

    // Sort by WPM (highest first)
    allResults.sort((a, b) => b.wpm - a.wpm);

    // Get top results (limit)
    const topResults = allResults.slice(0, parseInt(limit));

    res.json({
      leaderboard: topResults,
      total: allResults.length
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Get top players (best WPM per user)
router.get("/top-players", async (req, res) => {
  try {
    const { difficulty = "all", limit = 20 } = req.query;

    const allProgress = await UserProgress.find({}).populate('userId', 'username');

    // Calculate best WPM per user
    const playerStats = [];
    
    allProgress.forEach(progress => {
      if (progress.userId && progress.testResults && progress.testResults.length > 0) {
        let relevantResults = progress.testResults;
        
        // Filter by difficulty if specified
        if (difficulty !== "all") {
          relevantResults = relevantResults.filter(r => r.difficulty === difficulty);
        }

        if (relevantResults.length > 0) {
          const bestWpm = Math.max(...relevantResults.map(r => r.wpm));
          const avgWpm = Math.round(relevantResults.reduce((sum, r) => sum + r.wpm, 0) / relevantResults.length);
          const avgAccuracy = Math.round(relevantResults.reduce((sum, r) => sum + r.accuracy, 0) / relevantResults.length);
          const totalTests = relevantResults.length;

          playerStats.push({
            userId: progress.userId._id,
            username: progress.userId.username,
            bestWpm,
            avgWpm,
            avgAccuracy,
            totalTests
          });
        }
      }
    });

    // Sort by best WPM
    playerStats.sort((a, b) => b.bestWpm - a.bestWpm);

    // Get top players
    const topPlayers = playerStats.slice(0, parseInt(limit));

    res.json({
      players: topPlayers,
      total: playerStats.length
    });
  } catch (error) {
    console.error("Error fetching top players:", error);
    res.status(500).json({ error: "Failed to fetch top players" });
  }
});

// Get user's rank
router.get("/rank/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { difficulty = "all" } = req.query;

    const allProgress = await UserProgress.find({}).populate('userId', 'username');

    // Calculate best WPM per user
    const playerStats = [];
    
    allProgress.forEach(progress => {
      if (progress.userId && progress.testResults && progress.testResults.length > 0) {
        let relevantResults = progress.testResults;
        
        if (difficulty !== "all") {
          relevantResults = relevantResults.filter(r => r.difficulty === difficulty);
        }

        if (relevantResults.length > 0) {
          const bestWpm = Math.max(...relevantResults.map(r => r.wpm));
          playerStats.push({
            userId: progress.userId._id.toString(),
            username: progress.userId.username,
            bestWpm
          });
        }
      }
    });

    // Sort by best WPM
    playerStats.sort((a, b) => b.bestWpm - a.bestWpm);

    // Find user's rank
    const userRank = playerStats.findIndex(p => p.userId === userId) + 1;
    const userStats = playerStats.find(p => p.userId === userId);

    res.json({
      rank: userRank || null,
      totalPlayers: playerStats.length,
      userStats: userStats || null
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    res.status(500).json({ error: "Failed to fetch user rank" });
  }
});

module.exports = router;
