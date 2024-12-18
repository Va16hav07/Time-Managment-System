
// Timer functionality for Task Timer section

let timer;
let minutes = 25; // Pomodoro session length (in minutes)
let seconds = 0;
let isRunning = false;

const startButton = document.getElementById("start-timer");
const stopButton = document.getElementById("stop-timer");
const resetButton = document.getElementById("reset-timer");
const timerDisplay = document.getElementById("timer-display");

function updateTimerDisplay() {
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    isRunning = true;
    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                alert("Time's up!");
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    clearInterval(timer);
}

function resetTimer() {
    minutes = 25;
    seconds = 0;
    updateTimerDisplay();
    if (isRunning) {
        stopTimer();
    }
}

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);

// Initial update of timer display
updateTimerDisplay();


