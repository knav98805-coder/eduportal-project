import React from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp, Calendar, Award, UserCheck, FileText } from 'lucide-react';
import { mockStudents, mockFaculty, mockCourses } from '../../data/mockData';

const AdminDashboard: React.FC = () => {
  const totalStudents = mockStudents.length;
  const totalFaculty = mockFaculty.length;
  const totalCourses = mockCourses.length;
  const totalEnrollments = mockCourses.reduce((sum, course) => sum + course.enrolledStudents.length, 0);

  const stats = [
    {
      icon: Users,
      label: 'Total Students',
      value: totalStudents,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      icon: GraduationCap,
      label: 'Faculty Members',
      value: totalFaculty,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: totalCourses,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      icon: TrendingUp,
      label: 'Total Enrollments',
      value: totalEnrollments,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'];
  const departmentStats = departments.map(dept => ({
    name: dept,
    students: mockStudents.filter(s => s.department === dept).length,
    faculty: mockFaculty.filter(f => f.department === dept).length
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Administration Dashboard</h1>
        <p className="text-gray-600 mt-1">College Management Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Overview</h2>
          <div className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students: <span className="font-medium">{dept.students}</span></span>
                  <span className="text-gray-600">Faculty: <span className="font-medium">{dept.faculty}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-900">Manage Students</p>
                <p className="text-sm text-blue-700">Add, edit, or remove student records</p>
              </div>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <GraduationCap className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-green-900">Faculty Management</p>
                <p className="text-sm text-green-700">Oversee faculty assignments and details</p>
              </div>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-purple-900">Course Management</p>
                <p className="text-sm text-purple-700">Create and manage course offerings</p>
              </div>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <FileText className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <p className="font-medium text-orange-900">Generate Reports</p>
                <p className="text-sm text-orange-700">Academic and administrative reports</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">New student registration</p>
              <p className="text-sm text-gray-500">5 students registered for Computer Science program</p>
            </div>
            <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full">
              <BookOpen className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Course enrollment update</p>
              <p className="text-sm text-gray-500">Database Systems course reached maximum capacity</p>
            </div>
            <span className="text-xs text-gray-400 ml-auto">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-purple-100 p-2 rounded-full">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Semester grades published</p>
              <p className="text-sm text-gray-500">Final grades for Fall 2024 have been released</p>
            </div>
            <span className="text-xs text-gray-400 ml-auto">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;