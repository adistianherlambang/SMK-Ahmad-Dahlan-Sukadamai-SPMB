import React from 'react';
import styles from './Select.module.css';

export default function Select({ label, placeholder, options = [], value, onChange, name, required = false, ...props }) {
  const isPlaceholderActive = value === '' || value === null || value === undefined;

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}{required && '*'}</label>}
      <select 
        name={name} 
        value={value ?? ''} 
        onChange={onChange} 
        className={`${styles.selectField} ${isPlaceholderActive ? styles.placeholderActive : ''}`} 
        required={required}
        {...props}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
