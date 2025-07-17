import React, { useState, useEffect } from 'react';

const ActivityModule = ({ 
  user, 
  isAdmin, 
  events, 
  eventsLoading, 
  onCreateEvent, 
  onJoinEvent, 
  onLeaveEvent 
}) => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    description: '',
    location: '',
    maxParticipants: 50
  });
  const [filter, setFilter] = useState('upcoming');
  const [notifications, setNotifications] = useState([]);
  const [saving, setSaving] = useState(false);

  // Get current user's participation stats
  const getUserParticipationStats = () => {
    if (!events || !user) return { totalEvents: 0, upcomingEvents: 0, completedEvents: 0 };
    
    const userEvents = events.filter(event => 
      event.participants && event.participants.includes(user.uid || user.email)
    );
    return {
      totalEvents: userEvents.length,
      upcomingEvents: userEvents.filter(event => event.status === 'upcoming').length,
      completedEvents: userEvents.filter(event => event.status === 'completed').length
    };
  };

  const handleCreateEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const event = {
        ...newEvent,
        participants: [],
        status: 'upcoming',
        createdBy: user?.email || 'admin@company.com',
        createdAt: new Date().toISOString().split('T')[0]
      };

      await onCreateEvent(event);
      
      setNewEvent({
        name: '',
        date: '',
        time: '',
        description: '',
        location: '',
        maxParticipants: 50
      });
      setShowCreateEvent(false);

      // Add notification
      const notification = {
        id: Date.now(),
        message: `New event created: ${event.name} on ${event.date}`,
        type: 'event',
        timestamp: new Date().toISOString()
      };
      setNotifications([notification, ...notifications]);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    setSaving(true);
    try {
      await onJoinEvent(eventId, user.uid || user.email);
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Error joining event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLeaveEvent = async (eventId) => {
    setSaving(true);
    try {
      await onLeaveEvent(eventId, user.uid || user.email);
    } catch (error) {
      console.error('Error leaving event:', error);
      alert('Error leaving event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredEvents = events?.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  }) || [];

  const upcomingEvents = events?.filter(event => event.status === 'upcoming') || [];
  const userStats = getUserParticipationStats();

  if (eventsLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Activity Center</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Company events and participation tracking
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateEvent(true)}
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
            <span>📅</span> {saving ? 'Processing...' : 'Create Event'}
          </button>
        )}
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
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Participation Stats */}
      {!isAdmin && (
        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Total Events Joined</h3>
              <div className="card-icon blue">🎯</div>
            </div>
            <div className="card-value">{userStats.totalEvents}</div>
            <div className="card-description">Your participation history</div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Upcoming Events</h3>
              <div className="card-icon green">📅</div>
            </div>
            <div className="card-value">{userStats.upcomingEvents}</div>
            <div className="card-description">Events you've joined</div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Completed Events</h3>
              <div className="card-icon yellow">✅</div>
            </div>
            <div className="card-value">{userStats.completedEvents}</div>
            <div className="card-description">Events you've attended</div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Available Events</h3>
              <div className="card-icon red">🔔</div>
            </div>
            <div className="card-value">{upcomingEvents.length}</div>
            <div className="card-description">Events you can join</div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEvent && isAdmin && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Create New Event</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="form-label">Event Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  placeholder="Enter event name"
                />
              </div>
              
              <div>
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Time *</label>
                <input
                  type="time"
                  className="form-input"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Enter event location"
                />
              </div>

              <div>
                <label className="form-label">Max Participants</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={newEvent.maxParticipants}
                  onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              onClick={() => setShowCreateEvent(false)}
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
              onClick={handleCreateEvent}
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
              {saving ? 'Creating...' : 'Create Event'}
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
            const userId = user?.uid || user?.email;
            const isParticipating = event.participants && event.participants.includes(userId);
            const isFull = event.participants && event.participants.length >= event.maxParticipants;
            const eventDate = new Date(event.date);
            const isUpcoming = event.status === 'upcoming';

            return (
              <div key={event.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 600 }}>
                        {event.name}
                      </h3>
                      <span style={{
                        background: event.status === 'upcoming' ? '#dbeafe' : '#d1fae5',
                        color: event.status === 'upcoming' ? '#1e40af' : '#065f46',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}>
                        {event.status}
                      </span>
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
                        <span>{event.participants?.length || 0}/{event.maxParticipants} participants</span>
                      </div>
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
                          width: `${((event.participants?.length || 0) / event.maxParticipants) * 100}%`, 
                          height: '100%', 
                          backgroundColor: isFull ? '#ef4444' : '#10b981',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!isAdmin && isUpcoming && (
                    <div style={{ marginLeft: '1rem' }}>
                      {isParticipating ? (
                        <button
                          onClick={() => handleLeaveEvent(event.id)}
                          disabled={saving}
                          style={{
                            background: saving ? '#9ca3af' : '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontWeight: 500,
                            fontSize: '0.875rem'
                          }}
                        >
                          {saving ? 'Processing...' : 'Leave Event'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinEvent(event.id)}
                          disabled={isFull || saving}
                          style={{
                            background: (isFull || saving) ? '#9ca3af' : '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: (isFull || saving) ? 'not-allowed' : 'pointer',
                            fontWeight: 500,
                            fontSize: '0.875rem'
                          }}
                        >
                          {saving ? 'Processing...' : (isFull ? 'Event Full' : 'Join Event')}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Admin Info */}
                {isAdmin && (
                  <div style={{ 
                    borderTop: '1px solid #e2e8f0', 
                    paddingTop: '1rem', 
                    fontSize: '0.875rem', 
                    color: '#64748b' 
                  }}>
                    Created by {event.createdBy} on {new Date(event.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityModule;