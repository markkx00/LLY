import React, { useState, useEffect } from 'react';

const DataModule = ({ employees, loading, onUpdateEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let filtered = employees.filter(employee => {
      const searchLower = searchTerm.toLowerCase();
      return (
        employee.name.toLowerCase().includes(searchLower) ||
        employee.phone.toLowerCase().includes(searchLower) ||
        employee.employeeId.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.position.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower)
      );
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchTerm, employees, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee({ ...employee });
    setShowEditModal(true);
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingEmployee.name || !editingEmployee.email) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      await onUpdateEmployee(editingEmployee);
      setShowEditModal(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkillChange = (skillIndex, newScore) => {
    const updatedSkills = [...editingEmployee.skills];
    updatedSkills[skillIndex].score = Math.max(0, Math.min(100, newScore));
    setEditingEmployee({ ...editingEmployee, skills: updatedSkills });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getSkillColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 55) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Data Management</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            View, search, and edit all employee data
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: '#eff6ff', 
            color: '#1e40af', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.5rem',
            fontWeight: 600
          }}>
            Total: {employees.length} employees
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search by name, phone, employee ID, email, position, or department..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {filteredEmployees.length} results found
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Employee Directory</h3>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Page {currentPage} of {totalPages}
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th 
                  style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                  onClick={() => handleSort('employeeId')}
                >
                  Employee ID {getSortIcon('employeeId')}
                </th>
                <th 
                  style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </th>
                <th 
                  style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                  onClick={() => handleSort('position')}
                >
                  Position {getSortIcon('position')}
                </th>
                <th 
                  style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                  onClick={() => handleSort('department')}
                >
                  Department {getSortIcon('department')}
                </th>
                <th 
                  style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                  onClick={() => handleSort('phone')}
                >
                  Phone {getSortIcon('phone')}
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                  Status
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee) => (
                <tr key={employee.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>
                      {employee.employeeId}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 500, color: '#1e293b' }}>
                        {employee.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {employee.email}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500, color: '#1e293b' }}>
                      {employee.position}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: '#64748b' }}>
                      {employee.department}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: '#64748b' }}>
                      {employee.phone}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      background: employee.status === 'active' ? '#d1fae5' : '#fee2e2',
                      color: employee.status === 'active' ? '#065f46' : '#991b1b',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'capitalize'
                    }}>
                      {employee.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleViewDetails(employee)}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEdit(employee)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '1rem', 
            marginTop: '2rem',
            padding: '1rem'
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? '#f3f4f6' : '#3b82f6',
                color: currentPage === 1 ? '#9ca3af' : 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 500
              }}
            >
              Previous
            </button>
            
            <span style={{ color: '#64748b', fontWeight: 500 }}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? '#f3f4f6' : '#3b82f6',
                color: currentPage === totalPages ? '#9ca3af' : 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 500
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem', fontWeight: 700 }}>
                Edit Employee: {editingEmployee.name}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Basic Information */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: 600 }}>
                  Basic Information
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingEmployee.name}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editingEmployee.email}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={editingEmployee.phone}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingEmployee.position}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingEmployee.department}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: 600 }}>
                  Skills & Competencies
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {editingEmployee.skills?.map((skill, index) => (
                    <div key={index} style={{
                      padding: '1rem',
                      background: '#f8fafc',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                          {skill.name}
                        </label>
                        <span style={{
                          background: getSkillColor(skill.score),
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {skill.score}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.score}
                        onChange={(e) => handleSkillChange(index, parseInt(e.target.value))}
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.score}
                        onChange={(e) => handleSkillChange(index, parseInt(e.target.value) || 0)}
                        style={{
                          width: '80px',
                          padding: '0.25rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                onClick={() => setShowEditModal(false)}
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
                onClick={handleSaveEdit}
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
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem', fontWeight: 700 }}>
                Employee Details: {selectedEmployee.name}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Employee Information */}
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: 600 }}>
                  Employee Information
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div><strong>ID:</strong> {selectedEmployee.employeeId}</div>
                  <div><strong>Name:</strong> {selectedEmployee.name}</div>
                  <div><strong>Email:</strong> {selectedEmployee.email}</div>
                  <div><strong>Phone:</strong> {selectedEmployee.phone}</div>
                  <div><strong>Position:</strong> {selectedEmployee.position}</div>
                  <div><strong>Department:</strong> {selectedEmployee.department}</div>
                  <div><strong>Manager:</strong> {selectedEmployee.manager}</div>
                  <div><strong>Start Date:</strong> {new Date(selectedEmployee.startDate).toLocaleDateString()}</div>
                  <div><strong>Status:</strong> 
                    <span style={{
                      background: selectedEmployee.status === 'active' ? '#d1fae5' : '#fee2e2',
                      color: selectedEmployee.status === 'active' ? '#065f46' : '#991b1b',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      marginLeft: '0.5rem'
                    }}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: 600 }}>
                  Performance Metrics
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div><strong>Attendance Rate:</strong> {selectedEmployee.attendanceRate}%</div>
                  <div><strong>Tasks Completed:</strong> {selectedEmployee.tasksCompleted || 0}</div>
                  <div><strong>Events Joined:</strong> {selectedEmployee.eventsJoined || 0}</div>
                  <div><strong>Average Skill Score:</strong> {
                    selectedEmployee.skills ? 
                    Math.round(selectedEmployee.skills.reduce((sum, skill) => sum + skill.score, 0) / selectedEmployee.skills.length) : 0
                  }%</div>
                </div>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: 600 }}>
                Skills & Competencies
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {selectedEmployee.skills?.map((skill, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        {skill.name}
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${skill.score}%`,
                          height: '100%',
                          backgroundColor: getSkillColor(skill.score),
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                    <div style={{
                      background: getSkillColor(skill.score),
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: 600,
                      minWidth: '60px',
                      textAlign: 'center'
                    }}>
                      {skill.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataModule;