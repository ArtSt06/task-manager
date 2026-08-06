import type { ReactNode } from "react";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" ref={modalRef}>
        <header className="modal-header">
          <h2>{title}</h2>
          
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </header>
        
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.getElementById("modalRoot") as HTMLElement,
  );
};

export default Modal;
