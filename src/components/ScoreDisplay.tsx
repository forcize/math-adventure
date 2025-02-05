import React from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  correctAnswers: number;
  totalAnswers: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  correctAnswers,
  totalAnswers
}) => {
  return (
    <div className="flex items-center gap-4 text-lg font-semibold">
      <motion.div
        className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full"
        whileHover={{ scale: 1.05 }}
      >
        <Trophy size={20} />
        <span>{score}</span>
      </motion.div>
      <div className="text-gray-600">
        {correctAnswers}/{totalAnswers}
      </div>
    </div>
  );
};