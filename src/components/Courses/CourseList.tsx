import React, { useState } from 'react';
import { Search, Plus, Users, Calendar, Clock, MapPin, CreditCard as Edit, Trash2, Eye } from 'lucide-react';
import { mockCourses } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const CourseList: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || course.department === filterDepartment;
    
    // For students, only show enrolled courses
    if (user?.role === 'student') {
      return matchesSearch && matchesDepartment && (user as any).enrolledCourses.includes(course.id);
    }
    
    // For faculty, only show assigned courses
    if (user?.role === 'faculty') {
      return matchesSearch && matchesDepartment && (user as any).courses.includes(course.id);
    }
    
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(mockCourses.map(c => c.department))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'student' ? 'My Courses' : 
             user?.role === 'faculty' ? 'Teaching Courses' : 'Course Management'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'student' ? 'View your enrolled courses and schedules' :
             user?.role === 'faculty' ? 'Manage your assigned courses' : 'Manage all courses and enrollments'}
          </p>
        </div>
        {user?.role === 'admin' && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{course.code}</h3>
                <p className="text-gray-600 mt-1">{course.name}</p>
                <p className="text-sm text-gray-500 mt-2">{course.description}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {course.credits} Credits
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{course.enrolledStudents.length}/{course.maxCapacity} Students</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Semester {course.semester}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Instructor:</p>
              <p className="text-sm text-gray-600">{course.facultyName}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Schedule:</p>
              <div className="space-y-1">
                {course.schedule.map((schedule, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{schedule.day} {schedule.time}</span>
                    <MapPin className="w-3 h-3 ml-2" />
                    <span>{schedule.room}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors">
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              {user?.role !== 'student' && (
                <>
                  <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  {user?.role === 'admin' && (
                    <button className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Progress bar for enrollment */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Enrollment</span>
                <span>{Math.round((course.enrolledStudents.length / course.maxCapacity) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(course.enrolledStudents.length / course.maxCapacity) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;