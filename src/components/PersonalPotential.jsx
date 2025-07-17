import React, { useState, useEffect } from 'react';
import { getSkillLevel, getOverallRank, getRankColor, calculateAverageSkillScore } from '../utils/skillCalculations';
import { useCurrentEmployee } from '../hooks/useRealtimeData';

const PersonalPotential = ({ user, employees }) => {
  const { employee: currentEmployee, loading: employeeLoading } = useCurrentEmployee(user?.email);
  
  // Use current employee skills if available, otherwise use default
  const skills = currentEmployee?.skills || [
    { name: 'ทดสอบ Munsell', score: 80 },
    { name: 'การต่อเทปร้อยเทป', score: 65 },
    { name: 'การเตรียมสีและสารเคมี', score: 72 },
    { name: 'การอ่านใบย้อม', score: 88 },
    { name: 'การตรวจคุณภาพงานย้อม', score: 92 },
    { name: 'การตรวจเช็คเครื่องจักร', score: 58 },
    { name: 'ทักษะการดูสี / เติมสี / ปรับสี', score: 85 }
  ];

  const [performanceHistory, setPerformanceHistory] = useState([
    { month: 'Jan 2024', totalScore: 540, rank: 'A' },
    { month: 'Dec 2023', totalScore: 520, rank: 'A' },
    { month: 'Nov 2023', totalScore: 495, rank: 'A' },
    { month: 'Oct 2023', totalScore: 480, rank: 'B' },
    { month: 'Sep 2023', totalScore: 465, rank: 'B' }
  ]);

  const [goals, setGoals] = useState([
    { id: 1, skill: 'การต่อเทปร้อยเทป', currentScore: 65, targetScore: 75, deadline: '2024-03-01' },
    { id: 2, skill: 'การตรวจเช็คเครื่องจักร', currentScore: 58, targetScore: 70, deadline: '2024-02-15' }
  ]);

  // Calculate current stats
  const totalScore = skills.reduce((sum, skill) => sum + skill.score, 0);
  const averageScore = calculateAverageSkillScore(skills);
  const overallRank = getOverallRank(totalScore);

  const getSkillLevelColor = (level) => {
    if (level >= 9) return '#10b981'; // Green
    if (level >= 7) return '#3b82f6'; // Blue
    if (level >= 5) return '#f59e0b'; // Yellow
    if (level >= 3) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getProgressColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 55) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  if (employeeLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your potential data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Personal Potential</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Track your skills and professional development
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          background: getRankColor(overallRank),
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '1rem',
          fontWeight: 700,
          fontSize: '1.25rem'
        }}>
          <span>🏆</span>
          <span>Rank {overallRank}</span>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Score</h3>
            <div className="card-icon blue">📊</div>
          </div>
          <div className="card-value">{totalScore}</div>
          <div className="card-description">Out of 700 maximum points</div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e2e8f0', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${(totalScore / 700) * 100}%`, 
                height: '100%', 
                backgroundColor: getRankColor(overallRank),
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Average Score</h3>
            <div className="card-icon green">📈</div>
          </div>
          <div className="card-value">{averageScore}%</div>
          <div className="card-description">Average across all skills</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Skills Mastered</h3>
            <div className="card-icon yellow">⭐</div>
          </div>
          <div className="card-value">{skills.filter(skill => skill.score >= 85).length}</div>
          <div className="card-description">Skills with score ≥ 85</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Improvement Goals</h3>
            <div className="card-icon red">🎯</div>
          </div>
          <div className="card-value">{goals.length}</div>
          <div className="card-description">Active improvement targets</div>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Skill Breakdown</h3>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Real-time skill scores from your profile
          </div>
        </div>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {skills.map((skill, index) => {
            const level = getSkillLevel(skill.score);
            const levelColor = getSkillLevelColor(level);
            const progressColor = getProgressColor(skill.score);

            return (
              <div key={index} style={{ 
                padding: '1.5rem',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: 600 }}>
                      {skill.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                      <span style={{
                        background: levelColor,
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}>
                        Lv.{level}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Score: {skill.score}/100
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: 700, 
                    color: progressColor 
                  }}>
                    {skill.score}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ 
                  width: '100%', 
                  height: '12px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${skill.score}%`, 
                    height: '100%', 
                    background: `linear-gradient(90deg, ${progressColor}, ${progressColor}dd)`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>

                {/* Level Indicators */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>Lv.1</span>
                  <span>Lv.5</span>
                  <span>Lv.10</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance History */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Performance History</h3>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {performanceHistory.map((record, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem',
              background: index === 0 ? '#eff6ff' : '#f8fafc',
              borderRadius: '0.5rem',
              border: `1px solid ${index === 0 ? '#3b82f6' : '#e2e8f0'}`
            }}>
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{record.month}</div>
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Score: {record.totalScore}</div>
              </div>
              <div style={{
                background: getRankColor(record.rank),
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: 600
              }}>
                Rank {record.rank}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Goals */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Improvement Goals</h3>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {goals.map((goal) => {
            const currentSkill = skills.find(skill => skill.name === goal.skill);
            const currentScore = currentSkill ? currentSkill.score : goal.currentScore;
            const progress = ((currentScore / goal.targetScore) * 100);
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <div key={goal.id} style={{ 
                padding: '1.5rem',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1rem', fontWeight: 600 }}>
                      {goal.skill}
                    </h4>
                    <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      Target: {goal.targetScore} points by {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>
                      {currentScore} / {goal.targetScore}
                    </div>
                    <div style={{ 
                      color: daysLeft > 7 ? '#10b981' : daysLeft > 0 ? '#f59e0b' : '#ef4444',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${Math.min(progress, 100)}%`, 
                    height: '100%', 
                    backgroundColor: progress >= 100 ? '#10b981' : '#3b82f6',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonalPotential;