import React from 'react';
import styles from './FileInput.module.css';

export default function FileInput({ label, required = false, isUploaded, onFileView, onChange, accept = ".pdf" }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}{required && '*'}</span>
      {!isUploaded ? (
        <label className={styles.uploadBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          <span>Pilih File</span>
          <input type="file" accept={accept} onChange={onChange} className={styles.hiddenInput} />
        </label>
      ) : (
        <div className={styles.uploadedContainer}>
          <button type="button" onClick={onFileView} className={styles.viewBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>Lihat File</span>
          </button>
          <label className={styles.changeBtn}>
            <span>Ubah</span>
            <input type="file" accept={accept} onChange={onChange} className={styles.hiddenInput} />
          </label>
        </div>
      )}
    </div>
  );
}
