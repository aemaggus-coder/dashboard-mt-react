import { useState } from 'react';
import Modal from './Modal';

export default function Card({ id, label, title, children, detailsContent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="card" id={id} onClick={() => detailsContent && setIsModalOpen(true)}>
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
