const welcomeMessage = document.getElementById("welcomeMessage");
const signOutButton = document.getElementById("signOutButton");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const loggedinUser = JSON.parse(localStorage.getItem("loggedinUser"))[0];

if (loggedinUser) {
    welcomeMessage.textContent = `Welcome, ${loggedinUser.username}!`;
} else {
    window.location.href = "index.html"; 
}

addTaskButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

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
        taskItem.remove();  
    });

    taskItem.appendChild(taskLabel);
    taskItem.appendChild(editButton);
    taskItem.appendChild(doneButton);
    taskItem.appendChild(deleteButton);  
    taskList.appendChild(taskItem);

    taskInput.value = "";
});

signOutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedinUser");
    window.location.href = "index.html";
});
