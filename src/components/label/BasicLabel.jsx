import React from 'react'
import styles from '../styles/BasicLabel.module.css'

export default function BasicLabel({ text, variant = 'default', className = '' }) {
  return (
    <span className={[styles.badge, styles[variant] ?? styles.default, className].join(' ')}>
      {text}
    </span>
  )
}
