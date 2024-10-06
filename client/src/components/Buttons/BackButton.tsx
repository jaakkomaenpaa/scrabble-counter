import { CSSProperties } from 'react'
import styles from './Buttons.module.css'

interface BackButtonProps {
  onClick: (any: any) => void
  label?: string
  customStyles?: CSSProperties
}

const BackButton = ({ onClick, label, customStyles }: BackButtonProps) => {
  return (
    <button className={styles.backButton} style={customStyles} onClick={onClick}>
      {label || 'Back'}
    </button>
  )
}

export default BackButton
