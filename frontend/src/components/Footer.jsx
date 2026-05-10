function Footer() {
    return (
      <footer style={styles.footer}>
        <p style={styles.text}>© 2026 DonorLink – Saving Lives One Drop at a Time 🩸</p>
      </footer>
    );
  }
  
  const styles = {
    footer: {
      backgroundColor: '#c0392b',
      padding: '15px',
      textAlign: 'center',
    },
    text: {
      color: 'white',
      margin: 0,
    }
  };
  
  export default Footer;