export const generateProblem = (level: number, operations: ('addition' | 'subtraction' | 'multiplication' | 'division')[]) => {
  const difficulty = level <= 3 ? 'easy' : level <= 6 ? 'medium' : 'hard';
  const maxNumber = Math.min(10 + (level * 5), 50);
  
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1: number;
  let num2: number;
  let correctAnswer: number;
  let question: string;
  
  switch (operation) {
    case 'addition':
      num1 = Math.floor(Math.random() * maxNumber) + 1;
      num2 = Math.floor(Math.random() * maxNumber) + 1;
      correctAnswer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case 'subtraction':
      num1 = Math.floor(Math.random() * maxNumber) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      correctAnswer = num1;
      question = `${num1 + num2} - ${num2} = ?`;
      break;
    case 'multiplication':
      const multMax = Math.min(Math.floor(maxNumber / 2), 12);
      num1 = Math.floor(Math.random() * multMax) + 1;
      num2 = Math.floor(Math.random() * multMax) + 1;
      correctAnswer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
    case 'division':
      num2 = Math.floor(Math.random() * Math.min(maxNumber / 4, 10)) + 1;
      correctAnswer = Math.floor(Math.random() * Math.min(maxNumber / 4, 10)) + 1;
      num1 = correctAnswer * num2;
      question = `${num1} ÷ ${num2} = ?`;
      break;
    default:
      num1 = Math.floor(Math.random() * maxNumber) + 1;
      num2 = Math.floor(Math.random() * maxNumber) + 1;
      correctAnswer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
  }

  if (level === 1) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      question,
      correctAnswer,
      options: [],
      difficulty,
      type: operation
    };
  }

  const generateDecoyNumber = () => {
    const range = Math.floor(correctAnswer * (0.3 + (level * 0.05)));
    let decoy: number;
    
    switch (operation) {
      case 'addition':
        decoy = Math.random() < 0.5 
          ? correctAnswer + Math.floor(Math.random() * (level + 2)) + 1
          : correctAnswer - Math.floor(Math.random() * (level + 2)) - 1;
        break;
      case 'subtraction':
        decoy = Math.random() < 0.5
          ? correctAnswer + Math.floor(Math.random() * (level + 1))
          : Math.max(1, correctAnswer - Math.floor(Math.random() * (level + 1)));
        break;
      case 'multiplication':
        decoy = Math.random() < 0.5
          ? correctAnswer + num1
          : correctAnswer + num2;
        break;
      case 'division':
        decoy = Math.random() < 0.5
          ? correctAnswer + 1
          : Math.max(1, correctAnswer - 1);
        break;
      default:
        decoy = correctAnswer + (Math.random() < 0.5 ? level : -level);
    }
    
    return Math.max(1, Math.abs(Math.round(decoy)));
  };

  const numDecoys = Math.min(2 + Math.floor(level / 2), 5);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    question,
    correctAnswer,
    options: Array.from({ length: numDecoys }, generateDecoyNumber),
    difficulty,
    type: operation
  };
};