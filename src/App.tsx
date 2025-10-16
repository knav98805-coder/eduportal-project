import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import FacultyDashboard from './components/Dashboard/FacultyDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import StudentList from './components/Students/StudentList';
import CourseList from './components/Courses/CourseList';
import AttendanceTracker from './components/Attendance/AttendanceTracker';
import GradeManager from './components/Grades/GradeManager';
import ScheduleView from './components/Schedule/ScheduleView';
import ReportsView from './components/Reports/ReportsView';
import SettingsView from './components/Settings/SettingsView';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'courses':
        return <CourseList />;
      case 'students':
        return <StudentList />;
      case 'faculty':
        return <StudentList />; // Faculty list would be similar to StudentList
      case 'attendance':
        return <AttendanceTracker />;
      case 'grades':
        return <GradeManager />;
      case 'schedule':
        return <ScheduleView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;