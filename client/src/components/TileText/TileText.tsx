import { CSSProperties } from 'react'
import styles from './TileText.module.css'

interface TileTextProps {
  text: string
  customStyles?: CSSProperties
}

const TileText = ({ text, customStyles }: TileTextProps) => {
  return (
    <div className={styles.container} style={customStyles}>
      {text.split('').map(letter => {
        if (letter === ' ') {
          return <div className={styles.emptyTile}></div>
        }

        return <div className={styles.tile}>{letter}</div>
      })}
    </div>
  )
}

export default TileText
