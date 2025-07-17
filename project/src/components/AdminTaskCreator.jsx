import React, { useState, useEffect } from 'react';

const AdminTaskCreator = ({ 
  user, 
  employees, 
  onCreateTask, 
  onClose, 
  saving 
}) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    assignmentType: 'all', // 'all', 'department', 'specific'
    targetDepartment: '',
    targetUsers: [],
    scheduleType: 'immediate' // 'immediate' or 'scheduled'
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

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

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      alert('Please fill in all required fields (Title, Description, Due Date)');
      return;
    }

    const task = {
      ...newTask,
      status: 'pending',
      assignedBy: user?.email || 'admin@company.com',
      createdAt: new Date().toISOString(),
      scheduledFor: newTask.scheduleType === 'scheduled' ? 
        new Date(`${newTask.dueDate} ${newTask.dueTime || '00:00'}`).toISOString() : 
        new Date().toISOString(),
      targetUsers: newTask.assignmentType === 'specific' ? selectedEmployees : []
    };

    await onCreateTask(task);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      dueTime: '',
      assignmentType: 'all',
      targetDepartment: '',
      targetUsers: [],
      scheduleType: 'immediate'
    });
    setSelectedEmployees([]);
    onClose();
  };

  const handleEmployeeSelection = (employeeEmail) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeEmail)) {
        return prev.filter(email => email !== employeeEmail);
      } else {
        return [...prev, employeeEmail];
      }
    });
  };

  const departments = [
    'Engineering',
    'Design', 
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Quality Control'
  ];

  return (
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
      padding: isMobile ? '1rem' : '2rem',
      touchAction: 'none'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: isMobile ? '1.5rem' : '2rem',
        maxWidth: isMobile ? '100%' : '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1rem' : '0'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#1e293b', 
            fontSize: isMobile ? '1.25rem' : '1.5rem', 
            fontWeight: 700 
          }}>
            📋 Create New Task
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#64748b',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              touchAction: 'manipulation'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Basic Task Info */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: '1rem' 
          }}>
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#374151',
                fontSize: isMobile ? '1rem' : '0.875rem' 
              }}>
                Task Title *
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
                style={{ 
                  width: '100%',
                  padding: isMobile ? '1rem' : '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '16px' : '14px',
                  transition: 'border-color 0.2s',
                  touchAction: 'manipulation'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#374151',
                fontSize: isMobile ? '1rem' : '0.875rem' 
              }}>
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                style={{ 
                  width: '100%',
                  padding: isMobile ? '1rem' : '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '16px' : '14px',
                  background: 'white',
                  touchAction: 'manipulation'
                }}
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#374151',
              fontSize: isMobile ? '1rem' : '0.875rem' 
            }}>
              Description *
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Enter detailed task description"
              rows={isMobile ? "4" : "3"}
              style={{ 
                width: '100%',
                padding: isMobile ? '1rem' : '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: isMobile ? '16px' : '14px',
                resize: 'vertical',
                touchAction: 'manipulation'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Date and Time */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: '1rem' 
          }}>
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#374151',
                fontSize: isMobile ? '1rem' : '0.875rem' 
              }}>
                Due Date *
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                style={{ 
                  width: '100%',
                  padding: isMobile ? '1rem' : '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '16px' : '14px',
                  touchAction: 'manipulation'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#374151',
                fontSize: isMobile ? '1rem' : '0.875rem' 
              }}>
                Due Time
              </label>
              <input
                type="time"
                value={newTask.dueTime}
                onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                style={{ 
                  width: '100%',
                  padding: isMobile ? '1rem' : '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '16px' : '14px',
                  touchAction: 'manipulation'
                }}
              />
            </div>
          </div>

          {/* Assignment Type */}
          <div>
            <label style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#374151',
              fontSize: isMobile ? '1rem' : '0.875rem' 
            }}>
              Assign To
            </label>
            <select
              value={newTask.assignmentType}
              onChange={(e) => setNewTask({ ...newTask, assignmentType: e.target.value })}
              style={{ 
                width: '100%',
                padding: isMobile ? '1rem' : '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: isMobile ? '16px' : '14px',
                background: 'white',
                touchAction: 'manipulation'
              }}
            >
              <option value="all">👥 All Users</option>
              <option value="department">🏢 Specific Department</option>
              <option value="specific">👤 Specific Users</option>
            </select>
          </div>

          {/* Department Selection */}
          {newTask.assignmentType === 'department' && (
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#374151',
                fontSize: isMobile ? '1rem' : '0.875rem' 
              }}>
                Select Department
              </label>
              <select
                value={newTask.targetDepartment}
                onChange={(e) => setNewTask({ ...newTask, targetDepartment: e.target.value })}
                style={{ 
                  width: '100%',
                  padding: isMobile ? '1rem' : '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '16px' : '14px',
                  background: 'white',
                  touchAction: 'manipulation'
                }}
              >
                <option value="">Choose Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}

          {/* Specific Users Selection */}
          {newTask.assignmentType === 'specific' && (
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#374151',
                fontSize: isMobile ? '1rem' : '0.875rem' 
              }}>
                Select Users ({selectedEmployees.length} selected)
              </label>
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                border: '2px solid #e5e7eb', 
                borderRadius: '0.5rem',
                padding: '1rem',
                background: '#f9fafb',
                touchAction: 'pan-y'
              }}>
                {employees.filter(emp => emp.email !== 'admin@company.com').map((employee) => (
                  <div key={employee.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: selectedEmployees.includes(employee.email) ? '#eff6ff' : 'transparent',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    touchAction: 'manipulation'
                  }}
                  onClick={() => handleEmployeeSelection(employee.email)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.email)}
                      onChange={() => handleEmployeeSelection(employee.email)}
                      style={{ 
                        width: '18px', 
                        height: '18px',
                        accentColor: '#3b82f6'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: '#1e293b' }}>{employee.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {employee.position} - {employee.department}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Type */}
          <div>
            <label style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#374151',
              fontSize: isMobile ? '1rem' : '0.875rem' 
            }}>
              Schedule Type
            </label>
            <select
              value={newTask.scheduleType}
              onChange={(e) => setNewTask({ ...newTask, scheduleType: e.target.value })}
              style={{ 
                width: '100%',
                padding: isMobile ? '1rem' : '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: isMobile ? '16px' : '14px',
                background: 'white',
                touchAction: 'manipulation'
              }}
            >
              <option value="immediate">⚡ Assign Immediately</option>
              <option value="scheduled">⏰ Schedule for Later</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'flex-end', 
          marginTop: '2rem',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: isMobile ? '1rem' : '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              fontSize: isMobile ? '1rem' : '0.875rem',
              touchAction: 'manipulation'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTask}
            disabled={saving}
            style={{
              background: saving ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              padding: isMobile ? '1rem' : '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              fontSize: isMobile ? '1rem' : '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              touchAction: 'manipulation'
            }}
          >
            {saving ? (
              <>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Creating...
              </>
            ) : (
              <>
                ✅ Create Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTaskCreator;