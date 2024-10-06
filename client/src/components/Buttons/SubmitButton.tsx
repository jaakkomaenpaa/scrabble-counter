import { CSSProperties } from 'react'
import styles from './Buttons.module.css'

interface SubmitButtonProps {
  onClick: (any: any) => void
  label?: string
  customStyles?: CSSProperties
}

const SubmitButton = ({ onClick, label, customStyles }: SubmitButtonProps) => {
  return (
    <button className={styles.submitButton} style={customStyles} onClick={onClick}>
      {label || 'Submit'}
    </button>
  )
}

export default SubmitButton
