const welcomeMessage = document.getElementById("welcomeMessage");
const signOutButton = document.getElementById("signOutButton");
const taskInput = document.getElementById("taskInput");
const taskDescriptionInput = document.getElementById("taskDescriptionInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const searchBar = document.getElementById("searchBar");

const loggedinUser = JSON.parse(localStorage.getItem("loggedinUser"))[0];

if (loggedinUser) {
    welcomeMessage.textContent = `Welcome, ${loggedinUser.username}!`;
} else {
    window.location.href = "index.html";
}

// Retrieve tasks from localStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to render tasks
const renderTasks = (filteredTasks = tasks) => {
    taskList.innerHTML = ""; // Clear the list
    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";

        const taskLabel = document.createElement("span");
        taskLabel.textContent = task.text;
        taskLabel.style.textDecoration = task.done ? "line-through" : "none";
        taskLabel.style.color = task.done ? "gray" : "black";
        taskLabel.style.cursor = "pointer";

        const descriptionDropdown = document.createElement("div");
        descriptionDropdown.textContent = task.description || "No description";
        descriptionDropdown.style.display = "none";
        descriptionDropdown.style.marginTop = "5px";
        descriptionDropdown.style.color = "#555";

        taskLabel.addEventListener("click", () => {
            descriptionDropdown.style.display = descriptionDropdown.style.display === "none" ? "block" : "none";
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        editButton.addEventListener("click", () => {
            const updatedTask = prompt("Edit your task:", task.text);
            const updatedDescription = prompt("Edit your description:", task.description);
            if (updatedTask !== null) tasks[index].text = updatedTask;
            if (updatedDescription !== null) tasks[index].description = updatedDescription;
            saveTasks();
            renderTasks();
        });

        const doneButton = document.createElement("button");
        doneButton.textContent = "Done";
        doneButton.className = "done-button";
        doneButton.addEventListener("click", () => {
            tasks[index].done = !tasks[index].done;
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        taskItem.appendChild(taskLabel);
        taskItem.appendChild(descriptionDropdown);
        taskItem.appendChild(editButton);
        taskItem.appendChild(doneButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    });
};

// Initial rendering of tasks
renderTasks();

addTaskButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const taskDescription = taskDescriptionInput.value.trim();
    if (!taskText) return;

    const newTask = { text: taskText, description: taskDescription || "", done: false };
    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskDescriptionInput.value = "";
});

signOutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedinUser");
    window.location.href = "index.html";
});

// Function to filter tasks based on search input
const filterTasks = () => {
    const searchText = searchBar.value.toLowerCase().trim();
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchText) || 
        (task.description && task.description.toLowerCase().includes(searchText))
    );
    renderTasks(filteredTasks);
};

searchBar.addEventListener("input", filterTasks);