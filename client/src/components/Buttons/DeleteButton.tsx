import { CSSProperties } from 'react'
import styles from './Buttons.module.css'

interface DeleteButtonProps {
  onClick: (any: any) => void
  label?: string
  customStyles?: CSSProperties
}

const DeleteButton = ({ onClick, label, customStyles }: DeleteButtonProps) => {
  return (
    <button className={styles.deleteButton} style={customStyles} onClick={onClick}>
      {label || 'Delete'}
    </button>
  )
}

export default DeleteButton
