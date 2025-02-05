export interface Problem {
  id: string;
  question: string;
  correctAnswer: number;
  options: number[];
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
}

export interface GameState {
  score: number;
  level: number;
  correctAnswers: number;
  totalAnswers: number;
  currentProblem: Problem | null;
  gameStatus: 'idle' | 'playing' | 'correct' | 'incorrect' | 'complete' | 'victory' | 'countdown' | 'levelPause';
  stepsCompleted: number;
  timeRemaining: number;
  operations: ('addition' | 'subtraction' | 'multiplication' | 'division')[];
  maxLevel: number; // Added maxLevel property
}

export interface UserProfile {
  name: string;
  avatar: string;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
}

export interface FloatingNumber {
  id: string;
  value: number;
  x: number;
  y: number;
  velocity: {
    x: number;
    y: number;
  };
  color: string;
  size: number;
}