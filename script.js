const fullQuiz = [
  { question: "What does HTML stand for?", options: ["Hyperlinks and Text Markup Language", "HyperText Markup Language", "Home Tool Markup Language"], answer: "HyperText Markup Language" },
  { question: "Which HTML tag is used to create a hyperlink?", options: ["<link>", "<a>", "<href>"], answer: "<a>" },
  { question: "What is the purpose of CSS?", options: ["To create database connections", "To style and layout web pages", "To add interactivity to websites"], answer: "To style and layout web pages" },
  { question: "Which CSS property changes the text color?", options: ["font-style", "color", "background-color"], answer: "color" },
  { question: "Which unit is relative to the size of the parent element?", options: ["px", "em", "%"], answer: "em" },
  { question: "What does the 'alt' attribute in the <img> tag do?", options: ["Adds a tooltip", "Provides alternative text if the image can’t load", "Links the image to another page"], answer: "Provides alternative text if the image can’t load" },
  { question: "Which of the following is a valid CSS comment?", options: ["// comment", "/* comment */", "<!-- comment -->"], answer: "/* comment */" },
  { question: "What is the default position value for HTML elements?", options: ["absolute", "relative", "static"], answer: "static" },
  { question: "Which tag is used to define the largest heading?", options: ["<heading>", "<h6>", "<h1>"], answer: "<h1>" },
  { question: "Which property makes a website layout adapt to different screen sizes?", options: ["Responsive Design", "Fixed Layout", "Absolute Positioning"], answer: "Responsive Design" }
];

let quiz = [];
let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

function getRandomQuestions(count) {
  const shuffled = [...fullQuiz].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function startQuiz() {
  quiz = getRandomQuestions(3);
  currentQuestion = 0;
  score = 0;
  nextBtn.innerText = "Next Question";
  loadQuestion();
}

function loadQuestion() {
  feedbackEl.innerText = "";
  nextBtn.style.display = "none";
  const q = quiz[currentQuestion];
  questionEl.innerText = `Question ${currentQuestion + 1} of ${quiz.length}: ${q.question}`;
  optionsEl.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("div");
    btn.classList.add("option");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(btn, option);
    optionsEl.appendChild(btn);
  });

  scoreEl.innerText = `Score: ${score} / ${quiz.length}`;
}

function checkAnswer(button, selected) {
  const correct = quiz[currentQuestion].answer;
  const allOptions = optionsEl.querySelectorAll(".option");

  allOptions.forEach(btn => {
    btn.onclick = null;
    btn.style.pointerEvents = "none";
    if (btn.innerText === correct) {
      btn.style.backgroundColor = "#a4f0a4";
    } else {
      btn.style.backgroundColor = "#f0a4a4";
    }
  });

  if (selected === correct) {
    feedbackEl.innerText = "✅ Correct!";
    score++;
  } else {
    feedbackEl.innerText = `❌ Wrong! The correct answer was "${correct}".`;
  }

  nextBtn.style.display = "inline-block";
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < quiz.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
};

function endQuiz() {
  questionEl.innerText = "🎉 Quiz Completed!";
  optionsEl.innerHTML = "";
  feedbackEl.innerText = score >= quiz.length * 0.7 ? "Great job! 🎯" : "You can do better! 💪";
  scoreEl.innerText = `Final Score: ${score} / ${quiz.length}`;
  nextBtn.innerText = "Play Again (New Questions)";
  nextBtn.style.display = "block";
  nextBtn.onclick = startQuiz;
}

document.addEventListener("DOMContentLoaded", startQuiz);
