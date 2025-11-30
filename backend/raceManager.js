const { getRandomText } = require('./textLibrary');

class RaceManager {
  constructor() {
    this.races = new Map();
  }

  findWaitingRace() {
    return Array.from(this.races.values()).find(r => r.status === 'waiting');
  }

  createRace() {
    const race = {
      id: Date.now().toString(),
      text: getRandomText('medium'),
      players: [],
      status: 'waiting'
    };
    this.races.set(race.id, race);
    return race;
  }

  addPlayer(raceId, playerId, playerName) {
    const race = this.races.get(raceId);
    if (!race) return null;

    race.players.push({
      id: playerId,
      name: playerName,
      progress: 0,
      wpm: 0,
      finished: false
    });
    return race;
  }

  removePlayer(raceId, playerId) {
    const race = this.races.get(raceId);
    if (!race) return null;

    race.players = race.players.filter(p => p.id !== playerId);
    if (race.players.length === 0) {
      this.races.delete(raceId);
      return null;
    }
    return race;
  }

  updatePlayerProgress(raceId, playerId, { progress, wpm, finished }) {
    const race = this.races.get(raceId);
    if (!race) return null;

    const player = race.players.find(p => p.id === playerId);
    if (!player) return null;

    player.progress = progress;
    player.wpm = wpm;
    player.finished = finished;

    if (finished || race.players.every(p => p.finished)) {
      race.status = 'finished';
    }
    return race;
  }

  startCountdown(raceId, io) {
    const race = this.races.get(raceId);
    if (!race) return;

    race.status = 'countdown';
    race.countdown = 3;
    io.to(raceId).emit('raceUpdate', race);

    const countdown = setInterval(() => {
      race.countdown--;
      if (race.countdown <= 0) {
        clearInterval(countdown);
        race.status = 'racing';
        io.to(raceId).emit('raceStart');
      }
      io.to(raceId).emit('raceUpdate', race);
    }, 1000);
  }
}

module.exports = RaceManager;
