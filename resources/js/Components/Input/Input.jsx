import React from 'react';
import styles from './Input.module.css';

export default function Input({ label, placeholder, type = 'text', value, onChange, name, required = false, ...props }) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span style={{ color: 'var(--color-danger)', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <input 
        type={type} 
        name={name}
        placeholder={placeholder} 
        value={value ?? ''} 
        onChange={onChange} 
        className={styles.inputField}
        required={required}
        {...props}
      />
    </div>
  );
}
