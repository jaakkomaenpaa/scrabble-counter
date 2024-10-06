import { CSSProperties, ReactNode } from 'react'
import styles from './Modal.module.css'
import { ModalPosition } from '../../types'

interface ModalProps {
  show: boolean
  onClose: () => void
  position: ModalPosition
  children: ReactNode
  includeCloseButton?: boolean
  customStyles?: CSSProperties
  occupyWholeScreen?: boolean
}

const Modal = ({
  show,
  onClose,
  position,
  children,
  includeCloseButton,
  customStyles,
  occupyWholeScreen,
}: ModalProps) => {
  if (!show) return null

  return (
    <div
      className={
        occupyWholeScreen ? styles.modalWholeScreenOverlay : styles.modalOverlay
      }
      style={{
        top: position.top,
        left: position.left,
      }}
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        style={customStyles}
        onClick={e => e.stopPropagation()}
      >
        {children}
        {includeCloseButton && (
          <span className={styles.closeButton} onClick={onClose}>
            &times;
          </span>
        )}
      </div>
    </div>
  )
}

export default Modal
