import { CSSProperties } from 'react'
import styles from './Buttons.module.css'

interface ContinueButtonProps {
  onClick: (any: any) => void
  label?: string
  customStyles?: CSSProperties
}

const ContinueButton = ({ onClick, label, customStyles }: ContinueButtonProps) => {
  return (
    <button className={styles.continueButton} style={customStyles} onClick={onClick}>
      {label || 'Continue'}
    </button>
  )
}

export default ContinueButton
