import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ReceptionistDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('patients');

  const [newPatient, setNewPatient] = useState({ full_name: '', age: '', gender: 'male', phone: '', address: '' });
  const [newAppointment, setNewAppointment] = useState({ patient_id: '', doctor_id: '', appointment_time: '', notes: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    api.get('/patients/').then(res => setPatients(res.data));
    api.get('/doctors/').then(res => setDoctors(res.data));
    api.get('/appointments/').then(res => setAppointments(res.data));
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const addPatient = async () => {
    try {
      await api.post('/patients/', { ...newPatient, age: parseInt(newPatient.age) });
      showMessage('✅ Patient added successfully!');
      setNewPatient({ full_name: '', age: '', gender: 'male', phone: '', address: '' });
      fetchAll();
    } catch (err) {
      showMessage('❌ Error adding patient');
    }
  };

  const bookAppointment = async () => {
    try {
      await api.post('/appointments/', {
        patient_id: parseInt(newAppointment.patient_id),
        doctor_id: parseInt(newAppointment.doctor_id),
        appointment_time: newAppointment.appointment_time,
        notes: newAppointment.notes
      });
      showMessage('✅ Appointment booked successfully!');
      setNewAppointment({ patient_id: '', doctor_id: '', appointment_time: '', notes: '' });
      fetchAll();
    } catch (err) {
      showMessage('❌ Error booking appointment');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🏥 Clinic Management</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Welcome, {user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.tabs}>
        {['patients', 'appointments'].map(tab => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'patients' ? '👤 Patients' : '📅 Appointments'}
          </button>
        ))}
      </div>

      <div style={styles.content}>

        {activeTab === 'patients' && (
          <div>
            <div style={styles.card}>
              <h4 style={styles.cardTitle}>Add New Patient</h4>
              <div style={styles.formRow}>
                <input style={styles.input} placeholder="Full Name" value={newPatient.full_name}
                  onChange={e => setNewPatient({ ...newPatient, full_name: e.target.value })} />
                <input style={styles.input} placeholder="Age" type="number" value={newPatient.age}
                  onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} />
                <select style={styles.input} value={newPatient.gender}
                  onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input style={styles.input} placeholder="Phone" value={newPatient.phone}
                  onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} />
                <input style={styles.input} placeholder="Address" value={newPatient.address}
                  onChange={e => setNewPatient({ ...newPatient, address: e.target.value })} />
                <button style={styles.addBtn} onClick={addPatient}>Add Patient</button>
              </div>
            </div>

            <div style={styles.card}>
              <h4 style={styles.cardTitle}>All Patients ({patients.length})</h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Age</th>
                    <th style={styles.th}>Gender</th>
                    <th style={styles.th}>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.td}>{p.id}</td>
                      <td style={styles.td}>{p.full_name}</td>
                      <td style={styles.td}>{p.age}</td>
                      <td style={styles.td}>{p.gender}</td>
                      <td style={styles.td}>{p.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <div style={styles.card}>
              <h4 style={styles.cardTitle}>Book New Appointment</h4>
              <div style={styles.formRow}>
                <select style={styles.input} value={newAppointment.patient_id}
                  onChange={e => setNewAppointment({ ...newAppointment, patient_id: e.target.value })}>
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
                <select style={styles.input} value={newAppointment.doctor_id}
                  onChange={e => setNewAppointment({ ...newAppointment, doctor_id: e.target.value })}>
                  <option value="">Select Doctor</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.full_name} — {d.specialization}</option>)}
                </select>
                <input style={styles.input} placeholder="Date Time (2026-05-20 10:00)" value={newAppointment.appointment_time}
                  onChange={e => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })} />
                <input style={styles.input} placeholder="Notes (optional)" value={newAppointment.notes}
                  onChange={e => setNewAppointment({ ...newAppointment, notes: e.target.value })} />
                <button style={styles.addBtn} onClick={bookAppointment}>Book Appointment</button>
              </div>
            </div>

            <div style={styles.card}>
              <h4 style={styles.cardTitle}>All Appointments ({appointments.length})</h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Patient ID</th>
                    <th style={styles.th}>Doctor ID</th>
                    <th style={styles.th}>Time</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id} style={styles.tr}>
                      <td style={styles.td}>{a.id}</td>
                      <td style={styles.td}>{a.patient_id}</td>
                      <td style={styles.td}>{a.doctor_id}</td>
                      <td style={styles.td}>{new Date(a.appointment_time).toLocaleString()}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: a.status === 'waiting' ? '#fff3cd' : a.status === 'in_progress' ? '#cce5ff' : '#d4edda',
                          color: a.status === 'waiting' ? '#856404' : a.status === 'in_progress' ? '#004085' : '#155724'
                        }}>{a.status}</span>
                      </td>
                      <td style={styles.td}>{a.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f0f4f8' },
  navbar: { background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  logo: { color: '#1a73e8', margin: 0 },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { color: '#333', fontWeight: '500' },
  logoutBtn: { padding: '8px 16px', background: '#e53935', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  message: { background: '#e8f5e9', color: '#2e7d32', padding: '12px 32px', fontWeight: '500' },
  tabs: { display: 'flex', gap: '0', background: 'white', borderBottom: '2px solid #e0e0e0', padding: '0 32px' },
  tab: { padding: '14px 24px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: '#666', fontWeight: '500' },
  activeTab: { color: '#1a73e8', borderBottom: '2px solid #1a73e8' },
  content: { padding: '24px 32px' },
  card: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: '16px', color: '#333', marginBottom: '16px' },
  formRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minWidth: '160px' },
  addBtn: { padding: '10px 20px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#f8f9fa', padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontSize: '13px', color: '#555' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px', fontSize: '14px', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }
};

export default ReceptionistDashboard;