// Task Class: Represents a single task
class Task {
  constructor(title, details) {
    this.id = Date.now().toString(); // Unique ID for each task
    this.title = title;
    this.details = details;
    this.status = "pending"; // Default status
  }
}

// Application State: Stores all tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// DOM Elements
const taskForm = document.getElementById("add-task-form");
const taskList = document.getElementById("tasks");
const showAllButton = document.getElementById("show-all");
const showCompletedButton = document.getElementById("show-completed");
const showPendingButton = document.getElementById("show-pending");

// Render Tasks: Displays tasks in the UI
function renderTasks(filter = "all") {
  taskList.innerHTML = ""; // Clear the task list

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.status === "completed";
    if (filter === "pending") return task.status === "pending";
    return true; // Show all tasks
  });

  // Create and append task items to the list
  filteredTasks.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.className = task.status === "completed" ? "completed" : "";
    taskItem.innerHTML = `
      <div>
        <h3>${task.title}</h3>
        <p>${task.details}</p>
      </div>
      <div>
        <button class="edit-btn" onclick="openEditForm('${task.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
        <button onclick="toggleTaskStatus('${task.id}')">
          ${task.status === "pending" ? "Mark Complete" : "Mark Pending"}
        </button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Add Task: Handles form submission
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value.trim();
  const details = document.getElementById("task-details").value.trim();

  // Validate input
  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  // Create a new task and add it to the list
  const newTask = new Task(title, details);
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Save to localStorage
  renderTasks(); // Refresh the task list
  taskForm.reset(); // Clear the form
});

// Toggle Task Status: Switches between completed and pending
function toggleTaskStatus(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.status = task.status === "pending" ? "completed" : "pending";
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update localStorage
  renderTasks(); // Refresh the task list
}

// Delete Task: Removes a task from the list
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update localStorage
  renderTasks(); // Refresh the task list
}

// Open Edit Form: Populates the form with task details
function openEditForm(id) {
  const task = tasks.find(task => task.id === id);
  if (!task) return;

  // Fill the form with task details
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-details").value = task.details;

  // Change the form's submit button to "Save Changes"
  const submitButton = taskForm.querySelector("button");
  submitButton.textContent = "Save Changes";
  submitButton.onclick = (e) => {
    e.preventDefault();
    saveTaskChanges(id);
  };
}

// Save Task Changes: Updates the task with new details
function saveTaskChanges(id) {
  const title = document.getElementById("task-title").value.trim();
  const details = document.getElementById("task-details").value.trim();

  // Validate input
  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  // Update the task
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.title = title;
      task.details = details;
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update localStorage
  renderTasks(); // Refresh the task list

  // Reset the form
  taskForm.reset();
  const submitButton = taskForm.querySelector("button");
  submitButton.textContent = "Add Task";
  submitButton.onclick = (e) => {
    e.preventDefault();
    taskForm.dispatchEvent(new Event("submit"));
  };
}

// Filter Tasks: Displays tasks based on status
showAllButton.addEventListener("click", () => renderTasks("all"));
showCompletedButton.addEventListener("click", () => renderTasks("completed"));
showPendingButton.addEventListener("click", () => renderTasks("pending"));

// Initial Render: Load tasks when the page loads
renderTasks();