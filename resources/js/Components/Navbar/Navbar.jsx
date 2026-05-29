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
                      {link.label} <span className={styles.caret}>
                        <svg width="8" height="8" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.6924 3.39763L16 4.78573L8.8734 12.3464C8.75921 12.4683 8.62342 12.565 8.47384 12.631C8.32426 12.697 8.16386 12.731 8.00185 12.731C7.83985 12.731 7.67944 12.697 7.52986 12.631C7.38029 12.565 7.2445 12.4683 7.1303 12.3464L1.04668e-06 4.78573L1.30763 3.39893L8 10.4951L14.6924 3.39763Z" fill="currentColor" />
                        </svg>
                      </span>
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
                  link.method === 'post' && link.label !== 'Daftar Sekarang' ? (
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
        <div className={styles.navContainer} style={{ padding: "24px", borderBottom: "solid rgb(255, 255, 255) 1px" }}>
          <div className={styles.logo}>
            <img src="/mainLogo.png" alt="" className={styles.imgLogo} />
            <p style={{ color: "white" }}>SMK Ahmad<br />Dahlan Sukadamai</p>
          </div>
          <div className={styles.drawerHeader}>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
          </div>
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
                (link.method === 'post' || link.label === 'Daftar Sekarang') ? (
                  <div className={styles.mainLinkContainer}>
                    <Link
                      href={link.url}
                      method={link.label === 'Daftar Sekarang' ? 'get' : 'post'}
                      as={link.label === 'Daftar Sekarang' ? 'a' : 'button'}
                      className={styles.mainLinkBtn}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                    {link.label == "Daftar Sekarang" ?
                      <Link
                        style={{ color: "white", backgroundColor: "var(--color-primary-dark)", border: "solid white 1px" }}
                        as="a"
                        className={styles.mainLinkBtn}
                        href="/admin/login"
                        onClick={() => setIsOpen(false)}
                      >
                        Login Admin
                      </Link>
                      :
                      <Link
                        style={{ color: "white", backgroundColor: "var(--color-primary-dark)", border: "solid white 1px" }}
                        as="a"
                        className={styles.mainLinkBtn}
                        href="/"
                        onClick={() => setIsOpen(false)}
                      >
                        Ke Halaman Utama
                      </Link>
                    }
                  </div>
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

{/* <span className={styles.accArrow}>{openSection === 'fasilitas' ?
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.6924 3.39763L16 4.78573L8.8734 12.3464C8.75921 12.4683 8.62342 12.565 8.47384 12.631C8.32426 12.697 8.16386 12.731 8.00185 12.731C7.83985 12.731 7.67944 12.697 7.52986 12.631C7.38029 12.565 7.2445 12.4683 7.1303 12.3464L1.04668e-06 4.78573L1.30763 3.39893L8 10.4951L14.6924 3.39763Z" fill="currentColor" />
  </svg>
  :
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.30763 12.6024L-9.47459e-08 11.2143L7.1266 3.65362C7.24079 3.53174 7.37658 3.43502 7.52616 3.36902C7.67574 3.30302 7.83614 3.26904 7.99815 3.26904C8.16016 3.26904 8.32056 3.30302 8.47014 3.36902C8.61971 3.43502 8.75551 3.53174 8.8697 3.65362L16 11.2143L14.6924 12.6011L8 5.50486L1.30763 12.6024Z" fill="currentColor" />
  </svg>
}</span> */}