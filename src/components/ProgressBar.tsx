import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total }) => {
  const percentage = (progress / total) * 100;

  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};