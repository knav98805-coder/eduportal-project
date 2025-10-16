import React, { useState } from 'react';
import { BarChart3, Download, Filter, TrendingUp, Users, BookOpen, Award, Calendar } from 'lucide-react';
import { mockStudents, mockCourses, mockGrades, mockAttendance } from '../../data/mockData';

const ReportsView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('semester');

  const reportTypes = [
    { id: 'overview', name: 'Academic Overview', icon: BarChart3 },
    { id: 'attendance', name: 'Attendance Report', icon: Users },
    { id: 'grades', name: 'Grade Analysis', icon: Award },
    { id: 'enrollment', name: 'Enrollment Report', icon: BookOpen },
    { id: 'performance', name: 'Performance Trends', icon: TrendingUp }
  ];

  // Calculate statistics
  const totalStudents = mockStudents.length;
  const totalCourses = mockCourses.length;
  const averageGPA = mockStudents.reduce((sum, student) => sum + student.gpa, 0) / totalStudents;
  const totalEnrollments = mockCourses.reduce((sum, course) => sum + course.enrolledStudents.length, 0);

  // Attendance statistics
  const totalAttendanceRecords = mockAttendance.length;
  const presentRecords = mockAttendance.filter(record => record.status === 'present').length;
  const overallAttendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

  // Grade distribution
  const gradeDistribution = mockGrades.reduce((acc, grade) => {
    const percentage = (grade.marks / grade.maxMarks) * 100;
    const letterGrade = percentage >= 90 ? 'A+' : 
                       percentage >= 80 ? 'A' : 
                       percentage >= 70 ? 'B' : 
                       percentage >= 60 ? 'C' : 'F';
    acc[letterGrade] = (acc[letterGrade] || 0) + 1;
    return acc;
  }, {} as {[key: string]: number});

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-700">{totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Courses</p>
              <p className="text-2xl font-bold text-green-700">{totalCourses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Average GPA</p>
              <p className="text-2xl font-bold text-purple-700">{averageGPA.toFixed(2)}</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-orange-700">{overallAttendanceRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Statistics</h3>
        <div className="space-y-4">
          {['Computer Science', 'Mathematics', 'Physics', 'Chemistry'].map(dept => {
            const deptStudents = mockStudents.filter(s => s.department === dept).length;
            const deptCourses = mockCourses.filter(c => c.department === dept).length;
            return (
              <div key={dept} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{dept}</h4>
                  <p className="text-sm text-gray-600">{deptStudents} students, {deptCourses} courses</p>
                </div>
                <div className="text-right">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(deptStudents / totalStudents) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((deptStudents / totalStudents) * 100).toFixed(1)}% of students
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderGradeReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(gradeDistribution).map(([grade, count]) => (
            <div key={grade} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">Grade {grade}</div>
              <div className="text-xs text-gray-500">
                {((count / mockGrades.length) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
        <div className="space-y-4">
          {mockCourses.map(course => {
            const courseGrades = mockGrades.filter(g => g.courseId === course.id);
            const avgGrade = courseGrades.length > 0 
              ? courseGrades.reduce((sum, g) => sum + (g.marks / g.maxMarks) * 100, 0) / courseGrades.length
              : 0;
            
            return (
              <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{course.code}</h4>
                  <p className="text-sm text-gray-600">{course.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{avgGrade.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">{courseGrades.length} submissions</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAttendanceReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-700">{presentRecords}</div>
            <div className="text-sm text-green-600">Present</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-700">{totalAttendanceRecords - presentRecords}</div>
            <div className="text-sm text-red-600">Absent</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-700">{overallAttendanceRate.toFixed(1)}%</div>
            <div className="text-sm text-blue-600">Overall Rate</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Attendance Rates</h3>
        <div className="space-y-4">
          {mockStudents.map(student => {
            const studentAttendance = mockAttendance.filter(record => record.studentId === student.id);
            const presentCount = studentAttendance.filter(record => record.status === 'present').length;
            const attendanceRate = studentAttendance.length > 0 ? (presentCount / studentAttendance.length) * 100 : 0;
            
            return (
              <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.studentId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    attendanceRate >= 80 ? 'text-green-600' : 
                    attendanceRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {attendanceRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {presentCount}/{studentAttendance.length} classes
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'grades':
        return renderGradeReport();
      case 'attendance':
        return renderAttendanceReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive academic and administrative reports</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="semester">Current Semester</option>
            <option value="year">Academic Year</option>
            <option value="month">This Month</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {reportTypes.map(report => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-lg text-center transition-colors ${
                  selectedReport === report.id
                    ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">{report.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default ReportsView;