import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Player {
  id: string;
  name: string;
  progress: number;
  wpm: number;
  finished: boolean;
}

interface RaceState {
  id: string;
  text: string;
  players: Player[];
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  countdown: number;
}

export function useMultiplayerRace() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [race, setRace] = useState<RaceState | null>(null);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [connected, setConnected] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('ws://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => setConnected(true));
    newSocket.on('disconnect', () => setConnected(false));
    newSocket.on('raceUpdate', setRace);
    newSocket.on('raceStart', () => setStartTime(Date.now()));

    return () => newSocket.close();
  }, []);

  const joinRace = useCallback((playerName: string) => {
    socket?.emit('joinRace', { playerName });
  }, [socket]);

  const leaveRace = useCallback(() => {
    socket?.emit('leaveRace');
    setRace(null);
    setUserInput('');
    setStartTime(null);
    setErrors(0);
  }, [socket]);

  const handleKeyPress = useCallback((key: string) => {
    if (!race || race.status !== 'racing') return;

    setUserInput(prev => {
      if (key === 'Backspace') return prev.slice(0, -1);
      if (key.length === 1) {
        const newInput = prev + key;
        if (key !== race.text[newInput.length - 1]) {
          setErrors(e => e + 1);
        }
        
        const progress = Math.round((newInput.length / race.text.length) * 100);
        const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
        const wpm = elapsed > 0 ? Math.round((newInput.length / 5) / (elapsed / 60)) : 0;
        
        socket?.emit('updateProgress', { progress, wpm, finished: newInput.length === race.text.length });
        
        return newInput;
      }
      return prev;
    });
  }, [race, socket, startTime]);

  return {
    race,
    userInput,
    errors,
    connected,
    joinRace,
    leaveRace,
    handleKeyPress,
    inputRef
  };
}
