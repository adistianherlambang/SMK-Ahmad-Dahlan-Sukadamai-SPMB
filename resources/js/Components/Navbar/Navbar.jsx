import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import styles from './Navbar.module.css';

export default function Navbar({ navType = 'landing', links = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <img src="/mainLogo.png" alt="" className={styles.imgLogo} />
            <p>SMK Ahmad<br />Dahlan Sukadamai</p>
          </Link>

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
            <svg width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="19" height="2" fill="#939596" />
              <rect x="4" y="4.5" width="15" height="2" fill="#939596" />
              <rect x="7" y="9.5" width="12" height="2" fill="#939596" />
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
