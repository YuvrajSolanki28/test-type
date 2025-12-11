import { Header } from "./Header";
import { StatsBar } from "./StatsBar";
import { TypingArea } from "./TypingArea";
import { ResultsModal } from "./ResultsModal";
import { useTypingTest } from "../hooks/useTypingTest";
import { Loading } from './Loading';

export function TypingTest() {
  const {
    difficulty,
    timeLimit,
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
    resetTest,
    inputRef,
  } = useTypingTest();

  const personalBest = personalBests[difficulty] ?? null;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <Header
        difficulty={difficulty}
        timeLimit={timeLimit}
        onDifficultyChange={handleDifficultyChange}
        onTimeLimitChange={handleTimeLimitChange}
        disabled={isActive}
      />

      <main className="pt-24 pb-12 px-6 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <StatsBar
            wpm={wpm}
            accuracy={accuracy}
            time={elapsedTime}
            errors={errors}
            difficulty={difficulty}
            personalBest={personalBest}
          />

          <TypingArea
            text={text}
            userInput={userInput}
            isComplete={isComplete}
            isActive={isActive}
            progress={progress}
            timeLimit={timeLimit}
            timeRemaining={timeRemaining}
            onKeyPress={handleKeyPress}
            onReset={resetTest}
            inputRef={inputRef}
          />
        </div>
      </main>

      {isComplete && (
        <ResultsModal
          wpm={wpm}
          accuracy={accuracy}
          errors={errors}
          time={elapsedTime}
          difficulty={difficulty}
          personalBest={personalBest}
          isNewRecord={isNewRecord}
          onRestart={resetTest}
        />
      )}

      {/* Ambient Glow */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
