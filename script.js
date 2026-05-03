let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* SAVE */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ADD BUTTON FIX */
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("taskInput").addEventListener("keypress", function (e) {
        if (e.key === "Enter") addTask();
    });

    document.getElementById("addBtn").addEventListener("click", addTask);

    renderTasks();
});

/* ADD FUNCTION */
function addTask() {
    let input = document.getElementById("taskInput");

    if (!input) return; // safety

    let text = input.value.trim();

    if (!text) {
        alert("Task empty 😒");
        input.value = "";
        return;
    }

    tasks.push({ text, completed: false });

    input.value = "";
    saveTasks();
    renderTasks();
}

/* RENDER */
function renderTasks() {
    let list = document.getElementById("taskList");
    let search = document.getElementById("search").value.toLowerCase();

    list.innerHTML = "";

    let filtered = tasks.filter(task => {
        let matchFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        let matchSearch = task.text.toLowerCase().includes(search);

        return matchFilter && matchSearch;
    });

    filtered.forEach((task, index) => {
        let div = document.createElement("div");
        div.className = "task";

        let text = document.createElement("span");
        text.innerText = task.text;

        if (task.completed) text.classList.add("completed");

        let btns = document.createElement("div");

        let completeBtn = document.createElement("button");
        completeBtn.innerText = "✔";
        completeBtn.onclick = () => {
            task.completed = true;
            saveTasks();
            renderTasks();
        };

        let editBtn = document.createElement("button");
        editBtn.innerText = "✏";
        editBtn.onclick = () => {
            let newText = prompt("Edit task:", task.text);
            if (newText) {
                task.text = newText;
                saveTasks();
                renderTasks();
            }
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "❌";
        deleteBtn.onclick = () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };

        btns.appendChild(completeBtn);
        btns.appendChild(editBtn);
        btns.appendChild(deleteBtn);

        div.appendChild(text);
        div.appendChild(btns);

        list.appendChild(div);
    });

    updateCounts();
}

/* FILTER */
function filterTasks(type) {
    currentFilter = type;
    renderTasks();
}

/* SEARCH */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("search").addEventListener("input", renderTasks);
});

/* COUNT */
function updateCounts() {
    document.getElementById("allCount").innerText = tasks.length;
    document.getElementById("pendingCount").innerText =
        tasks.filter(t => !t.completed).length;
    document.getElementById("completedCount").innerText =
        tasks.filter(t => t.completed).length;
}