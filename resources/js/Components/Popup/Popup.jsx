import React from 'react';
import styles from './Popup.module.css';

export default function Popup({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
