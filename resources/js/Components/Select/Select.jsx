import React, { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';

export default function Select({ label, placeholder, options = [], value, onChange, name, required = false, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Standardize options structure dynamically (supports both standard {value, label} and databases {id, name})
  const getOptValue = (opt) => opt.value !== undefined ? opt.value : opt.id;
  const getOptLabel = (opt) => opt.label !== undefined ? opt.label : opt.name;

  const normalizedOptions = options.map(opt => ({
    value: getOptValue(opt),
    label: getOptLabel(opt)
  }));

  const activeSelected = normalizedOptions.find(opt => String(opt.value) === String(value));
  const activeLabel = activeSelected ? activeSelected.label : placeholder;
  const showPlaceholder = !activeSelected;

  const handleSelectOption = (val) => {
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: {
          name,
          value: val
        }
      });
    }
  };

  return (
    <div className={styles.wrapper} ref={selectRef}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span style={{ color: 'var(--color-danger)', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      
      <div className={styles.selectContainer}>
        {/* Dropdown Trigger Button */}
        <button
          type="button"
          className={`${styles.selectTrigger} ${showPlaceholder ? styles.placeholderActive : ''} ${isOpen ? styles.triggerOpen : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          <span className={styles.triggerText}>{activeLabel}</span>
          <span className={`${styles.caret} ${isOpen ? styles.caretRotate : ''}`}>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {/* Custom Dropdown Option List Menu */}
        {isOpen && (
          <div className={styles.dropdownMenu}>
            {normalizedOptions.length > 0 ? (
              normalizedOptions.map((opt, i) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.dropdownItem} ${isSelected ? styles.itemSelected : ''}`}
                    onClick={() => handleSelectOption(opt.value)}
                  >
                    {opt.label}
                  </button>
                );
              })
            ) : (
              <div className={styles.noOptions}>Tidak ada pilihan</div>
            )}
          </div>
        )}
      </div>

      {/* Hidden native select for standard HTML validation or backward compatibility */}
      <select
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        style={{ display: 'none' }}
      >
        <option value="">{placeholder}</option>
        {normalizedOptions.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
