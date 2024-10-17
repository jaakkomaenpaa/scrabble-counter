import styles from './Loader.module.css'

interface LoaderProps {
  size?: number
}

const Loader = ({ size }: LoaderProps) => {
  return <div className={styles.loader} style={{ width: size, height: size }}></div>
}

export default Loader
