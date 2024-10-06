import { useNavigate } from 'react-router-dom'
import styles from './ErrorPage.module.css'

const ErrorPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <p>Page not found</p>
      <button onClick={() => navigate('/')}>Home</button>
    </div>
  )
}

export default ErrorPage
