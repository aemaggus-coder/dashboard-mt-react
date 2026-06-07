import { useState } from 'react';
import Modal from './Modal';

export default function Card({ id, label, title, children, detailsContent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e) => {
    // не открывать детализацию при клике по интерактивным элементам (переключатель, кнопки)
    if (e.target.closest('.card-toggle, button, a, input')) return;
    if (detailsContent) setIsModalOpen(true);
  };

  return (
    <>
      <div className="card" id={id} onClick={handleCardClick}>
        <div className="card-label">{label}</div>
        <div className="card-title">{title}</div>
        {children}
        {detailsContent && <div className="card-badge">Подробнее →</div>}
      </div>

      {detailsContent && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
        >
          {detailsContent}
        </Modal>
      )}
    </>
  );
}
