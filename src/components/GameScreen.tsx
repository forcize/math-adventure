import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import { MathMascot } from './MathMascot';
import { useMathGame } from '../hooks/useMathGame';
import { Medal, RotateCcw, LogOut, Volume2, VolumeX, Star, Trophy, Brain, Zap } from 'lucide-react';
import { FloatingNumber } from '../types';

interface GameScreenProps {
  onExit: () => void;
  selectedOperations: ('addition' | 'subtraction' | 'multiplication' | 'division')[];
  maxLevel: number;
}

const COLORS = [
  'bg-pink-400 hover:bg-pink-500',
  'bg-purple-400 hover:bg-purple-500',
  'bg-blue-400 hover:bg-blue-500',
  'bg-green-400 hover:bg-green-500',
  'bg-yellow-400 hover:bg-yellow-500',
  'bg-orange-400 hover:bg-orange-600'
];

const ACHIEVEMENTS = [
  {
    step: 1,
    title: "Math Rookie",
    icon: Star,
    color: "from-yellow-400 to-orange-500",
    message: "Great start! Keep going!"
  },
  {
    step: 2,
    title: "Math Wizard",
    icon: Zap,
    color: "from-blue-400 to-purple-500",
    message: "ZOOM! You're on fire!"
  },
  {
    step: 3,
    title: "Math Champion",
    icon: Trophy,
    color: "from-green-400 to-teal-500",
    message: "AMAZING! You're a champion!"
  }
];

const CONTAINER_PADDING = 20;
const MIN_DISTANCE = 100;

export const GameScreen: React.FC<GameScreenProps> = ({ onExit, selectedOperations, maxLevel }) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { state, checkAnswer, startNewProblem, resetGame, getRequiredNumbers, getBaseVelocity } = useMathGame(selectedOperations);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [playCorrect] = useSound('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', { soundEnabled });
  const [playPop] = useSound('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3', { soundEnabled });
  const [playIncorrect] = useSound('https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3', { soundEnabled });
  const [currentSum, setCurrentSum] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!state.currentProblem || state.gameStatus !== 'playing') return;

    const target = state.currentProblem.correctAnswer;
    const requiredNumbers = getRequiredNumbers(state.level);
    const baseVelocity = getBaseVelocity(state.level);
    
    const numbers: number[] = [];
    let remaining = target;
    
    while (remaining > 0 && numbers.length < requiredNumbers - 1) {
      const num = Math.min(Math.floor(Math.random() * remaining) + 1, remaining);
      numbers.push(num);
      remaining -= num;
    }
    if (remaining > 0) numbers.push(remaining);

    while (numbers.length < requiredNumbers) {
      const decoy = Math.floor(Math.random() * target) + 1;
      if (!numbers.includes(decoy)) {
        numbers.push(decoy);
      }
    }

    const containerRect = gameAreaRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const positions: { x: number, y: number }[] = [];
    const getRandomPosition = () => {
      let attempts = 0;
      let position;
      
      do {
        position = {
          x: Math.random() * (containerRect.width - 100) + CONTAINER_PADDING,
          y: Math.random() * (containerRect.height - 100) + CONTAINER_PADDING
        };
        attempts++;
      } while (
        positions.some(pos => 
          Math.sqrt(Math.pow(pos.x - position.x, 2) + Math.pow(pos.y - position.y, 2)) < MIN_DISTANCE
        ) && 
        attempts < 50
      );
      
      positions.push(position);
      return position;
    };

    const newFloatingNumbers = numbers.map((value) => {
      const position = getRandomPosition();
      const angle = Math.random() * Math.PI * 2;
      return {
        id: Math.random().toString(36).substr(2, 9),
        value,
        x: position.x,
        y: position.y,
        velocity: {
          x: Math.cos(angle) * baseVelocity,
          y: Math.sin(angle) * baseVelocity
        },
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 112
      };
    });

    setFloatingNumbers(newFloatingNumbers);
    setCurrentSum(0);
    setSelectedNumbers([]);
  }, [state.currentProblem, state.gameStatus, state.level, getRequiredNumbers, getBaseVelocity]);

  useEffect(() => {
    if (state.gameStatus === 'correct') {
      setShowAchievement(true);
      const timer = setTimeout(() => {
        setShowAchievement(false);
        startNewProblem();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.gameStatus, startNewProblem]);

  useEffect(() => {
    const updatePositions = () => {
      if (!gameAreaRef.current || state.gameStatus !== 'playing') return;

      const containerRect = gameAreaRef.current.getBoundingClientRect();
      
      setFloatingNumbers(prev => prev.map(num => {
        let newX = num.x + num.velocity.x;
        let newY = num.y + num.velocity.y;
        let newVelocityX = num.velocity.x;
        let newVelocityY = num.velocity.y;

        if (newX <= CONTAINER_PADDING || newX >= containerRect.width - num.size - CONTAINER_PADDING) {
          newVelocityX *= -1;
          newX = newX <= CONTAINER_PADDING ? CONTAINER_PADDING : containerRect.width - num.size - CONTAINER_PADDING;
        }
        
        if (newY <= CONTAINER_PADDING || newY >= containerRect.height - num.size - CONTAINER_PADDING) {
          newVelocityY *= -1;
          newY = newY <= CONTAINER_PADDING ? CONTAINER_PADDING : containerRect.height - num.size - CONTAINER_PADDING;
        }

        return {
          ...num,
          x: newX,
          y: newY,
          velocity: {
            x: newVelocityX,
            y: newVelocityY
          }
        };
      }));

      animationFrameRef.current = requestAnimationFrame(updatePositions);
    };

    animationFrameRef.current = requestAnimationFrame(updatePositions);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.gameStatus]);

  const handleNumberClick = (number: FloatingNumber) => {
    if (state.gameStatus !== 'playing') return;
    
    const newSum = currentSum + number.value;
    const targetAnswer = state.currentProblem?.correctAnswer;
    
    // Check if the sum exceeds the target answer
    if (newSum > targetAnswer) {
      playIncorrect();
      checkAnswer(newSum);
      setCurrentSum(0);
      setSelectedNumbers([]);
      setFloatingNumbers([]);
      return;
    }
    
    playPop();
    const newSelectedNumbers = [...selectedNumbers, number.value];
    setCurrentSum(newSum);
    setSelectedNumbers(newSelectedNumbers);
    setFloatingNumbers((prev) => prev.filter((n) => n.id !== number.id));

    if (newSum === targetAnswer) {
      playCorrect();
      checkAnswer(newSum);
    } else if (floatingNumbers.length === 1 && newSum < targetAnswer) {
      // If this is the last number and we're still under the target
      playIncorrect();
      checkAnswer(newSum);
      setCurrentSum(0);
      setSelectedNumbers([]);
      setFloatingNumbers([]);
    }
  };

  const getCurrentAchievement = () => {
    return ACHIEVEMENTS[state.stepsCompleted - 1];
  };

  const handleReset = () => {
    resetGame();
  };

  if (!state.currentProblem) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="w-[90vw] max-w-6xl bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 ml-2">
              {[...Array(maxLevel)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < state.level - 1
                      ? 'bg-green-500'
                      : i === state.level - 1
                      ? 'bg-yellow-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-600 hover:text-gray-800"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
            <div className="text-lg font-semibold text-purple-600">
              Score: {state.score}
            </div>
            <div className="text-lg font-semibold text-blue-600">
              Time: {state.timeRemaining}s
            </div>
            <button
              onClick={onExit}
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-[90vw] max-w-6xl bg-white rounded-2xl shadow-xl p-6 space-y-6 relative">
        <AnimatePresence mode="wait">
          {showAchievement && state.gameStatus === 'correct' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto text-center space-y-3"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${getCurrentAchievement().color} flex items-center justify-center`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {React.createElement(getCurrentAchievement().icon, {
                    size: 40,
                    className: "text-white"
                  })}
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {getCurrentAchievement().title}
                </h2>
                <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {getCurrentAchievement().message}
                </p>
              </motion.div>
            </motion.div>
          )}

          {state.gameStatus === 'victory' ? (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center space-y-6 py-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="inline-block text-yellow-500 mb-4"
              >
                <Medal size={80} />
              </motion.div>
              <h2 className="text-3xl font-bold text-purple-600">
                Congratulations!
              </h2>
              <p className="text-xl text-gray-600">
                You've completed all 3 levels with a score of {state.score}!
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={handleReset}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-8 rounded-xl text-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again <RotateCcw className="w-6 h-6" />
                </motion.button>
                <motion.button
                  onClick={onExit}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl text-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Exit <LogOut className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <MathMascot state={state.gameStatus} />
              </div>

              {state.gameStatus === 'countdown' && (
                <motion.div
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-center"
                >
                  <h2 className="text-4xl font-bold text-purple-600">
                    Get Ready!
                  </h2>
                  <p className="text-xl text-gray-600 mt-2">
                    Level {state.level} starting...
                  </p>
                </motion.div>
              )}

              {state.gameStatus === 'levelPause' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-center"
                >
                  <h2 className="text-4xl font-bold text-green-600">
                    Great job!
                  </h2>
                  <p className="text-xl text-gray-600 mt-2">
                    Get ready for level {state.level}
                  </p>
                </motion.div>
              )}

              {(state.gameStatus === 'playing' || state.gameStatus === 'correct' || state.gameStatus === 'incorrect') && (
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-4 text-5xl font-bold text-gray-800">
                    <span>{state.currentProblem.question.split('=')[0]}</span>
                    <span className="text-gray-800">=</span>
                    <div className="w-40 h-20 border-4 border-purple-300 rounded-xl flex items-center justify-center bg-purple-50">
                      <motion.span
                        key={currentSum}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-3xl font-bold ${
                          state.gameStatus === 'correct'
                            ? 'text-green-600'
                            : 'text-purple-600'
                        }`}
                      >
                        {currentSum}
                      </motion.span>
                    </div>
                  </div>

                  <div ref={gameAreaRef} className="relative h-[50vh] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl overflow-hidden">
                    {floatingNumbers.map((number) => (
                      <motion.button
                        key={number.id}
                        className={`absolute ${number.color} rounded-full shadow-lg cursor-pointer flex items-center justify-center text-4xl font-bold text-white hover:shadow-xl transition-all`}
                        style={{
                          left: `${number.x}px`,
                          top: `${number.y}px`,
                          width: `${number.size}px`,
                          height: `${number.size}px`,
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleNumberClick(number)}
                      >
                        {number.value}
                      </motion.button>
                    ))}
                  </div>

                  {selectedNumbers.length > 0 && (
                    <div className="flex gap-3 justify-center mt-4">
                      {selectedNumbers.map((num, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl font-semibold text-purple-600"
                        >
                          {num}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {state.gameStatus === 'incorrect' && (
                <motion.div
                  className="text-center text-2xl font-semibold text-red-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Try again!
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};