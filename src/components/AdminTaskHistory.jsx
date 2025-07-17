import React, { useState, useEffect } from 'react';

const AdminTaskHistory = ({ tasks, employees, onClose }) => {
  const [historyEntries, setHistoryEntries] = useState([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    employeeEmail: '',
    taskTitle: '',
    description: '',
    completedDate: '',
    completedTime: '',
    notes: '',
    rating: 5,
    category: 'task'
  });
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
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

  // Initialize with completed tasks from the task system
  useEffect(() => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const initialEntries = completedTasks.map(task => ({
      id: `task-${task.id}`,
      employeeEmail: task.completedBy || 'Unknown',
      taskTitle: task.title,
      description: task.description,
      completedDate: task.completedAt ? new Date(task.completedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      completedTime: task.completedAt ? new Date(task.completedAt).toTimeString().slice(0, 5) : '',
      notes: `Task completed successfully`,
      rating: 5,
      category: 'task',
      source: 'system'
    }));

    // Add some sample manual entries
    const sampleEntries = [
      {
        id: 'manual-1',
        employeeEmail: 'john.doe@company.com',
        taskTitle: 'Quality Control Training',
        description: 'Completed advanced quality control training program',
        completedDate: '2024-01-15',
        completedTime: '14:30',
        notes: 'Excellent performance, showed great attention to detail',
        rating: 9,
        category: 'training',
        source: 'manual'
      },
      {
        id: 'manual-2',
        employeeEmail: 'sarah.wilson@company.com',
        taskTitle: 'Design System Documentation',
        description: 'Created comprehensive design system documentation',
        completedDate: '2024-01-10',
        completedTime: '16:45',
        notes: 'Outstanding work, very thorough documentation',
        rating: 10,
        category: 'project',
        source: 'manual'
      }
    ];

    setHistoryEntries([...initialEntries, ...sampleEntries]);
  }, [tasks]);

  const handleAddEntry = () => {
    if (!newEntry.employeeEmail || !newEntry.taskTitle || !newEntry.completedDate) {
      alert('Please fill in all required fields');
      return;
    }

    const entry = {
      id: `manual-${Date.now()}`,
      ...newEntry,
      source: 'manual',
      createdAt: new Date().toISOString()
    };

    setHistoryEntries(prev => [entry, ...prev]);
    
    // Reset form
    setNewEntry({
      employeeEmail: '',
      taskTitle: '',
      description: '',
      completedDate: '',
      completedTime: '',
      notes: '',
      rating: 5,
      category: 'task'
    });
    setShowAddEntry(false);
  };

  const handleDeleteEntry = (entryId) => {
    if (window.confirm('Are you sure you want to delete this history entry?')) {
      setHistoryEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  };

  // Filter and sort entries
  const filteredAndSortedEntries = React.useMemo(() => {
    let filtered = historyEntries;

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(entry => entry.category === filter);
    }

    // Sort entries
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(`${a.completedDate} ${a.completedTime || '00:00'}`);
        const dateB = new Date(`${b.completedDate} ${b.completedTime || '00:00'}`);
        return dateB - dateA; // Most recent first
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'employee') {
        return a.employeeEmail.localeCompare(b.employeeEmail);
      }
      return 0;
    });

    return filtered;
  }, [historyEntries, filter, sortBy]);

  const getEmployeeName = (email) => {
    const employee = employees.find(emp => emp.email === email);
    return employee ? employee.name : email;
  };

  const getRatingColor = (rating) => {
    if (rating >= 9) return '#10b981'; // Green
    if (rating >= 7) return '#3b82f6'; // Blue
    if (rating >= 5) return '#f59e0b'; // Yellow
    if (rating >= 3) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'task': return '#3b82f6';
      case 'project': return '#10b981';
      case 'training': return '#8b5cf6';
      case 'meeting': return '#f59e0b';
      default: return '#6b7280';
    }
  };

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
        maxWidth: isMobile ? '100%' : '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1rem' : '0'
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              color: '#1e293b', 
              fontSize: isMobile ? '1.5rem' : '1.75rem', 
              fontWeight: 700 
            }}>
              📊 Task History Management
            </h2>
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              color: '#64748b',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>
              View and manage employee task completion history
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
            <button
              onClick={() => setShowAddEntry(true)}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: isMobile ? '1rem' : '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: isMobile ? '1rem' : '0.875rem',
                touchAction: 'manipulation'
              }}
            >
              ➕ Add Entry
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: isMobile ? '1rem' : '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: isMobile ? '1rem' : '0.875rem',
                touchAction: 'manipulation'
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            background: '#eff6ff', 
            padding: '1rem', 
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#1e40af' }}>
              {historyEntries.length}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Entries</div>
          </div>
          <div style={{ 
            background: '#f0fdf4', 
            padding: '1rem', 
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#16a34a' }}>
              {historyEntries.filter(e => e.rating >= 8).length}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>High Rated</div>
          </div>
          <div style={{ 
            background: '#fefce8', 
            padding: '1rem', 
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#ca8a04' }}>
              {historyEntries.filter(e => e.source === 'manual').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Manual Entries</div>
          </div>
          <div style={{ 
            background: '#fdf2f8', 
            padding: '1rem', 
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#be185d' }}>
              {Math.round(historyEntries.reduce((sum, e) => sum + e.rating, 0) / historyEntries.length) || 0}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Avg Rating</div>
          </div>
        </div>

        {/* Add Entry Form */}
        {showAddEntry && (
          <div style={{ 
            background: '#f8fafc', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            marginBottom: '2rem',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: 600 }}>
              Add New History Entry
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
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
                  Employee *
                </label>
                <select
                  value={newEntry.employeeEmail}
                  onChange={(e) => setNewEntry({ ...newEntry, employeeEmail: e.target.value })}
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
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.email}>
                      {emp.name} ({emp.position})
                    </option>
                  ))}
                </select>
              </div>

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
                  value={newEntry.taskTitle}
                  onChange={(e) => setNewEntry({ ...newEntry, taskTitle: e.target.value })}
                  placeholder="Enter task title"
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

              <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: isMobile ? '1rem' : '0.875rem'
                }}>
                  Description
                </label>
                <textarea
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={isMobile ? "3" : "2"}
                  style={{
                    width: '100%',
                    padding: isMobile ? '1rem' : '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: isMobile ? '16px' : '14px',
                    resize: 'vertical',
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
                  Completed Date *
                </label>
                <input
                  type="date"
                  value={newEntry.completedDate}
                  onChange={(e) => setNewEntry({ ...newEntry, completedDate: e.target.value })}
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
                  Completed Time
                </label>
                <input
                  type="time"
                  value={newEntry.completedTime}
                  onChange={(e) => setNewEntry({ ...newEntry, completedTime: e.target.value })}
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
                  Category
                </label>
                <select
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
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
                  <option value="task">Task</option>
                  <option value="project">Project</option>
                  <option value="training">Training</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: isMobile ? '1rem' : '0.875rem'
                }}>
                  Rating (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newEntry.rating}
                  onChange={(e) => setNewEntry({ ...newEntry, rating: parseInt(e.target.value) || 1 })}
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

              <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: isMobile ? '1rem' : '0.875rem'
                }}>
                  Notes
                </label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="Additional notes or feedback"
                  rows={isMobile ? "3" : "2"}
                  style={{
                    width: '100%',
                    padding: isMobile ? '1rem' : '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: isMobile ? '16px' : '14px',
                    resize: 'vertical',
                    touchAction: 'manipulation'
                  }}
                />
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end', 
              marginTop: '1.5rem',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <button
                onClick={() => setShowAddEntry(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: isMobile ? '1rem' : '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: isMobile ? '1rem' : '0.875rem',
                  touchAction: 'manipulation'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddEntry}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: isMobile ? '1rem' : '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: isMobile ? '1rem' : '0.875rem',
                  touchAction: 'manipulation'
                }}
              >
                Add Entry
              </button>
            </div>
          </div>
        )}

        {/* Filters and Sort */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 500, color: '#374151', fontSize: isMobile ? '1rem' : '0.875rem' }}>
              Filter:
            </span>
            {['all', 'task', 'project', 'training', 'meeting'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                style={{
                  background: filter === category ? '#3b82f6' : '#f3f4f6',
                  color: filter === category ? 'white' : '#374151',
                  border: 'none',
                  padding: isMobile ? '0.75rem 1rem' : '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  fontSize: isMobile ? '0.875rem' : '0.75rem',
                  touchAction: 'manipulation'
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 500, color: '#374151', fontSize: isMobile ? '1rem' : '0.875rem' }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: isMobile ? '0.75rem' : '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: isMobile ? '16px' : '14px',
                background: 'white',
                touchAction: 'manipulation'
              }}
            >
              <option value="date">Date</option>
              <option value="rating">Rating</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>

        {/* History Entries */}
        <div style={{ display: 'grid', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
          {filteredAndSortedEntries.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: '#64748b',
              background: '#f8fafc',
              borderRadius: '0.75rem'
            }}>
              <p>No history entries found for the selected filter.</p>
            </div>
          ) : (
            filteredAndSortedEntries.map((entry) => (
              <div key={entry.id} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '1rem' : '0'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: 600 }}>
                        {entry.taskTitle}
                      </h4>
                      <span style={{
                        background: getCategoryColor(entry.category),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}>
                        {entry.category}
                      </span>
                      <span style={{
                        background: getRatingColor(entry.rating),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        ⭐ {entry.rating}/10
                      </span>
                      {entry.source === 'system' && (
                        <span style={{
                          background: '#e2e8f0',
                          color: '#64748b',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          Auto
                        </span>
                      )}
                    </div>
                    
                    <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      👤 {getEmployeeName(entry.employeeEmail)} • 
                      📅 {new Date(entry.completedDate).toLocaleDateString()}
                      {entry.completedTime && ` • 🕐 ${entry.completedTime}`}
                    </div>
                    
                    {entry.description && (
                      <p style={{ color: '#64748b', margin: '0.5rem 0', fontSize: '0.875rem' }}>
                        {entry.description}
                      </p>
                    )}
                    
                    {entry.notes && (
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '0.75rem', 
                        borderRadius: '0.5rem',
                        marginTop: '0.5rem'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>
                          Notes:
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {entry.notes}
                        </div>
                      </div>
                    )}
                  </div>

                  {entry.source === 'manual' && (
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        touchAction: 'manipulation'
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTaskHistory;