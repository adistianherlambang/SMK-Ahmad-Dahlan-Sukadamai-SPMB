import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import styles from './Navbar.module.css';

export default function Navbar({ navType = 'landing', links = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>SMK Ahmad Dahlan</Link>
          
          {/* Desktop Horizontal Menu Links */}
          <div className={styles.desktopNav}>
            {links.map((link, i) => (
              <div key={i} className={styles.desktopNavItem}>
                {link.dropdown ? (
                  <div className={styles.desktopDropdownGroup}>
                    <span className={styles.desktopLink}>
                      {link.label} <span className={styles.caret}>▼</span>
                    </span>
                    <div className={styles.desktopDropdownMenu}>
                      {link.dropdown.map((sub, idx) => {
                        if (sub.method === 'post') {
                          return (
                            <Link
                              key={idx}
                              href={sub.url}
                              method="post"
                              as="button"
                              className={styles.desktopSubLinkBtn}
                            >
                              {sub.label}
                            </Link>
                          );
                        }
                        return (
                          <Link
                            key={idx}
                            href={sub.url}
                            className={styles.desktopSubLink}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  link.method === 'post' ? (
                    <Link
                      href={link.url}
                      method="post"
                      as="button"
                      className={styles.desktopLinkBtn}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      href={link.url}
                      className={styles.desktopLink}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>

          <button className={styles.hamburger} onClick={() => setIsOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>

      {/* Drawer Overlay */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>}

      {/* Side Slide-in Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
        </div>
        <div className={styles.drawerBody}>
          {links.map((link, i) => (
            <div key={i} className={styles.navItem}>
              {link.dropdown ? (
                <div className={styles.dropdownGroup}>
                  <span className={styles.dropdownTitle}>{link.label}</span>
                  <div className={styles.dropdownItems}>
                    {link.dropdown.map((sub, idx) => {
                      if (sub.method === 'post') {
                        return (
                          <Link
                            key={idx}
                            href={sub.url}
                            method="post"
                            as="button"
                            className={styles.subLinkBtn}
                            onClick={() => setIsOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        );
                      }
                      return (
                        <Link
                          key={idx}
                          href={sub.url}
                          className={styles.subLink}
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                link.method === 'post' ? (
                  <Link
                    href={link.url}
                    method="post"
                    as="button"
                    className={styles.mainLinkBtn}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    href={link.url}
                    className={styles.mainLink}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
