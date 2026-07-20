import { useEffect, useState } from 'react';
import { CalendarDays, Check, GripVertical, Pencil, Save, Trash2, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const priorityNames = { high: '高', medium: '中', low: '低' };
const formatDate = (date) => {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric' }).format(parsed);
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit, removing }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [priority, setPriority] = useState(todo.priority);
  const [dueDate, setDueDate] = useState(todo.dueDate || '');
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id, disabled: editing });
  const overdue = dueDate && !todo.completed && dueDate < new Date().toLocaleDateString('en-CA');

  useEffect(() => setTitle(todo.title), [todo.title]);

  const save = () => {
    if (!title.trim()) return;
    onEdit(todo.id, { title: title.trim(), priority, dueDate });
    setEditing(false);
  };
  const cancel = () => { setTitle(todo.title); setPriority(todo.priority); setDueDate(todo.dueDate || ''); setEditing(false); };

  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''} ${removing ? 'removing' : ''} ${isDragging ? 'dragging' : ''}`}>
      <button className="drag-handle icon-button" {...attributes} {...listeners} aria-label={`${todo.title}を並べ替え`} title="ドラッグして並べ替え"><GripVertical size={20} /></button>
      <button className="check-button" onClick={() => onToggle(todo.id)} aria-label={todo.completed ? '未完了に戻す' : '完了にする'} aria-pressed={todo.completed}>{todo.completed && <Check size={17} />}</button>
      {editing ? (
        <div className="edit-area">
          <input className="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }} autoFocus aria-label="Todoの内容" />
          <div className="edit-options">
            <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="優先度"><option value="high">高</option><option value="medium">中</option><option value="low">低</option></select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} aria-label="期限" />
          </div>
        </div>
      ) : (
        <div className="todo-content">
          <p>{todo.title}</p>
          <div className="badges">
            <span className={`badge priority-badge ${todo.priority}`}>優先度 {priorityNames[todo.priority]}</span>
            {todo.dueDate && <span className={`badge date-badge ${overdue ? 'is-overdue' : ''}`}><CalendarDays size={13} />{overdue ? '期限切れ · ' : ''}{formatDate(todo.dueDate)}</span>}
          </div>
        </div>
      )}
      <div className="item-actions">
        {editing ? <><button className="icon-button save" onClick={save} disabled={!title.trim()} aria-label="保存"><Save size={18} /></button><button className="icon-button" onClick={cancel} aria-label="キャンセル"><X size={18} /></button></> : <><button className="icon-button" onClick={() => setEditing(true)} aria-label="編集"><Pencil size={17} /></button><button className="icon-button delete" onClick={() => onDelete(todo.id)} aria-label="削除"><Trash2 size={17} /></button></>}
      </div>
    </li>
  );
}
