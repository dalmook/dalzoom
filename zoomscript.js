let quizData = [];
let currentQuestion = 0;
let score = 0;

// Elements
const quizImage = document.getElementById('quiz-image');
const userAnswer = document.getElementById('user-answer');
const submitButton = document.getElementById('submit-answer');
const feedback = document.getElementById('feedback');
const currentScore = document.getElementById('current-score');
const questionNumber = document.getElementById('question-number');
const nextButton = document.getElementById('next-question');
const zoomOverlay = document.getElementById('zoom-overlay');

// Fetch quiz data
fetch('zoomdata.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        startQuiz();
    })
    .catch(error => console.error('Error loading quiz data:', error));

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    updateScoreboard();
    loadQuestion();
}

function loadQuestion() {
    resetState();
    if (currentQuestion < quizData.length) {
        const question = quizData[currentQuestion];
        quizImage.src = question.image;
        quizImage.alt = `Question ${currentQuestion + 1}`;
        questionNumber.textContent = `Question: ${currentQuestion + 1} / ${quizData.length}`;
    } else {
        endQuiz();
    }
}

function resetState() {
    feedback.textContent = '';
    userAnswer.value = '';
    nextButton.disabled = true;
}

submitButton.addEventListener('click', checkAnswer);
userAnswer.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

function checkAnswer() {
    const answer = userAnswer.value.trim().toLowerCase();
    if (answer === '') {
        feedback.textContent = 'Please enter your answer!';
        feedback.style.color = 'orange';
        return;
    }

    const correctAnswer = quizData[currentQuestion].answer.toLowerCase();
    if (answer === correctAnswer) {
        feedback.textContent = 'Correct!';
        feedback.style.color = 'green';
        score++;
    } else {
        feedback.textContent = `Incorrect! The correct answer was "${quizData[currentQuestion].answer}".`;
        feedback.style.color = 'red';
    }

    updateScoreboard();
    submitButton.disabled = true;
    userAnswer.disabled = true;
    nextButton.disabled = false;
}

nextButton.addEventListener('click', () => {
    currentQuestion++;
    loadQuestion();
    submitButton.disabled = false;
    userAnswer.disabled = false;
});

function updateScoreboard() {
    currentScore.textContent = `Score: ${score}`;
}

function endQuiz() {
    quizImage.style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    feedback.textContent = `Quiz Over! Your final score is ${score} out of ${quizData.length}.`;
    feedback.style.color = '#007acc';
    nextButton.style.display = 'none';
}

// Zoom functionality
let isZoomed = false;

quizImage.addEventListener('click', () => {
    if (!isZoomed) {
        quizImage.style.transform = 'scale(2)';
        zoomOverlay.style.opacity = '0.5';
        isZoomed = true;
    } else {
        quizImage.style.transform = 'scale(1)';
        zoomOverlay.style.opacity = '0';
        isZoomed = false;
    }
});
