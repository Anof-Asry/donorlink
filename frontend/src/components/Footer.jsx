function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2026 DonorLink – Saving Lives One Drop at a Time 🩸</p>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'linear-gradient(90deg, #b92d2d 0%, #d64545 100%)',
    padding: '16px 20px',
    textAlign: 'center',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
  },
  text: {
    color: 'white',
    margin: 0,
    fontSize: '14px',
    fontWeight: '500',
  }
};

export default Footer;