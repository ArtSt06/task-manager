import Modal from "@components/common/Modal";

import "./ConfirmModal.scss";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title = "Подтверждение",
  message = "Вы уверены?",
  confirmText = "Подтвердить",
  cancelText = "Отмена",
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirm-modal">
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button className="button-cancel" onClick={handleCancel}>
            {cancelText}
          </button>

          <button className="button-confirm" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
