import { CheckCircle2, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  return <div className="toast" role="status">{toast.type === 'info' ? <Info size={18} /> : <CheckCircle2 size={18} />}<span>{toast.message}</span><button onClick={onClose} aria-label="通知を閉じる"><X size={16} /></button></div>;
}
