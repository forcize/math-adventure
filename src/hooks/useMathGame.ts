import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { gameStateAtom } from '../state/atoms';
import { generateProblem } from '../utils/gameUtils';
import { Problem, GameState } from '../types';

const INITIAL_TIME = 30;
const BASE_VELOCITY = 2;
const COUNTDOWN_TIME = 1500;
const LEVEL_PAUSE_TIME = 2000;

export const useMathGame = (
  selectedOperations: ('addition' | 'subtraction' | 'multiplication' | 'division')[],
  maxLevel: number = 4
) => {
  const [state, setState] = useRecoilState(gameStateAtom);

  useEffect(() => {
    let timer: number;

    if (state.gameStatus === 'countdown') {
      timer = window.setTimeout(() => {
        setState(prev => ({ ...prev, gameStatus: 'playing' }));
      }, COUNTDOWN_TIME);
    } else if (state.gameStatus === 'levelPause') {
      timer = window.setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          gameStatus: 'countdown',
          timeRemaining: Math.max(INITIAL_TIME - (prev.level - 1) * 5, 20)
        }));
      }, LEVEL_PAUSE_TIME);
    } else if (state.gameStatus === 'playing') {
      timer = window.setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 0) {
            return { ...prev, gameStatus: 'incorrect' };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [state.gameStatus]);

  const startNewProblem = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentProblem: generateProblem(prev.level, prev.operations),
      gameStatus: 'levelPause',
      timeRemaining: Math.max(INITIAL_TIME - (prev.level - 1) * 5, 20)
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState({
      score: 0,
      level: 1,
      correctAnswers: 0,
      totalAnswers: 0,
      currentProblem: generateProblem(1, selectedOperations),
      gameStatus: 'countdown',
      stepsCompleted: 0,
      timeRemaining: INITIAL_TIME,
      operations: selectedOperations,
      maxLevel
    });
  }, [selectedOperations, maxLevel]);

  const checkAnswer = useCallback((answer: number) => {
    if (!state.currentProblem || state.gameStatus !== 'playing') return;

    const isCorrect = answer === state.currentProblem.correctAnswer;
    
    if (isCorrect) {
      setState(prev => ({
        ...prev,
        score: prev.score + (prev.level * 10),
        correctAnswers: prev.correctAnswers + 1,
        totalAnswers: prev.totalAnswers + 1,
        stepsCompleted: prev.stepsCompleted + 1,
        gameStatus: prev.level >= prev.maxLevel ? 'victory' : 'correct',
        level: Math.min(prev.level + 1, prev.maxLevel)
      }));
    } else {
      setState(prev => ({
        ...prev,
        totalAnswers: prev.totalAnswers + 1,
        gameStatus: 'incorrect'
      }));
      
      // Set a timer to return to playing state
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          gameStatus: 'playing',
          currentProblem: generateProblem(prev.level, prev.operations)
        }));
      }, 1500);
    }
  }, [state]);

  const getRequiredNumbers = useCallback((level: number) => {
    const baseNumbers = 2;
    const decoyNumbers = Math.min(level + 1, 6);
    return baseNumbers + decoyNumbers;
  }, []);

  const getBaseVelocity = useCallback((level: number) => 
    BASE_VELOCITY * (1 + (level - 1) * 0.15),
  []);

  return {
    state,
    checkAnswer,
    startNewProblem,
    resetGame,
    getRequiredNumbers,
    getBaseVelocity
  };
};