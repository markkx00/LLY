// Custom hooks for real-time data management
import { useState, useEffect, useCallback } from 'react';
import { employeeService, eventService, taskService, userProfileService, taskHistoryService } from '../services/firebaseService';

// Hook for managing employees with real-time updates
export const useEmployees = (userEmail = null) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    console.log('Setting up employee subscription for user:', userEmail);
    
    const unsubscribe = employeeService.subscribeToEmployees((employeesData) => {
      console.log('Received employees data:', employeesData.length, 'employees');
      setEmployees(employeesData);
      setLoading(false);
      setError(null);
    }, userEmail);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userEmail]);

  const updateEmployee = useCallback(async (employeeData) => {
    try {
      await employeeService.saveEmployee(employeeData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteEmployee = useCallback(async (employeeId) => {
    try {
      await employeeService.deleteEmployee(employeeId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateEmployeeSkills = useCallback(async (employeeId, skills) => {
    try {
      await employeeService.updateEmployeeSkills(employeeId, skills);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const bulkImportEmployees = useCallback(async (employeesData) => {
    try {
      await employeeService.bulkImportEmployees(employeesData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    employees,
    loading,
    error,
    updateEmployee,
    deleteEmployee,
    updateEmployeeSkills,
    bulkImportEmployees
  };
};

// Hook for managing events with real-time updates
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = eventService.subscribeToEvents((eventsData) => {
      setEvents(eventsData);
      setLoading(false);
      setError(null);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const createEvent = useCallback(async (eventData) => {
    try {
      return await eventService.createEvent(eventData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateEvent = useCallback(async (eventId, eventData) => {
    try {
      await eventService.updateEvent(eventId, eventData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const joinEvent = useCallback(async (eventId, userId) => {
    try {
      await eventService.joinEvent(eventId, userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const leaveEvent = useCallback(async (eventId, userId) => {
    try {
      await eventService.leaveEvent(eventId, userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent
  };
};

// Hook for managing tasks with real-time updates
export const useTasks = (userEmail = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = taskService.subscribeToTasks((tasksData) => {
      setTasks(tasksData);
      setLoading(false);
      setError(null);
    }, userEmail);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userEmail]);

  const createTask = useCallback(async (taskData) => {
    try {
      return await taskService.createTask(taskData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      await taskService.updateTask(taskId, taskData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask
  };
};

// Hook for managing user profile with real-time updates
export const useUserProfile = (userEmail) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const unsubscribe = userProfileService.subscribeToUserProfile(userEmail, (profileData) => {
      setProfile(profileData);
      setLoading(false);
      setError(null);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userEmail]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      await userProfileService.saveUserProfile(profileData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile
  };
};

// Hook for managing current user employee data
export const useCurrentEmployee = (userEmail) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Setting up current employee subscription for:', userEmail);
    
    const unsubscribe = employeeService.subscribeToEmployees((employees) => {
      const currentEmployee = employees.find(emp => emp.email === userEmail);
      console.log('Current employee found:', currentEmployee ? currentEmployee.name : 'Not found');
      setEmployee(currentEmployee || null);
      setLoading(false);
      setError(null);
    }, userEmail);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userEmail]);

  return {
    employee,
    loading,
    error
  };
};

// Hook for checking if user is admin
export const useIsAdmin = (userEmail) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Simple check: if email is admin@company.com, they're admin
    const adminCheck = userEmail === 'admin@company.com';
    setIsAdmin(adminCheck);
    setLoading(false);
    
    console.log('Admin check for', userEmail, ':', adminCheck);
  }, [userEmail]);

  return { isAdmin, loading };
};

// Hook for managing task history
export const useTaskHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = taskHistoryService.subscribeToTaskHistory((historyData) => {
      setHistory(historyData);
      setLoading(false);
      setError(null);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const createHistoryEntry = useCallback(async (entryData) => {
    try {
      return await taskHistoryService.createHistoryEntry(entryData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateHistoryEntry = useCallback(async (entryId, entryData) => {
    try {
      await taskHistoryService.updateHistoryEntry(entryId, entryData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteHistoryEntry = useCallback(async (entryId) => {
    try {
      await taskHistoryService.deleteHistoryEntry(entryId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    history,
    loading,
    error,
    createHistoryEntry,
    updateHistoryEntry,
    deleteHistoryEntry
  };
};