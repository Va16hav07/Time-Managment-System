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

// Fetch tasks for the logged-in user
let tasks = JSON.parse(localStorage.getItem(loggedinUser.username + "_tasks")) || [];

// Function to save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem(loggedinUser.username + "_tasks", JSON.stringify(tasks));
};
//

const updateTaskStatus = () => {
    const currentDate = new Date(); // Get today's date

    // Filter tasks for the logged-in user
    const userTasks = tasks.filter(task => task.username === loggedinUser.username);

    userTasks.forEach(task => {
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;

        if (taskDueDate && taskDueDate < currentDate) {
            task.done = false; // Mark the task as incomplete if it's past due
        }
    });

    // Update the main tasks array with the modified userTasks
    tasks = tasks.map(task => {
        if (task.username === loggedinUser.username) {
            const updatedTask = userTasks.find(userTask => userTask.TaskTitle === task.TaskTitle);
            return updatedTask ? updatedTask : task;
        }
        return task;
    });

    saveTasks(); // Save updated tasks to localStorage
    renderTasks(); // Re-render the task list with updated statuses
};


// Function to render tasks
const renderTasks = (filteredTasks = tasks) => {
    taskList.innerHTML = "";

    filteredTasks.sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityComparison !== 0) return priorityComparison;

        return new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31");
    });

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";

        // Task label
        const taskLabel = document.createElement("span");
        taskLabel.textContent = task.text;
        taskLabel.style.textDecoration = task.done ? "line-through" : "none";
        taskLabel.style.color = task.done ? "gray" : "red";

        // Toggle description display
        const description = document.createElement("div");
        description.textContent = task.description || "No description provided.";
        description.style.display = "none";
        description.style.marginTop = "5px";
        description.style.color = "#555";

        taskLabel.addEventListener("click", () => {
            description.style.display = description.style.display === "none" ? "block" : "none";
        });

        // Task details
        const taskDetails = document.createElement("div");
        taskDetails.innerHTML = `
            <span>Due: ${task.dueDate || "No due date"}</span> | 
            <span>Priority: ${task.priority}</span>
        `;
        taskDetails.style.marginTop = "5px";

        // Edit button
        const editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            const updatedText = prompt("Edit task name:", task.text);
            const updatedDescription = prompt("Edit description:", task.description);
            if (updatedText) task.text = updatedText;
            if (updatedDescription !== null) task.description = updatedDescription;
            saveTasks();
            renderTasks();
        });

        // Done button
        const doneButton = document.createElement("button");
        doneButton.classList.add("done");
        doneButton.textContent = task.done ? "Undo" : "Done";
        doneButton.addEventListener("click", () => {
            task.done = !task.done;
            saveTasks();
            renderTasks();
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        // Append elements to task item
        taskItem.appendChild(taskLabel);
        taskItem.appendChild(description);
        taskItem.appendChild(taskDetails);
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
        text: taskText, // Changed TaskTitle to text
        description: taskDescription,
        dueDate: taskDueDateValue,
        priority: taskPriorityValue,
        done: false,
        username: loggedinUser.username
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
    localStorage.removeItem("loggedinUser");
    window.location.href = "index.html";
});

// Search bar logic
searchBar.addEventListener("input", () => {
    const searchQuery = searchBar.value.toLowerCase();
    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchQuery) ||
        (task.description && task.description.toLowerCase().includes(searchQuery))
    );
    renderTasks(filteredTasks);
});

// Profile icon dropdown toggle
profileIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
    if (!dropdownMenu.contains(event.target) && !profileIcon.contains(event.target)) {
        dropdownMenu.classList.add("hidden");
    }
});

function navigateTo(url) {
    window.location.href = url;
}
