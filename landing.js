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

const loggedinUser = JSON.parse(localStorage.getItem("loggedinUser"));

if (loggedinUser) {
    welcomeMessage.textContent = `Welcome, ${loggedinUser.name}!`;
} else {
    window.location.href = "index.html";
}

// Unique key for storing the tasks of the current user
const userTaskKey = `${loggedinUser.name}_tasks`;

// Load tasks for the current user or initialize as an empty array
let tasks = JSON.parse(localStorage.getItem(userTaskKey)) || [];

// Save tasks to local storage under the user's unique key
const saveTasks = () => {
    localStorage.setItem(userTaskKey, JSON.stringify(tasks));
};

// Format date and time for display
const formatTime = (date) => {
    return new Date(date).toLocaleString();
};

// Render the tasks for the current user
const renderTasks = (filteredTasks = tasks) => {
    taskList.innerHTML = "";

    const userTasks = filteredTasks.filter((task) => task.Name === loggedinUser.name);

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
            description.style.display =
                description.style.display === "none" ? "block" : "none";
        });

        const timeInfo = document.createElement("div");
        timeInfo.style.marginTop = "5px";
        timeInfo.innerHTML = task.startTime
            ? `Started: ${formatTime(task.startTime)}${
                  task.endTime ? ` | Ended: ${formatTime(task.endTime)}` : ""
              }`
            : "Not started yet";

        const taskDetails = document.createElement("div");
        taskDetails.innerHTML = `
            <span>Due: ${task.dueDate || "No due date"}</span> | 
            <span>Priority: ${task.priority}</span>
        `;
        taskDetails.style.marginTop = "5px";

        const timeTrackButton = document.createElement("button");
        timeTrackButton.classList.add(
            task.startTime && !task.endTime ? "end-task" : "start-task"
        );
        timeTrackButton.textContent =
            task.startTime && !task.endTime ? "End Task" : "Start Task";
        timeTrackButton.disabled = task.done || (task.startTime && task.endTime);

        timeTrackButton.addEventListener("click", () => {
            if (!task.startTime) {
                task.startTime = new Date().toISOString();
                timeTrackButton.textContent = "End Task";
                timeTrackButton.classList.remove("start-task");
                timeTrackButton.classList.add("end-task");
            } else if (!task.endTime) {
                task.endTime = new Date().toISOString();
                const isCompleted = confirm("Have you completed this task?");
                if (isCompleted) {
                    task.done = true;
                }
                timeTrackButton.disabled = true;
            }
            saveTasks();
            renderTasks();
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit");
        editButton.addEventListener("click", () => {
            const updatedText = prompt("Edit task Title:", task.taskTitle);
            const updatedDescription = prompt(
                "Edit description:",
                task.description
            );
            if (updatedText) task.taskTitle = updatedText;
            if (updatedDescription !== null) task.description = updatedDescription;
            saveTasks();
            renderTasks();
        });

        const doneButton = document.createElement("button");
        doneButton.textContent = task.done ? "Undo" : "Done";
        doneButton.classList.add("done");
        doneButton.addEventListener("click", () => {
            task.done = !task.done;
            if (task.done && !task.endTime && task.startTime) {
                task.endTime = new Date().toISOString();
            }
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete");
        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter((t) => t !== task);
            saveTasks();
            renderTasks();
        });

        taskItem.appendChild(taskLabel);
        taskItem.appendChild(description);
        taskItem.appendChild(taskDetails);
        taskItem.appendChild(timeInfo);
        taskItem.appendChild(timeTrackButton);
        taskItem.appendChild(editButton);
        taskItem.appendChild(doneButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
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
        taskTitle: taskText,
        description: taskDescription,
        dueDate: taskDueDateValue,
        priority: taskPriorityValue,
        done: false,
        Name: loggedinUser.name,
        startTime: null,
        endTime: null,
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

// Sign out logic
signOutButton.addEventListener("click", () => {
    const isConfirmed = confirm("Are you sure you want to sign out?");
    if (isConfirmed) {
        localStorage.removeItem("loggedinUser");
        window.location.href = "index.html";
    }
});

// Search bar logic
searchBar.addEventListener("input", () => {
    const searchQuery = searchBar.value.toLowerCase();
    const filteredTasks = tasks.filter(
        (task) =>
            task.taskTitle.toLowerCase().includes(searchQuery) ||
            (task.description &&
                task.description.toLowerCase().includes(searchQuery))
    );
    renderTasks(filteredTasks);
});
