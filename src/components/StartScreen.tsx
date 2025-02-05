import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X as Multiply, Divide } from 'lucide-react';

interface StartScreenProps {
  onStart: (operations: ('addition' | 'subtraction' | 'multiplication' | 'division')[], maxLevel: number) => void;
}

const operations = [
  { 
    id: 'addition', 
    name: 'Addition', 
    icon: Plus, 
    color: 'from-pink-500 to-rose-500',
    hoverColor: 'from-pink-600 to-rose-600'
  },
  { 
    id: 'subtraction', 
    name: 'Subtraction', 
    icon: Minus, 
    color: 'from-emerald-500 to-teal-500',
    hoverColor: 'from-emerald-600 to-teal-600'
  },
  { 
    id: 'multiplication', 
    name: 'Multiplication', 
    icon: Multiply, 
    color: 'from-violet-500 to-purple-500',
    hoverColor: 'from-violet-600 to-purple-600'
  },
  { 
    id: 'division', 
    name: 'Division', 
    icon: Divide, 
    color: 'from-blue-500 to-indigo-500',
    hoverColor: 'from-blue-600 to-indigo-600'
  }
] as const;

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [selectedOperations, setSelectedOperations] = useState<Set<typeof operations[number]['id']>>(new Set(['addition']));
  const maxLevel = 3;

  const toggleOperation = (operationId: typeof operations[number]['id']) => {
    setSelectedOperations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(operationId)) {
        if (newSet.size > 1) {
          newSet.delete(operationId);
        }
      } else {
        newSet.add(operationId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Math Adventure</h1>
        <p className="text-xl text-white/90">Let's make numbers fun!</p>
        <p className="mt-2 text-sm text-white/70 italic">
          This is a proof of concept for synthesis, can contain bugs
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[80%] max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-8"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 text-center">Choose Math Operations</h3>
          <div className="grid grid-cols-2 gap-4">
            {operations.map(({ id, name, icon: Icon, color, hoverColor }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleOperation(id)}
                className={`relative p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-lg overflow-hidden group ${
                  selectedOperations.has(id)
                    ? `bg-gradient-to-br ${color}`
                    : 'bg-gray-100'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${hoverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <Icon className={`w-8 h-8 ${selectedOperations.has(id) ? 'text-white' : 'text-gray-600 group-hover:text-white'}`} />
                  <span className={`font-semibold ${selectedOperations.has(id) ? 'text-white' : 'text-gray-700 group-hover:text-white'}`}>
                    {name}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart(Array.from(selectedOperations), maxLevel)}
            className="w-full py-6 rounded-xl text-2xl font-semibold shadow-lg bg-purple-600 hover:bg-purple-700 text-white"
          >
            Start Playing
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};