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

  useEffect(() => {
    setEditedProfile(profile);
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
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Employee Profile</h1>
        <div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
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
              Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleSave}
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
                Save Changes
              </button>
              <button 
                onClick={handleCancel}
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
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Basic Information</h3>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedProfile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {profile.name}
                </div>
              )}
            </div>
            
            <div>
              <label className="form-label">Position</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedProfile.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                />
              ) : (
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {profile.position}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedProfile.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                />
              ) : (
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {profile.department}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Employee ID</label>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', color: '#64748b' }}>
                {profile.employeeId}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Contact Information</h3>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label className="form-label">Email</label>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', color: '#64748b' }}>
                {user?.email}
              </div>
            </div>

            <div>
              <label className="form-label">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  className="form-input"
                  value={editedProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {profile.phone}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Address</label>
              {isEditing ? (
                <textarea
                  className="form-input"
                  value={editedProfile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows="3"
                />
              ) : (
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {profile.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Employment Details</h3>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label className="form-label">Start Date</label>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                {new Date(profile.startDate).toLocaleDateString()}
              </div>
            </div>

            <div>
              <label className="form-label">Manager</label>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                {profile.manager}
              </div>
            </div>

            <div>
              <label className="form-label">Skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      background: '#eff6ff',
                      color: '#1e40af',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
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
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Rewards & Recognition</h3>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label className="form-label">Rewards & Achievements</label>
              {isEditing ? (
                <textarea
                  className="form-input"
                  value={editedProfile.rewards}
                  onChange={(e) => handleInputChange('rewards', e.target.value)}
                  placeholder="List your rewards and achievements"
                  rows="4"
                />
              ) : (
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
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