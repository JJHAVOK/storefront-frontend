'use client';

interface ToastProps {
  message: string;
  type?: 'success' | 'danger' | 'warning' | 'info';
  show: boolean;
  onClose: () => void;
}

export function Toast({ message, type = 'success', show, onClose }: ToastProps) {
  if (!show) return null;

  const bgClass = type === 'success' ? 'alert-success' : type === 'danger' ? 'alert-danger' : 'alert-info';
  const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 10000, marginTop: '80px', minWidth: '300px' }}>
      <div className={`alert ${bgClass} alert-dismissible fade show shadow-sm`} role="alert">
        <i className={`${icon} me-2`}></i>
        <strong>{message}</strong>
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      </div>
    </div>
  );
}
