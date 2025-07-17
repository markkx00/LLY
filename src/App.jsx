import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { initializeDefaultData } from './services/firebaseService';
import { useEmployees, useEvents, useIsAdmin } from './hooks/useRealtimeData';
import './App.css';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeProfile from './components/EmployeeProfile';
import TaskManager from './taskmanager';
import ActivityModule from './components/ActivityModule';
import PersonalPotential from './components/PersonalPotential';
import AdminDashboard from './components/AdminDashboard';
import Navigation from './components/Navigation';
import DataModule from './components/DataModule';
import BackupModule from './components/BackupModule';
import EventModule from './components/EventModule';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appInitialized, setAppInitialized] = useState(false);

  // Check if user is admin
  const { isAdmin, loading: adminLoading } = useIsAdmin(user?.email);

  // Real-time data hooks - pass user email for proper filtering
  const { 
    employees, 
    loading: employeesLoading, 
    updateEmployee, 
    deleteEmployee, 
    updateEmployeeSkills,
    bulkImportEmployees 
  } = useEmployees(user?.email);
  
  const { 
    events, 
    loading: eventsLoading, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    joinEvent,
    leaveEvent 
  } = useEvents();

  useEffect(() => {
    // Initialize Firebase data and auth listener
    const initializeApp = async () => {
      try {
        // Initialize default data if needed
        await initializeDefaultData();
        setAppInitialized(true);
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
        setAppInitialized(true); // Continue even if initialization fails
      }
    };

    initializeApp();

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? user.email : 'No user');
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Show loading while app is initializing or auth is loading
  if (loading || !appInitialized || adminLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Debug logging
  console.log('Current user:', user?.email);
  console.log('Is admin:', isAdmin);
  console.log('Employees loaded:', employees.length);

  return (
    <Router>
      <div className="App">
        {user ? (
          <>
            <Navigation user={user} onLogout={handleLogout} />
            <main className="main-content">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    isAdmin ? (
                      <AdminDashboard 
                        user={user} 
                        employees={employees}
                        employeesLoading={employeesLoading}
                        onUpdateEmployee={updateEmployee}
                        onDeleteEmployee={deleteEmployee}
                        onUpdateEmployeeSkills={updateEmployeeSkills}
                      />
                    ) : (
                      <Dashboard 
                        user={user} 
                        employees={employees}
                        events={events}
                      />
                    )
                  } 
                />
                <Route 
                  path="/data" 
                  element={
                    isAdmin ? (
                      <DataModule 
                        employees={employees} 
                        loading={employeesLoading}
                        onUpdateEmployee={updateEmployee} 
                      />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  } 
                />
                <Route 
                  path="/backup" 
                  element={
                    isAdmin ? (
                      <BackupModule 
                        employees={employees} 
                        onImportData={bulkImportEmployees} 
                      />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  } 
                />
                <Route 
                  path="/events" 
                  element={
                    isAdmin ? (
                      <EventModule 
                        employees={employees} 
                        events={events} 
                        eventsLoading={eventsLoading}
                        onCreateEvent={createEvent} 
                        onUpdateEvent={updateEvent} 
                        onDeleteEvent={deleteEvent} 
                      />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    isAdmin ? (
                      <AdminDashboard 
                        user={user} 
                        employees={employees}
                        employeesLoading={employeesLoading}
                        onUpdateEmployee={updateEmployee}
                        onDeleteEmployee={deleteEmployee}
                        onUpdateEmployeeSkills={updateEmployeeSkills}
                      />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <EmployeeProfile 
                      user={user} 
                      employees={employees}
                    />
                  } 
                />
                <Route 
                  path="/tasks" 
                  element={
                    isAdmin ? (
                      <TaskManager 
                        user={user}
                        isAdmin={isAdmin}
                      />
                    ) : (
                      <TaskManager 
                        user={user}
                        isAdmin={isAdmin}
                      />
                    )
                  } 
                />
                <Route 
                  path="/activity" 
                  element={
                    <ActivityModule 
                      user={user} 
                      isAdmin={isAdmin} 
                      events={events}
                      eventsLoading={eventsLoading}
                      onCreateEvent={createEvent}
                      onJoinEvent={joinEvent}
                      onLeaveEvent={leaveEvent}
                    />
                  } 
                />
                <Route 
                  path="/personal-potential" 
                  element={
                    <PersonalPotential 
                      user={user} 
                      employees={employees}
                    />
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </>
        ) : (
          <Login />
        )}
      </div>
    </Router>
  );
}

export default App;