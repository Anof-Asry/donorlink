import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🩸 Welcome to DonorLink</h1>
        <p style={styles.subtitle}>
          Connecting blood donors with patients in need — saving lives, one drop at a time.
        </p>
        <div style={styles.cards}>
          <div style={styles.card}>
            <h2>🧑‍⚕️ Donors</h2>
            <p>Register and manage blood donors across the country.</p>
            <Link to="/donors" style={styles.btn}>Manage Donors</Link>
          </div>
          <div style={styles.card}>
            <h2>🏥 Patients</h2>
            <p>Track patients who are in need of blood transfusions.</p>
            <Link to="/patients" style={styles.btn}>Manage Patients</Link>
          </div>
          <div style={styles.card}>
            <h2>🆘 Blood Requests</h2>
            <p>Create and manage urgent blood requests efficiently.</p>
            <Link to="/requests" style={styles.btn}>Manage Requests</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  hero: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  title: {
    fontSize: '42px',
    color: '#c0392b',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '40px',
  },
  cards: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '30px',
    width: '280px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  },
  btn: {
    display: 'inline-block',
    marginTop: '15px',
    backgroundColor: '#c0392b',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default Home;