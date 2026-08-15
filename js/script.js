// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

// Store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; 

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

localStorage.setItem("tasks", JSON.stringify(tasks));

taskInput.value = "";

displayTasks();

}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Delete</button>
        `;

        taskList.appendChild(li);
    });

    updateTaskCount();
} 

// Update task count
function updateTaskCount() {
    const remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    taskCount.textContent = `${remainingTasks} tasks remaining`;
}

// Handle task actions using event delegation
taskList.addEventListener("click", function(event) {

    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const taskIndex = Array.from(taskList.children).indexOf(taskItem);

    // Complete / Uncomplete task
    if (event.target.type === "checkbox") {
    tasks[taskIndex].completed = event.target.checked;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
} 
if (event.target.classList.contains("delete-btn")) {
    tasks.splice(taskIndex, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
}
});

// Add button event
addTaskBtn.addEventListener("click", addTask); 

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();
    });
}); 

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

}); 