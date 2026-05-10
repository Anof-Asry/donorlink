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

  // Fetch all donors
  const fetchDonors = async () => {
    try {
      const res = await API.get('/donors');
      console.log('API response', res.data);
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

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit (create or update)
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

  // Handle edit
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

  // Handle delete
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
        <h1 style={styles.title}>🧑‍⚕️ Donors</h1>
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

      {/* Form */}
      {showForm && (
        <div style={styles.form}>
          <h2>{editingDonor ? 'Edit Donor' : 'Add New Donor'}</h2>
          <input
            style={styles.input}
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          <select
            style={styles.input}
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <input
            style={styles.input}
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
          <select
            style={styles.input}
            name="isAvailable"
            value={formData.isAvailable}
            onChange={handleChange}
          >
            <option value={true}>Available</option>
            <option value={false}>Not Available</option>
          </select>
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {editingDonor ? 'Update Donor' : 'Create Donor'}
          </button>
        </div>
      )}

      {/* Donors Table */}
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
                  <td style={styles.td}>
                    <span style={styles.badge}>{donor.bloodGroup}</span>
                  </td>
                  <td style={styles.td}>{donor.age}</td>
                  <td style={styles.td}>{donor.contact}</td>
                  <td style={styles.td}>{donor.city}</td>
                  <td style={styles.td}>
                    <span style={donor.isAvailable ? styles.available : styles.unavailable}>
                      {donor.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
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
  container: { maxWidth: '1100px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { color: '#c0392b', fontSize: '32px' },
  addBtn: { backgroundColor: '#c0392b', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
  form: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '25px' },
  input: { display: 'block', width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
  submitBtn: { backgroundColor: '#c0392b', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', width: '100%' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' },
  thead: { backgroundColor: '#c0392b' },
  th: { color: 'white', padding: '14px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 14px' },
  noData: { textAlign: 'center', padding: '30px', color: '#888' },
  badge: { backgroundColor: '#c0392b', color: 'white', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' },
  available: { backgroundColor: '#27ae60', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  unavailable: { backgroundColor: '#888', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  editBtn: { backgroundColor: '#f39c12', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' },
  deleteBtn: { backgroundColor: '#e74c3c', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default Donors;