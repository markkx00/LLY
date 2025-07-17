# Employee Dashboard

A modern, responsive employee dashboard built with React, Vite, and Firebase. This application provides employees with a comprehensive view of their work-related information including tasks, attendance, performance metrics, and profile management.

## 🚀 Features

### 🔐 Authentication
- Secure login with Firebase Authentication
- User session management
- Protected routes

### 📊 Dashboard Overview
- Real-time statistics and metrics
- Task overview with completion status
- Attendance rate tracking
- Performance score visualization
- Recent activity feed

### 👤 Employee Profile
- Editable personal information
- Contact details management
- Employment information
- Skills and certifications
- Emergency contact details

### 📋 Task Management
- Create, edit, and delete tasks
- Task status tracking (Pending, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Due date management
- Task filtering and search

### ⏰ Attendance Tracker
- Check-in/Check-out functionality
- Monthly attendance calendar
- Attendance statistics
- Working hours tracking

### 📈 Performance Metrics
- Overall performance scoring
- Individual metric breakdown
- Monthly performance trends
- Recent feedback display
- Performance goals tracking

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite
- **Styling**: CSS3 with modern design patterns
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore (configured)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Chart.js with React Chart.js 2

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### 1. Clone and Install Dependencies
```bash
# Install dependencies
npm install
```

### 2. Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Get your Firebase configuration

### 3. Configure Firebase
Edit `src/firebase.js` and replace the placeholder configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Run the Application
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Common Issues & Solutions

### 1. Firebase Configuration Errors

**Problem**: `Firebase: Error (auth/invalid-api-key)`
```javascript
// Solution: Check your API key in firebase.js
const firebaseConfig = {
  apiKey: "your-actual-api-key", // Make sure this is correct
  // ... other config
};
```

**Problem**: `Firebase: Error (auth/network-request-failed)`
```javascript
// Solution: Check internet connection and Firebase project status
// Also verify your Firebase project is active
```

### 2. Authentication Issues

**Problem**: Login not working
```javascript
// Solution: Ensure Firebase Auth is enabled in your project
// Go to Firebase Console > Authentication > Sign-in method
// Enable Email/Password authentication
```

**Problem**: User not found errors
```javascript
// Solution: Create test users in Firebase Console
// Or implement user registration functionality
```

### 3. Firebase Permissions Issues

**Problem**: `Missing or insufficient permissions` when accessing data
```
Error: Missing or insufficient permissions.
at /src/services/firebaseService.js
```

**Solution**: Update your Firestore Security Rules in Firebase Console
```javascript
// Go to Firebase Console > Firestore Database > Rules
// Replace your current rules with:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /employees/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /events/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /tasks/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /userProfiles/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

// Then click "Publish" to apply the rules
```

**Problem**: `Error subscribing to employees` collection
```javascript
// Solution: Ensure the employees collection rule allows read access
// The rule above specifically allows authenticated users to read/write
// to the employees collection which resolves this error
```

### 4. Build Errors

**Problem**: Module not found errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Vite configuration issues
```javascript
// Solution: Check vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 4. Styling Issues

**Problem**: CSS not loading
```javascript
// Solution: Ensure CSS imports are correct
import './App.css'
import './index.css'
```

**Problem**: Responsive design not working
```css
/* Solution: Check media queries in App.css */
@media (max-width: 768px) {
  /* Mobile styles */
}
```

### 5. Component Errors

**Problem**: Component not rendering
```javascript
// Solution: Check import statements
import ComponentName from './components/ComponentName'

// Ensure component is properly exported
export default ComponentName
```

**Problem**: State not updating
```javascript
// Solution: Use proper state management
const [state, setState] = useState(initialValue)
setState(newValue) // Use setter function
```

## 📱 Demo Credentials

For testing purposes, you can use these demo credentials:
- **Email**: employee@company.com
- **Password**: password123

*Note: You'll need to create this user in your Firebase Authentication console*

## 🎨 Customization

### Styling
The application uses a modern design system with CSS custom properties. Main styling is in `src/App.css`.

### Components
All components are modular and can be easily customized:
- `src/components/Login.jsx` - Authentication
- `src/components/Dashboard.jsx` - Main dashboard
- `src/components/EmployeeProfile.jsx` - Profile management
- `src/components/TaskManager.jsx` - Task management
- `src/components/AttendanceTracker.jsx` - Attendance tracking
- `src/components/PerformanceMetrics.jsx` - Performance analytics

### Firebase Integration
The Firebase configuration is centralized in `src/firebase.js`. You can extend it to include:
- Real-time data synchronization
- File uploads
- Push notifications
- Analytics

## 🔒 Security Considerations

1. **Firebase Security Rules**: Configure proper Firestore security rules
2. **Environment Variables**: Use environment variables for sensitive data
3. **Input Validation**: Implement proper form validation
4. **Error Handling**: Add comprehensive error handling

## 📈 Performance Optimization

1. **Code Splitting**: Implement React.lazy() for route-based code splitting
2. **Image Optimization**: Use optimized images and lazy loading
3. **Caching**: Implement proper caching strategies
4. **Bundle Analysis**: Use tools like `npm run build -- --analyze`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify Firebase configuration
3. Ensure all dependencies are installed
4. Check the troubleshooting section above
5. Create an issue with detailed error information

## 🔄 Updates

To keep the project updated:

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Update to latest versions (use with caution)
npm update --latest
```

---

**Happy Coding! 🚀** 