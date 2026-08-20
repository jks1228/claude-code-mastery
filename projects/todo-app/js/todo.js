// 할 일 관리 앱 - Vanilla JS, localStorage 기반 데이터 저장

const STORAGE_KEY = 'todo-app:tasks';

const state = {
  tasks: [],
  filter: 'all', // 'all' | 'active' | 'completed'
  editingId: null, // 현재 편집 중인 항목의 id (없으면 null)
};

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const filters = document.getElementById('todo-filters');
const countLabel = document.getElementById('todo-count');
const clearCompletedBtn = document.getElementById('clear-completed');

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    // 저장된 데이터가 손상된 경우 빈 목록으로 시작
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  state.tasks.push({
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
    createdAt: Date.now(),
  });

  saveTasks();
  render();
}

function toggleTask(id) {
  const task = state.tasks.find((t) => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((t) => t.id !== id);
  if (state.editingId === id) state.editingId = null;
  saveTasks();
  render();
}

function editTask(id, newText) {
  const trimmed = newText.trim();
  const task = state.tasks.find((t) => t.id === id);
  if (!task) return;

  if (trimmed) {
    task.text = trimmed;
    saveTasks();
  }
  state.editingId = null;
  render();
}

function startEditing(id) {
  state.editingId = id;
  render();
  const editInput = list.querySelector('.todo-edit-input');
  if (editInput) {
    editInput.focus();
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);
  }
}

function cancelEditing() {
  state.editingId = null;
  render();
}

function setFilter(filter) {
  state.filter = filter;
  render();
}

function clearCompleted() {
  state.tasks = state.tasks.filter((t) => !t.completed);
  saveTasks();
  render();
}

function getFilteredTasks() {
  if (state.filter === 'active') return state.tasks.filter((t) => !t.completed);
  if (state.filter === 'completed') return state.tasks.filter((t) => t.completed);
  return state.tasks;
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3';
  li.dataset.id = task.id;

  if (state.editingId === task.id) {
    li.innerHTML = `
      <input
        type="text"
        class="todo-edit-input flex-1 rounded-lg border border-slate-300 px-3 py-1"
        value="${escapeHtml(task.text)}"
      />
    `;
    return li;
  }

  li.innerHTML = `
    <input type="checkbox" class="todo-toggle w-4 h-4" ${task.completed ? 'checked' : ''} aria-label="완료 여부" />
    <span class="todo-text flex-1 ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
    <button type="button" class="todo-edit-btn text-slate-400 hover:text-blue-600" aria-label="수정">✎</button>
    <button type="button" class="todo-delete-btn text-slate-400 hover:text-red-600" aria-label="삭제">✕</button>
  `;
  return li;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function render() {
  const filteredTasks = getFilteredTasks();

  list.innerHTML = '';
  filteredTasks.forEach((task) => {
    list.appendChild(createTaskElement(task));
  });

  const remaining = state.tasks.filter((t) => !t.completed).length;
  countLabel.textContent = `${remaining}개 남음`;

  filters.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === state.filter);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(input.value);
  input.value = '';
});

list.addEventListener('click', (event) => {
  const li = event.target.closest('li[data-id]');
  if (!li) return;
  const id = li.dataset.id;

  if (event.target.closest('.todo-delete-btn')) {
    deleteTask(id);
  } else if (event.target.closest('.todo-edit-btn')) {
    startEditing(id);
  }
});

list.addEventListener('change', (event) => {
  const li = event.target.closest('li[data-id]');
  if (!li) return;

  if (event.target.classList.contains('todo-toggle')) {
    toggleTask(li.dataset.id);
  }
});

list.addEventListener('dblclick', (event) => {
  const li = event.target.closest('li[data-id]');
  if (!li) return;

  if (event.target.classList.contains('todo-text')) {
    startEditing(li.dataset.id);
  }
});

list.addEventListener('keydown', (event) => {
  if (!event.target.classList.contains('todo-edit-input')) return;

  const li = event.target.closest('li[data-id]');
  if (!li) return;

  if (event.key === 'Enter') {
    editTask(li.dataset.id, event.target.value);
  } else if (event.key === 'Escape') {
    cancelEditing();
  }
});

filters.addEventListener('click', (event) => {
  const btn = event.target.closest('.filter-btn');
  if (!btn) return;
  setFilter(btn.dataset.filter);
});

clearCompletedBtn.addEventListener('click', clearCompleted);

state.tasks = loadTasks();
render();
