import { useState, useEffect } from 'react';
import API from '../api/axios';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    age: '',
    contact: '',
    hospital: '',
    condition: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const conditions = ['Stable', 'Critical', 'Serious', 'Fair'];

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const res = await API.get('/patients');
      if (Array.isArray(res.data)) {
        setPatients(res.data);
      } else if (Array.isArray(res.data.data)) {
        setPatients(res.data.data);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setPatients([]);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit (create or update)
  const handleSubmit = async () => {
    try {
      if (editingPatient) {
        await API.put(`/patients/${editingPatient._id}`, formData);
        alert('Patient updated successfully!');
      } else {
        await API.post('/patients', formData);
        alert('Patient created successfully!');
      }
      setFormData({ name: '', bloodGroup: '', age: '', contact: '', hospital: '', condition: '' });
      setShowForm(false);
      setEditingPatient(null);
      fetchPatients();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  // Handle edit
  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      bloodGroup: patient.bloodGroup,
      age: patient.age,
      contact: patient.contact,
      hospital: patient.hospital,
      condition: patient.condition
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await API.delete(`/patients/${id}`);
        alert('Patient deleted successfully!');
        fetchPatients();
      } catch (error) {
        alert('Error deleting patient');
      }
    }
  };

  // Condition color
  const getConditionStyle = (condition) => {
    switch (condition) {
      case 'Critical': return styles.critical;
      case 'Serious': return styles.serious;
      case 'Fair': return styles.fair;
      default: return styles.stable;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏥 Patients</h1>
        <button
          style={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setEditingPatient(null);
            setFormData({ name: '', bloodGroup: '', age: '', contact: '', hospital: '', condition: '' });
          }}
        >
          {showForm ? 'Cancel' : '+ Add Patient'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={styles.form}>
          <h2>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
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
            name="hospital"
            placeholder="Hospital Name"
            value={formData.hospital}
            onChange={handleChange}
          />
          <select
            style={styles.input}
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="">Select Condition</option>
            {conditions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {editingPatient ? 'Update Patient' : 'Create Patient'}
          </button>
        </div>
      )}

      {/* Patients Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Blood Group</th>
              <th style={styles.th}>Age</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Hospital</th>
              <th style={styles.th}>Condition</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.noData}>No patients found. Add one!</td>
              </tr>
            ) : (
              patients.map(patient => (
                <tr key={patient._id} style={styles.tr}>
                  <td style={styles.td}>{patient.name}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{patient.bloodGroup}</span>
                  </td>
                  <td style={styles.td}>{patient.age}</td>
                  <td style={styles.td}>{patient.contact}</td>
                  <td style={styles.td}>{patient.hospital}</td>
                  <td style={styles.td}>
                    <span style={getConditionStyle(patient.condition)}>
                      {patient.condition}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(patient)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(patient._id)}>Delete</button>
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
  stable: { backgroundColor: '#27ae60', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  fair: { backgroundColor: '#f39c12', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  serious: { backgroundColor: '#e67e22', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  critical: { backgroundColor: '#e74c3c', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  editBtn: { backgroundColor: '#f39c12', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' },
  deleteBtn: { backgroundColor: '#e74c3c', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default Patients;