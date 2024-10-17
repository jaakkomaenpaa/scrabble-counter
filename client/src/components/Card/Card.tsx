import { CSSProperties, ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  customStyles?: CSSProperties
}

const Card = ({ children, customStyles }: CardProps) => {
  return (
    <div className={styles.container} style={customStyles}>
      {children}
    </div>
  )
}

export default Card
