const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const taskCounter = document.getElementById('taskCounter');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function updateCounter() {
  const doneCount = todos.filter(t => t.done).length;
  taskCounter.textContent = `${doneCount} / ${todos.length}`;
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';

  // Urutkan:
  // - Pinned dan belum selesai di atas
  // - Belum selesai tanpa pin di tengah
  // - Selesai di paling bawah
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.done && !b.done) return 1;
    if (!a.done && b.done) return -1;
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  sortedTodos.forEach((todo, index) => {
    const originalIndex = getOriginalIndex(sortedTodos[index]);

    const li = document.createElement('li');
    li.className = "flex items-center justify-between bg-gray-700 px-4 py-2 rounded-full";

    if (todo.pinned && !todo.done) {
      li.classList.add("order-first");
    }

    li.innerHTML = `
      <div class="flex items-center gap-3">
        <input type="checkbox" ${todo.done ? "checked" : ""} onclick="toggleDone(${originalIndex})" class="accent-green-500 form-checkbox h-5 w-5 text-green-400">
        <span class="${todo.done ? 'line-through text-green-400' : ''}">${todo.text}</span>
      </div>
      <div class="flex gap-3 items-center text-lg">
        ${!todo.done ? `
          <i class="mdi ${todo.pinned ? 'mdi-pin' : 'mdi-pin-outline'} text-yellow-400 hover:text-yellow-200 cursor-pointer text-xl" onclick="togglePin(${originalIndex})"></i>
        ` : ''}
        <i class="mdi mdi-trash-can-outline text-red-400 hover:text-red-600 cursor-pointer text-xl" onclick="deleteTodo(${originalIndex})"></i>
      </div>
    `;

    todoList.appendChild(li);
  });

  updateCounter();
  saveTodos();
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text !== '') {
    todos.push({ text, done: false, pinned: false });
    todoInput.value = '';
    renderTodos();
  }
}

function toggleDone(index) {
  todos[index].done = !todos[index].done;

  // Jika selesai, hilangkan pinned
  if (todos[index].done) {
    todos[index].pinned = false;
  }

  renderTodos();
}

function togglePin(index) {
  todos[index].pinned = !todos[index].pinned;
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos();
}

// Ambil index asli dari data sorted
function getOriginalIndex(todoItem) {
  return todos.findIndex(t => t.text === todoItem.text && t.done === todoItem.done && t.pinned === todoItem.pinned);
}

addBtn.addEventListener('click', addTodo);
document.addEventListener('DOMContentLoaded', renderTodos);
