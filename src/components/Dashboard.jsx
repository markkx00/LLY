import React, { useState, useEffect } from 'react';
import { getSkillLevel, getOverallRank, getRankColor, calculateAverageSkillScore } from '../utils/skillCalculations';
import { useCurrentEmployee } from '../hooks/useRealtimeData';

const Dashboard = ({ user, employees, events }) => {
  const { employee: currentEmployee, loading: employeeLoading } = useCurrentEmployee(user?.email);
  
  const [stats, setStats] = useState({
    totalTasks: 12,
    completedTasks: 8,
    pendingTasks: 3,
    inProgressTasks: 1,
    activityRate: 95,
    hoursWorked: 42,
    projectsActive: 3,
    eventsJoined: 8
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'task',
      message: 'Completed project proposal review',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'attendance',
      message: 'Joined Team Building Workshop',
      time: '8:30 AM',
      status: 'joined'
    },
    {
      id: 3,
      type: 'task',
      message: 'Started working on quarterly report',
      time: 'Yesterday',
      status: 'in-progress'
    },
    {
      id: 4,
      type: 'skill',
      message: 'Received positive feedback from manager',
      time: '2 days ago',
      status: 'positive'
    }
  ]);

  // Use current employee data if available, otherwise use default skills
  const userSkills = currentEmployee?.skills || [
    { name: 'ทดสอบ Munsell', score: 80 },
    { name: 'การต่อเทปร้อยเทป', score: 65 },
    { name: 'การเตรียมสีและสารเคมี', score: 72 },
    { name: 'การอ่านใบย้อม', score: 88 },
    { name: 'การตรวจคุณภาพงานย้อม', score: 92 },
    { name: 'การตรวจเช็คเครื่องจักร', score: 58 },
    { name: 'ทักษะการดูสี / เติมสี / ปรับสี', score: 85 }
  ];

  useEffect(() => {
    // Update stats when current employee data changes
    if (currentEmployee) {
      setStats(prevStats => ({
        ...prevStats,
        eventsJoined: currentEmployee.eventsJoined || 0,
        totalTasks: currentEmployee.tasksCompleted || 0
      }));
    }
  }, [currentEmployee]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Calculate user's rank and stats
  const totalScore = userSkills.reduce((sum, skill) => sum + skill.score, 0);
  const averageScore = calculateAverageSkillScore(userSkills);
  const userRank = getOverallRank(totalScore);
  const upcomingEvents = events?.filter(event => event.status === 'upcoming').length || 0;

  if (employeeLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            {getGreeting()}, {currentEmployee?.name || user?.email?.split('@')[0] || 'Employee'}!
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Here's your dashboard overview for today
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          background: getRankColor(userRank),
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '1rem',
          fontWeight: 700
        }}>
          <span>🏆</span>
          <span>Rank {userRank}</span>
        </div>
      </div>

      {/* Skills Overview */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Your Skills Overview</h3>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Total Score: {totalScore}/700 • Average: {averageScore}%
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {userSkills.slice(0, 4).map((skill, index) => {
            const level = getSkillLevel(skill.score);
            return (
              <div key={index} style={{ 
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>
                    {skill.name}
                  </div>
                  <span style={{
                    background: getRankColor(getOverallRank(skill.score * 7)),
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    Lv.{level}
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '6px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${skill.score}%`, 
                    height: '100%', 
                    backgroundColor: getRankColor(getOverallRank(skill.score * 7)),
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Task Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Task Overview</h3>
            <div className="card-icon blue">📋</div>
          </div>
          <div className="card-value">{stats.totalTasks}</div>
          <div className="card-description">Total tasks assigned</div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <div>
              <div style={{ color: '#10b981', fontWeight: 600 }}>{stats.completedTasks}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Completed</div>
            </div>
            <div>
              <div style={{ color: '#f59e0b', fontWeight: 600 }}>{stats.pendingTasks}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pending</div>
            </div>
            <div>
              <div style={{ color: '#3b82f6', fontWeight: 600 }}>{stats.inProgressTasks}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>In Progress</div>
            </div>
          </div>
        </div>

        {/* Activity Participation */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Events Joined</h3>
            <div className="card-icon green">✅</div>
          </div>
          <div className="card-value">{stats.eventsJoined}</div>
          <div className="card-description">Company activities participated</div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              {upcomingEvents} upcoming events available
            </div>
          </div>
        </div>

        {/* Skill Score */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Skill Average</h3>
            <div className="card-icon yellow">📊</div>
          </div>
          <div className="card-value">{averageScore}%</div>
          <div className="card-description">Average skill score</div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e2e8f0', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${averageScore}%`, 
                height: '100%', 
                backgroundColor: getRankColor(userRank),
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>

        {/* Hours Worked */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Hours This Week</h3>
            <div className="card-icon red">⏰</div>
          </div>
          <div className="card-value">{stats.hoursWorked}h</div>
          <div className="card-description">Total hours worked this week</div>
          <div style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
            Target: 40h • {stats.hoursWorked > 40 ? '+' : ''}{stats.hoursWorked - 40}h {stats.hoursWorked > 40 ? 'overtime' : 'remaining'}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Recent Activity</h3>
        </div>
        <div className="task-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="task-item">
              <div className="task-content">
                <div className="task-title">{activity.message}</div>
                <div className="task-description">{activity.time}</div>
              </div>
              <span className={`task-status ${activity.status}`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;