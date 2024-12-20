// HTML Elements
const welcomeMessage = document.getElementById("welcomeMessage");
const profileIcon = document.getElementById("profileIcon");
const dropdownMenu = document.getElementById("dropdownMenu");
const signOutButton = document.getElementById("signOutButton");
const taskInput = document.getElementById("taskInput");
const taskDescriptionInput = document.getElementById("taskDescriptionInput");
const taskDueDate = document.getElementById("taskDueDate");
const taskPriority = document.getElementById("taskPriority");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const searchBar = document.getElementById("searchBar");

// Retrieve logged-in user
const loggedinUser = JSON.parse(localStorage.getItem("loggedinUser"));

if (loggedinUser) {
    welcomeMessage.textContent = `Welcome, ${loggedinUser.name}!`;
} else {
    window.location.href = "index.html";
}

// Generate a unique key for the user's tasks
const getUserTaskKey = () => {
    let userIndex = localStorage.getItem("userIndex");
    if (!userIndex) {
        userIndex = JSON.stringify({});
        localStorage.setItem("userIndex", userIndex);
    }
    userIndex = JSON.parse(userIndex);

    if (!userIndex[loggedinUser.name]) {
        const nextIndex = Object.keys(userIndex).length + 1;
        userIndex[loggedinUser.name] = nextIndex.toString().padStart(2, '0');
        localStorage.setItem("userIndex", JSON.stringify(userIndex));
    }

    return `${userIndex[loggedinUser.name]}_task`;
};

const userTaskKey = getUserTaskKey();
let tasks = JSON.parse(localStorage.getItem(userTaskKey)) || [];
let timers = {};
let startTimes = {};

const saveTasks = () => {
    localStorage.setItem(userTaskKey, JSON.stringify(tasks));
};

const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const updateTimerDisplay = (taskId) => {
    const timerDisplay = document.querySelector(`[data-timer-id="${taskId}"]`);
    const task = tasks.find(t => t.id === taskId);
    if (timerDisplay && task) {
        const currentTime = Date.now();
        const additionalSeconds = task.isRunning ? Math.floor((currentTime - startTimes[taskId]) / 1000) : 0;
        const totalSeconds = (task.elapsedSeconds || 0) + additionalSeconds;
        timerDisplay.textContent = `Time: ${formatTime(totalSeconds)}`;
    }
};

const startTimer = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.isRunning) return;

    task.isRunning = true;
    startTimes[taskId] = Date.now();
    
    timers[taskId] = setInterval(() => {
        updateTimerDisplay(taskId);
    }, 1000);

    updateTimerDisplay(taskId);
};

const stopTimer = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.isRunning) return;

    clearInterval(timers[taskId]);
    delete timers[taskId];

    const currentTime = Date.now();
    const additionalSeconds = Math.floor((currentTime - startTimes[taskId]) / 1000);
    task.elapsedSeconds = (task.elapsedSeconds || 0) + additionalSeconds;
    task.isRunning = false;
    delete startTimes[taskId];

    updateTimerDisplay(taskId);
    saveTasks();
};

const renderTasks = (filteredTasks = tasks) => {
    taskList.innerHTML = "";
    
    const userTasks = filteredTasks;
    
    userTasks.sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityComparison !== 0) return priorityComparison;
        return new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31");
    });

    userTasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";

        const taskLabel = document.createElement("span");
        taskLabel.textContent = task.taskTitle;
        taskLabel.style.textDecoration = task.done ? "line-through" : "none";
        taskLabel.style.color = task.done ? "gray" : "red";

        const description = document.createElement("div");
        description.textContent = task.description || "No description provided.";
        description.style.display = "none";
        description.style.marginTop = "5px";
        description.style.color = "#555";

        taskLabel.addEventListener("click", () => {
            description.style.display = description.style.display === "none" ? "block" : "none";
        });

        const timerDisplay = document.createElement("div");
        timerDisplay.setAttribute('data-timer-id', task.id);
        timerDisplay.textContent = `Time: ${formatTime(task.elapsedSeconds || 0)}`;
        timerDisplay.style.marginTop = "5px";
        timerDisplay.style.fontFamily = "monospace";

        const taskDetails = document.createElement("div");
        taskDetails.innerHTML = `
            <span>Due: ${task.dueDate || "No due date"}</span> | 
            <span>Priority: ${task.priority}</span>
        `;
        taskDetails.style.marginTop = "5px";

        const timeTrackButton = document.createElement("button");
        if (task.isRunning) {
            timeTrackButton.textContent = "Stop Timer";
            timeTrackButton.classList.add("end-task");
        } else {
            timeTrackButton.textContent = "Start Timer";
            timeTrackButton.classList.add("start-task");
        }
        timeTrackButton.disabled = task.done;

        timeTrackButton.addEventListener("click", () => {
            if (task.isRunning) {
                stopTimer(task.id);
                timeTrackButton.textContent = "Start Timer";
                timeTrackButton.classList.remove("end-task");
                timeTrackButton.classList.add("start-task");
            } else {
                startTimer(task.id);
                timeTrackButton.textContent = "Stop Timer";
                timeTrackButton.classList.remove("start-task");
                timeTrackButton.classList.add("end-task");
            }
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit");
        editButton.addEventListener("click", () => {
            if (task.isRunning) {
                stopTimer(task.id);
                timeTrackButton.textContent = "Start Timer";
                timeTrackButton.classList.remove("end-task");
                timeTrackButton.classList.add("start-task");
            }
            const updatedText = prompt("Edit task Title:", task.taskTitle);
            const updatedDescription = prompt("Edit description:", task.description);
            if (updatedText) task.taskTitle = updatedText;
            if (updatedDescription !== null) task.description = updatedDescription;
            saveTasks();
            renderTasks();
        });

        const doneButton = document.createElement("button");
        doneButton.textContent = task.done ? "Undo" : "Done";
        doneButton.classList.add("done");
        doneButton.addEventListener("click", () => {
            if (task.isRunning) {
                stopTimer(task.id);
            }
            task.done = !task.done;
            if (task.done) {
                timeTrackButton.disabled = true;
                timeTrackButton.textContent = "Start Timer";
                timeTrackButton.classList.remove("end-task");
                timeTrackButton.classList.add("start-task");
            } else {
                timeTrackButton.disabled = false;
                task.isRunning = false;
            }
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete");
        deleteButton.addEventListener("click", () => {
            if (task.isRunning) {
                stopTimer(task.id);
            }
            const taskIndex = tasks.indexOf(task);
            tasks.splice(taskIndex, 1);
            saveTasks();
            renderTasks();
        });

        taskItem.appendChild(taskLabel);
        taskItem.appendChild(description);
        taskItem.appendChild(taskDetails);
        taskItem.appendChild(timerDisplay);
        taskItem.appendChild(timeTrackButton);
        taskItem.appendChild(editButton);
        taskItem.appendChild(doneButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        // Restart timer if it was running
        if (task.isRunning) {
            startTimer(task.id);
        }
    });
};

// Initial rendering of tasks
renderTasks();

// Add a new task
addTaskButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const taskDescription = taskDescriptionInput.value.trim();
    const taskDueDateValue = taskDueDate.value;
    const taskPriorityValue = taskPriority.value;

    if (!taskText) {
        alert("Task name cannot be empty!");
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        taskTitle: taskText,
        description: taskDescription,
        dueDate: taskDueDateValue,
        priority: taskPriorityValue,
        done: false,
        elapsedSeconds: 0,
        isRunning: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // Clear inputs
    taskInput.value = "";
    taskDescriptionInput.value = "";
    taskDueDate.value = "";
    taskPriority.value = "low";
});

signOutButton.addEventListener("click", () => {
    const isConfirmed = confirm("Are you sure you want to sign out?");
    
    if (isConfirmed) {
        // Stop all running timers
        tasks.forEach(task => {
            if (task.isRunning) {
                stopTimer(task.id);
            }
        });
        localStorage.removeItem("loggedinUser");
        window.location.href = "index.html";
    }
});

// Search bar logic
searchBar.addEventListener("input", () => {
    const searchQuery = searchBar.value.toLowerCase();
    const filteredTasks = tasks.filter(task =>
        task.taskTitle.toLowerCase().includes(searchQuery) ||
        (task.description && task.description.toLowerCase().includes(searchQuery))
    );
    renderTasks(filteredTasks);
});

// Clean up all timers when the window is closed or refreshed
window.addEventListener('beforeunload', () => {
    tasks.forEach(task => {
        if (task.isRunning) {
            stopTimer(task.id);
        }
    });
});
const navigateTo = (url) => {
    window.location.href = url;
};
