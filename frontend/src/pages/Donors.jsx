import { useState, useEffect } from 'react';
import API from '../api/axios';

function Donors() {
  const [donors, setDonors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    age: '',
    contact: '',
    city: '',
    isAvailable: true
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchDonors = async () => {
    try {
      const res = await API.get('/donors');
      if (Array.isArray(res.data)) {
        setDonors(res.data);
      } else if (Array.isArray(res.data.data)) {
        setDonors(res.data.data);
      } else {
        setDonors([]);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setDonors([]);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingDonor) {
        await API.put(`/donors/${editingDonor._id}`, formData);
        alert('Donor updated successfully!');
      } else {
        await API.post('/donors', formData);
        alert('Donor created successfully!');
      }
      setFormData({ name: '', bloodGroup: '', age: '', contact: '', city: '', isAvailable: true });
      setShowForm(false);
      setEditingDonor(null);
      fetchDonors();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleEdit = (donor) => {
    setEditingDonor(donor);
    setFormData({
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      age: donor.age,
      contact: donor.contact,
      city: donor.city,
      isAvailable: donor.isAvailable
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await API.delete(`/donors/${id}`);
        alert('Donor deleted successfully!');
        fetchDonors();
      } catch (error) {
        alert('Error deleting donor');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🧑‍⚕️ Donors</h1>
          <p style={styles.subtitle}>Maintain a trusted network of people ready to help.</p>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setEditingDonor(null);
            setFormData({ name: '', bloodGroup: '', age: '', contact: '', city: '', isAvailable: true });
          }}
        >
          {showForm ? 'Cancel' : '+ Add Donor'}
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <h2 style={styles.formTitle}>{editingDonor ? 'Edit Donor' : 'Add New Donor'}</h2>
          <input style={styles.input} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
          <select style={styles.input} name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
            <option value="">Select Blood Group</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <input style={styles.input} name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} />
          <input style={styles.input} name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} />
          <input style={styles.input} name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          <select style={styles.input} name="isAvailable" value={formData.isAvailable} onChange={handleChange}>
            <option value={true}>Available</option>
            <option value={false}>Not Available</option>
          </select>
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {editingDonor ? 'Update Donor' : 'Create Donor'}
          </button>
        </div>
      )}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Blood Group</th>
              <th style={styles.th}>Age</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>City</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donors.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.noData}>No donors found. Add one!</td>
              </tr>
            ) : (
              donors.map(donor => (
                <tr key={donor._id} style={styles.tr}>
                  <td style={styles.td}>{donor.name}</td>
                  <td style={styles.td}><span style={styles.badge}>{donor.bloodGroup}</span></td>
                  <td style={styles.td}>{donor.age}</td>
                  <td style={styles.td}>{donor.contact}</td>
                  <td style={styles.td}>{donor.city}</td>
                  <td style={styles.td}><span style={donor.isAvailable ? styles.available : styles.unavailable}>{donor.isAvailable ? 'Available' : 'Unavailable'}</span></td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(donor)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(donor._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1150px', margin: '0 auto', padding: '8px 4px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', gap: '12px', flexWrap: 'wrap' },
  title: { color: '#b92d2d', fontSize: '32px', marginBottom: '4px' },
  subtitle: { color: '#6b7280', fontSize: '14px' },
  addBtn: { background: 'linear-gradient(90deg, #d64545 0%, #b92d2d 100%)', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '999px', fontSize: '15px', fontWeight: '700', boxShadow: '0 10px 20px rgba(214,69,69,0.2)' },
  form: { backgroundColor: '#fff', padding: '24px', borderRadius: '18px', boxShadow: '0 12px 30px rgba(0,0,0,0.06)', marginBottom: '20px', border: '1px solid #f2e4e4' },
  formTitle: { color: '#b92d2d', marginBottom: '14px' },
  input: { display: 'block', width: '100%', padding: '11px 12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e6d5d5', fontSize: '15px', boxSizing: 'border-box' },
  submitBtn: { background: 'linear-gradient(90deg, #d64545 0%, #b92d2d 100%)', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', width: '100%' },
  tableWrapper: { overflowX: 'auto', borderRadius: '18px', boxShadow: '0 12px 30px rgba(0,0,0,0.06)', border: '1px solid #f2e4e4' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' },
  thead: { backgroundColor: '#fff5f5' },
  th: { color: '#b92d2d', padding: '14px', textAlign: 'left', fontWeight: '700' },
  tr: { borderBottom: '1px solid #f6e9e9' },
  td: { padding: '12px 14px', color: '#4b5563' },
  noData: { textAlign: 'center', padding: '30px', color: '#888' },
  badge: { backgroundColor: '#b92d2d', color: 'white', padding: '4px 10px', borderRadius: '999px', fontWeight: '700', fontSize: '13px' },
  available: { backgroundColor: '#2ecc71', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  unavailable: { backgroundColor: '#8a8a8a', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  editBtn: { backgroundColor: '#f39c12', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '8px', marginRight: '8px', fontWeight: '700' },
  deleteBtn: { backgroundColor: '#e74c3c', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '8px', fontWeight: '700' },
};

export default Donors;