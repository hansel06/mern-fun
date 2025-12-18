import { useEffect } from 'react';

interface AlertModalProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  autoClose?: number; // Auto close after milliseconds (0 = no auto close)
}

const AlertModal = ({ message, type = 'error', onClose, autoClose = 0 }: AlertModalProps) => {
  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className={`alert-modal alert-modal-${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="alert-modal-content">
          <div className="alert-modal-icon">
            {type === 'error' && '❌'}
            {type === 'success' && '✅'}
            {type === 'info' && 'ℹ️'}
          </div>
          <div className="alert-modal-message">{message}</div>
          <button className="alert-modal-close" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;

