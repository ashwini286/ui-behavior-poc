// Romantic Quiz Questions
const quizQuestions = [
    {
        question: "What would be your ideal romantic date? 💕",
        options: [
            "A candlelit dinner under the stars",
            "A cozy movie night at home with cuddles",
            "An adventurous outdoor activity together",
            "A romantic walk on the beach at sunset"
        ],
        correctAnswer: 0 // All answers are "correct" for romantic purposes
    },
    {
        question: "How do you express your love? ❤️",
        options: [
            "Through words and poetry",
            "With physical touch and hugs",
            "By doing thoughtful acts of service",
            "With meaningful gifts and surprises"
        ],
        correctAnswer: 0
    },
    {
        question: "What makes a relationship special to you? 💖",
        options: [
            "Deep emotional connection and trust",
            "Shared laughter and fun moments",
            "Supporting each other's dreams",
            "Creating unforgettable memories together"
        ],
        correctAnswer: 0
    },
    {
        question: "What's your idea of the perfect Valentine's Day? 🌹",
        options: [
            "A surprise romantic getaway",
            "Handmade gifts and love letters",
            "A simple day filled with quality time",
            "A grand romantic gesture with flowers and chocolates"
        ],
        correctAnswer: 0
    },
    {
        question: "What does 'forever' mean to you? 💍",
        options: [
            "Growing old together and never giving up",
            "Always finding new ways to fall in love",
            "Being each other's best friend for life",
            "Creating a beautiful family and legacy"
        ],
        correctAnswer: 0
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;

// DOM Elements
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const questionSection = document.getElementById('questionSection');
const resultsSection = document.getElementById('resultsSection');
const scoreSpan = document.getElementById('score');
const resultMessage = document.getElementById('resultMessage');

// Initialize quiz
function initQuiz() {
    totalQuestionsSpan.textContent = quizQuestions.length;
    loadQuestion();
}

// Load question
function loadQuestion() {
    const question = quizQuestions[currentQuestionIndex];

    // Update question text
    questionText.textContent = question.question;

    // Update progress
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    progressBar.style.width = progress + '%';

    // Clear options
    optionsContainer.innerHTML = '';

    // Create option buttons
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option glass-card p-4 rounded-xl';
        optionDiv.innerHTML = `
            <label class="flex items-center cursor-pointer">
                <input type="radio" name="answer" value="${index}" class="mr-4 w-5 h-5 cursor-pointer">
                <span class="text-white text-lg">${option}</span>
            </label>
        `;

        // Check if user already answered this question
        if (userAnswers[currentQuestionIndex] !== undefined && userAnswers[currentQuestionIndex] === index) {
            optionDiv.classList.add('selected');
            optionDiv.querySelector('input').checked = true;
        }

        // Add click listener
        optionDiv.addEventListener('click', () => selectOption(index, optionDiv));

        optionsContainer.appendChild(optionDiv);
    });

    // Update button states
    updateButtons();
}

// Select option
function selectOption(index, optionDiv) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));

    // Add selection to clicked option
    optionDiv.classList.add('selected');
    optionDiv.querySelector('input').checked = true;

    // Store answer
    userAnswers[currentQuestionIndex] = index;

    // Enable next button
    nextBtn.disabled = false;
    nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
}

// Update buttons
function updateButtons() {
    // Previous button
    if (currentQuestionIndex === 0) {
        prevBtn.disabled = true;
        prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    // Next button
    if (userAnswers[currentQuestionIndex] === undefined) {
        nextBtn.disabled = true;
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    // Change next button to submit on last question
    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.textContent = 'Submit 💖';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

// Next button click
nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        questionSection.classList.remove('fade-in');
        setTimeout(() => {
            questionSection.classList.add('fade-in');
            loadQuestion();
        }, 50);
    } else {
        // Show results
        showResults();
    }
});

// Previous button click
prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        questionSection.classList.remove('fade-in');
        setTimeout(() => {
            questionSection.classList.add('fade-in');
            loadQuestion();
        }, 50);
    }
});

// Show results
function showResults() {
    // Calculate score (all answers are considered correct for romantic quiz)
    score = userAnswers.length;

    // Hide question section
    questionSection.classList.add('hidden');

    // Show results section
    resultsSection.classList.remove('hidden');
    scoreSpan.textContent = score;

    // Personalized message based on score
    let message = '';
    if (score === 5) {
        message = "Perfect! You have a beautiful romantic heart! 💖✨";
    } else if (score >= 3) {
        message = "Amazing! Your romantic spirit shines bright! 🌟❤️";
    } else {
        message = "Sweet! Love is all about the journey together! 💕";
    }

    resultMessage.textContent = message;
}

// Initialize quiz on page load
initQuiz();
