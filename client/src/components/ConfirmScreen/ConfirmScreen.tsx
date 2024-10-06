import { CSSProperties } from 'react'
import { BackButton, SubmitButton } from '../Buttons'
import Modal from '../Modal'
import styles from './ConfirmScreen.module.css'

interface ConfirmScreenProps {
  show: boolean
  text: string
  onCancel: (any: any) => void
  onConfirm: (any: any) => void
  customStyles?: CSSProperties
}

const ConfirmScreen = ({ show, text, onCancel, onConfirm }: ConfirmScreenProps) => {
  if (!show) return null

  return (
    <Modal
      show={show}
      position={{ top: 0, left: 0 }}
      onClose={() => null}
      includeCloseButton={false}
      occupyWholeScreen={true}
    >
      <div className={styles.content}>
        {text}
        <div className={styles.buttonContainer}>
          <BackButton onClick={onCancel} label='Cancel' />
          <SubmitButton onClick={onConfirm} label='Confirm' />
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmScreen
