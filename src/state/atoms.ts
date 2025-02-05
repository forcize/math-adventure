import { atom } from 'recoil';
import { GameState, Problem } from '../types';

export const gameStateAtom = atom<GameState>({
  key: 'gameState',
  default: {
    score: 0,
    level: 1,
    correctAnswers: 0,
    totalAnswers: 0,
    currentProblem: null,
    gameStatus: 'idle',
    stepsCompleted: 0,
    timeRemaining: 30,
    operations: ['addition'],
    maxLevel: 3
  }
});

export const selectedOperationsAtom = atom<('addition' | 'subtraction' | 'multiplication' | 'division')[]>({
  key: 'selectedOperations',
  default: ['addition']
});