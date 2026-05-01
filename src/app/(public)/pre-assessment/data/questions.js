export const sampleQuestions = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'What is the capital of France?',
    correctAnswer: 'Paris',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
  },
  {
    id: 2,
    type: 'true-false',
    question: 'The Earth is flat.',
    correctAnswer: false,
  },
  {
    id: 3,
    type: 'multiple-select', // New type for multiple answers
    question: 'Which of the following are mammals?',
    correctAnswer: ['Dog', 'Whale', 'Bat'],
    options: ['Dog', 'Snake', 'Whale', 'Lizard', 'Bat'],
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: 'Which planet is known as the Red Planet?',
    correctAnswer: 'Mars',
    options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
  },
  {
    id: 5,
    type: 'multiple-select',
    question: 'Which of these are prime numbers?',
    correctAnswer: ['3', '5', '7', '11'],
    options: ['1', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
  },
  // Additional questions for testing pagination
  {
    id: 6,
    type: 'multiple-choice',
    question: "Who wrote 'Romeo and Juliet'?",
    correctAnswer: 'William Shakespeare',
    options: [
      'Charles Dickens',
      'William Shakespeare',
      'Jane Austen',
      'Mark Twain',
    ],
  },
  {
    id: 7,
    type: 'true-false',
    question: 'The Great Wall of China is visible from space.',
    correctAnswer: false,
  },
  {
    id: 8,
    type: 'multiple-select',
    question: 'Which of the following are programming languages?',
    correctAnswer: ['JavaScript', 'Python', 'Java', 'C++'],
    options: ['JavaScript', 'HTML', 'Python', 'CSS', 'Java', 'C++'],
  },
];

export const createQuestionSchema = (question) => {
  if (question.type === 'true-false') {
    return {
      answer: {
        type: 'boolean',
        nullable: true,
        required: true,
      },
    };
  } else {
    return {
      answer: {
        type: 'string',
        required: 'Please select an answer',
      },
    };
  }
};
