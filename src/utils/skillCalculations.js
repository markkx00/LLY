// Skill level calculation (0-100 score to Lv.1-10)
export const getSkillLevel = (score) => {
  if (score < 0) return 1;
  if (score >= 90) return 10;
  return Math.floor(score / 10) + 1;
};

// Overall rank calculation based on total score (max 700)
export const getOverallRank = (totalScore) => {
  if (totalScore >= 595) return 'S';
  if (totalScore >= 490) return 'A';
  if (totalScore >= 385) return 'B';
  if (totalScore >= 280) return 'C';
  if (totalScore >= 175) return 'D';
  if (totalScore >= 70) return 'E';
  return 'E-';
};

// Get rank color for display
export const getRankColor = (rank) => {
  switch (rank) {
    case 'S': return '#ffd700'; // Gold
    case 'A': return '#c0c0c0'; // Silver
    case 'B': return '#cd7f32'; // Bronze
    case 'C': return '#3b82f6'; // Blue
    case 'D': return '#10b981'; // Green
    case 'E': return '#f59e0b'; // Yellow
    case 'E-': return '#ef4444'; // Red
    default: return '#6b7280'; // Gray
  }
};

// Calculate average skill score
export const calculateAverageSkillScore = (skills) => {
  if (!skills || skills.length === 0) return 0;
  const totalScore = skills.reduce((sum, skill) => sum + skill.score, 0);
  return Math.round(totalScore / skills.length);
};

// Get rank based on average skill score (for percentage-based ranking)
export const getRankByAverage = (averageScore) => {
  if (averageScore >= 85) return 'S';
  if (averageScore >= 70) return 'A';
  if (averageScore >= 55) return 'B';
  if (averageScore >= 40) return 'C';
  if (averageScore >= 25) return 'D';
  if (averageScore >= 10) return 'E';
  return 'E-';
};