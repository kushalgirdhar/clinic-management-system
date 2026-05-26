import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [notification, setNotification] = useState('');
  const wsRef = useRef(null);

  useEffect(() => {
    fetchAppointments();
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const fetchAppointments = () => {
    api.get('/appointments/').then(res => setAppointments(res.data));
  };

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/queue');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📨 Received:', data);

      if (data.event === 'new_appointment') {
        setNotification(`🔔 New patient: ${data.patient_name} is waiting!`);
        fetchAppointments();
        setTimeout(() => setNotification(''), 5000);
      }

      if (data.event === 'status_updated') {
        setNotification(`✅ Appointment #${data.appointment_id} updated to ${data.status}`);
        fetchAppointments();
        setTimeout(() => setNotification(''), 5000);
      }
    };

    ws.onclose = () => console.log('🔴 WebSocket disconnected');
  };

  const updateStatus = async (appointmentId, status) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status });
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const getStatusStyle = (status) => {
    if (status === 'waiting') return { background: '#fff3cd', color: '#856404' };
    if (status === 'in_progress') return { background: '#cce5ff', color: '#004085' };
    return { background: '#d4edda', color: '#155724' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🏥 Clinic Management</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Welcome, Dr. {user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {notification && (
        <div style={styles.notification}>
          {notification}
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.headerRow}>
          <h3 style={styles.sectionTitle}>📋 Patient Queue</h3>
          <div style={styles.liveBadge}>🟢 Live</div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{appointments.filter(a => a.status === 'waiting').length}</div>
            <div style={styles.statLabel}>Waiting</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{appointments.filter(a => a.status === 'in_progress').length}</div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{appointments.filter(a => a.status === 'done').length}</div>
            <div style={styles.statLabel}>Done Today</div>
          </div>
        </div>

        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Patient ID</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Notes</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id} style={styles.tr}>
                  <td style={styles.td}>{a.id}</td>
                  <td style={styles.td}>{a.patient_id}</td>
                  <td style={styles.td}>{new Date(a.appointment_time).toLocaleString()}</td>
                  <td style={styles.td}>{a.notes || '-'}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...getStatusStyle(a.status) }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {a.status === 'waiting' && (
                      <button style={styles.actionBtn} onClick={() => updateStatus(a.id, 'in_progress')}>
                        Start
                      </button>
                    )}
                    {a.status === 'in_progress' && (
                      <button style={{ ...styles.actionBtn, background: '#28a745' }} onClick={() => updateStatus(a.id, 'done')}>
                        Done
                      </button>
                    )}
                    {a.status === 'done' && (
                      <span style={{ color: '#28a745', fontSize: '18px' }}>✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div style={styles.empty}>No appointments yet. Waiting for patients...</div>
          )}
        </div>
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
  notification: { background: '#1a73e8', color: 'white', padding: '14px 32px', fontWeight: '500', fontSize: '15px', textAlign: 'center' },
  content: { padding: '32px' },
  headerRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  sectionTitle: { fontSize: '22px', color: '#333', margin: 0 },
  liveBadge: { background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '24px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flex: 1, textAlign: 'center' },
  statNumber: { fontSize: '36px', fontWeight: 'bold', color: '#1a73e8' },
  statLabel: { fontSize: '13px', color: '#666', marginTop: '4px' },
  card: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#f8f9fa', padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontSize: '13px', color: '#555' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px', fontSize: '14px', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  actionBtn: { padding: '6px 14px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '40px', color: '#999', fontSize: '15px' }
};

export default DoctorDashboard;