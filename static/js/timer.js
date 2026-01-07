let studyTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = studyTime;
let timer = null;
let isStudy = true;
let sessionsCompleted = 0;
let username = localStorage.getItem("username");

const usernameBox = document.getElementById("usernameBox");
const usernameInput = document.getElementById("usernameInput");
const saveUsernameBtn = document.getElementById("saveUsername");


const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const buddySelect = document.getElementById("buddy");
const buddyImage = document.getElementById("buddyImage");
const buddyMessage = document.getElementById("buddyMessage");
const sessionsDisplay = document.getElementById("sessions");
const modeText = document.getElementById("mode");
const studyInput = document.getElementById("studyInput");
const breakInput = document.getElementById("breakInput");
const app = document.querySelector(".app");



// 🔔 Sound
const ding = new Audio("/static/sounds/ding.mp3");

// 🐻 Buddy Messages
const messages = {
  soft: {
    study: [
      "I'm proud of you for starting 🩷",
      "One step at a time, okay?",
      "You're doing your best 💕"
    ],
    break: [
      "Take a deep breath 🌿",
      "Rest your eyes, love 💗"
    ]
  },
  strict: {
    study: [
      "Focus. No excuses 🔥",
      "Stay disciplined. You started this.",
      "Eyes on the task."
    ],
    break: [
      "You earned this break. Be ready.",
      "Back in 5. No delays."
    ]
  },
  funny: {
    study: [
      "Study now, regret never 😆",
      "Your future self is watching 👀",
      "No phone. I see you."
    ],
    break: [
      "Break time! Stretch like a cat 🐱",
      "Hydration check 💧"
    ]
  },
  senpai: {
    study: [
      "Ganbatte! I'm watching you 👀",
      "Don't disappoint your senpai.",
      "Your effort is noticed."
    ],
    break: [
      "Rest well. Then return stronger.",
      "Even warriors need rest."
    ]
  }
};



// 🎭 Update Buddy
function updateBuddy(state) {
  const type = buddySelect.value;
  const options = messages[type][state];
  buddyMessage.textContent =
    options[Math.floor(Math.random() * options.length)];
  buddyImage.src = `/static/images/bear_${type}.jpeg`;
}

// ⏱ Update Timer Display
function updateDisplay() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  timeDisplay.textContent =
    `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

if (!username) {
  usernameBox.style.display = "flex";
  app.style.display = "none";
} else {
  usernameBox.style.display = "none";
  app.style.display = "block";
  loadStats();
}

function loadStats() {
  fetch(`/stats?username=${username}`)
    .then(res => res.json())
    .then(data => {
      sessionsCompleted = data.sessions;
      sessionsDisplay.textContent = data.sessions;
      document.getElementById("streak").textContent = data.streak;
      buddySelect.value = data.buddy || "soft";
      updateBuddy("study");
    })
    .catch(err => {
      console.error("Failed to load stats:", err);
    });
}


saveUsernameBtn.addEventListener("click", () => {
  const value = usernameInput.value.trim();
  if (!value) {
    alert("Username cannot be empty");
    return;
  }

  localStorage.setItem("username", value);
  username = value;

  usernameBox.style.display = "none";
  app.style.display = "block";
  loadStats();
});


// ▶ Start Timer
startBtn.addEventListener("click", () => {
  if (timer) return;
  isStudy = true;
  startBtn.disabled = true;

// Read custom values
studyTime = parseInt(studyInput.value) * 60;
breakTime = parseInt(breakInput.value) * 60;

// Reset timer to selected study time
timeLeft = studyTime;
updateDisplay();

updateBuddy(isStudy ? "study" : "break");
modeText.textContent = "Study Time 📚";

studyInput.disabled = true;
breakInput.disabled = true;


  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      ding.play();
      startBtn.disabled = false;


      if (isStudy) {
        fetch("/complete", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username })
})       
        .then(res => res.json())
        .then(() => {
  loadStats();  
});


        isStudy = false;
        timeLeft = breakTime;
        updateBuddy("break");
        modeText.textContent = "Break Time ☕";

      } else {
        isStudy = true;
        timeLeft = studyTime;
        updateBuddy("study");
        modeText.textContent = "Study Time 📚";

      }

      updateDisplay();
    }
  }, 1000);
});

// ⏸ Pause
pauseBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  startBtn.disabled = false;
  studyInput.disabled = false;
  breakInput.disabled = false;

});


// 🔄 Reset
resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  isStudy = true;

  studyTime = parseInt(studyInput.value) * 60;
  breakTime = parseInt(breakInput.value) * 60;
  timeLeft = studyTime;

  updateDisplay();
  updateBuddy("study");
  modeText.textContent = "Study Time 📚";
  startBtn.disabled = false;
});



// 🎭 Change Buddy
buddySelect.addEventListener("change", () => {
  fetch("/buddy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
  username,
  buddy: buddySelect.value
})

  });

  updateBuddy(isStudy ? "study" : "break");
});

// Init
updateDisplay();
updateBuddy("study");
