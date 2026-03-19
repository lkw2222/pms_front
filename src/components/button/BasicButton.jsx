import React from 'react'
import styles from '../styles/BasicButton.module.css'

/**
 * BasicButton
 * variant: primary | secondary | danger | ghost | success | warning
 * size:    sm | md | lg
 */
export default function BasicButton({
  label,
  variant  = 'primary',
  size     = 'md',
  disabled = false,
  icon: Icon,
  onClick,
  type     = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        styles.btn,
        styles[size]     ?? styles.md,
        styles[variant]  ?? styles.primary,
        className,
      ].join(' ')}
      {...props}
    >
      {Icon && <Icon size={(size === 'sm' ? 12 : size === 'lg' ? 14 : 13) - 1} strokeWidth={2} />}
      {label}
    </button>
  )
}
