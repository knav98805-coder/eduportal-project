import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, Filter, Download } from 'lucide-react';
import { mockCourses, mockStudents, mockAttendance } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const AttendanceTracker: React.FC = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<{[key: string]: 'present' | 'absent' | 'late'}>({});

  // Get courses based on user role
  const availableCourses = user?.role === 'faculty' 
    ? mockCourses.filter(course => (user as any).courses.includes(course.id))
    : user?.role === 'student'
    ? mockCourses.filter(course => (user as any).enrolledCourses.includes(course.id))
    : mockCourses;

  const selectedCourseData = mockCourses.find(c => c.id === selectedCourse);
  const enrolledStudents = selectedCourseData 
    ? mockStudents.filter(student => selectedCourseData.enrolledStudents.includes(student.id))
    : [];

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = () => {
    // In a real app, this would save to the database
    alert('Attendance saved successfully!');
  };

  // Get attendance statistics for student view
  const getStudentAttendanceStats = () => {
    if (user?.role !== 'student') return null;
    
    const studentAttendance = mockAttendance.filter(record => record.studentId === user.id);
    const totalClasses = studentAttendance.length;
    const presentClasses = studentAttendance.filter(record => record.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;
    
    return { totalClasses, presentClasses, attendancePercentage };
  };

  const studentStats = getStudentAttendanceStats();

  if (user?.role === 'student') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600">Track your attendance across all courses</p>
        </div>

        {/* Student Attendance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Classes</p>
                <p className="text-2xl font-bold text-blue-700">{studentStats?.totalClasses || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Classes Attended</p>
                <p className="text-2xl font-bold text-green-700">{studentStats?.presentClasses || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-purple-700">{studentStats?.attendancePercentage.toFixed(1) || 0}%</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Course-wise Attendance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course-wise Attendance</h2>
          <div className="space-y-4">
            {availableCourses.map(course => {
              const courseAttendance = mockAttendance.filter(record => 
                record.studentId === user.id && record.courseId === course.id
              );
              const totalClasses = courseAttendance.length;
              const presentClasses = courseAttendance.filter(record => record.status === 'present').length;
              const percentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

              return (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.code}</h3>
                      <p className="text-sm text-gray-600">{course.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{presentClasses}/{totalClasses}</p>
                      <p className={`text-sm ${percentage >= 75 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percentage >= 75 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Mark and track student attendance</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a course...</option>
              {availableCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={saveAttendance}
              disabled={!selectedCourse || enrolledStudents.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Save Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Marking */}
      {selectedCourse && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Mark Attendance - {selectedCourseData?.code}
            </h2>
            <div className="text-sm text-gray-600">
              {enrolledStudents.length} students enrolled
            </div>
          </div>

          <div className="space-y-4">
            {enrolledStudents.map(student => (
              <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.studentId}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAttendanceChange(student.id, 'present')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      attendanceData[student.id] === 'present'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Present
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(student.id, 'late')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      attendanceData[student.id] === 'late'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    Late
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(student.id, 'absent')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      attendanceData[student.id] === 'absent'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedCourse && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Select a course to mark attendance</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;