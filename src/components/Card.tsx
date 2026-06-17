import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { useStore } from '../hooks/useStore';
import type { CardProps } from '../types';

export default function Card({ id, label, title, titleBadge, children, detailsContent }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { focusTarget, setFocusTarget } = useStore();
  const cardRef   = useRef<HTMLDivElement>(null);
  const isFocused = focusTarget === id;

  useEffect(() => {
    if (isFocused) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [isFocused]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFocused) setFocusTarget(null);
    if ((e.target as Element).closest('.card-toggle, button, a, input')) return;
    if (detailsContent) setIsModalOpen(true);
  };

  return (
    <>
      <div ref={cardRef} className={`card ${isFocused ? 'focus-attention' : ''}`} id={id} onClick={handleCardClick}>
        <div className="card-label">{label}</div>
        <div className="card-title-row">
          <div className="card-title">{title}</div>
          {titleBadge}
        </div>
        {children}
        {detailsContent && <div className="card-badge">Подробнее →</div>}
      </div>
      {detailsContent && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={title}>
          {detailsContent}
        </Modal>
      )}
    </>
  );
}
