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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        <div>
          <h1 style={styles.title}>🏥 Patients</h1>
          <p style={styles.subtitle}>Coordinate care needs with clarity and urgency.</p>
        </div>
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

      {showForm && (
        <div style={styles.form}>
          <h2 style={styles.formTitle}>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
          <input style={styles.input} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
          <select style={styles.input} name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
            <option value="">Select Blood Group</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <input style={styles.input} name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} />
          <input style={styles.input} name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} />
          <input style={styles.input} name="hospital" placeholder="Hospital Name" value={formData.hospital} onChange={handleChange} />
          <select style={styles.input} name="condition" value={formData.condition} onChange={handleChange}>
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
                  <td style={styles.td}><span style={styles.badge}>{patient.bloodGroup}</span></td>
                  <td style={styles.td}>{patient.age}</td>
                  <td style={styles.td}>{patient.contact}</td>
                  <td style={styles.td}>{patient.hospital}</td>
                  <td style={styles.td}><span style={getConditionStyle(patient.condition)}>{patient.condition}</span></td>
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
  stable: { backgroundColor: '#2ecc71', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  fair: { backgroundColor: '#f39c12', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  serious: { backgroundColor: '#e67e22', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  critical: { backgroundColor: '#e74c3c', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  editBtn: { backgroundColor: '#f39c12', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '8px', marginRight: '8px', fontWeight: '700' },
  deleteBtn: { backgroundColor: '#e74c3c', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '8px', fontWeight: '700' },
};

export default Patients;