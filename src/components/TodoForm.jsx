import { useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Todoの内容を入力してください');
      return;
    }
    onAdd({ title: title.trim(), priority, dueDate });
    setTitle('');
    setDueDate('');
    setError('');
  };

  return (
    <form className="todo-form" onSubmit={submit} noValidate>
      <div className={`title-field ${error ? 'has-error' : ''}`}>
        <label htmlFor="todo-title">新しいTodo</label>
        <input id="todo-title" value={title} onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) setError(''); }} placeholder="やることを入力して Enter" autoComplete="off" aria-describedby="title-error" />
        <span id="title-error" className="field-error" role="alert">{error}</span>
      </div>
      <div className="form-options">
        <div className="field-group">
          <label htmlFor="priority">優先度</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">高</option><option value="medium">中</option><option value="low">低</option>
          </select>
        </div>
        <div className="field-group date-field">
          <label htmlFor="due-date"><CalendarDays size={15} /> 期限</label>
          <input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <button className="primary-button add-button" type="submit"><Plus size={19} />追加</button>
      </div>
    </form>
  );
}
