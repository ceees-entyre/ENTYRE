import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../../styles/Nav.module.css';

// Breadcrumb component
const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNames = {
    'home': 'Home',
    'key-outputs': 'Research & Publications',
    'pathway-explorer': 'Recycling Solutions',
    'data-visualisation': 'Analysis Tools',
    'compare': 'Compare Options',
    'mcda': 'Decision Tool',
    'manual': 'User Guide'
  };

  if (pathnames.length === 0 || pathnames[0] === 'home') {
    return null; // Don't show breadcrumb on home page
  }

  return (
    <div style={{
      background: '#f8fafc',
      padding: '8px 0',
      fontSize: '14px',
      color: '#666',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        fontFamily: "'FiraGO', sans-serif"
      }}>
        <Link
          to="/home"
          style={{
            color: '#006087',
            textDecoration: 'none'
          }}
        >
          Home
        </Link>
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);

          return (
            <span key={routeTo}>
              <span style={{ margin: '0 8px', color: '#ccc' }}>/</span>
              {isLast ? (
                <span style={{ color: '#003C69', fontWeight: '500' }}>
                  {displayName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  style={{
                    color: '#006087',
                    textDecoration: 'none'
                  }}
                >
                  {displayName}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    const currentPath = location.pathname;

    if (path === '/home') {
      return currentPath === '/' || currentPath === '/home';
    }

    // Only highlight if the current path matches the nav item exactly or is a sub-route (but not for /home)
    return currentPath.startsWith(path) && path !== '/home';
  };

  // Navigation items
  const navItems = [
    {
      path: '/home',
      label: 'Home'
    },
    {
      path: '/key-outputs',
      label: 'Research & Publications'
    },
    {
      path: '/pathway-explorer',
      label: 'Recycling Solutions'
    },
    {
      path: '/data-visualisation',
      label: 'Analysis Tools'
    }
  ];

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div>
            <Link to="/home" className={styles.logoButton} style={{ display: 'flex', alignItems: 'center', height: 70 }}>
              <img
                src="https://res.cloudinary.com/ddzezr2rm/image/upload/v1755300553/logo_d7wqie.png"
                alt="MaREI Centre Logo"
                className={styles.logoImage}
                style={{ height: 70, width: 'auto', marginRight: 40 }}
              />
              <img
                src="https://res.cloudinary.com/ddzezr2rm/image/upload/v1755300552/logo2_eixhfj.png"
                alt="ENTYRE Project Logo"
                className={styles.logoImage}
                style={{ height: 80, width: 'auto' }}
              />
            </Link>
          </div>

          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${isActive(item.path) ? styles.activeLink : ''}`}
                aria-current={isActive(item.path) ? 'page' : undefined}
                style={{
                  position: 'relative'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <Breadcrumb />
    </>
  );
};

export default Navbar;