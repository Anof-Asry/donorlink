import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        🩸 DonorLink
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/donors" style={styles.link}>Donors</Link>
        <Link to="/patients" style={styles.link}>Patients</Link>
        <Link to="/requests" style={styles.link}>Requests</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#c0392b',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
  }
};

export default Navbar;