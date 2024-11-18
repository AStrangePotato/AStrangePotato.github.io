let startTime = null;
let timerInterval = null;
let isRunning = false;
let isPreparing = false;

const timerDisplay = document.getElementById("timer");
const leaderboardList = document.getElementById("leaderboardList");

const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// Update the leaderboard display
function updateLeaderboard() {
  leaderboardList.innerHTML = "";
  leaderboard
    .sort((a, b) => Math.abs(a.time - 5) - Math.abs(b.time - 5))
    .slice(0, 5) // Top 5 players
    .forEach((entry, index) => {
      const li = document.createElement("li");
      let positionText = `${entry.name}: ${entry.time.toFixed(3)}s`;
      
      // Add crown emoji for the first place
      if (index === 0) {
        positionText = `👑 ${positionText}`;
      }

      li.textContent = positionText;
      leaderboardList.appendChild(li);
    });
}

// Start the timer
function startTimer() {
  startTime = performance.now();
  isRunning = true;
  isPreparing = false;

  timerDisplay.textContent = "?";
  timerDisplay.classList.add("timer-opacity-breathing");  // Apply the breathing animation
}


// Stop the timer
function stopTimer() {
  isRunning = false;
  timerDisplay.classList.remove("timer-opacity-breathing");

  const elapsed = (performance.now() - startTime) / 1000;

  // Display the elapsed time immediately
  timerDisplay.textContent = elapsed.toFixed(3);

  // Use a small delay to let the DOM update before showing the prompt
  setTimeout(() => {
    const name = prompt("Enter your name for the leaderboard:");
    if (name) {
      leaderboard.push({ name, time: elapsed });
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
      updateLeaderboard();
    }
  }, 100); // 100ms delay
}


// Prepare the timer
function prepareTimer() {
  timerDisplay.classList.remove("default");
  timerDisplay.classList.add("red");
  isPreparing = true;
}

// Reset the timer color after preparation
function resetTimerColor() {
  timerDisplay.classList.remove("red");
  timerDisplay.classList.add("default");

  if (isPreparing && !isRunning) {
    startTimer();
  }
}

// Handle spacebar key press and release
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !isRunning && !isPreparing) {
    prepareTimer();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    if (isRunning) {
      stopTimer();
    } else {
      resetTimerColor();
    }
  }
});

// Initialize leaderboard on page load
updateLeaderboard();
