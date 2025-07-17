// Sample events data
const events = [
  {
    id: 1,
    name: 'Company Annual Meeting',
    date: '2024-02-15',
    time: '09:00',
    description: 'Annual company meeting to discuss goals and achievements',
    location: 'Main Conference Room',
    participants: [1, 2, 3],
    maxParticipants: 50,
    status: 'upcoming',
    createdBy: 'admin@company.com',
    createdAt: '2024-01-10'
  },
  {
    id: 2,
    name: 'Team Building Workshop',
    date: '2024-02-20',
    time: '14:00',
    description: 'Interactive workshop to improve team collaboration and communication',
    location: 'Training Room B',
    participants: [1, 4],
    maxParticipants: 20,
    status: 'upcoming',
    createdBy: 'admin@company.com',
    createdAt: '2024-01-12'
  },
  {
    id: 3,
    name: 'Safety Training Session',
    date: '2024-01-05',
    time: '10:00',
    description: 'Mandatory safety training for all employees',
    location: 'Auditorium',
    participants: [1, 2, 3, 4],
    maxParticipants: 100,
    status: 'completed',
    createdBy: 'admin@company.com',
    createdAt: '2023-12-20'
  },
  {
    id: 4,
    name: 'New Year Celebration',
    date: '2024-01-01',
    time: '18:00',
    description: 'Company New Year celebration party',
    location: 'Main Hall',
    participants: [1, 2, 3, 4],
    maxParticipants: 200,
    status: 'completed',
    createdBy: 'admin@company.com',
    createdAt: '2023-12-15'
  }
];

export default events;