// Fetch elements
const welcomeMessage = document.getElementById("welcomeMessage");
const signOutButton = document.getElementById("signOutButton");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const startTaskButton = document.getElementById("startTaskButton");
const endTaskButton = document.getElementById("endTaskButton");
const currentTask = document.getElementById("currentTask");
const timeSpent = document.getElementById("timeSpent");

// Load logged-in user
const loggedinUser = JSON.parse(localStorage.getItem("loggedinUser"))[0];

if (!loggedinUser) {
    window.location.href = "index.html"; // Redirect to login if no user is logged in
} else {
    welcomeMessage.textContent = `Welcome, ${loggedinUser.username}!`;
}

// Add task to the list
addTaskButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();

    if (!taskText) {
        alert("Task cannot be empty!");
        return;
    }

    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    const taskLabel = document.createElement("span");
    taskLabel.textContent = taskText;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.addEventListener("click", () => {
        const updatedTask = prompt("Edit your task:", taskLabel.textContent);
        if (updatedTask) {
            taskLabel.textContent = updatedTask;
        }
    });

    const doneButton = document.createElement("button");
    doneButton.textContent = "Done";
    doneButton.className = "done-button";
    doneButton.addEventListener("click", () => {
        taskLabel.style.textDecoration = "line-through";
        taskLabel.style.color = "gray";
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => {
        taskItem.remove();  // Remove from UI
        saveTasksToLocalStorage();  // Update localStorage
    });

    taskItem.appendChild(taskLabel);
    taskItem.appendChild(editButton);
    taskItem.appendChild(doneButton);
    taskItem.appendChild(deleteButton);  // Add delete button
    taskList.appendChild(taskItem);

    taskInput.value = "";
    saveTasksToLocalStorage();
});

// Time tracking variables
let currentTaskTimer = null;
let timeInSeconds = 0;
let taskInterval;

// Start tracking time for a task
startTaskButton.addEventListener("click", () => {
    if (!taskInput.value.trim()) {
        alert("Please enter a task before starting time tracking.");
        return;
    }
    currentTask.textContent = `Current Task: ${taskInput.value}`;
    taskInput.disabled = true;
    startTaskButton.disabled = true;
    endTaskButton.disabled = false;

    taskInterval = setInterval(() => {
        timeInSeconds++;
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        timeSpent.textContent = `Time Spent: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }, 1000);
});

// Stop tracking time for the current task
endTaskButton.addEventListener("click", () => {
    clearInterval(taskInterval);
    taskInput.disabled = false;
    startTaskButton.disabled = false;
    endTaskButton.disabled = true;
    currentTask.textContent = "Current Task: None";
    timeSpent.textContent = "Time Spent: 0:00";
    timeInSeconds = 0;
});

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((taskItem) => {
        tasks.push(taskItem.querySelector("span").textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((taskText) => {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";

        const taskLabel = document.createElement("span");
        taskLabel.textContent = taskText;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        editButton.addEventListener("click", () => {
            const updatedTask = prompt("Edit your task:", taskLabel.textContent);
            if (updatedTask) {
                taskLabel.textContent = updatedTask;
                saveTasksToLocalStorage();
            }
        });

        const doneButton = document.createElement("button");
        doneButton.textContent = "Done";
        doneButton.className = "done-button";
        doneButton.addEventListener("click", () => {
            taskLabel.style.textDecoration = "line-through";
            taskLabel.style.color = "gray";
            saveTasksToLocalStorage();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => {
            taskItem.remove();  // Remove from UI
            saveTasksToLocalStorage();  // Update localStorage
        });

        taskItem.appendChild(taskLabel);
        taskItem.appendChild(editButton);
        taskItem.appendChild(doneButton);
        taskItem.appendChild(deleteButton);  // Add delete button
        taskList.appendChild(taskItem);
    });
});

// Sign Out
signOutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedinUser");
    window.location.href = "index.html";
});
