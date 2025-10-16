import React from 'react';
import { BookOpen, Calendar, Award, TrendingUp, Clock, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';
import { mockCourses, mockGrades, mockAttendance } from '../../data/mockData';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const student = user as Student;

  const enrolledCourses = mockCourses.filter(course => 
    student.enrolledCourses.includes(course.id)
  );

  const recentGrades = mockGrades.filter(grade => grade.studentId === student.id);
  const attendanceRecords = mockAttendance.filter(record => record.studentId === student.id);
  
  const attendancePercentage = attendanceRecords.length > 0 
    ? (attendanceRecords.filter(record => record.status === 'present').length / attendanceRecords.length) * 100
    : 0;

  const averageGrade = recentGrades.length > 0
    ? recentGrades.reduce((sum, grade) => sum + (grade.marks / grade.maxMarks) * 100, 0) / recentGrades.length
    : 0;

  const stats = [
    {
      icon: BookOpen,
      label: 'Enrolled Courses',
      value: enrolledCourses.length,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      icon: Award,
      label: 'Average Grade',
      value: `${averageGrade.toFixed(1)}%`,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      icon: TrendingUp,
      label: 'Current GPA',
      value: student.gpa,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      icon: Users,
      label: 'Attendance',
      value: `${attendancePercentage.toFixed(1)}%`,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  const upcomingSchedule = enrolledCourses.flatMap(course =>
    course.schedule.map(schedule => ({
      ...schedule,
      courseName: course.name,
      courseCode: course.code
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {student.name}!</h1>
        <p className="text-gray-600 mt-1">
          {student.department} • Year {student.year} • Semester {student.semester}
        </p>
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
        {/* Enrolled Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Courses</h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.code}</h3>
                    <p className="text-gray-600 text-sm">{course.name}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Credits: {course.credits} • {course.facultyName}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {course.credits} Credits
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Grades</h2>
          <div className="space-y-4">
            {recentGrades.map((grade) => {
              const course = mockCourses.find(c => c.id === grade.courseId);
              const percentage = (grade.marks / grade.maxMarks) * 100;
              return (
                <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{course?.code}</p>
                    <p className="text-sm text-gray-600 capitalize">{grade.examType}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{grade.marks}/{grade.maxMarks}</p>
                    <p className={`text-sm ${percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingSchedule.map((schedule, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900">{schedule.day}</span>
              </div>
              <p className="text-sm text-gray-600">{schedule.courseName}</p>
              <p className="text-sm text-gray-500">{schedule.time}</p>
              <p className="text-sm text-gray-500">Room: {schedule.room}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;