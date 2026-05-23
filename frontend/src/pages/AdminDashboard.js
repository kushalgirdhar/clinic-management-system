import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api.get('/patients/').then(res => setPatients(res.data));
    api.get('/doctors/').then(res => setDoctors(res.data));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
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

      <div style={styles.content}>
        <h3 style={styles.sectionTitle}>Dashboard Overview</h3>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{patients.length}</div>
            <div style={styles.statLabel}>Total Patients</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{doctors.length}</div>
            <div style={styles.statLabel}>Total Doctors</div>
          </div>
        </div>

        <div style={styles.tableSection}>
          <h4 style={styles.tableTitle}>Patients List</h4>
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

        <div style={styles.tableSection}>
          <h4 style={styles.tableTitle}>Doctors List</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Specialization</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Available</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(d => (
                <tr key={d.id} style={styles.tr}>
                  <td style={styles.td}>{d.id}</td>
                  <td style={styles.td}>{d.full_name}</td>
                  <td style={styles.td}>{d.specialization}</td>
                  <td style={styles.td}>{d.phone}</td>
                  <td style={styles.td}>{d.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
  content: { padding: '32px' },
  sectionTitle: { fontSize: '22px', color: '#333', marginBottom: '24px' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '32px' },
  statCard: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flex: 1, textAlign: 'center' },
  statNumber: { fontSize: '42px', fontWeight: 'bold', color: '#1a73e8' },
  statLabel: { fontSize: '14px', color: '#666', marginTop: '4px' },
  tableSection: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  tableTitle: { fontSize: '16px', color: '#333', marginBottom: '16px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#f8f9fa', padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontSize: '13px', color: '#555' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px', fontSize: '14px', color: '#333' }
};

export default AdminDashboard;