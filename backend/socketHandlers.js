module.exports = function setupSocketHandlers(io, raceManager) {
  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('joinRace', ({ playerName }) => {
      let race = raceManager.findWaitingRace();
      
      if (!race) {
        race = raceManager.createRace();
      }
      
      raceManager.addPlayer(race.id, socket.id, playerName);
      socket.join(race.id);
      socket.raceId = race.id;
      
      if (race.players.length >= 2) {
        raceManager.startCountdown(race.id, io);
      } else {
        io.to(race.id).emit('raceUpdate', race);
      }
    });

    socket.on('leaveRace', () => {
      if (!socket.raceId) return;
      
      const race = raceManager.removePlayer(socket.raceId, socket.id);
      if (race) {
        io.to(socket.raceId).emit('raceUpdate', race);
      }
      socket.leave(socket.raceId);
      socket.raceId = null;
    });
    
    socket.on('updateProgress', (data) => {
      if (!socket.raceId) return;
      
      const race = raceManager.updatePlayerProgress(socket.raceId, socket.id, data);
      if (race) {
        io.to(socket.raceId).emit('raceUpdate', race);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);
      if (!socket.raceId) return;
      
      const race = raceManager.removePlayer(socket.raceId, socket.id);
      if (race) {
        io.to(socket.raceId).emit('raceUpdate', race);
      }
    });
  });
  const createPrivateRoom = (hostId, difficulty) => {
  const roomId = generateRoomId();
  const room = raceManager.createPrivateRoom(roomId, hostId, difficulty);
  return room;
};

const inviteFriend = (roomId, friendId) => {
  // Send invitation to friend
  io.to(friendId).emit('roomInvitation', { roomId });
};
}
