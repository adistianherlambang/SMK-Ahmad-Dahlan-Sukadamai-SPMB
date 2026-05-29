import React from 'react';
import { Link } from '@inertiajs/react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brandInfo}>
          <h3>SMK Ahmad Dahlan Sukadamai</h3>
          <p>Maju bersama, mencetak kader kejuruan tangguh, kreatif, dan islami.</p>
        </div>
        <div className={styles.footerMeta}>
          <p>📍 Jl. KH Ahmad Dahlan No. 1 Sukadamai, Kabupaten Lampung Selatan</p>
          <p>📞 Hubungi Kami: 0852-XXXX-XXXX | ✉️ info@smkahmaddahlan.sch.id</p>
        </div>
        <div className={styles.developerCta}>
          <Link href="/admin/login" className={styles.adminLoginLink}>Portal Admin</Link>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2026 SMK Ahmad Dahlan Sukadamai. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
