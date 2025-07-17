import React, { useState, useEffect } from 'react';
import { getSkillLevel, getOverallRank, getRankColor, calculateAverageSkillScore } from '../utils/skillCalculations';

const AdminDashboard = ({ 
  user, 
  employees, 
  employeesLoading, 
  onUpdateEmployee, 
  onDeleteEmployee, 
  onUpdateEmployeeSkills 
}) => {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    phone: '',
    manager: '',
    attendanceRate: 95,
    skills: [
      { name: 'ทดสอบ Munsell', score: 50 },
      { name: 'การต่อเทปร้อยเทป', score: 50 },
      { name: 'การเตรียมสีและสารเคมี', score: 50 },
      { name: 'การอ่านใบย้อม', score: 50 },
      { name: 'การตรวจคุณภาพงานย้อม', score: 50 },
      { name: 'การตรวจเช็คเครื่องจักร', score: 50 },
      { name: 'ทักษะการดูสี / เติมสี / ปรับสี', score: 50 }
    ],
    eventsJoined: 0
  });
  const [saving, setSaving] = useState(false);

  // Calculate company overview stats
  const companyStats = React.useMemo(() => {
    if (!employees || employees.length === 0) {
      return {
        totalEmployees: 0,
        averagePerformance: 0,
        averageAttendance: 0,
        totalTasksCompleted: 0,
        totalEventsJoined: 0
      };
    }

    const totalEmployees = employees.length;
    const averageAttendance = Math.round(employees.reduce((sum, emp) => sum + (emp.attendanceRate || 0), 0) / employees.length);
    const totalTasksCompleted = employees.reduce((sum, emp) => sum + (emp.tasksCompleted || 0), 0);
    const totalEventsJoined = employees.reduce((sum, emp) => sum + (emp.eventsJoined || 0), 0);
    
    // Calculate average performance based on skill scores
    const averagePerformance = Math.round(
      employees.reduce((sum, emp) => {
        const empAverage = calculateAverageSkillScore(emp.skills || []);
        return sum + empAverage;
      }, 0) / employees.length
    );

    return {
      totalEmployees,
      averagePerformance,
      averageAttendance,
      totalTasksCompleted,
      totalEventsJoined
    };
  }, [employees]);

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.position) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const employee = {
        ...newEmployee,
        employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
        startDate: new Date().toISOString().split('T')[0],
        tasksCompleted: 0,
        eventsJoined: 0,
        status: 'active'
      };

      await onUpdateEmployee(employee);
      
      setNewEmployee({
        name: '',
        email: '',
        position: '',
        department: '',
        phone: '',
        manager: '',
        attendanceRate: 95,
        skills: [
          { name: 'ทดสอบ Munsell', score: 50 },
          { name: 'การต่อเทปร้อยเทป', score: 50 },
          { name: 'การเตรียมสีและสารเคมี', score: 50 },
          { name: 'การอ่านใบย้อม', score: 50 },
          { name: 'การตรวจคุณภาพงานย้อม', score: 50 },
          { name: 'การตรวจเช็คเครื่องจักร', score: 50 },
          { name: 'ทักษะการดูสี / เติมสี / ปรับสี', score: 50 }
        ],
        eventsJoined: 0
      });
      setShowAddEmployee(false);
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee({ ...employee });
  };

  const handleUpdateEmployee = async () => {
    setSaving(true);
    try {
      await onUpdateEmployee(editingEmployee);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await onDeleteEmployee(employeeId);
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee. Please try again.');
      }
    }
  };

  const handleSkillUpdate = async (employeeId, skillIndex, newScore) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        const updatedSkills = [...employee.skills];
        updatedSkills[skillIndex].score = Math.max(0, Math.min(100, newScore));
        await onUpdateEmployeeSkills(employeeId, updatedSkills);
      }
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Error updating skill. Please try again.');
    }
  };

  if (employeesLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Manage employees, performance, and company overview
          </p>
        </div>
        <button
          onClick={() => setShowAddEmployee(true)}
          disabled={saving}
          style={{
            background: saving ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>➕</span> {saving ? 'Processing...' : 'Add Employee'}
        </button>
      </div>

      {/* Company Overview */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Employees</h3>
            <div className="card-icon blue">👥</div>
          </div>
          <div className="card-value">{companyStats.totalEmployees}</div>
          <div className="card-description">Active employees in company</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Avg Skill Score</h3>
            <div className="card-icon green">📊</div>
          </div>
          <div className="card-value">{companyStats.averagePerformance}%</div>
          <div className="card-description">Company average skill score</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Activity Rate</h3>
            <div className="card-icon yellow">⏰</div>
          </div>
          <div className="card-value">{companyStats.totalEventsJoined}</div>
          <div className="card-description">Total events participated</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tasks Completed</h3>
            <div className="card-icon red">✅</div>
          </div>
          <div className="card-value">{companyStats.totalTasksCompleted}</div>
          <div className="card-description">Total tasks completed by all employees</div>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {(showAddEmployee || editingEmployee) && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingEmployee ? editingEmployee.name : newEmployee.name}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, name: e.target.value });
                    } else {
                      setNewEmployee({ ...newEmployee, name: e.target.value });
                    }
                  }}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={editingEmployee ? editingEmployee.email : newEmployee.email}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, email: e.target.value });
                    } else {
                      setNewEmployee({ ...newEmployee, email: e.target.value });
                    }
                  }}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="form-label">Position *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingEmployee ? editingEmployee.position : newEmployee.position}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, position: e.target.value });
                    } else {
                      setNewEmployee({ ...newEmployee, position: e.target.value });
                    }
                  }}
                  placeholder="Enter position"
                />
              </div>

              <div>
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingEmployee ? editingEmployee.department : newEmployee.department}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, department: e.target.value });
                    } else {
                      setNewEmployee({ ...newEmployee, department: e.target.value });
                    }
                  }}
                  placeholder="Enter department"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={editingEmployee ? editingEmployee.phone : newEmployee.phone}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, phone: e.target.value });
                    } else {
                      setNewEmployee({ ...newEmployee, phone: e.target.value });
                    }
                  }}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="form-label">Manager</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingEmployee ? editingEmployee.manager : newEmployee.manager}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, manager: e.target.value });
                    } else {
                      setNewEmployee({ ...newEmployee, manager: e.target.value });
                    }
                  }}
                  placeholder="Enter manager name"
                />
              </div>

              <div>
                <label className="form-label">Activity Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input" 
                  value={editingEmployee ? editingEmployee.attendanceRate : newEmployee.attendanceRate}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, attendanceRate: parseInt(e.target.value) });
                    } else {
                      setNewEmployee({ ...newEmployee, attendanceRate: parseInt(e.target.value) });
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Skills Management */}
          {editingEmployee && (
            <div style={{ marginTop: '2rem' }}>
              <label className="form-label">Skills (Click to edit scores)</label>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {editingEmployee.skills?.map((skill, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ flex: 1, fontWeight: 500 }}>{skill.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        background: getRankColor(getOverallRank(skill.score * 7)),
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        Lv.{getSkillLevel(skill.score)}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.score}
                        onChange={(e) => {
                          const updatedSkills = [...editingEmployee.skills];
                          updatedSkills[index].score = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                          setEditingEmployee({ ...editingEmployee, skills: updatedSkills });
                        }}
                        style={{
                          width: '80px',
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              onClick={() => {
                setShowAddEmployee(false);
                setEditingEmployee(null);
                setNewEmployee({
                  name: '',
                  email: '',
                  position: '',
                  department: '',
                  phone: '',
                  manager: '',
                  attendanceRate: 95,
                  skills: [
                    { name: 'ทดสอบ Munsell', score: 50 },
                    { name: 'การต่อเทปร้อยเทป', score: 50 },
                    { name: 'การเตรียมสีและสารเคมี', score: 50 },
                    { name: 'การอ่านใบย้อม', score: 50 },
                    { name: 'การตรวจคุณภาพงานย้อม', score: 50 },
                    { name: 'การตรวจเช็คเครื่องจักร', score: 50 },
                    { name: 'ทักษะการดูสี / เติมสี / ปรับสี', score: 50 }
                  ],
                  eventsJoined: 0
                });
              }}
              disabled={saving}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 500
              }}
            >
              Cancel
            </button>
            <button
              onClick={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
              disabled={saving}
              style={{
                background: saving ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 500
              }}
            >
              {saving ? 'Saving...' : (editingEmployee ? 'Update Employee' : 'Add Employee')}
            </button>
          </div>
        </div>
      )}

      {/* Employee Management Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Employee Management</h3>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {employees.length} employees total
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Employee</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Position</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Rank</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Avg Score</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Tasks</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Events</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const totalScore = (employee.skills || []).reduce((sum, skill) => sum + skill.score, 0);
                const averageScore = calculateAverageSkillScore(employee.skills || []);
                const rank = getOverallRank(totalScore);
                
                return (
                  <tr key={employee.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{employee.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{employee.email}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{employee.employeeId}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 500, color: '#1e293b' }}>{employee.position}</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{employee.department}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ 
                        background: getRankColor(rank),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        textAlign: 'center'
                      }}>
                        Rank {rank}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ 
                        background: averageScore >= 85 ? '#d1fae5' : averageScore >= 70 ? '#dbeafe' : '#fef3c7',
                        color: averageScore >= 85 ? '#065f46' : averageScore >= 70 ? '#1e40af' : '#92400e',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textAlign: 'center'
                      }}>
                        {averageScore}%
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 500 }}>
                      {employee.tasksCompleted || 0}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ 
                        background: (employee.eventsJoined || 0) >= 10 ? '#d1fae5' : (employee.eventsJoined || 0) >= 5 ? '#dbeafe' : '#fef3c7',
                        color: (employee.eventsJoined || 0) >= 10 ? '#065f46' : (employee.eventsJoined || 0) >= 5 ? '#1e40af' : '#92400e',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textAlign: 'center'
                      }}>
                        {employee.eventsJoined || 0} events
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          disabled={saving}
                          style={{
                            background: saving ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          disabled={saving}
                          style={{
                            background: saving ? '#9ca3af' : '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;