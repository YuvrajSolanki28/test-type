import { Header } from './Header';
import { StatsBar } from './StatsBar';
import { TypingArea } from './TypingArea';
import { CodeTypingArea } from './CodeTypingArea';
import { ResultsModal } from './ResultsModal';
import { useTypingTest } from '../hooks/useTypingTest';

export function TypingTest() {
  const {
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
    inputRef
  } = useTypingTest();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <Header 
        difficulty={difficulty} 
        timeLimit={timeLimit} 
        textType={textType}
        language={language}
        onDifficultyChange={handleDifficultyChange} 
        onTimeLimitChange={handleTimeLimitChange} 
        onTextTypeChange={handleTextTypeChange}
        onLanguageChange={handleLanguageChange}
        disabled={isActive} 
      />

      <main className="pt-24 pb-12 px-6 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <StatsBar 
            wpm={wpm} 
            accuracy={accuracy} 
            time={elapsedTime} 
            errors={errors} 
            personalBest={personalBests[difficulty]} 
            difficulty={difficulty}
            isActive={isActive}
          />

          {textType === 'code' ? (
            <CodeTypingArea
              text={text}
              userInput={userInput}
              isComplete={isComplete}
              isActive={isActive}
              progress={progress}
              timeLimit={timeLimit}
              timeRemaining={timeRemaining}
              language={language}
              onKeyPress={handleKeyPress}
              onReset={resetTest}
              inputRef={inputRef}
            />
          ) : (
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
          )}
        </div>
      </main>

      {isComplete && (
        <ResultsModal 
          wpm={wpm} 
          accuracy={accuracy} 
          errors={errors} 
          time={elapsedTime} 
          difficulty={difficulty} 
          personalBest={personalBests[difficulty]} 
          isNewRecord={isNewRecord} 
          onRestart={resetTest} 
        />
      )}

      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
