import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCheck, ClipboardList, Trash2 } from 'lucide-react';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import Toast from './components/Toast';
import { loadTodos, saveTodos } from './utils/storage';

const filters = [{ id: 'all', label: 'すべて' }, { id: 'active', label: '未完了' }, { id: 'completed', label: '完了済み' }];

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [removingIds, setRemovingIds] = useState([]);
  const toastTimer = useRef();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => { saveTodos(todos); }, [todos]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const notify = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };
  const addTodo = ({ title, priority, dueDate }) => {
    setTodos((items) => [{ id: crypto.randomUUID(), title, priority, dueDate, completed: false, createdAt: Date.now() }, ...items]);
    notify('Todoを追加しました');
  };
  const toggleTodo = (id) => { setTodos((items) => items.map((item) => item.id === id ? { ...item, completed: !item.completed } : item)); notify('状態を更新しました'); };
  const editTodo = (id, changes) => { setTodos((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item)); notify('Todoを更新しました'); };
  const remove = (ids, message) => {
    setRemovingIds(ids);
    setTimeout(() => { setTodos((items) => items.filter((item) => !ids.includes(item.id))); setRemovingIds([]); notify(message); }, 230);
  };
  const clearCompleted = () => { const ids = todos.filter((todo) => todo.completed).map((todo) => todo.id); if (ids.length) remove(ids, '完了済みTodoを削除しました'); else notify('完了済みのTodoはありません', 'info'); };
  const clearAll = () => { if (todos.length && window.confirm('すべてのTodoを削除しますか？')) remove(todos.map((todo) => todo.id), 'すべてのTodoを削除しました'); };
  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setTodos((items) => arrayMove(items, items.findIndex((i) => i.id === active.id), items.findIndex((i) => i.id === over.id)));
    notify('並び順を変更しました');
  };

  const visibleTodos = useMemo(() => todos.filter((todo) => filter === 'all' || (filter === 'completed' ? todo.completed : !todo.completed)), [todos, filter]);
  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app-shell">
      <header className="app-header"><div className="brand-mark"><CheckCheck /></div><div><h1>FlowTodo</h1><p>今日を、すっきり整える。</p></div></header>
      <main>
        <section className="hero"><div><span className="eyebrow">MY TASKS</span><h2>やることを整理しよう</h2><p>小さな一歩から、今日を前へ。</p></div><div className="summary-card"><strong>{activeCount}</strong><span>件の未完了</span><small>全 {todos.length} 件</small></div></section>
        <TodoForm onAdd={addTodo} />
        <section className="list-panel">
          <div className="toolbar">
            <div className="filters" role="group" aria-label="Todoフィルター">{filters.map((item) => <button key={item.id} className={filter === item.id ? 'active' : ''} onClick={() => setFilter(item.id)}>{item.label}<span>{item.id === 'all' ? todos.length : todos.filter((t) => item.id === 'completed' ? t.completed : !t.completed).length}</span></button>)}</div>
            <div className="bulk-actions"><button onClick={clearCompleted} disabled={!todos.some((t) => t.completed)}><CheckCheck size={16} />完了済みを削除</button><button className="danger" onClick={clearAll} disabled={!todos.length}><Trash2 size={16} />すべて削除</button></div>
          </div>
          {visibleTodos.length ? <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}><SortableContext items={visibleTodos.map((t) => t.id)} strategy={verticalListSortingStrategy}><ul className="todo-list">{visibleTodos.map((todo) => <TodoItem key={todo.id} todo={todo} removing={removingIds.includes(todo.id)} onToggle={toggleTodo} onDelete={(id) => remove([id], 'Todoを削除しました')} onEdit={editTodo} />)}</ul></SortableContext></DndContext> : <div className="empty-state"><ClipboardList size={42} /><h3>{filter === 'all' ? 'Todoはまだありません' : '該当するTodoはありません'}</h3><p>{filter === 'all' ? '上のフォームから、最初のTodoを追加しましょう。' : 'フィルターを切り替えて確認できます。'}</p></div>}
        </section>
      </main>
      <footer>FlowTodo · データはこのブラウザに安全に保存されます</footer>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
