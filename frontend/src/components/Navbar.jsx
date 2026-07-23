import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.icon}>🩸</span>
        <span>DonorLink</span>
      </div>
      <div style={styles.links}>
        <NavLink to="/" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Home</NavLink>
        <NavLink to="/donors" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Donors</NavLink>
        <NavLink to="/patients" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Patients</NavLink>
        <NavLink to="/requests" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Requests</NavLink>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: 'linear-gradient(90deg, #d64545 0%, #b92d2d 100%)',
    padding: '16px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 8px 30px rgba(185, 45, 45, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  brand: {
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    letterSpacing: '0.3px',
  },
  icon: {
    fontSize: '26px',
  },
  links: {
    display: 'flex',
    gap: '18px',
    alignItems: 'center',
  },
  link: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: '15px',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '999px',
  },
  activeLink: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  }
};

export default Navbar;