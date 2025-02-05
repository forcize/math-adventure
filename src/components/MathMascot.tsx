import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface MascotProps {
  state: 'playing' | 'correct' | 'incorrect' | 'complete' | 'victory' | 'countdown' | 'levelPause';
}

export const MathMascot: React.FC<MascotProps> = ({ state }) => {
  const mascotVariants = {
    playing: { 
      y: [0, -5, 0], 
      transition: { repeat: Infinity, duration: 1.5 } 
    },
    correct: { 
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5 } 
    },
    incorrect: { 
      rotate: [-5, 5, -5, 0], 
      transition: { duration: 0.5 } 
    },
    countdown: {
      scale: [1, 1.1, 1],
      transition: { repeat: Infinity, duration: 1 }
    },
    levelPause: {
      rotate: [0, 360],
      transition: { duration: 1 }
    },
    victory: {
      scale: [1, 1.5, 1],
      rotate: [0, 360],
      transition: { duration: 1 }
    },
    complete: { scale: 1 }
  };

  const colors = {
    playing: 'text-blue-500',
    correct: 'text-green-500',
    incorrect: 'text-red-500',
    countdown: 'text-purple-500',
    levelPause: 'text-yellow-500',
    victory: 'text-yellow-500',
    complete: 'text-purple-500'
  };

  return (
    <motion.div
      className={`text-4xl ${colors[state]}`}
      variants={mascotVariants}
      animate={state}
    >
      <Star size={48} />
    </motion.div>
  );
};