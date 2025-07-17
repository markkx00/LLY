// Firebase service for real-time data operations
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Collections
const EMPLOYEES_COLLECTION = 'employees';
const EVENTS_COLLECTION = 'events';
const TASKS_COLLECTION = 'tasks';
const USER_PROFILES_COLLECTION = 'userProfiles';

// Employee operations
export const employeeService = {
  // Get all employees with real-time updates
  subscribeToEmployees: (callback, userEmail = null) => {
    const employeesRef = collection(db, EMPLOYEES_COLLECTION);
    
    // For admin users, get all employees
    // For regular users, only get their own data
    let q;
    if (userEmail === 'admin@company.com') {
      // Admin gets all employees
      q = query(employeesRef, orderBy('name', 'asc'));
    } else if (userEmail) {
      // Regular user gets only their own data
      q = query(employeesRef, where('email', '==', userEmail));
    } else {
      // Fallback: try to get all (will fail for non-admin due to security rules)
      q = query(employeesRef, orderBy('name', 'asc'));
    }
    
    return onSnapshot(q, (snapshot) => {
      const employees = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`Loaded ${employees.length} employees for user: ${userEmail || 'unknown'}`);
      callback(employees);
    }, (error) => {
      console.error('Error subscribing to employees:', error);
      console.error('User email:', userEmail);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // If it's a permission error and user is not admin, try to get only their own data
      if (error.code === 'permission-denied' && userEmail && userEmail !== 'admin@company.com') {
        console.log('Permission denied, trying to get user-specific data...');
        const userSpecificQuery = query(employeesRef, where('email', '==', userEmail));
        return onSnapshot(userSpecificQuery, (snapshot) => {
          const employees = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log(`Loaded ${employees.length} employees for specific user: ${userEmail}`);
          callback(employees);
        }, (fallbackError) => {
          console.error('Fallback query also failed:', fallbackError);
          callback([]);
        });
      }
      
      callback([]);
    });
  },

  // Get single employee
  getEmployee: async (employeeId) => {
    try {
      const docRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting employee:', error);
      throw error;
    }
  },

  // Subscribe to single employee
  subscribeToEmployee: (employeeId, callback) => {
    const docRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error subscribing to employee:', error);
      callback(null);
    });
  },

  // Create or update employee
  saveEmployee: async (employeeData) => {
    try {
      const employeeRef = employeeData.id 
        ? doc(db, EMPLOYEES_COLLECTION, employeeData.id)
        : doc(collection(db, EMPLOYEES_COLLECTION));
      
      const dataToSave = {
        ...employeeData,
        updatedAt: serverTimestamp(),
        ...(employeeData.id ? {} : { createdAt: serverTimestamp() })
      };
      
      await setDoc(employeeRef, dataToSave, { merge: true });
      return employeeRef.id;
    } catch (error) {
      console.error('Error saving employee:', error);
      throw error;
    }
  },

  // Update employee skills
  updateEmployeeSkills: async (employeeId, skills) => {
    try {
      const employeeRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
      await updateDoc(employeeRef, {
        skills,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating employee skills:', error);
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (employeeId) => {
    try {
      await deleteDoc(doc(db, EMPLOYEES_COLLECTION, employeeId));
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  // Bulk import employees
  bulkImportEmployees: async (employees) => {
    try {
      const promises = employees.map(employee => 
        employeeService.saveEmployee(employee)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Error bulk importing employees:', error);
      throw error;
    }
  }
};

// Events operations
export const eventService = {
  // Subscribe to events
  subscribeToEvents: (callback) => {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, orderBy('date', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(events);
    }, (error) => {
      console.error('Error subscribing to events:', error);
      callback([]);
    });
  },

  // Create event
  createEvent: async (eventData) => {
    try {
      const eventRef = doc(collection(db, EVENTS_COLLECTION));
      const dataToSave = {
        ...eventData,
        participants: eventData.participants || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(eventRef, dataToSave);
      return eventRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Join event
  joinEvent: async (eventId, userId) => {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        const participants = eventData.participants || [];
        
        if (!participants.includes(userId)) {
          participants.push(userId);
          await updateDoc(eventRef, {
            participants,
            updatedAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error joining event:', error);
      throw error;
    }
  },

  // Leave event
  leaveEvent: async (eventId, userId) => {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        const participants = (eventData.participants || []).filter(id => id !== userId);
        
        await updateDoc(eventRef, {
          participants,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error leaving event:', error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};

// Tasks operations
export const taskService = {
  // Subscribe to tasks
  subscribeToTasks: (callback, userEmail = null) => {
    const tasksRef = collection(db, TASKS_COLLECTION);
    
    // For admin users, get all tasks
    // For regular users, get tasks assigned to them
    let q;
    if (userEmail === 'admin@company.com') {
      // Admin gets all tasks
      q = query(tasksRef, orderBy('createdAt', 'desc'));
    } else if (userEmail) {
      // Regular user gets tasks assigned to them
      // This is a simplified query - in production you'd need more complex filtering
      q = query(tasksRef, orderBy('createdAt', 'desc'));
    } else {
      // Fallback: get all tasks
      q = query(tasksRef, orderBy('createdAt', 'desc'));
    }
    
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`Loaded ${tasks.length} tasks for user: ${userEmail || 'unknown'}`);
      callback(tasks);
    }, (error) => {
      console.error('Error subscribing to tasks:', error);
      callback([]);
    });
  },

  // Create task
  createTask: async (taskData) => {
    try {
      const taskRef = doc(collection(db, TASKS_COLLECTION));
      const dataToSave = {
        ...taskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(taskRef, dataToSave);
      return taskRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

// Task History operations
export const taskHistoryService = {
  // Subscribe to task history
  subscribeToTaskHistory: (callback) => {
    const historyRef = collection(db, 'taskHistory');
    const q = query(historyRef, orderBy('completedDate', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(history);
    }, (error) => {
      console.error('Error subscribing to task history:', error);
      callback([]);
    });
  },

  // Create history entry
  createHistoryEntry: async (entryData) => {
    try {
      const historyRef = doc(collection(db, 'taskHistory'));
      const dataToSave = {
        ...entryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(historyRef, dataToSave);
      return historyRef.id;
    } catch (error) {
      console.error('Error creating history entry:', error);
      throw error;
    }
  },

  // Update history entry
  updateHistoryEntry: async (entryId, entryData) => {
    try {
      const historyRef = doc(db, 'taskHistory', entryId);
      await updateDoc(historyRef, {
        ...entryData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating history entry:', error);
      throw error;
    }
  },

  // Delete history entry
  deleteHistoryEntry: async (entryId) => {
    try {
      await deleteDoc(doc(db, 'taskHistory', entryId));
    } catch (error) {
      console.error('Error deleting history entry:', error);
      throw error;
    }
  }
};

// User profile operations
export const userProfileService = {
  // Get user profile by email
  getUserProfile: async (email) => {
    try {
      const profilesRef = collection(db, USER_PROFILES_COLLECTION);
      const q = query(profilesRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Subscribe to user profile
  subscribeToUserProfile: (email, callback) => {
    const profilesRef = collection(db, USER_PROFILES_COLLECTION);
    const q = query(profilesRef, where('email', '==', email));
    
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error subscribing to user profile:', error);
      callback(null);
    });
  },

  // Create or update user profile
  saveUserProfile: async (profileData) => {
    try {
      const profileRef = profileData.id 
        ? doc(db, USER_PROFILES_COLLECTION, profileData.id)
        : doc(collection(db, USER_PROFILES_COLLECTION));
      
      const dataToSave = {
        ...profileData,
        updatedAt: serverTimestamp(),
        ...(profileData.id ? {} : { createdAt: serverTimestamp() })
      };
      
      await setDoc(profileRef, dataToSave, { merge: true });
      return profileRef.id;
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }
};

// Initialize default data if collections are empty
export const initializeDefaultData = async () => {
  try {
    // Check if employees collection is empty
    const employeesSnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION));
    
    if (employeesSnapshot.empty) {
      console.log('Initializing default employee data...');
      
      const defaultEmployees = [
        {
          name: 'Admin User',
          email: 'admin@company.com',
          position: 'System Administrator',
          department: 'IT',
          employeeId: 'EMP000',
          phone: '+1 (555) 000-0000',
          startDate: '2023-01-01',
          manager: 'CEO',
          attendanceRate: 100,
          tasksCompleted: 50,
          skills: [
            { name: 'ทดสอบ Munsell', score: 95 },
            { name: 'การต่อเทปร้อยเทป', score: 90 },
            { name: 'การเตรียมสีและสารเคมี', score: 92 },
            { name: 'การอ่านใบย้อม', score: 98 },
            { name: 'การตรวจคุณภาพงานย้อม', score: 96 },
            { name: 'การตรวจเช็คเครื่องจักร', score: 88 },
            { name: 'ทักษะการดูสี / เติมสี / ปรับสี', score: 94 }
          ],
          eventsJoined: 25,
          status: 'active',
          role: 'admin',
          rewards: 'System Administrator, Full Access'
        },
        {
          name: 'John Doe',
          email: 'john.doe@company.com',
          position: 'Software Developer',
          department: 'Engineering',
          employeeId: 'EMP001',
          phone: '+1 (555) 123-4567',
          startDate: '2023-01-15',
          manager: 'Jane Smith',
          attendanceRate: 95,
          tasksCompleted: 24,
          skills: [
            { name: 'ทดสอบ Munsell', score: 85 },
            { name: 'การต่อเทปร้อยเทป', score: 72 },
            { name: 'การเตรียมสีและสารเคมี', score: 68 },
            { name: 'การอ่านใบย้อม', score: 90 },
            { name: 'การตรวจคุณภาพงานย้อม', score: 88 },
            { name: 'การตรวจเช็คเครื่องจักร', score: 75 },
            { name: 'ทักษะการดูสี / เติมสี / ปรับสี', score: 82 }
          ],
          eventsJoined: 12,
          status: 'active',
          role: 'employee',
          rewards: 'Employee of the Month, Perfect Attendance'
        },
        {
          name: 'Sarah Wilson',
          email: 'sarah.wilson@company.com',
          position: 'UI/UX Designer',
          department: 'Design',
          employeeId: 'EMP002',
          phone: '+1 (555) 234-5678',
          startDate: '2023-03-20',
          manager: 'Mike Johnson',
          attendanceRate: 98,
          tasksCompleted: 18,
          skills: [
            { name: 'ทดสอบ Munsell', score: 92 },
            { name: 'การต่อเทปร้อยเทป', score: 88 },
            { name: 'การเตรียมสีและสารเคมี', score: 85 },
            { name: 'การอ่านใบย้อม', score: 95 },
            { name: 'การตรวจคุณภาพงานย้อม', score: 90 },
            { name: 'การตรวจเช็คเครื่องจักร', score: 78 },
            { name: 'ทักษะการดูสี / เติมสี / ปรับสี', score: 87 }
          ],
          eventsJoined: 15,
          status: 'active',
          role: 'employee',
          rewards: 'Team Leader Award, Innovation Prize'
        }
      ];

      await Promise.all(defaultEmployees.map(emp => employeeService.saveEmployee(emp)));
      console.log('Default employee data initialized');
    }

    // Check if user profiles collection is empty and create admin profile
    const userProfilesSnapshot = await getDocs(collection(db, USER_PROFILES_COLLECTION));
    
    if (userProfilesSnapshot.empty) {
      console.log('Initializing default user profiles...');
      
      const defaultProfiles = [
        {
          email: 'admin@company.com',
          role: 'admin',
          name: 'Admin User',
          createdAt: serverTimestamp()
        },
        {
          email: 'john.doe@company.com',
          role: 'employee',
          name: 'John Doe',
          createdAt: serverTimestamp()
        },
        {
          email: 'sarah.wilson@company.com',
          role: 'employee',
          name: 'Sarah Wilson',
          createdAt: serverTimestamp()
        }
      ];

      await Promise.all(defaultProfiles.map(profile => userProfileService.saveUserProfile(profile)));
      console.log('Default user profiles initialized');
    }

    // Check if events collection is empty
    const eventsSnapshot = await getDocs(collection(db, EVENTS_COLLECTION));
    
    if (eventsSnapshot.empty) {
      console.log('Initializing default event data...');
      
      const defaultEvents = [
        {
          name: 'Company Annual Meeting',
          date: '2024-02-15',
          time: '09:00',
          description: 'Annual company meeting to discuss goals and achievements',
          location: 'Main Conference Room',
          participants: [],
          maxParticipants: 50,
          status: 'upcoming',
          createdBy: 'admin@company.com',
          registrationDeadline: '2024-02-10',
          targetEmployees: 'all'
        },
        {
          name: 'Team Building Workshop',
          date: '2024-02-20',
          time: '14:00',
          description: 'Interactive workshop to improve team collaboration and communication',
          location: 'Training Room B',
          participants: [],
          maxParticipants: 20,
          status: 'upcoming',
          createdBy: 'admin@company.com',
          registrationDeadline: '2024-02-18',
          targetEmployees: 'all'
        }
      ];

      await Promise.all(defaultEvents.map(event => eventService.createEvent(event)));
      console.log('Default event data initialized');
    }

  } catch (error) {
    console.error('Error initializing default data:', error);
  }
};