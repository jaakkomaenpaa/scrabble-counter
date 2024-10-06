import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [pathname, setPathname] = useState<string>('/')
  const location = useLocation()

  useEffect(() => {
    setPathname(location.pathname)
  }, [location.pathname])

  const links = [
    { to: '/game', label: 'Game' },
    { to: '/ranking', label: 'Ranking' },
    { to: '/stats', label: 'Stats' },
    { to: '/settings', label: 'Settings' },
  ]

  const getLinkClass = (path: string) => {
    return pathname === path ? styles.navbarTabActive : styles.navbarTab
  }

  return (
    <section className={styles.container}>
      {links.map(link => (
        <Link key={link.to} className={getLinkClass(link.to)} to={link.to}>
          {link.label}
        </Link>
      ))}
    </section>
  )
}

export default Navbar
