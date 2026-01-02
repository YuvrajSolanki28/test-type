const express = require('express');
const GameRoom = require('../model/GameRoom');
const { getRandomText } = require('../textLibrary');
const auth = require('../middleware/auth');
const router = express.Router();

// Create game room
router.post('/room', auth, async (req, res) => {
  try {
    const { difficulty = 'medium' } = req.body;
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const room = new GameRoom({
      roomId,
      host: req.user.id,
      players: [req.user.id],
      text: getRandomText(difficulty),
      difficulty
    });

    await room.save();
    res.json({ roomId, room });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join game room
router.post('/room/:roomId/join', auth, async (req, res) => {
  try {
    const room = await GameRoom.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.status !== 'waiting') return res.status(400).json({ message: 'Game already started' });
    
    if (!room.players.includes(req.user.id)) {
      room.players.push(req.user.id);
      await room.save();
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit result
router.post('/room/:roomId/result', auth, async (req, res) => {
  try {
    const { wpm, accuracy } = req.body;
    const room = await GameRoom.findOne({ roomId: req.params.roomId });
    
    if (!room) return res.status(404).json({ message: 'Room not found' });
    
    const existingResult = room.results.find(r => r.player.toString() === req.user.id);
    if (existingResult) return res.status(400).json({ message: 'Result already submitted' });
    
    room.results.push({
      player: req.user.id,
      wpm,
      accuracy,
      finishedAt: new Date()
    });
    
    if (room.results.length === room.players.length) {
      room.status = 'finished';
    }
    
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
