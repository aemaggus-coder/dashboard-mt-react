export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop open" onClick={onClose} />
      <div className="modal-backdrop open" style={{ background: 'none', backdropFilter: 'none' }}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-head">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div style={{ marginTop: '20px' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
