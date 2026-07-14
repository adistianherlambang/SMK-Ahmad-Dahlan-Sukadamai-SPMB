import React from "react";
import styles from "./Batik.module.css";

export default function Batik({ section, color }) {
  if (section == "atas") {
    return (
      <div style={{
        backgroundColor: color
      }}>
        <img src="/batik/batik1.webp" alt="Batik Atas" style={{
          width: "100%",
          height: "100%",
          display: "block"
        }} />
      </div>
    )
  }

  if (section == "bawah") {
    return (
      <div style={{
        backgroundColor: color
      }}>
        <img src="/batik/batik2.webp" alt="Batik Bawah" style={{
          width: "100%",
          height: "100%",
          display: "block"
        }} />
      </div>
    )
  }
}