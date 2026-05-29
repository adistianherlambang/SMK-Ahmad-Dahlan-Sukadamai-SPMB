import React from 'react';
import { Link } from '@inertiajs/react';
import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  // Combine all styling classes
  const buttonClass = [
    styles.btn,
    styles[variant],
    styles[size],
    loading ? styles.loading : '',
    className
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;

  // Modern built-in hardware-accelerated SVG Spinner
  const renderLoadingSpinner = () => (
    <svg className={styles.spinner} viewBox="0 0 50 50">
      <circle
        className={styles.spinnerPath}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      />
    </svg>
  );

  // If href is specified, it behaves as a link wrapper
  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={buttonClass}
          onClick={isDisabled ? (e) => e.preventDefault() : onClick}
          {...props}
        >
          {loading && renderLoadingSpinner()}
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={buttonClass}
        onClick={isDisabled ? (e) => e.preventDefault() : onClick}
        {...props}
      >
        {loading && renderLoadingSpinner()}
        {children}
      </Link>
    );
  }

  // Standard HTML Button
  return (
    <button
      type={type}
      className={buttonClass}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && renderLoadingSpinner()}
      {children}
    </button>
  );
}
