const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  status: { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
  results: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    wpm: Number,
    accuracy: Number,
    finishedAt: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

const GameRoom = mongoose.model("GameRoom", gameRoomSchema);
module.exports = GameRoom;