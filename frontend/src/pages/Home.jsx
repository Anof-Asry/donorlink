import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.badge}>Community blood coordination</div>
        <h1 style={styles.title}>Fast, compassionate support for every life-saving match</h1>
        <p style={styles.subtitle}>
          DonorLink helps hospitals, donors, and patients stay connected with a clearer, faster way to organize blood needs and help save lives.
        </p>
        <div style={styles.heroActions}>
          <Link to="/requests" style={styles.primaryBtn}>View Requests</Link>
          <Link to="/donors" style={styles.secondaryBtn}>Add Donor</Link>
        </div>
      </section>

      <section style={styles.cards}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🧑‍⚕️ Donors</h2>
          <p style={styles.cardText}>Register and manage blood donors with an organized, friendly workflow.</p>
          <Link to="/donors" style={styles.cardBtn}>Manage Donors</Link>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🏥 Patients</h2>
          <p style={styles.cardText}>Track patients who need transfusions and keep their records ready for action.</p>
          <Link to="/patients" style={styles.cardBtn}>Manage Patients</Link>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🆘 Blood Requests</h2>
          <p style={styles.cardText}>Create urgent requests, monitor priority levels, and match donors quickly.</p>
          <Link to="/requests" style={styles.cardBtn}>Manage Requests</Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1180px',
    margin: '0 auto',
  },
  hero: {
    textAlign: 'center',
    padding: '46px 24px 32px',
    background: 'linear-gradient(135deg, rgba(214,69,69,0.08) 0%, rgba(255,138,101,0.14) 100%)',
    borderRadius: '24px',
    boxShadow: '0 16px 40px rgba(214,69,69,0.12)',
    marginBottom: '24px',
    border: '1px solid rgba(214,69,69,0.15)',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: '999px',
    backgroundColor: 'rgba(214,69,69,0.1)',
    color: '#b92d2d',
    fontWeight: '700',
    marginBottom: '14px',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '38px',
    color: '#b92d2d',
    marginBottom: '12px',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: '17px',
    color: '#5d6470',
    margin: '0 auto 22px',
    maxWidth: '760px',
    lineHeight: 1.7,
  },
  heroActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    display: 'inline-block',
    background: 'linear-gradient(90deg, #d64545 0%, #b92d2d 100%)',
    color: 'white',
    padding: '11px 20px',
    borderRadius: '999px',
    fontWeight: '700',
    boxShadow: '0 10px 20px rgba(214,69,69,0.22)',
  },
  secondaryBtn: {
    display: 'inline-block',
    backgroundColor: 'white',
    color: '#b92d2d',
    padding: '11px 20px',
    borderRadius: '999px',
    fontWeight: '700',
    border: '1px solid rgba(214,69,69,0.2)',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid var(--border)',
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    color: '#b92d2d',
    marginBottom: '8px',
    fontSize: '22px',
  },
  cardText: {
    color: '#6b7280',
    marginBottom: '14px',
    lineHeight: 1.6,
  },
  cardBtn: {
    display: 'inline-block',
    backgroundColor: '#fff5f5',
    color: '#b92d2d',
    padding: '9px 14px',
    borderRadius: '10px',
    fontWeight: '700',
    border: '1px solid rgba(214,69,69,0.15)',
  }
};

export default Home;