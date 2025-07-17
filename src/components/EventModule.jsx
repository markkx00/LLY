import React, { useState, useEffect } from 'react';

const EventModule = ({ employees, events, eventsLoading, onCreateEvent, onUpdateEvent, onDeleteEvent }) => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    registrationDeadline: '',
    maxParticipants: 50,
    targetAudience: 'all' // 'all' or 'selected'
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [notifications, setNotifications] = useState([]);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);
  const [selectedEventForTask, setSelectedEventForTask] = useState(null);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: []
  });

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time) {
      alert('Please fill in all required fields (Name, Date, Time)');
      return;
    }

    const event = {
      id: Date.now(),
      ...newEvent,
      participants: [],
      status: 'upcoming',
      createdBy: 'admin@company.com',
      createdAt: new Date().toISOString().split('T')[0],
      targetEmployees: newEvent.targetAudience === 'all' ? 'all' : selectedEmployees
    };

    if (onCreateEvent) {
      onCreateEvent(event);
    }

    // Create notification
    const notification = {
      id: Date.now(),
      message: `New event created: ${event.name} on ${event.date}`,
      type: 'event',
      timestamp: new Date().toISOString(),
      targetAudience: newEvent.targetAudience,
      targetEmployees: newEvent.targetAudience === 'all' ? 'all' : selectedEmployees
    };
    setNotifications([notification, ...notifications]);

    // Reset form
    setNewEvent({
      name: '',
      date: '',
      time: '',
      location: '',
      description: '',
      registrationDeadline: '',
      maxParticipants: 50,
      targetAudience: 'all'
    });
    setSelectedEmployees([]);
    setShowCreateEvent(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent({ ...event });
  };

  const handleUpdateEvent = () => {
    if (onUpdateEvent) {
      onUpdateEvent(editingEvent);
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      if (onDeleteEvent) {
        onDeleteEvent(eventId);
      }
    }
  };

  const handleAssignTask = (event) => {
    setSelectedEventForTask(event);
    setTaskData({
      title: `Task for ${event.name}`,
      description: '',
      priority: 'medium',
      dueDate: event.date,
      assignedTo: event.participants || []
    });
    setShowTaskAssignment(true);
  };

  const handleCreateTask = async () => {
    if (!taskData.title || !taskData.description) {
      alert('Please fill in task title and description');
      return;
    }

    try {
      // Create task for each assigned user
      const taskPromises = taskData.assignedTo.map(userId => {
        return fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...taskData,
            assignedTo: userId,
            eventId: selectedEventForTask.id,
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0],
            assignedBy: 'admin@company.com'
          })
        });
      });

      await Promise.all(taskPromises);
      
      setShowTaskAssignment(false);
      setSelectedEventForTask(null);
      setTaskData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: []
      });

      // Add notification
      const notification = {
        id: Date.now(),
        message: `Task "${taskData.title}" assigned to ${taskData.assignedTo.length} participants`,
        type: 'task',
        timestamp: new Date().toISOString()
      };
      setNotifications([notification, ...notifications]);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    }
  };

  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const getEventStatus = (event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
    
    if (eventDate < today) {
      return 'completed';
    } else if (registrationDeadline && registrationDeadline < today) {
      return 'registration-closed';
    } else {
      return 'upcoming';
    }
  };

  const isRegistrationOpen = (event) => {
    const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
    const today = new Date();
    return !registrationDeadline || registrationDeadline >= today;
  };

  if (eventsLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Event Management</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Create and manage company events with targeted notifications
          </p>
        </div>
        <button
          onClick={() => setShowCreateEvent(true)}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>📅</span> Create New Event
        </button>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem', background: '#eff6ff', border: '1px solid #3b82f6' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ color: '#1e40af' }}>📢 Recent Notifications</h3>
            <button
              onClick={() => setNotifications([])}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Clear All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} style={{ 
                padding: '0.75rem',
                background: 'white',
                borderRadius: '0.5rem',
                color: '#1e40af'
              }}>
                <div>{notification.message}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Sent to: {notification.targetAudience === 'all' ? 'All employees' : `${notification.targetEmployees.length} selected employees`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Event Modal */}
      {(showCreateEvent || editingEvent) && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="form-label">Event Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingEvent ? editingEvent.name : newEvent.name}
                  onChange={(e) => {
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, name: e.target.value });
                    } else {
                      setNewEvent({ ...newEvent, name: e.target.value });
                    }
                  }}
                  placeholder="Enter event name"
                />
              </div>
              
              <div>
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingEvent ? editingEvent.date : newEvent.date}
                  onChange={(e) => {
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, date: e.target.value });
                    } else {
                      setNewEvent({ ...newEvent, date: e.target.value });
                    }
                  }}
                />
              </div>

              <div>
                <label className="form-label">Time *</label>
                <input
                  type="time"
                  className="form-input"
                  value={editingEvent ? editingEvent.time : newEvent.time}
                  onChange={(e) => {
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, time: e.target.value });
                    } else {
                      setNewEvent({ ...newEvent, time: e.target.value });
                    }
                  }}
                />
              </div>

              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingEvent ? editingEvent.location : newEvent.location}
                  onChange={(e) => {
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, location: e.target.value });
                    } else {
                      setNewEvent({ ...newEvent, location: e.target.value });
                    }
                  }}
                  placeholder="Enter event location"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="form-label">Registration Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingEvent ? editingEvent.registrationDeadline : newEvent.registrationDeadline}
                  onChange={(e) => {
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, registrationDeadline: e.target.value });
                    } else {
                      setNewEvent({ ...newEvent, registrationDeadline: e.target.value });
                    }
                  }}
                />
              </div>

              <div>
                <label className="form-label">Max Participants</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={editingEvent ? editingEvent.maxParticipants : newEvent.maxParticipants}
                  onChange={(e) => {
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, maxParticipants: parseInt(e.target.value) });
                    } else {
                      setNewEvent({ ...newEvent, maxParticipants: parseInt(e.target.value) });
                    }
                  }}
                />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={editingEvent ? editingEvent.description : newEvent.description}
                  onChange={(e) => {
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, description: e.target.value });
                    } else {
                      setNewEvent({ ...newEvent, description: e.target.value });
                    }
                  }}
                  placeholder="Enter event description"
                  rows="3"
                />
              </div>

              {!editingEvent && (
                <div>
                  <label className="form-label">Send To</label>
                  <select
                    className="form-input"
                    value={newEvent.targetAudience}
                    onChange={(e) => setNewEvent({ ...newEvent, targetAudience: e.target.value })}
                  >
                    <option value="all">All Employees</option>
                    <option value="selected">Selected Employees</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Employee Selection */}
          {!editingEvent && newEvent.targetAudience === 'selected' && (
            <div style={{ marginTop: '2rem' }}>
              <label className="form-label">Select Employees ({selectedEmployees.length} selected)</label>
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                border: '1px solid #e2e8f0', 
                borderRadius: '0.5rem',
                padding: '1rem'
              }}>
                {employees.map((employee) => (
                  <div key={employee.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    background: selectedEmployees.includes(employee.id) ? '#eff6ff' : 'transparent'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleEmployeeSelection(employee.id)}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{employee.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {employee.position} - {employee.department}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              onClick={() => {
                setShowCreateEvent(false);
                setEditingEvent(null);
                setNewEvent({
                  name: '',
                  date: '',
                  time: '',
                  location: '',
                  description: '',
                  registrationDeadline: '',
                  maxParticipants: 50,
                  targetAudience: 'all'
                });
                setSelectedEmployees([]);
              }}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Cancel
            </button>
            <button
              onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 500, color: '#374151' }}>Filter:</span>
          {['all', 'upcoming', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                background: filter === status ? '#3b82f6' : '#f3f4f6',
                color: filter === status ? 'white' : '#374151',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 500,
                textTransform: 'capitalize'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {filteredEvents.length === 0 ? (
          <div className="card">
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              <p>No events found for the selected filter.</p>
            </div>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const eventStatus = getEventStatus(event);
            const registrationOpen = isRegistrationOpen(event);
            const eventDate = new Date(event.date);
            const isFull = event.participants.length >= event.maxParticipants;

            return (
              <div key={event.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 600 }}>
                        {event.name}
                      </h3>
                      <span style={{
                        background: eventStatus === 'upcoming' ? '#dbeafe' : eventStatus === 'completed' ? '#d1fae5' : '#fef3c7',
                        color: eventStatus === 'upcoming' ? '#1e40af' : eventStatus === 'completed' ? '#065f46' : '#92400e',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}>
                        {eventStatus === 'registration-closed' ? 'Registration Closed' : eventStatus}
                      </span>
                      {!registrationOpen && (
                        <span style={{
                          background: '#fee2e2',
                          color: '#991b1b',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          Registration Closed
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                        <span>📅</span>
                        <span>{eventDate.toLocaleDateString()} at {event.time}</span>
                      </div>
                      {event.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                          <span>📍</span>
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                        <span>👥</span>
                        <span>{event.participants.length}/{event.maxParticipants} participants</span>
                      </div>
                      {event.registrationDeadline && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                          <span>⏰</span>
                          <span>Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p style={{ color: '#64748b', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                        {event.description}
                      </p>
                    )}

                    {/* Participants Progress Bar */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: '#e2e8f0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${(event.participants.length / event.maxParticipants) * 100}%`, 
                          height: '100%', 
                          backgroundColor: isFull ? '#ef4444' : '#10b981',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {event.participants && event.participants.length > 0 && (
                      <button
                        onClick={() => handleAssignTask(event)}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                        title="Assign Task"
                      >
                        📋
                      </button>
                    )}
                    <button
                      onClick={() => handleEditEvent(event)}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Admin Info */}
                <div style={{ 
                  borderTop: '1px solid #e2e8f0', 
                  paddingTop: '1rem', 
                  fontSize: '0.875rem', 
                  color: '#64748b' 
                }}>
                  Created by {event.createdBy} on {new Date(event.createdAt).toLocaleDateString()}
                  {event.targetEmployees && event.targetEmployees !== 'all' && (
                    <span> • Sent to {event.targetEmployees.length} selected employees</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Assignment Modal */}
      {showTaskAssignment && selectedEventForTask && (
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem', fontWeight: 700 }}>
                Assign Task for: {selectedEventForTask.name}
              </h2>
              <button
                onClick={() => setShowTaskAssignment(false)}
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

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input"
                  value={taskData.description}
                  onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Priority</label>
                  <select
                    className="form-input"
                    value={taskData.priority}
                    onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={taskData.dueDate}
                    onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Assign to Event Participants ({taskData.assignedTo.length} selected)
                </label>
                <div style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  {employees.filter(emp => selectedEventForTask.participants.includes(emp.id)).map((employee) => (
                    <div key={employee.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      background: taskData.assignedTo.includes(employee.id) ? '#eff6ff' : 'transparent'
                    }}>
                      <input
                        type="checkbox"
                        checked={taskData.assignedTo.includes(employee.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTaskData({
                              ...taskData,
                              assignedTo: [...taskData.assignedTo, employee.id]
                            });
                          } else {
                            setTaskData({
                              ...taskData,
                              assignedTo: taskData.assignedTo.filter(id => id !== employee.id)
                            });
                          }
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 500 }}>{employee.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {employee.position}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                onClick={() => setShowTaskAssignment(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventModule;