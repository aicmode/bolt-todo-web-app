const STORAGE_KEY = 'flowtodo.items.v1';

const priorities = new Set(['high', 'medium', 'low']);

// 有効な YYYY-MM-DD 形式のみ許可する（不正な文字列は空文字にして描画時の例外を防ぐ）。
function normalizeDueDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  return Number.isNaN(new Date(`${value}T00:00:00`).getTime()) ? '' : value;
}

function normalizeTodo(todo) {
  if (!todo || typeof todo !== 'object' || Array.isArray(todo)) return null;

  const title = typeof todo.title === 'string' ? todo.title.trim() : '';
  const hasValidId = typeof todo.id === 'string' || typeof todo.id === 'number';
  if (!hasValidId || !title) return null;

  return {
    id: todo.id,
    title,
    priority: priorities.has(todo.priority) ? todo.priority : 'medium',
    dueDate: normalizeDueDate(todo.dueDate),
    completed: todo.completed === true,
    createdAt: Number.isFinite(todo.createdAt) ? todo.createdAt : Date.now(),
  };
}

export function loadTodos() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data.map(normalizeTodo).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    return false;
  }
  return true;
}
