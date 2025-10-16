import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { mockCourses } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const ScheduleView: React.FC = () => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  // Get courses based on user role
  const relevantCourses = user?.role === 'faculty' 
    ? mockCourses.filter(course => (user as any).courses.includes(course.id))
    : user?.role === 'student'
    ? mockCourses.filter(course => (user as any).enrolledCourses.includes(course.id))
    : mockCourses;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Create schedule data structure
  const scheduleData: {[key: string]: {[key: string]: any[]}} = {};
  
  daysOfWeek.forEach(day => {
    scheduleData[day] = {};
    timeSlots.forEach(time => {
      scheduleData[day][time] = [];
    });
  });

  // Populate schedule with courses
  relevantCourses.forEach(course => {
    course.schedule.forEach(schedule => {
      const timeKey = schedule.time.split('-')[0];
      if (scheduleData[schedule.day] && scheduleData[schedule.day][timeKey]) {
        scheduleData[schedule.day][timeKey].push({
          ...course,
          scheduleTime: schedule.time,
          room: schedule.room
        });
      }
    });
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    return daysOfWeek.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'student' ? 'My Schedule' : 
             user?.role === 'faculty' ? 'Teaching Schedule' : 'Master Schedule'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'student' ? 'View your class schedule and timings' :
             user?.role === 'faculty' ? 'Manage your teaching schedule' : 'Overview of all schedules'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Day
            </button>
          </div>
          {user?.role === 'admin' && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-sm text-gray-600">
              {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
              <div className="p-4 text-sm font-medium text-gray-700">Time</div>
              {daysOfWeek.map((day, index) => (
                <div key={day} className="p-4 text-center border-l border-gray-200">
                  <div className="text-sm font-medium text-gray-700">{day}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {weekDates[index].getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {timeSlots.map(time => (
              <div key={time} className="grid grid-cols-8 border-b border-gray-200 min-h-[80px]">
                <div className="p-4 bg-gray-50 border-r border-gray-200 flex items-center">
                  <span className="text-sm font-medium text-gray-700">{time}</span>
                </div>
                {daysOfWeek.map(day => (
                  <div key={`${day}-${time}`} className="p-2 border-l border-gray-200 relative">
                    {scheduleData[day][time].map((course, index) => (
                      <div
                        key={`${course.id}-${index}`}
                        className="bg-blue-100 border border-blue-200 rounded-lg p-2 mb-1 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="text-xs font-semibold text-blue-900">{course.code}</div>
                        <div className="text-xs text-blue-700 truncate">{course.name}</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-blue-600">{course.scheduleTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-blue-600">{course.room}</span>
                        </div>
                        {user?.role !== 'faculty' && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-blue-600 truncate">{course.facultyName}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Classes</h2>
        <div className="space-y-3">
          {relevantCourses
            .filter(course => 
              course.schedule.some(s => s.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }))
            )
            .map(course => {
              const todaySchedule = course.schedule.find(s => 
                s.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })
              );
              return (
                <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.code}</h3>
                    <p className="text-sm text-gray-600">{course.name}</p>
                    {user?.role !== 'faculty' && (
                      <p className="text-xs text-gray-500">{course.facultyName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span>{todaySchedule?.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{todaySchedule?.room}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          {relevantCourses.filter(course => 
            course.schedule.some(s => s.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }))
          ).length === 0 && (
            <p className="text-gray-500 text-center py-4">No classes scheduled for today</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;