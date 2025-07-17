import React, { useState, useEffect } from 'react';
import { useTasks } from './hooks/useRealtimeData';
import AdminTaskCreator from './components/AdminTaskCreator';
import AdminTaskHistory from './components/AdminTaskHistory';

const TaskManager = ({ user, isAdmin: propIsAdmin }) => {
  const { tasks, loading, createTask, updateTask, deleteTask, acceptTask, completeTask } = useTasks();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showTaskHistory, setShowTaskHistory] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Check if user is admin
  const isAdmin = propIsAdmin || user?.email === 'admin@company.com';

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

  // Load employees for admin task creation
  useEffect(() => {
    if (isAdmin) {
      setEmployees([
        { id: '1', name: 'John Doe', email: 'john.doe@company.com', position: 'Developer', department: 'Engineering' },
        { id: '2', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', position: 'Designer', department: 'Design' },
        { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com', position: 'Manager', department: 'Engineering' },
        { id: '4', name: 'Lisa Chen', email: 'lisa.chen@company.com', position: 'Marketer', department: 'Marketing' }
      ]);
    }
  }, [isAdmin]);

  // Filter tasks based on user role and assignment
  const userTasks = React.useMemo(() => {
    if (isAdmin) {
      return tasks; // Admin sees all tasks
    }
    
    // Regular users see tasks assigned to them
    return tasks.filter(task => {
      // Check if task is assigned to all users
      if (task.assignmentType === 'all') return true;
      
      // Check if task is assigned to user's department
      if (task.assignmentType === 'department' && task.targetDepartment) {
        // In a real app, you'd get user's department from their profile
        return task.targetDepartment === 'Engineering'; // Example department
      }
      
      // Check if task is assigned to specific users
      if (task.assignmentType === 'specific' && task.targetUsers) {
        return task.targetUsers.includes(user?.email);
      }
      
      return false;
    });
  }, [tasks, isAdmin, user?.email]);

  // Sort and filter tasks
  const filteredAndSortedTasks = React.useMemo(() => {
    let filtered = userTasks;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(task => task.status === filter);
    }

    // Sort tasks
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        const dateA = new Date(`${a.dueDate} ${a.dueTime || '00:00'}`);
        const dateB = new Date(`${b.dueDate} ${b.dueTime || '00:00'}`);
        return dateA - dateB;
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'status') {
        const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });

    return filtered;
  }, [userTasks, filter, sortBy]);

  const handleCreateTask = async (taskData) => {
    setSaving(true);
    try {
      await createTask(taskData);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Error adding task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAcceptTask = async (taskId) => {
    setSaving(true);
    try {
      await acceptTask(taskId, user?.email);
      // Also update status to in-progress
      await updateTask(taskId, { status: 'in-progress' });
    } catch (error) {
      console.error('Error accepting task:', error);
      alert('Error accepting task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteTask = async (taskId, notes = '') => {
    setSaving(true);
    try {
      await completeTask(taskId, user?.email, { notes });
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Error completing task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setSaving(true);
    try {
      const updateData = { status: newStatus };
      
      if (newStatus === 'in-progress') {
        // Accept task when starting
        await acceptTask(taskId, user?.email);
      } else if (newStatus === 'completed') {
        // Complete task
        await completeTask(taskId, user?.email);
        return; // completeTask already updates the status
      }
      
      await updateTask(taskId, updateData);
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Error updating task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      setSaving(true);
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task. Please try again.');
      } finally {
        setSaving(false);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date} ${time || '00:00'}`);
    return {
      date: dateObj.toLocaleDateString(),
      time: time ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
    };
  };

  const isTaskAssignedToUser = (task) => {
    if (task.assignmentType === 'all') return true;
    if (task.assignmentType === 'specific' && task.targetUsers) {
      return task.targetUsers.includes(user?.email);
    }
    if (task.assignmentType === 'department' && task.targetDepartment) {
      // In a real app, you'd check user's actual department
      return task.targetDepartment === 'Engineering';
    }
    return false;
  };

  const isUserParticipating = (task) => {
    return task.participants && task.participants.includes(user?.email);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ touchAction: 'pan-y' }}>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            {isAdmin ? 'Task Management' : 'My Tasks'}
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            {isAdmin ? 'Create and manage tasks for employees' : 'View and manage your assigned tasks'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {isAdmin && (
            <>
              <button
                onClick={() => setShowTaskHistory(true)}
                disabled={saving}
                style={{
                  background: saving ? '#9ca3af' : '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  padding: isMobile ? '0.875rem 1.25rem' : '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: isMobile ? '1rem' : '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  touchAction: 'manipulation'
                }}
              >
                <span>📊</span> Task History
              </button>
              <button
                onClick={() => setShowAddTask(true)}
                disabled={saving}
                style={{
                  background: saving ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: isMobile ? '0.875rem 1.25rem' : '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: isMobile ? '1rem' : '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  touchAction: 'manipulation'
                }}
              >
                <span>➕</span> {saving ? 'Processing...' : 'Create Task'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Task Statistics */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Tasks</h3>
            <div className="card-icon blue">📋</div>
          </div>
          <div className="card-value">{userTasks.length}</div>
          <div className="card-description">
            {isAdmin ? 'All tasks in system' : 'Tasks assigned to you'}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pending</h3>
            <div className="card-icon yellow">⏳</div>
          </div>
          <div className="card-value">
            {userTasks.filter(task => task.status === 'pending').length}
          </div>
          <div className="card-description">Awaiting action</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">In Progress</h3>
            <div className="card-icon blue">🔄</div>
          </div>
          <div className="card-value">
            {userTasks.filter(task => task.status === 'in-progress').length}
          </div>
          <div className="card-description">Currently working</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Completed</h3>
            <div className="card-icon green">✅</div>
          </div>
          <div className="card-value">
            {userTasks.filter(task => task.status === 'completed').length}
          </div>
          <div className="card-description">Finished tasks</div>
        </div>
      </div>

      {/* Admin Task Creation Component */}
      {showAddTask && isAdmin && (
        <AdminTaskCreator
          user={user}
          employees={employees}
          onCreateTask={handleCreateTask}
          onClose={() => setShowAddTask(false)}
          saving={saving}
        />
      )}

      {/* Admin Task History Component */}
      {showTaskHistory && isAdmin && (
        <AdminTaskHistory
          tasks={tasks}
          employees={employees}
          onClose={() => setShowTaskHistory(false)}
        />
      )}

      {/* Filter and Sort Controls */}
      <div style={{ 
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '1rem',
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 500, color: '#374151', fontSize: isMobile ? '1rem' : '0.875rem' }}>
            Filter:
          </span>
          {['all', 'pending', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                background: filter === status ? '#3b82f6' : '#f3f4f6',
                color: filter === status ? 'white' : '#374151',
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
              {status}
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
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredAndSortedTasks.length === 0 ? (
          <div className="card">
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              <p style={{ fontSize: isMobile ? '1rem' : '0.875rem' }}>
                No tasks found for the selected filter.
              </p>
            </div>
          </div>
        ) : (
          filteredAndSortedTasks.map((task) => {
            const dateTime = formatDateTime(task.dueDate, task.dueTime);
            const isOverdue = new Date(`${task.dueDate} ${task.dueTime || '23:59'}`) < new Date() && task.status !== 'completed';
            const isAssigned = isTaskAssignedToUser(task);
            const isParticipating = isUserParticipating(task);

            return (
              <div key={task.id} className="card" style={{
                border: isOverdue ? '2px solid #ef4444' : '1px solid #e2e8f0',
                background: isOverdue ? '#fef2f2' : 'white',
                touchAction: 'pan-y'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '1rem',
                  alignItems: isMobile ? 'stretch' : 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'flex-start' : 'center', 
                      gap: '1rem', 
                      marginBottom: '0.75rem' 
                    }}>
                      <h3 style={{ 
                        margin: 0, 
                        color: '#1e293b', 
                        fontSize: isMobile ? '1.1rem' : '1rem', 
                        fontWeight: 600,
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                      }}>
                        {task.title}
                      </h3>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          background: getPriorityColor(task.priority),
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: isMobile ? '0.75rem' : '0.625rem',
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}>
                          {task.priority}
                        </span>

                        <span style={{
                          background: getStatusColor(task.status),
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: isMobile ? '0.75rem' : '0.625rem',
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}>
                          {task.status}
                        </span>
                        
                        {isOverdue && (
                          <span style={{
                            background: '#ef4444',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: isMobile ? '0.75rem' : '0.625rem',
                            fontWeight: 500
                          }}>
                            Overdue
                          </span>
                        )}

                        {isParticipating && (
                          <span style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: isMobile ? '0.75rem' : '0.625rem',
                            fontWeight: 500
                          }}>
                            Participating
                          </span>
                        )}
                      </div>
                    </div>

                    <p style={{ 
                      color: '#64748b', 
                      margin: '0 0 1rem 0',
                      fontSize: isMobile ? '0.875rem' : '0.75rem',
                      lineHeight: 1.5
                    }}>
                      {task.description}
                    </p>

                    <div style={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? '0.5rem' : '1rem', 
                      fontSize: isMobile ? '0.875rem' : '0.75rem',
                      color: '#64748b'
                    }}>
                      <span>📅 Due: {dateTime.date}</span>
                      {dateTime.time && <span>🕐 {dateTime.time}</span>}
                      {isAdmin && (
                        <span>👤 By: {task.assignedBy}</span>
                      )}
                      {task.participants && task.participants.length > 0 && (
                        <span>👥 {task.participants.length} participating</span>
                      )}
                      {task.completedAt && (
                        <span style={{ color: '#10b981' }}>
                          ✅ Completed: {new Date(task.completedAt.seconds * 1000).toLocaleDateString()}
                          {task.completedBy && ` by ${task.completedBy}`}
                        </span>
                      )}
                    </div>

                    {/* Assignment Info for Admin */}
                    {isAdmin && (
                      <div style={{ 
                        marginTop: '0.5rem',
                        fontSize: isMobile ? '0.75rem' : '0.625rem',
                        color: '#6b7280',
                        fontStyle: 'italic'
                      }}>
                        Assigned to: {
                          task.assignmentType === 'all' ? 'All users' :
                          task.assignmentType === 'department' ? `${task.targetDepartment} department` :
                          `${task.targetUsers?.length || 0} specific users`
                        }
                      </div>
                    )}
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'row' : 'column',
                    gap: '0.75rem',
                    alignItems: 'stretch',
                    minWidth: isMobile ? 'auto' : '200px'
                  }}>
                    {/* Task Actions for Regular Users */}
                    {!isAdmin && isAssigned && (
                      <>
                        {task.status === 'pending' && !isParticipating && (
                          <button
                            onClick={() => handleAcceptTask(task.id)}
                            disabled={saving}
                            style={{
                              background: saving ? '#9ca3af' : '#10b981',
                              color: 'white',
                              border: 'none',
                              padding: isMobile ? '0.75rem' : '0.5rem',
                              borderRadius: '0.5rem',
                              cursor: saving ? 'not-allowed' : 'pointer',
                              fontSize: isMobile ? '0.875rem' : '0.75rem',
                              fontWeight: 500,
                              touchAction: 'manipulation'
                            }}
                          >
                            {saving ? 'Processing...' : '✅ Accept Task'}
                          </button>
                        )}

                        {(task.status === 'in-progress' || isParticipating) && task.status !== 'completed' && (
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            disabled={saving}
                            style={{
                              background: saving ? '#9ca3af' : '#3b82f6',
                              color: 'white',
                              border: 'none',
                              padding: isMobile ? '0.75rem' : '0.5rem',
                              borderRadius: '0.5rem',
                              cursor: saving ? 'not-allowed' : 'pointer',
                              fontSize: isMobile ? '0.875rem' : '0.75rem',
                              fontWeight: 500,
                              touchAction: 'manipulation'
                            }}
                          >
                            {saving ? 'Processing...' : '🏁 Complete Task'}
                          </button>
                        )}
                      </>
                    )}

                    {/* Admin Actions */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={saving}
                        style={{
                          background: saving ? '#9ca3af' : '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: isMobile ? '0.75rem' : '0.5rem',
                          borderRadius: '0.5rem',
                          cursor: saving ? 'not-allowed' : 'pointer',
                          fontSize: isMobile ? '0.875rem' : '0.75rem',
                          fontWeight: 500,
                          minWidth: isMobile ? '80px' : 'auto',
                          touchAction: 'manipulation'
                        }}
                      >
                        {saving ? '...' : '🗑️ Delete'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskManager;