import React, { useState } from 'react';
import { Award, Plus, CreditCard as Edit, Eye, Download, Filter, TrendingUp } from 'lucide-react';
import { mockCourses, mockStudents, mockGrades } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const GradeManager: React.FC = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [showAddGrade, setShowAddGrade] = useState(false);

  // Get courses based on user role
  const availableCourses = user?.role === 'faculty' 
    ? mockCourses.filter(course => (user as any).courses.includes(course.id))
    : user?.role === 'student'
    ? mockCourses.filter(course => (user as any).enrolledCourses.includes(course.id))
    : mockCourses;

  const selectedCourseData = mockCourses.find(c => c.id === selectedCourse);
  
  // Get grades based on filters and user role
  const filteredGrades = mockGrades.filter(grade => {
    if (user?.role === 'student') {
      return grade.studentId === user.id && 
             (!selectedCourse || grade.courseId === selectedCourse) &&
             (!selectedExamType || grade.examType === selectedExamType);
    }
    return (!selectedCourse || grade.courseId === selectedCourse) &&
           (!selectedExamType || grade.examType === selectedExamType);
  });

  const examTypes = ['quiz', 'midterm', 'final', 'assignment'];

  // Calculate statistics
  const calculateStats = () => {
    if (filteredGrades.length === 0) return { average: 0, highest: 0, lowest: 0 };
    
    const percentages = filteredGrades.map(grade => (grade.marks / grade.maxMarks) * 100);
    const average = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);
    
    return { average, highest, lowest };
  };

  const stats = calculateStats();

  if (user?.role === 'student') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
          <p className="text-gray-600">View your academic performance and grades</p>
        </div>

        {/* Grade Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Average Grade</p>
                <p className="text-2xl font-bold text-blue-700">{stats.average.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Highest Grade</p>
                <p className="text-2xl font-bold text-green-700">{stats.highest.toFixed(1)}%</p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Current GPA</p>
                <p className="text-2xl font-bold text-purple-700">{(user as any).gpa}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Courses</option>
              {availableCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Exam Types</option>
              {examTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Grades List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Grade History</h2>
          <div className="space-y-4">
            {filteredGrades.map(grade => {
              const course = mockCourses.find(c => c.id === grade.courseId);
              const percentage = (grade.marks / grade.maxMarks) * 100;
              return (
                <div key={grade.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{course?.code}</h3>
                      <p className="text-sm text-gray-600">{course?.name}</p>
                      <p className="text-sm text-gray-500 capitalize mt-1">{grade.examType}</p>
                      <p className="text-xs text-gray-400">{new Date(grade.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{grade.marks}/{grade.maxMarks}</p>
                      <p className={`text-lg font-semibold ${
                        percentage >= 90 ? 'text-green-600' : 
                        percentage >= 80 ? 'text-blue-600' : 
                        percentage >= 70 ? 'text-yellow-600' : 
                        percentage >= 60 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {percentage.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500">
                        {percentage >= 90 ? 'A+' : 
                         percentage >= 80 ? 'A' : 
                         percentage >= 70 ? 'B' : 
                         percentage >= 60 ? 'C' : 'F'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentage >= 90 ? 'bg-green-500' : 
                          percentage >= 80 ? 'bg-blue-500' : 
                          percentage >= 70 ? 'bg-yellow-500' : 
                          percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Grade Management</h1>
          <p className="text-gray-600">Manage student grades and assessments</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddGrade(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Grade</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {availableCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Exam Types</option>
            {examTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex items-center text-sm text-gray-600">
            Showing {filteredGrades.length} grade{filteredGrades.length !== 1 ? 's' : ''}
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Class Average</p>
              <p className="text-2xl font-bold text-blue-700">{stats.average.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Highest Grade</p>
              <p className="text-2xl font-bold text-green-700">{stats.highest.toFixed(1)}%</p>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Lowest Grade</p>
              <p className="text-2xl font-bold text-red-700">{stats.lowest.toFixed(1)}%</p>
            </div>
            <Award className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Grade Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.map(grade => {
                const student = mockStudents.find(s => s.id === grade.studentId);
                const course = mockCourses.find(c => c.id === grade.courseId);
                const percentage = (grade.marks / grade.maxMarks) * 100;
                const letterGrade = percentage >= 90 ? 'A+' : 
                                  percentage >= 80 ? 'A' : 
                                  percentage >= 70 ? 'B' : 
                                  percentage >= 60 ? 'C' : 'F';
                
                return (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={student?.avatar}
                          alt={student?.name}
                          className="w-8 h-8 rounded-full object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student?.name}</div>
                          <div className="text-sm text-gray-500">{student?.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{course?.code}</div>
                      <div className="text-sm text-gray-500">{course?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm text-gray-900">{grade.examType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.marks}/{grade.maxMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        percentage >= 80 ? 'text-green-600' : 
                        percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        letterGrade === 'A+' || letterGrade === 'A' ? 'bg-green-100 text-green-800' :
                        letterGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                        letterGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {letterGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradeManager;