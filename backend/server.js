const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");

// Local modules
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const Friend = require("./routes/friends");
const GameRoom = require("./routes/multiplayer");
const RaceManager = require("./raceManager");
const setupSocketHandlers = require("./socketHandlers");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL.split(','),
    methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", Friend);
app.use("/api/multiplayer", GameRoom);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// HTTP + Socket.io setup
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL.split(','),
    methods: ["GET", "POST"]
  }
});

// Race system
const raceManager = new RaceManager();
setupSocketHandlers(io, raceManager);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Race server running on port ${PORT}`);
});
