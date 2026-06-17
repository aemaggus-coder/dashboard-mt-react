import { useEffect, useRef } from 'react';
import type { ModalProps } from '../types';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef       = useRef<HTMLDivElement>(null);
  const prevFocusRef   = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    prevFocusRef.current = document.activeElement;
    const focusable = Array.from(modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    focusable[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      (prevFocusRef.current as HTMLElement | null)?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop open" onClick={onClose} role="presentation">
      <div className="modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 id="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Закрыть">✕</button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
