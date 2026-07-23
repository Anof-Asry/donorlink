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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleMatch = async (id) => {
    try {
      await API.put(`/requests/${id}/match`);
      alert('✅ Donor matched successfully!');
      fetchRequests();
    } catch (error) {
      alert('❌ ' + error.response?.data?.message);
    }
  };

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'Critical': return styles.critical;
      case 'High': return styles.high;
      case 'Medium': return styles.medium;
      default: return styles.low;
    }
  };

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
        <div>
          <h1 style={styles.title}>🆘 Blood Requests</h1>
          <p style={styles.subtitle}>Prioritize urgent needs and keep matching progress visible.</p>
        </div>
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

      {showForm && (
        <div style={styles.form}>
          <h2 style={styles.formTitle}>{editingRequest ? 'Edit Request' : 'New Blood Request'}</h2>
          <select style={styles.input} name="patient" value={formData.patient} onChange={handleChange}>
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.bloodGroup})</option>
            ))}
          </select>
          <select style={styles.input} name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
            <option value="">Select Blood Group</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <input style={styles.input} name="units" type="number" placeholder="Units Required" value={formData.units} onChange={handleChange} />
          <select style={styles.input} name="urgency" value={formData.urgency} onChange={handleChange}>
            <option value="">Select Urgency Level</option>
            {urgencyLevels.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <input style={styles.input} name="hospital" placeholder="Hospital Name" value={formData.hospital} onChange={handleChange} />
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {editingRequest ? 'Update Request' : 'Create Request'}
          </button>
        </div>
      )}

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
                  <td style={styles.td}><span style={styles.badge}>{request.bloodGroup}</span></td>
                  <td style={styles.td}>{request.units}</td>
                  <td style={styles.td}><span style={getUrgencyStyle(request.urgency)}>{request.urgency}</span></td>
                  <td style={styles.td}>{request.hospital}</td>
                  <td style={styles.td}><span style={getStatusStyle(request.status)}>{request.status}</span></td>
                  <td style={styles.td}>{request.donor ? request.donor.name : '—'}</td>
                  <td style={styles.td}>
                    {request.status === 'Pending' && <button style={styles.matchBtn} onClick={() => handleMatch(request._id)}>🔗 Match</button>}
                    <button style={styles.editBtn} onClick={() => handleEdit(request)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(request._id)}>Delete</button>
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
  container: { maxWidth: '1200px', margin: '0 auto', padding: '8px 4px 20px' },
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
  pending: { backgroundColor: '#f39c12', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  matched: { backgroundColor: '#2980b9', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  fulfilled: { backgroundColor: '#2ecc71', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  cancelled: { backgroundColor: '#8a8a8a', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  low: { backgroundColor: '#2ecc71', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  medium: { backgroundColor: '#f39c12', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  high: { backgroundColor: '#e67e22', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  critical: { backgroundColor: '#e74c3c', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' },
  matchBtn: { backgroundColor: '#2980b9', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '8px', marginRight: '6px', fontWeight: '700' },
  editBtn: { backgroundColor: '#f39c12', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '8px', marginRight: '6px', fontWeight: '700' },
  deleteBtn: { backgroundColor: '#e74c3c', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '8px', fontWeight: '700' },
};

export default Requests;