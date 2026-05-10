import { useState, useEffect } from 'react';
import API from '../api/axios';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [formData, setFormData] = useState({
    patient: '',
    bloodGroup: '',
    units: '',
    urgency: '',
    hospital: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const res = await API.get('/requests');
      if (Array.isArray(res.data)) {
        setRequests(res.data);
      } else if (Array.isArray(res.data.data)) {
        setRequests(res.data.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setRequests([]);
    }
  };

  // Fetch all patients for dropdown
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
    fetchRequests();
    fetchPatients();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit (create or update)
  const handleSubmit = async () => {
    try {
      if (editingRequest) {
        await API.put(`/requests/${editingRequest._id}`, formData);
        alert('Request updated successfully!');
      } else {
        await API.post('/requests', formData);
        alert('Blood request created successfully!');
      }
      setFormData({ patient: '', bloodGroup: '', units: '', urgency: '', hospital: '' });
      setShowForm(false);
      setEditingRequest(null);
      fetchRequests();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  // Handle edit
  const handleEdit = (request) => {
    setEditingRequest(request);
    setFormData({
      patient: request.patient?._id || '',
      bloodGroup: request.bloodGroup,
      units: request.units,
      urgency: request.urgency,
      hospital: request.hospital
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await API.delete(`/requests/${id}`);
        alert('Request deleted successfully!');
        fetchRequests();
      } catch (error) {
        alert('Error deleting request');
      }
    }
  };

  // Handle match donor
  const handleMatch = async (id) => {
    try {
      const res = await API.put(`/requests/${id}/match`);
      alert('✅ Donor matched successfully!');
      fetchRequests();
    } catch (error) {
      alert('❌ ' + error.response?.data?.message);
    }
  };

  // Urgency color
  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'Critical': return styles.critical;
      case 'High': return styles.high;
      case 'Medium': return styles.medium;
      default: return styles.low;
    }
  };

  // Status color
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Matched': return styles.matched;
      case 'Fulfilled': return styles.fulfilled;
      case 'Cancelled': return styles.cancelled;
      default: return styles.pending;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🆘 Blood Requests</h1>
        <button
          style={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setEditingRequest(null);
            setFormData({ patient: '', bloodGroup: '', units: '', urgency: '', hospital: '' });
          }}
        >
          {showForm ? 'Cancel' : '+ New Request'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={styles.form}>
          <h2>{editingRequest ? 'Edit Request' : 'New Blood Request'}</h2>
          <select
            style={styles.input}
            name="patient"
            value={formData.patient}
            onChange={handleChange}
          >
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.bloodGroup})</option>
            ))}
          </select>
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
            name="units"
            type="number"
            placeholder="Units Required"
            value={formData.units}
            onChange={handleChange}
          />
          <select
            style={styles.input}
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
          >
            <option value="">Select Urgency Level</option>
            {urgencyLevels.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <input
            style={styles.input}
            name="hospital"
            placeholder="Hospital Name"
            value={formData.hospital}
            onChange={handleChange}
          />
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {editingRequest ? 'Update Request' : 'Create Request'}
          </button>
        </div>
      )}

      {/* Requests Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Blood Group</th>
              <th style={styles.th}>Units</th>
              <th style={styles.th}>Urgency</th>
              <th style={styles.th}>Hospital</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Matched Donor</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8" style={styles.noData}>No requests found. Add one!</td>
              </tr>
            ) : (
              requests.map(request => (
                <tr key={request._id} style={styles.tr}>
                  <td style={styles.td}>{request.patient?.name || 'N/A'}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{request.bloodGroup}</span>
                  </td>
                  <td style={styles.td}>{request.units}</td>
                  <td style={styles.td}>
                    <span style={getUrgencyStyle(request.urgency)}>
                      {request.urgency}
                    </span>
                  </td>
                  <td style={styles.td}>{request.hospital}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(request.status)}>
                      {request.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {request.donor ? request.donor.name : '—'}
                  </td>
                  <td style={styles.td}>
                    {request.status === 'Pending' && (
                      <button
                        style={styles.matchBtn}
                        onClick={() => handleMatch(request._id)}
                      >
                        🔗 Match
                      </button>
                    )}
                    <button
                      style={styles.editBtn}
                      onClick={() => handleEdit(request)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(request._id)}
                    >
                      Delete
                    </button>
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
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
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
  pending: { backgroundColor: '#f39c12', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  matched: { backgroundColor: '#2980b9', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  fulfilled: { backgroundColor: '#27ae60', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  cancelled: { backgroundColor: '#888', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  low: { backgroundColor: '#27ae60', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  medium: { backgroundColor: '#f39c12', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  high: { backgroundColor: '#e67e22', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  critical: { backgroundColor: '#e74c3c', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  matchBtn: { backgroundColor: '#2980b9', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '6px' },
  editBtn: { backgroundColor: '#f39c12', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '6px' },
  deleteBtn: { backgroundColor: '#e74c3c', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default Requests;