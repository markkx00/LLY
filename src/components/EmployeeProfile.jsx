import React, { useState, useEffect } from 'react';

const EmployeeProfile = ({ user }) => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    position: 'Software Developer',
    department: 'Engineering',
    employeeId: 'EMP001',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    startDate: '2023-01-15',
    manager: 'Jane Smith',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    rewards: 'Employee of the Month, Perfect Attendance Award, Innovation Prize'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setEditedProfile(profile);
    
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [profile]);

  const handleSave = async () => {
    try {
      // In a real app, you would save to Firebase here
      console.log('Saving profile:', editedProfile);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(editedProfile);
      setIsEditing(false);
      
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        <h1 className="dashboard-title" style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
          Employee Profile
        </h1>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          marginTop: isMobile ? '1rem' : '0'
        }}>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                touchAction: 'manipulation'
              }}
            >
              Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={handleSave}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  touchAction: 'manipulation'
                }}
              >
                Save Changes
              </button>
              <button 
                onClick={handleCancel}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  touchAction: 'manipulation'
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid" style={{
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: isMobile ? '1rem' : '2rem',
        padding: isMobile ? '0 1rem' : '0'
      }}>
        {/* Basic Information */}
        <div className="card" style={{ padding: isMobile ? '1.5rem' : '2rem' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
              Basic Information
            </h3>
          </div>
          <div style={{ display: 'grid', gap: isMobile ? '0.75rem' : '1rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedProfile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{ fontSize: isMobile ? '16px' : '1rem' }}
                />
              ) : (
                <div style={{ 
                  padding: isMobile ? '0.5rem' : '0.75rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {profile.name}
                </div>
              )}
            </div>
            
            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Position
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedProfile.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  style={{ fontSize: isMobile ? '16px' : '1rem' }}
                />
              ) : (
                <div style={{ 
                  padding: isMobile ? '0.5rem' : '0.75rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {profile.position}
                </div>
              )}
            </div>

            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedProfile.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  style={{ fontSize: isMobile ? '16px' : '1rem' }}
                />
              ) : (
                <div style={{ 
                  padding: isMobile ? '0.5rem' : '0.75rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {profile.department}
                </div>
              )}
            </div>

            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Employee ID
              </label>
              <div style={{ 
                padding: isMobile ? '0.5rem' : '0.75rem', 
                backgroundColor: '#f8fafc', 
                borderRadius: '0.5rem', 
                color: '#64748b',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>
                {profile.employeeId}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card" style={{ padding: isMobile ? '1.5rem' : '2rem' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
              Contact Information
            </h3>
          </div>
          <div style={{ display: 'grid', gap: isMobile ? '0.75rem' : '1rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Email
              </label>
              <div style={{ 
                padding: isMobile ? '0.5rem' : '0.75rem', 
                backgroundColor: '#f8fafc', 
                borderRadius: '0.5rem', 
                color: '#64748b',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>
                {user?.email}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  className="form-input"
                  value={editedProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{ fontSize: isMobile ? '16px' : '1rem' }}
                />
              ) : (
                <div style={{ 
                  padding: isMobile ? '0.5rem' : '0.75rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {profile.phone}
                </div>
              )}
            </div>

            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Address
              </label>
              {isEditing ? (
                <textarea
                  className="form-input"
                  value={editedProfile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows="3"
                  style={{ fontSize: isMobile ? '16px' : '1rem' }}
                />
              ) : (
                <div style={{ 
                  padding: isMobile ? '0.5rem' : '0.75rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {profile.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="card" style={{ padding: isMobile ? '1.5rem' : '2rem' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
              Employment Details
            </h3>
          </div>
          <div style={{ display: 'grid', gap: isMobile ? '0.75rem' : '1rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Start Date
              </label>
              <div style={{ 
                padding: isMobile ? '0.5rem' : '0.75rem', 
                backgroundColor: '#f8fafc', 
                borderRadius: '0.5rem',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>
                {new Date(profile.startDate).toLocaleDateString()}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Manager
              </label>
              <div style={{ 
                padding: isMobile ? '0.5rem' : '0.75rem', 
                backgroundColor: '#f8fafc', 
                borderRadius: '0.5rem',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>
                {profile.manager}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Skills
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      background: '#eff6ff',
                      color: '#1e40af',
                      padding: isMobile ? '0.25rem 0.5rem' : '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="card" style={{ padding: isMobile ? '1.5rem' : '2rem' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
              Rewards & Recognition
            </h3>
          </div>
          <div style={{ display: 'grid', gap: isMobile ? '0.75rem' : '1rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                Rewards & Achievements
              </label>
              {isEditing ? (
                <textarea
                  className="form-input"
                  value={editedProfile.rewards}
                  onChange={(e) => handleInputChange('rewards', e.target.value)}
                  placeholder="List your rewards and achievements"
                  rows="4"
                  style={{ fontSize: isMobile ? '16px' : '1rem' }}
                />
              ) : (
                <div style={{ 
                  padding: isMobile ? '0.5rem' : '0.75rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {profile.rewards || 'No rewards recorded yet'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile; 
