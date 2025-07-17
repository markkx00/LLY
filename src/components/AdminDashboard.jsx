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
  const [isMobile, setIsMobile] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <div className="dashboard" style={{ 
      minHeight: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      touchAction: 'pan-y',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div className="dashboard-header" style={{
        position: 'sticky',
        top: 0,
        background: '#f8fafc',
        zIndex: 10,
        padding: isMobile ? '1rem' : '2rem',
        marginBottom: isMobile ? '1rem' : '2rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? '1rem' : '0'
        }}>
          <div style={{ flex: 1 }}>
            <h1 className="dashboard-title" style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
              Admin Dashboard
            </h1>
            <p style={{ 
              color: '#64748b', 
              marginTop: '0.5rem',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>
              Manage employees, performance, and company overview
            </p>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            justifyContent: isMobile ? 'center' : 'flex-end',
            alignItems: 'center'
          }}>
            {isMobile && (
              <button
                onClick={() => setShowEmployeeList(!showEmployeeList)}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  touchAction: 'manipulation'
                }}
              >
                {showEmployeeList ? '📊 Stats' : '👥 Employees'}
              </button>
            )}
            <button
              onClick={() => setShowAddEmployee(true)}
              disabled={saving}
              style={{
                background: saving ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: isMobile ? '0.875rem' : '1rem',
                touchAction: 'manipulation',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <span style={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>➕</span> 
              {saving ? 'Processing...' : 'Add Employee'}
            </button>
          </div>
        </div>
      </div>

      {/* Company Overview */}
      <div className="dashboard-grid" style={{ 
        marginBottom: isMobile ? '1rem' : '2rem',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: isMobile ? '0.75rem' : '2rem',
        padding: isMobile ? '0 1rem' : '0'
      }}>
        <div className="card" style={{ padding: isMobile ? '1rem' : '2rem' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: isMobile ? '0.875rem' : '1.25rem' }}>
              Total Employees
            </h3>
            <div className="card-icon blue" style={{ 
              width: isMobile ? '30px' : '40px', 
              height: isMobile ? '30px' : '40px',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>👥</div>
          </div>
          <div className="card-value" style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
            {companyStats.totalEmployees}
          </div>
          <div className="card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            Active employees in system
          </div>
        </div>

        <div className="card" style={{ padding: isMobile ? '1rem' : '2rem' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: isMobile ? '0.875rem' : '1.25rem' }}>
              Avg Performance
            </h3>
            <div className="card-icon green" style={{ 
              width: isMobile ? '30px' : '40px', 
              height: isMobile ? '30px' : '40px',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>📈</div>
          </div>
          <div className="card-value" style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
            {companyStats.averagePerformance}%
          </div>
          <div className="card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            Average skill performance
          </div>
        </div>

        <div className="card" style={{ padding: isMobile ? '1rem' : '2rem' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: isMobile ? '0.875rem' : '1.25rem' }}>
              Avg Attendance
            </h3>
            <div className="card-icon yellow" style={{ 
              width: isMobile ? '30px' : '40px', 
              height: isMobile ? '30px' : '40px',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>📅</div>
          </div>
          <div className="card-value" style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
            {companyStats.averageAttendance}%
          </div>
          <div className="card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            Average attendance rate
          </div>
        </div>

        <div className="card" style={{ padding: isMobile ? '1rem' : '2rem' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: isMobile ? '0.875rem' : '1.25rem' }}>
              Tasks Completed
            </h3>
            <div className="card-icon green" style={{ 
              width: isMobile ? '30px' : '40px', 
              height: isMobile ? '30px' : '40px',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>✅</div>
          </div>
          <div className="card-value" style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
            {companyStats.totalTasksCompleted}
          </div>
          <div className="card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            Total tasks completed by all employees
          </div>
        </div>
      </div>

      {/* Mobile Toggle View */}
      {isMobile ? (
        showEmployeeList ? (
          // Employee List View for Mobile
          <div style={{ padding: '0 1rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: '1rem',
              color: '#1e293b'
            }}>
              Employee List
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {employees.map((employee) => (
                <div key={employee.id} className="card" style={{ 
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  background: 'white'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                  }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '1rem', 
                        fontWeight: 600, 
                        color: '#1e293b',
                        marginBottom: '0.25rem'
                      }}>
                        {employee.name}
                      </h3>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#64748b',
                        marginBottom: '0.25rem'
                      }}>
                        {employee.position} • {employee.department}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {employee.email}
                      </p>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem',
                      flexDirection: 'column'
                    }}>
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          touchAction: 'manipulation'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          touchAction: 'manipulation'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }}>
                    <span>Attendance: {employee.attendanceRate}%</span>
                    <span>Performance: {calculateAverageSkillScore(employee.skills || [])}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Stats View for Mobile
          <div style={{ padding: '0 1rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: '1rem',
              color: '#1e293b'
            }}>
              Performance Overview
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {employees.slice(0, 5).map((employee) => (
                <div key={employee.id} className="card" style={{ 
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  background: 'white'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '1rem', 
                        fontWeight: 600, 
                        color: '#1e293b',
                        marginBottom: '0.25rem'
                      }}>
                        {employee.name}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {employee.position}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 700,
                        color: getRankColor(calculateAverageSkillScore(employee.skills || []))
                      }}>
                        {calculateAverageSkillScore(employee.skills || [])}%
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#64748b',
                        textTransform: 'uppercase'
                      }}>
                        {getSkillLevel(calculateAverageSkillScore(employee.skills || []))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        // Desktop View - Original layout
        <>
          {/* Add Employee Modal */}
          {showAddEmployee && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
                  Add New Employee
                </h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Position *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Manager</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newEmployee.manager}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, manager: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button
                    onClick={handleAddEmployee}
                    disabled={saving}
                    style={{
                      background: saving ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {saving ? 'Adding...' : 'Add Employee'}
                  </button>
                  <button
                    onClick={() => setShowAddEmployee(false)}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Employee Modal */}
          {editingEmployee && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
                  Edit Employee: {editingEmployee.name}
                </h2>
                
                {/* Basic Info */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                    Basic Information
                  </h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingEmployee.name}
                        onChange={(e) => setEditingEmployee(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-input"
                        value={editingEmployee.email}
                        onChange={(e) => setEditingEmployee(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="form-label">Position</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingEmployee.position}
                        onChange={(e) => setEditingEmployee(prev => ({ ...prev, position: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingEmployee.department}
                        onChange={(e) => setEditingEmployee(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                    Skills Assessment
                  </h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {(editingEmployee.skills || []).map((skill, index) => (
                      <div key={index}>
                        <label className="form-label">{skill.name}</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.score}
                            onChange={(e) => {
                              const newSkills = [...editingEmployee.skills];
                              newSkills[index].score = parseInt(e.target.value);
                              setEditingEmployee(prev => ({ ...prev, skills: newSkills }));
                            }}
                            style={{ flex: 1 }}
                          />
                          <span style={{ minWidth: '3rem', textAlign: 'right', fontWeight: 600 }}>
                            {skill.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleUpdateEmployee}
                    disabled={saving}
                    style={{
                      background: saving ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditingEmployee(null)}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Employee Table */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
              Employee Management
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Position</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Department</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Performance</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Attendance</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Tasks</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => {
                    const performance = calculateAverageSkillScore(employee.skills || []);
                    return (
                      <tr key={employee.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{employee.name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{employee.email}</div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#374151' }}>{employee.position}</td>
                        <td style={{ padding: '1rem', color: '#374151' }}>{employee.department}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ 
                            color: getRankColor(performance), 
                            fontWeight: 600 
                          }}>
                            {performance}%
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {getSkillLevel(performance)}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ 
                            color: employee.attendanceRate >= 90 ? '#10b981' : 
                                   employee.attendanceRate >= 80 ? '#f59e0b' : '#ef4444',
                            fontWeight: 600 
                          }}>
                            {employee.attendanceRate}%
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#374151' }}>
                          {employee.tasksCompleted || 0}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEditEmployee(employee)}
                              style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500
                              }}
                            >
                              Delete
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
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
