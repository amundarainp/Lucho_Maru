// ============================================
// VARIABLES GLOBALES
// ============================================
let currentPhoto = 1;
let memoryCards = [];
let memoryFlipped = [];
let memoryMoves = 0;
let memoryPairs = 0;
let quizCurrentQuestion = 0;
let quizScore = 0;
let wheelSpinning = false;

// Fecha de inicio de la relación (ajustar según corresponda)
const relationshipStartDate = new Date("2020-01-01"); // AJUSTAR ESTA FECHA

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  createFloatingHearts();
  initializeCounters();
});

// ============================================
// PANTALLA DE BIENVENIDA
// ============================================
function startExperience() {
  const welcomeScreen = document.getElementById("welcomeScreen");
  const mainContainer = document.getElementById("mainContainer");

  welcomeScreen.style.animation = "fadeOut 1s ease";

  setTimeout(() => {
    welcomeScreen.style.display = "none";
    mainContainer.style.display = "block";
    mainContainer.style.animation = "fadeIn 1s ease";
  }, 1000);
}

// ============================================
// PARTÍCULAS DE CORAZONES
// ============================================
function createFloatingHearts() {
  const container = document.getElementById("heartsContainer");
  const heartSymbols = ["❤️", "💕", "💖", "💗", "💝", "💘"];

  setInterval(() => {
    if (document.getElementById("mainContainer").style.display !== "none") {
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.textContent =
        heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.left = Math.random() * 100 + "%";
      heart.style.fontSize = Math.random() * 20 + 15 + "px";
      heart.style.animationDuration = Math.random() * 3 + 4 + "s";

      container.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 7000);
    }
  }, 500);
}

// ============================================
// CONTADORES
// ============================================
function initializeCounters() {
  const now = new Date();
  const diff = now - relationshipStartDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  animateCounter("daysCounter", days);
  animateCounter("hoursCounter", hours);
}

function animateCounter(id, target) {
  const element = document.getElementById(id);
  let current = 0;
  const increment = Math.ceil(target / 50);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current.toLocaleString();
  }, 30);
}

// ============================================
// NAVEGACIÓN
// ============================================
function showSection(sectionId, buttonElement) {
  // Cerrar carta si está abierta
  closeLetter();

  // Resetear juegos si se sale de la sección de juegos
  resetGames();

  // Cerrar modal de fotos si está abierto
  closePhotoModal();

  // Ocultar todas las secciones
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => section.classList.remove("active"));

  // Mostrar sección seleccionada
  document.getElementById(sectionId).classList.add("active");

  // Actualizar botones de navegación
  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  if (buttonElement) {
    buttonElement.classList.add("active");
  }
}

// ============================================
// CARTA DE AMOR
// ============================================
function openLetter() {
  const envelope = document.getElementById("envelope");
  const letterContent = document.getElementById("letterContent");

  envelope.classList.add("opened");

  setTimeout(() => {
    letterContent.classList.add("show");
  }, 600);
}

function closeLetter() {
  const envelope = document.getElementById("envelope");
  const letterContent = document.getElementById("letterContent");

  if (envelope && letterContent) {
    envelope.classList.remove("opened");
    letterContent.classList.remove("show");
  }
}

// ============================================
// GALERÍA DE FOTOS
// ============================================
function openPhotoModal(photoNumber) {
  currentPhoto = photoNumber;
  const modal = document.getElementById("photoModal");
  const img = document.getElementById("modalImage");

  modal.style.display = "block";
  img.src = `assets/${photoNumber}.jpeg`;
}

function closePhotoModal() {
  const modal = document.getElementById("photoModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function nextPhoto() {
  currentPhoto = currentPhoto >= 12 ? 1 : currentPhoto + 1;
  document.getElementById("modalImage").src = `assets/${currentPhoto}.jpeg`;
}

function prevPhoto() {
  currentPhoto = currentPhoto <= 1 ? 12 : currentPhoto - 1;
  document.getElementById("modalImage").src = `assets/${currentPhoto}.jpeg`;
}

// Navegación con teclado
document.addEventListener("keydown", function (e) {
  const modal = document.getElementById("photoModal");
  if (modal.style.display === "block") {
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
    if (e.key === "Escape") closePhotoModal();
  }
});

// ============================================
// JUEGO 1: QUIZ DEL AMOR
// ============================================
const quizQuestions = [
  {
    question: "¿Qué es lo que más amo de ti?",
    options: [
      "Tu sonrisa que ilumina mi día",
      "Tu forma de ser auténtica",
      "Todo, porque eres perfecta para mí",
      "Tu corazón generoso",
    ],
    correct: 2,
  },
  {
    question: "¿Cuál es nuestro plan perfecto?",
    options: [
      "Una cena romántica",
      "Quedarnos en casa viendo películas",
      "Una aventura espontánea",
      "Cualquier cosa, si es contigo",
    ],
    correct: 3,
  },
  {
    question: "¿Qué significa 'te amo' para mí?",
    options: [
      "Palabras bonitas",
      "Un compromiso eterno",
      "La promesa de estar siempre juntos",
      "Todo lo anterior y más",
    ],
    correct: 3,
  },
  {
    question: "¿Cuál es mi momento favorito del día?",
    options: [
      "Despertarme a tu lado",
      "Cuando me cuentas tu día",
      "Antes de dormir, abrazados",
      "Cada momento contigo",
    ],
    correct: 3,
  },
  {
    question: "¿Qué eres para mí?",
    options: [
      "Mi amor",
      "Mi mejor amiga",
      "Mi compañera de vida",
      "Todo lo anterior y mi razón de ser feliz",
    ],
    correct: 3,
  },
];

function startQuiz() {
  quizCurrentQuestion = 0;
  quizScore = 0;
  document.getElementById("quizResult").innerHTML = "";
  showQuizQuestion();
}

function showQuizQuestion() {
  if (quizCurrentQuestion >= quizQuestions.length) {
    showQuizResult();
    return;
  }

  const question = quizQuestions[quizCurrentQuestion];
  const questionContainer = document.getElementById("quizQuestion");

  let html = `<p class="question-text">${question.question}</p><div class="quiz-options">`;

  question.options.forEach((option, index) => {
    html += `<button class="quiz-option" onclick="checkQuizAnswer(${index})">${option}</button>`;
  });

  html += "</div>";
  questionContainer.innerHTML = html;
}

function checkQuizAnswer(answer) {
  const question = quizQuestions[quizCurrentQuestion];
  const options = document.querySelectorAll(".quiz-option");

  options.forEach((option, index) => {
    option.disabled = true;
    if (index === question.correct) {
      option.classList.add("correct");
    } else if (index === answer && answer !== question.correct) {
      option.classList.add("incorrect");
    }
  });

  if (answer === question.correct) {
    quizScore++;
  }

  setTimeout(() => {
    quizCurrentQuestion++;
    showQuizQuestion();
  }, 1500);
}

function showQuizResult() {
  const resultDiv = document.getElementById("quizResult");
  const percentage = (quizScore / quizQuestions.length) * 100;

  let message = "";
  if (percentage === 100) {
    message = "¡Perfecto! 💕 Sabía que nos conocemos perfectamente";
  } else if (percentage >= 80) {
    message = "¡Excelente! ❤️ Nuestra conexión es increíble";
  } else if (percentage >= 60) {
    message = "¡Muy bien! 💖 Cada día nos conocemos más";
  } else {
    message = "¡Todo está bien! 💗 Lo importante es que nos amamos";
  }

  resultDiv.innerHTML = `
        <p style="font-size: 1.5rem; margin: 1rem 0;">Puntuación: ${quizScore}/${quizQuestions.length}</p>
        <p style="color: var(--gold);">${message}</p>
    `;

  document.getElementById("quizQuestion").innerHTML = "";
}

// ============================================
// RESETEO DE JUEGOS
// ============================================
function resetGames() {
  // Resetear Quiz
  quizCurrentQuestion = 0;
  quizScore = 0;
  const quizQuestion = document.getElementById("quizQuestion");
  const quizResult = document.getElementById("quizResult");
  if (quizQuestion) quizQuestion.innerHTML = "";
  if (quizResult) quizResult.innerHTML = "";

  // Resetear Memoria
  memoryMoves = 0;
  memoryPairs = 0;
  memoryFlipped = [];
  const memoryGrid = document.getElementById("memoryGrid");
  if (memoryGrid) memoryGrid.innerHTML = "";
  const movesDisplay = document.getElementById("moves");
  const pairsDisplay = document.getElementById("pairs");
  if (movesDisplay) movesDisplay.textContent = "0";
  if (pairsDisplay) pairsDisplay.textContent = "0";

  // Resetear Ruleta
  wheelSpinning = false;
  const wheelCanvas = document.getElementById("wheelCanvas");
  const wheelResult = document.getElementById("wheelResult");
  if (wheelCanvas) wheelCanvas.style.transform = "rotate(0deg)";
  if (wheelResult) wheelResult.innerHTML = "";

  // Resetear Juego de Fechas
  currentDateQuestion = 0;
  const dateQuestion = document.getElementById("dateQuestion");
  const dateResult = document.getElementById("dateResult");
  if (dateQuestion) dateQuestion.innerHTML = "";
  if (dateResult) dateResult.innerHTML = "";
  const checkDateBtn = document.getElementById("checkDateBtn");
  if (checkDateBtn) checkDateBtn.style.display = "none";

  // Resetear Mensaje Secreto en Sorpresas
  const secretInput = document.getElementById("secretInput");
  const secretResult = document.getElementById("secretResult");
  if (secretInput) secretInput.value = "";
  if (secretResult) secretResult.innerHTML = "";

  // Cerrar cajas de recuerdos reveladas
  const memoryBoxes = document.querySelectorAll(".memory-box");
  memoryBoxes.forEach((box) => box.classList.remove("revealed"));
}

// ============================================
// JUEGO 2: MEMORIA DE PAREJAS
// ============================================
function startMemoryGame() {
  memoryMoves = 0;
  memoryPairs = 0;
  memoryFlipped = [];

  document.getElementById("moves").textContent = "0";
  document.getElementById("pairs").textContent = "0";

  const symbols = ["❤️", "💕", "💖", "💗", "💝", "💘"];
  memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

  const grid = document.getElementById("memoryGrid");
  grid.innerHTML = "";

  memoryCards.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.index = index;
    card.dataset.symbol = symbol;
    card.textContent = "?";
    card.onclick = () => flipMemoryCard(index);
    grid.appendChild(card);
  });
}

function flipMemoryCard(index) {
  if (memoryFlipped.length >= 2) return;

  const card = document.querySelector(`[data-index="${index}"]`);
  if (card.classList.contains("flipped") || card.classList.contains("matched"))
    return;

  card.classList.add("flipped");
  card.textContent = card.dataset.symbol;
  memoryFlipped.push(index);

  if (memoryFlipped.length === 2) {
    memoryMoves++;
    document.getElementById("moves").textContent = memoryMoves;
    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  const [index1, index2] = memoryFlipped;
  const card1 = document.querySelector(`[data-index="${index1}"]`);
  const card2 = document.querySelector(`[data-index="${index2}"]`);

  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    memoryPairs++;
    document.getElementById("pairs").textContent = memoryPairs;
    memoryFlipped = [];

    if (memoryPairs === 6) {
      setTimeout(() => {
        alert(
          `¡Felicidades! 🎉 Completaste el juego en ${memoryMoves} movimientos`,
        );
      }, 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.textContent = "?";
      card2.textContent = "?";
      memoryFlipped = [];
    }, 1000);
  }
}

// ============================================
// JUEGO 3: RULETA DEL AMOR
// ============================================
const wheelPrizes = [
  "🌹 Un beso apasionado",
  "💝 Un abrazo eterno",
  "🎁 Una sorpresa especial",
  "💕 Una serenata de amor",
  "🌟 Una cita romántica",
  "💌 Una carta de amor",
  "🍫 Chocolates y mimos",
  "✨ Un masaje relajante",
];

function drawWheel() {
  const canvas = document.getElementById("wheelCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 140;
  const sliceAngle = (2 * Math.PI) / wheelPrizes.length;

  wheelPrizes.forEach((prize, index) => {
    const startAngle = index * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    // Dibujar slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    // Color alternado
    const hue = (index * 360) / wheelPrizes.length;
    ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
    ctx.fill();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// Dibujar la ruleta al cargar
setTimeout(drawWheel, 100);

function spinWheel() {
  if (wheelSpinning) return;

  wheelSpinning = true;
  const canvas = document.getElementById("wheelCanvas");
  const resultDiv = document.getElementById("wheelResult");

  const spins = 5 + Math.random() * 5;
  const extraDegrees = Math.random() * 360;
  const totalRotation = spins * 360 + extraDegrees;

  let currentRotation = 0;
  const duration = 4000;
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function para desaceleración
    const easeOut = 1 - Math.pow(1 - progress, 3);
    currentRotation = totalRotation * easeOut;

    canvas.style.transform = `rotate(${currentRotation}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const finalAngle = currentRotation % 360;
      const sliceAngle = 360 / wheelPrizes.length;
      const prizeIndex =
        Math.floor((360 - finalAngle) / sliceAngle) % wheelPrizes.length;

      resultDiv.innerHTML = `<p style="font-size: 1.3rem; color: var(--gold);">🎉 ¡Ganaste! 🎉</p>
                                  <p style="margin-top: 0.5rem;">${wheelPrizes[prizeIndex]}</p>`;

      wheelSpinning = false;
    }
  }

  resultDiv.innerHTML = "<p>Girando...</p>";
  animate();
}

// ============================================
// JUEGO 4: ADIVINA LA FECHA
// ============================================
const dateQuestions = [
  {
    question: "¿Cuándo nos conocimos?",
    answer: "2020-01-01", // AJUSTAR
    tolerance: 7,
  },
  {
    question: "¿Cuándo fue nuestro primer beso?",
    answer: "2020-02-14", // AJUSTAR
    tolerance: 7,
  },
  {
    question: "¿Cuándo dijimos 'te amo' por primera vez?",
    answer: "2020-03-01", // AJUSTAR
    tolerance: 7,
  },
];

let currentDateQuestion = 0;

function startDateGame() {
  currentDateQuestion = Math.floor(Math.random() * dateQuestions.length);
  const question = dateQuestions[currentDateQuestion];

  document.getElementById("dateQuestion").innerHTML = `
        <p class="question-text">${question.question}</p>
        <input type="date" id="dateInput" class="date-input">
    `;

  document.getElementById("dateResult").innerHTML = "";
  document.getElementById("checkDateBtn").style.display = "inline-block";
  document.querySelector(".btn-game").style.display = "none";
}

function checkDate() {
  const input = document.getElementById("dateInput").value;
  const question = dateQuestions[currentDateQuestion];
  const resultDiv = document.getElementById("dateResult");

  if (!input) {
    resultDiv.innerHTML =
      '<p style="color: var(--accent);">Por favor selecciona una fecha</p>';
    return;
  }

  const userDate = new Date(input);
  const correctDate = new Date(question.answer);
  const diffDays = Math.abs((userDate - correctDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    resultDiv.innerHTML =
      '<p style="color: #38ef7d; font-size: 1.5rem;">¡Perfecto! 💕 ¡Recuerdas la fecha exacta!</p>';
  } else if (diffDays <= question.tolerance) {
    resultDiv.innerHTML =
      '<p style="color: #FFD700;">¡Muy cerca! ❤️ Lo importante es el recuerdo</p>';
  } else {
    resultDiv.innerHTML = `<p style="color: var(--rose);">La fecha era ${correctDate.toLocaleDateString("es")} 💗</p>`;
  }

  document.getElementById("checkDateBtn").style.display = "none";
  setTimeout(() => {
    document.querySelector(".btn-game").style.display = "inline-block";
  }, 2000);
}

// ============================================
// SORPRESAS
// ============================================

// Revelar recuerdos
function revealMemory(number) {
  const boxes = document.querySelectorAll(".memory-box");
  boxes[number - 1].classList.toggle("revealed");
}

// Razones por las que te amo
const reasons = [
  "Por tu sonrisa que ilumina mis días más oscuros",
  "Por cómo me haces sentir amado cada día",
  "Por tu bondad y tu corazón generoso",
  "Por ser mi mejor amiga y mi confidente",
  "Por cada abrazo que me hace sentir en casa",
  "Por tu risa que es mi música favorita",
  "Por cómo me miras y haces que mi corazón se acelere",
  "Por ser exactamente quien eres",
  "Por cada momento compartido y los que vienen",
  "Por hacer de mi vida una aventura increíble",
  "Por tu paciencia y comprensión",
  "Por ser mi inspiración cada día",
  "Por los pequeños detalles que me demuestran tu amor",
  "Por ser mi persona favorita en todo el universo",
  "Por amarme tal como soy",
  "Por construir este hermoso futuro juntos",
  "Por cada sueño que compartimos",
  "Por ser mi compañera perfecta",
  "Por hacer que cada día valga la pena",
  "Por ser simplemente tú, mi amor eterno",
];

let usedReasons = [];

function showReason() {
  if (usedReasons.length === reasons.length) {
    usedReasons = [];
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * reasons.length);
  } while (usedReasons.includes(randomIndex));

  usedReasons.push(randomIndex);

  const display = document.getElementById("reasonDisplay");
  display.style.animation = "none";
  setTimeout(() => {
    display.textContent = reasons[randomIndex];
    display.style.animation = "fadeIn 0.8s ease";
  }, 10);
}

// Mensaje secreto
function checkSecret() {
  const input = document
    .getElementById("secretInput")
    .value.toLowerCase()
    .trim();
  const result = document.getElementById("secretResult");

  if (input === "tamo" || input === "t amo" || input === "te amo") {
    result.innerHTML = `
            <p style="color: #38ef7d; font-size: 1.5rem; margin-top: 1rem;">
                ¡Correcto! 💕<br>
                <span style="font-size: 1.2rem; margin-top: 0.5rem; display: block;">
                    Y yo también te amo con todo mi corazón ❤️
                </span>
            </p>
        `;

    // Crear efecto de corazones
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        createSpecialHeart();
      }, i * 100);
    }
  } else {
    result.innerHTML =
      '<p style="color: var(--accent); margin-top: 1rem;">Intenta de nuevo... 💭</p>';
  }
}

function createSpecialHeart() {
  const heart = document.createElement("div");
  heart.textContent = "❤️";
  heart.style.position = "fixed";
  heart.style.left = Math.random() * window.innerWidth + "px";
  heart.style.top = window.innerHeight + "px";
  heart.style.fontSize = "2rem";
  heart.style.zIndex = "10000";
  heart.style.transition = "all 2s ease";
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.style.top = "-100px";
    heart.style.opacity = "0";
  }, 10);

  setTimeout(() => {
    heart.remove();
  }, 2000);
}

// Promesas
const promises = [
  "Prometo amarte cada día más que el anterior",
  "Prometo hacer que te sientas especial siempre",
  "Prometo estar a tu lado en las buenas y en las malas",
  "Prometo hacer que cada día sea una aventura",
  "Prometo escucharte y comprenderte siempre",
  "Prometo cuidar de ti y protegerte",
  "Prometo hacerte reír incluso en los días difíciles",
  "Prometo respetar tus sueños y apoyarte en todo",
  "Prometo ser tu mejor amigo y tu amor eterno",
  "Prometo construir contigo el futuro que soñamos",
  "Prometo celebrar cada logro tuyo como si fuera mío",
  "Prometo darte todo mi amor sin reservas",
  "Prometo ser paciente y comprensivo",
  "Prometo sorprenderte y mantener viva la chispa",
  "Prometo amarte hasta el fin de mis días",
];

let usedPromises = [];

function showPromise() {
  if (usedPromises.length === promises.length) {
    usedPromises = [];
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * promises.length);
  } while (usedPromises.includes(randomIndex));

  usedPromises.push(randomIndex);

  const display = document.getElementById("promiseDisplay");
  display.style.animation = "none";
  setTimeout(() => {
    display.textContent = promises[randomIndex];
    display.style.animation = "fadeIn 0.8s ease";
  }, 10);
}

// ============================================
// CONTROL DE MÚSICA
// ============================================
let musicPlaying = false;
let audioContext;
let oscillator;

function toggleMusic() {
  const btn = document.getElementById("musicBtn");

  if (!musicPlaying) {
    btn.textContent = "🔇";
    btn.classList.add("playing");
    musicPlaying = true;
    // Aquí podrías agregar un audio si lo deseas
    // const audio = new Audio('ruta-a-tu-cancion.mp3');
    // audio.play();
  } else {
    btn.textContent = "🎵";
    btn.classList.remove("playing");
    musicPlaying = false;
    // audio.pause();
  }
}

// ============================================
// UTILIDADES
// ============================================
function addFadeOut() {
  return `
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.9);
            }
        }
    `;
}
