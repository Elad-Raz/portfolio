let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const deleteAllBtn = document.getElementById("delete-all");
const toggleTheme = document.getElementById("toggle-theme");

renderTasks();

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;

  const task = {
    id: Date.now(),
    title,
    description,
    priority,
    deadline,
    deleted: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task";
    if (task.deleted) li.classList.add("deleted");

    let html = `<strong>${task.title}</strong>`;
    if (task.priority) {
      html += ` (${task.priority})`;
    }
    if (task.description) {
      html += `<br/><small>${task.description}</small>`;
    }
    if (task.deadline) {
      html += `<br/><em>Due: ${new Date(task.deadline).toLocaleString()}</em>`;
    }

    if (task.deleted) {
      html += `
        <button class="restore" onclick="restoreTask(${task.id})">
          Restore
        </button>
        <button class="remove-final" onclick="deletePermanently(${task.id})">
          Delete Forever
        </button>`;
    } else {
      html += `
        <button class="delete" onclick="softDeleteTask(${task.id})">×</button>`;
    }

    li.innerHTML = html;
    taskList.appendChild(li);
  });
}

function softDeleteTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, deleted: true } : t));
  saveTasks();
  renderTasks();
}

function restoreTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, deleted: false } : t));
  saveTasks();
  renderTasks();
}

function deletePermanently(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

deleteAllBtn.addEventListener("click", () => {
  if (confirm("Delete all tasks permanently?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleTheme.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});
