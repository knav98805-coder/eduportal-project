import React from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Settings,
  UserCheck,
  Award,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
    ];

    const roleSpecificItems = {
      student: [
        { id: 'courses', icon: BookOpen, label: 'My Courses' },
        { id: 'attendance', icon: UserCheck, label: 'Attendance' },
        { id: 'grades', icon: Award, label: 'Grades' },
        { id: 'schedule', icon: Calendar, label: 'Schedule' },
      ],
      faculty: [
        { id: 'courses', icon: BookOpen, label: 'My Courses' },
        { id: 'students', icon: Users, label: 'Students' },
        { id: 'attendance', icon: UserCheck, label: 'Attendance' },
        { id: 'grades', icon: Award, label: 'Grade Management' },
        { id: 'reports', icon: BarChart3, label: 'Reports' },
      ],
      admin: [
        { id: 'students', icon: Users, label: 'Students' },
        { id: 'faculty', icon: Users, label: 'Faculty' },
        { id: 'courses', icon: BookOpen, label: 'Courses' },
        { id: 'reports', icon: BarChart3, label: 'Reports' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ]
    };

    return [
      ...commonItems,
      ...(roleSpecificItems[user?.role || 'student'] || [])
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white shadow-md h-full w-64 border-r border-gray-200">
      <div className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;