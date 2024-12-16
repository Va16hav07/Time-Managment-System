const welcomeMessage = document.getElementById("welcomeMessage");
const signOutButton = document.getElementById("signOutButton");
const taskInput = document.getElementById("taskInput");
const taskDescriptionInput = document.getElementById("taskDescriptionInput");
const taskDueDate = document.getElementById("taskDueDate");
const taskPriority = document.getElementById("taskPriority");
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
    // Sort tasks by priority (high > medium > low) and due date (closest first)
    filteredTasks.sort((a, b) => {
        // Priority sorting
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        
        if (priorityComparison !== 0) return priorityComparison;

        // If priorities are the same, sort by due date (earliest first)
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }

        // If only one task has a due date, the one without it comes last
        return a.dueDate ? -1 : 1;
    });

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

        // Show priority and due date
        const taskDetails = document.createElement("div");
        taskDetails.classList.add("task-details");

        const taskDueDateSpan = document.createElement("span");
        taskDueDateSpan.textContent = task.dueDate ? `Due: ${task.dueDate}` : "No due date";
        taskDetails.appendChild(taskDueDateSpan);

        const taskPrioritySpan = document.createElement("span");
        taskPrioritySpan.textContent = `Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`;
        taskDetails.appendChild(taskPrioritySpan);

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
        taskItem.appendChild(taskDetails);
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
    const taskDueDateValue = taskDueDate.value.trim();
    const taskPriorityValue = taskPriority.value.trim();

    if (!taskText) return;

    // Create a new task with priority and due date
    const newTask = {
        text: taskText,
        description: taskDescription || "",
        done: false,
        dueDate: taskDueDateValue || "",
        priority: taskPriorityValue || "low"
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskDescriptionInput.value = "";
    taskDueDate.value = "";
    taskPriority.value = "low";
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
