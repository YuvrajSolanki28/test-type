import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Difficulty, TextType, Language } from "../utils/aiTextGenerator";
import { personalizedTextLibrary } from "../utils/aiTextGenerator";
import { saveTestResult } from "../utils/statsManager";

interface PersonalBests {
  easy: number | null;
  medium: number | null;
  hard: number | null;
}

const STORAGE_KEY = "typespeed_personal_bests";

function loadPersonalBests(): PersonalBests {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : { easy: null, medium: null, hard: null };
  } catch {
    return { easy: null, medium: null, hard: null };
  }
}

function savePersonalBest(difficulty: Difficulty, wpm: number) {
  try {
    const bests = loadPersonalBests();
    const current = bests[difficulty];
    if (!current || wpm > current) {
      bests[difficulty] = wpm;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bests));
      return true;
    }
  } catch {
    // Ignore storage errors
  }
  return false;
}

export function useTypingTest() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [textType, setTextType] = useState<TextType>('normal');
  const [language, setLanguage] = useState<Language>('javascript');
  const [text, setText] = useState(() => personalizedTextLibrary.generateText("medium"));
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [personalBests, setPersonalBests] = useState<PersonalBests>(
    loadPersonalBests()
  );
  const [isNewRecord, setIsNewRecord] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);

  const resetTest = useCallback(() => {
    const newText = personalizedTextLibrary.generateText(difficulty, textType, language);
    setText(newText);
    setUserInput("");
    setStartTime(null);
    setIsActive(false);
    setIsComplete(false);
    setErrors(0);
    setElapsedTime(0);
    setTimeRemaining(timeLimit);
    setIsNewRecord(false);

    inputRef.current?.focus();
  }, [difficulty, timeLimit, textType, language]);

  const completeTest = useCallback(() => {
    setIsActive(false);
    setIsComplete(true);

    const finalWpm = calculateWpm(userInput.length, elapsedTime);
    const finalAccuracy = calculateAccuracy(userInput, text);

    saveTestResult({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      errors,
      time: elapsedTime,
      difficulty,
      timeLimit,
    });

    const newRecord = savePersonalBest(difficulty, finalWpm);
    if (newRecord) {
      setIsNewRecord(true);
      setPersonalBests(loadPersonalBests());
    }
  }, [userInput, elapsedTime, text, errors, difficulty, timeLimit]);

  // Timer
  useEffect(() => {
    if (!isActive || !startTime || isComplete) return;

    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);

      if (timeLimit) {
        const remaining = Math.max(0, timeLimit - elapsed);
        setTimeRemaining(remaining);
        if (remaining === 0) completeTest();
      }
    }, 500);

    return () => clearInterval(id);
  }, [isActive, startTime, isComplete, timeLimit, completeTest]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (isComplete) return;

      if (!isActive) {
        setIsActive(true);
        setStartTime(Date.now());
        setTimeRemaining(timeLimit);
      }

      setUserInput((prev) => {
        if (key === "Backspace") return prev.slice(0, -1);

        if (key.length === 1 || key === '  ') {
          const newInput = prev + key;

          // error detection (fixed stale index)
          if (key !== text[newInput.length - 1]) {
            setErrors((e) => e + 1);
          }

          if (newInput.length === text.length) {
            completeTest();
          }

          return newInput;
        }

        return prev;
      });
    },
    [text, isActive, isComplete, timeLimit, completeTest]
  );

  const handleDifficultyChange = useCallback(
    (newDifficulty: Difficulty) => {
      if (!isActive) {
        setDifficulty(newDifficulty);
        const newText = personalizedTextLibrary.generateText(newDifficulty, textType, language);
        setText(newText);
        setUserInput("");
        setErrors(0);
        setElapsedTime(0);
        setIsNewRecord(false);
        inputRef.current?.focus();
      }
    },
    [isActive, textType, language]
  );

  const handleTimeLimitChange = useCallback(
    (newTimeLimit: number | null) => {
      if (!isActive) {
        setTimeLimit(newTimeLimit);
        setTimeRemaining(newTimeLimit);
      }
    },
    [isActive]
  );

  const handleTextTypeChange = useCallback((newTextType: TextType) => {
    if (!isActive) {
      setTextType(newTextType);
      const newText = personalizedTextLibrary.generateText(difficulty, newTextType, language);
      setText(newText);
      setUserInput('');
      setErrors(0);
      setElapsedTime(0);
      setIsNewRecord(false);
      inputRef.current?.focus();
    }
  }, [isActive, difficulty, language]);

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    if (!isActive) {
      setLanguage(newLanguage);
      if (textType === 'code') {
        const newText = personalizedTextLibrary.generateText(difficulty, textType, newLanguage);
        setText(newText);
        setUserInput('');
        setErrors(0);
        setElapsedTime(0);
        setIsNewRecord(false);
        inputRef.current?.focus();
      }
    }
  }, [isActive, difficulty, textType]);

  const wpm = useMemo(() => {
    return calculateWpm(userInput.length, elapsedTime);
  }, [userInput.length, elapsedTime]);

  const accuracy = useMemo(() => {
    return calculateAccuracy(userInput, text);
  }, [userInput, text]);

  const progress = useMemo(() => {
    if (!text.length) return 0;
    return Math.round((userInput.length / text.length) * 100);
  }, [userInput.length, text.length]);

  return {
    difficulty,
    timeLimit,
    textType,
    language,
    text,
    userInput,
    isActive,
    isComplete,
    errors,
    elapsedTime,
    timeRemaining,
    wpm,
    accuracy,
    progress,
    personalBests,
    isNewRecord,

    handleKeyPress,
    handleDifficultyChange,
    handleTimeLimitChange,
    handleTextTypeChange,
    handleLanguageChange,
    resetTest,

    inputRef,
  };
}

// ---------- helpers ----------
function calculateWpm(charsTyped: number, seconds: number): number {
  if (seconds === 0) return 0;
  const words = charsTyped / 5;
  return Math.round(words / (seconds / 60));
}

function calculateAccuracy(userInput: string, text: string): number {
  if (!userInput.length) return 100;
  const correct = userInput.split("").filter((c, i) => c === text[i]).length;
  return Math.round((correct / userInput.length) * 100);
}
