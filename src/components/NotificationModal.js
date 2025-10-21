export function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info', // 'info', 'error', 'confirm'
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
}) {
  if (!isOpen) return null;

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content notification-modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ✕
        </button>

        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-body">
          <p className="notification-message">{message}</p>

          <div className="notification-buttons">
            {type === 'confirm' ? (
              <>
                <button
                  className="notification-button notification-cancel"
                  onClick={onClose}
                >
                  {cancelText}
                </button>
                <button
                  className="notification-button notification-confirm"
                  onClick={handleConfirm}
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                className="notification-button notification-ok"
                onClick={onClose}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
