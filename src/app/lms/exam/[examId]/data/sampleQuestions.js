export const examQuestions = [
    {
        id: 1,
        type: 'multiple-choice-single',
        number: 1,
        text: 'What is the output of console.log(typeof [])?',
        options: [
            'array',
            'object',
            'undefined',
            'Array'
        ],
        correctAnswer: 1, // Index of 'object'
        explanation: 'In JavaScript, arrays are actually objects, so typeof [] returns "object".'
    },
    {
        id: 2,
        type: 'multiple-choice-multiple',
        number: 2,
        text: 'Which of the following are valid ways to declare a variable in JavaScript?',
        options: [
            'var x = 1;',
            'let y = 2;',
            'const z = 3;',
            'variable w = 4;'
        ],
        correctAnswers: [0, 1, 2], // Indices of correct options
        explanation: 'JavaScript has three ways to declare variables: var, let, and const.'
    },
    {
        id: 3,
        type: 'fill-blank',
        number: 3,
        text: 'Complete the code: fetch(url).then(response => response.___()).then(data => console.log(data))',
        correctAnswer: 'json',
        caseSensitive: false,
        explanation: 'The json() method of the Response interface takes a Response stream and reads it to completion.'
    },
    {
        id: 4,
        type: 'code-writing',
        number: 4,
        text: 'Write a function that reverses a string without using the built-in reverse() method.',
        testCases: [
            { input: ['hello'], expected: 'olleh' },
            { input: ['JavaScript'], expected: 'tpircSavaJ' }
        ],
        initialCode: 'function reverseString(str) {\n  // Your code here\n}',
        explanation: 'This can be solved using various approaches like using a for loop or array methods.'
    },
    {
        id: 5,
        type: 'image-choice',
        number: 5,
        text: 'Which image shows the correct flexbox alignment?',
        image: '/questions/flexbox-question.png',
        options: [
            '/answers/flexbox-1.png',
            '/answers/flexbox-2.png',
            '/answers/flexbox-3.png',
            '/answers/flexbox-4.png'
        ],
        correctAnswer: 2,
        explanation: 'The third image shows proper alignment with justify-content: center and align-items: center.'
    },
    {
        id: 6,
        type: 'video-question',
        number: 6,
        text: 'After watching the video, what is the main benefit of using React hooks?',
        videoUrl: '/videos/react-hooks-intro.mp4',
        options: [
            'They make code longer',
            'They allow use of state in functional components',
            'They only work in class components',
            'They reduce performance'
        ],
        correctAnswer: 1,
        explanation: 'Hooks allow you to use state and other React features in functional components.'
    },
    {
        id: 7,
        type: 'hotspot',
        number: 7,
        text: 'Click on the area where you would add the event listener in the DOM tree.',
        image: '/questions/dom-tree.png',
        correctArea: {
            x: 150,
            y: 100,
            width: 100,
            height: 30
        },
        explanation: 'Event listeners are typically added to the target element in the DOM tree.'
    },
    {
        id: 8,
        type: 'drag-drop',
        number: 8,
        text: 'Arrange the following steps in the correct order for a Git workflow.',
        items: [
            'git add .',
            'git commit -m "message"',
            'git pull origin main',
            'git push origin main'
        ],
        correctOrder: [2, 0, 1, 3],
        explanation: 'A typical Git workflow involves pulling latest changes, staging files, committing, and then pushing.'
    }
];

export const mockExamData = {
    id: 1,
    title: "JavaScript Fundamentals Assessment",
    description: "Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.",
    duration: 120, // minutes
    totalMarks: 100,
    passingMarks: 60,
    questions: examQuestions,
    instructions: [
        "Read each question carefully before answering",
        "You can review and change your answers before final submission",
        "Each question carries equal marks",
        "There is no negative marking"
    ],
    course: "Web Development",
    subject: "JavaScript",
    type: "remote",
    flexible_timing: true,
    schedule_exam_date_time: new Date().toISOString(),
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
};

// Question type definitions
export const questionTypes = {
    'true-false': {
        name: 'True/False',
        icon: 'SwitchHorizontalIcon'
    },
    'multiple-choice-single': {
        name: 'Multiple Choice',
        icon: 'CheckCircleIcon'
    },
    'multiple-choice-multiple': {
        name: 'Multiple Select',
        icon: 'ViewListIcon'
    },
    'image-choice': {
        name: 'Image Based',
        icon: 'PhotographIcon'
    },
    'fill-blank': {
        name: 'Fill in the Blank',
        icon: 'PencilIcon'
    },
    'code-writing': {
        name: 'Code Writing',
        icon: 'CodeIcon'
    },
    'drag-drop': {
        name: 'Drag and Drop',
        icon: 'SortAscendingIcon'
    },
    'hotspot': {
        name: 'Hotspot',
        icon: 'CursorClickIcon'
    },
    'video-question': {
        name: 'Video Question',
        icon: 'PlayIcon'
    }
}; 