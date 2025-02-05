import React from 'react';
import { useRecoilState } from 'recoil';
import { selectedOperationsAtom, gameStateAtom } from './state/atoms';
import { generateProblem } from './utils/gameUtils';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';

function App() {
  const [gameState, setGameState] = useRecoilState(gameStateAtom);
  const [selectedOperations, setSelectedOperations] = useRecoilState(selectedOperationsAtom);

  const handleStart = (operations: ('addition' | 'subtraction' | 'multiplication' | 'division')[], maxLevel: number) => {
    setSelectedOperations(operations);
    setGameState({
      score: 0,
      level: 1,
      correctAnswers: 0,
      totalAnswers: 0,
      currentProblem: generateProblem(1, operations),
      gameStatus: 'countdown',
      stepsCompleted: 0,
      timeRemaining: 30,
      operations,
      maxLevel
    });
  };

  return gameState.gameStatus !== 'idle' ? (
    <GameScreen 
      onExit={() => setGameState(prev => ({ ...prev, gameStatus: 'idle' }))} 
      selectedOperations={selectedOperations}
      maxLevel={gameState.maxLevel}
    />
  ) : (
    <StartScreen onStart={handleStart} />
  );
}

export default App;