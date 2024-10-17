import styles from './Navbar.module.css'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/game', label: 'New game' },
    { to: '/ranking', label: 'Ranking' },
    { to: '/stats', label: 'Stats' },
    { to: '/settings', label: 'Settings' },
  ]

  const getLinkClass = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' ? styles.navbarTabActive : styles.navbarTab
    }

    return location.pathname.startsWith(path)
      ? styles.navbarTabActive
      : styles.navbarTab
  }

  return (
    <section className={styles.container}>
      {links.map((link) => (
        <Link key={link.to} className={getLinkClass(link.to)} to={link.to}>
          {link.label}
        </Link>
      ))}
    </section>
  )
}

export default Navbar

/*
    if (pathname === '/' && path === '/') {
      return styles.navbarTabActive
    }

    if (pathname !== '/') {
      return pathname.includes(path) ? styles.navbarTabActive : styles.navbarTab
    }

    return styles.navbarTab
    */
