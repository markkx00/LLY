import React, { useState, useEffect } from 'react';

const AttendanceTracker = ({ user }) => {
  const [attendance, setAttendance] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('not-checked-in');
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate sample attendance data for the current month
  useEffect(() => {
    const generateAttendanceData = () => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      
      const attendanceData = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          let status = 'present';
          let checkIn = '08:30';
          let checkOut = '17:30';
          
          // Add some variation
          if (Math.random() < 0.1) {
            status = 'absent';
            checkIn = null;
            checkOut = null;
          } else if (Math.random() < 0.15) {
            status = 'late';
            checkIn = '09:15';
          }
          
          attendanceData.push({
            id: day,
            date: date.toISOString().split('T')[0],
            status,
            checkIn,
            checkOut,
            hours: status === 'absent' ? 0 : Math.floor(Math.random() * 2) + 8
          });
        }
      }
      
      setAttendance(attendanceData);
    };

    generateAttendanceData();
  }, []);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const checkInTime = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // In a real app, you would save to Firebase here
      console.log('Checking in at:', checkInTime);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStatus('checked-in');
      setCheckInTime(checkInTime);
      
      // Update today's attendance
      const today = new Date().toISOString().split('T')[0];
      setAttendance(prev => prev.map(record => 
        record.date === today 
          ? { ...record, status: 'present', checkIn: checkInTime }
          : record
      ));
      
      console.log('Check-in successful');
    } catch (error) {
      console.error('Error checking in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const checkOutTime = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // In a real app, you would save to Firebase here
      console.log('Checking out at:', checkOutTime);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStatus('not-checked-in');
      setCheckInTime(null);
      
      // Update today's attendance
      const today = new Date().toISOString().split('T')[0];
      setAttendance(prev => prev.map(record => 
        record.date === today 
          ? { ...record, checkOut: checkOutTime, hours: 8 }
          : record
      ));
      
      console.log('Check-out successful');
    } catch (error) {
      console.error('Error checking out:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonthStats = () => {
    const totalDays = attendance.length;
    const presentDays = attendance.filter(record => record.status === 'present').length;
    const absentDays = attendance.filter(record => record.status === 'absent').length;
    const lateDays = attendance.filter(record => record.status === 'late').length;
    const totalHours = attendance.reduce((sum, record) => sum + record.hours, 0);
    
    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      totalHours,
      attendanceRate: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
    };
  };

  const stats = getCurrentMonthStats();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Attendance Tracker</h1>
        <div style={{ color: '#64748b' }}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Current Status */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Today's Status</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: currentStatus === 'checked-in' ? '#10b981' : '#f59e0b',
              marginBottom: '0.5rem'
            }}>
              {currentStatus === 'checked-in' ? 'Checked In' : 'Not Checked In'}
            </div>
            {checkInTime && (
              <div style={{ color: '#64748b' }}>
                Check-in time: {checkInTime}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {currentStatus === 'not-checked-in' ? (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Checking In...' : 'Check In'}
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                disabled={loading}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Checking Out...' : 'Check Out'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Attendance Rate</h3>
            <div className="card-icon green">✅</div>
          </div>
          <div className="card-value">{stats.attendanceRate}%</div>
          <div className="card-description">
            {stats.presentDays} out of {stats.totalDays} working days
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Hours</h3>
            <div className="card-icon blue">⏰</div>
          </div>
          <div className="card-value">{stats.totalHours}h</div>
          <div className="card-description">This month's total hours</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Late Days</h3>
            <div className="card-icon yellow">⚠️</div>
          </div>
          <div className="card-value">{stats.lateDays}</div>
          <div className="card-description">Days arrived late</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Absent Days</h3>
            <div className="card-icon red">❌</div>
          </div>
          <div className="card-value">{stats.absentDays}</div>
          <div className="card-description">Days absent</div>
        </div>
      </div>

      {/* Attendance Calendar */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">This Month's Attendance</h3>
        </div>
        <div className="attendance-grid">
          {attendance.map((record) => (
            <div key={record.id} className="attendance-card">
              <div className="attendance-date">
                {new Date(record.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className={`attendance-status ${record.status}`}>
                {record.status}
              </div>
              {record.checkIn && (
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  {record.checkIn} - {record.checkOut || '--'}
                </div>
              )}
              {record.hours > 0 && (
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {record.hours}h
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker; 