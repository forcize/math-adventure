import React from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Target, Brain, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface ScoreModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({ profile, onClose }) => {
  const correctPercentage = profile.totalAnswers > 0
    ? Math.round((profile.correctAnswers / profile.totalAnswers) * 100)
    : 0;

  const getPerformanceMessage = () => {
    if (correctPercentage >= 90) return "Amazing work! You're a math superstar! 🌟";
    if (correctPercentage >= 70) return "Great job! Keep practicing! 💪";
    if (correctPercentage >= 50) return "You're making progress! Keep going! 🎯";
    return "Practice makes perfect! Don't give up! 🌱";
  };

  const getParentTip = () => {
    if (correctPercentage >= 90) return "Your child is excelling! Consider introducing more challenging problems.";
    if (correctPercentage >= 70) return "Your child is doing well! Focus on maintaining consistent practice.";
    if (correctPercentage >= 50) return "Consider reviewing basic concepts and providing additional support.";
    return "Your child might benefit from one-on-one tutoring or extra practice sessions.";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-600">Your Math Journey 🚀</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Score Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-purple-700">Total Score</span>
              </div>
              <span className="text-3xl font-bold text-purple-600">{profile.score}</span>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-700">Accuracy</span>
              </div>
              <span className="text-3xl font-bold text-green-600">{correctPercentage}%</span>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-blue-50 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-blue-700">Progress Details</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-600">Problems Solved</p>
                <p className="text-2xl font-bold text-blue-700">{profile.totalAnswers}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Correct Answers</p>
                <p className="text-2xl font-bold text-blue-700">{profile.correctAnswers}</p>
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="bg-yellow-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-yellow-700">Performance</span>
            </div>
            <p className="text-lg text-yellow-800">{getPerformanceMessage()}</p>
          </div>

          {/* Parent Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">📝 Note for Parents</h3>
            <p className="text-sm text-gray-600">{getParentTip()}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl text-lg font-semibold bg-purple-600 text-white hover:bg-purple-700"
        >
          Keep Learning! 📚
        </motion.button>
      </motion.div>
    </motion.div>
  );
};