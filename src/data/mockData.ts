import { Student, Faculty, Admin, Course, AttendanceRecord, Grade, Notification } from '../types';

export const mockStudents: Student[] = [
  {
    id: 'st001',
    studentId: 'CS2021001',
    name: 'Alice Johnson',
    email: 'alice.johnson@college.edu',
    role: 'student',
    department: 'Computer Science',
    year: 3,
    semester: 5,
    enrolledCourses: ['cs301', 'cs302', 'cs303', 'ma301'],
    gpa: 3.8,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  },
  {
    id: 'st002',
    studentId: 'CS2021002',
    name: 'Bob Smith',
    email: 'bob.smith@college.edu',
    role: 'student',
    department: 'Computer Science',
    year: 2,
    semester: 3,
    enrolledCourses: ['cs201', 'cs202', 'ma201'],
    gpa: 3.5,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  }
];

export const mockFaculty: Faculty[] = [
  {
    id: 'fc001',
    facultyId: 'FAC001',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@college.edu',
    role: 'faculty',
    department: 'Computer Science',
    designation: 'Professor',
    courses: ['cs301', 'cs302'],
    experience: 15,
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  },
  {
    id: 'fc002',
    facultyId: 'FAC002',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@college.edu',
    role: 'faculty',
    department: 'Mathematics',
    designation: 'Associate Professor',
    courses: ['ma301', 'ma201'],
    experience: 10,
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  }
];

export const mockAdmin: Admin[] = [
  {
    id: 'ad001',
    adminId: 'ADM001',
    name: 'John Administrator',
    email: 'john.admin@college.edu',
    role: 'admin',
    permissions: ['manage_students', 'manage_faculty', 'manage_courses', 'view_reports'],
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'cs301',
    code: 'CS301',
    name: 'Database Systems',
    description: 'Introduction to database design, SQL, and database management systems.',
    credits: 3,
    department: 'Computer Science',
    semester: 5,
    facultyId: 'fc001',
    facultyName: 'Dr. Sarah Wilson',
    schedule: [
      { day: 'Monday', time: '10:00-11:30', room: 'CS-101' },
      { day: 'Wednesday', time: '10:00-11:30', room: 'CS-101' }
    ],
    enrolledStudents: ['st001'],
    maxCapacity: 40
  },
  {
    id: 'cs302',
    code: 'CS302',
    name: 'Software Engineering',
    description: 'Software development methodologies, project management, and quality assurance.',
    credits: 4,
    department: 'Computer Science',
    semester: 5,
    facultyId: 'fc001',
    facultyName: 'Dr. Sarah Wilson',
    schedule: [
      { day: 'Tuesday', time: '14:00-16:00', room: 'CS-102' },
      { day: 'Friday', time: '14:00-16:00', room: 'CS-102' }
    ],
    enrolledStudents: ['st001'],
    maxCapacity: 35
  },
  {
    id: 'ma301',
    code: 'MA301',
    name: 'Advanced Mathematics',
    description: 'Linear algebra, calculus, and discrete mathematics for computer science.',
    credits: 3,
    department: 'Mathematics',
    semester: 5,
    facultyId: 'fc002',
    facultyName: 'Dr. Michael Chen',
    schedule: [
      { day: 'Monday', time: '12:00-13:30', room: 'MA-201' },
      { day: 'Thursday', time: '12:00-13:30', room: 'MA-201' }
    ],
    enrolledStudents: ['st001'],
    maxCapacity: 50
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: 'att001',
    studentId: 'st001',
    courseId: 'cs301',
    date: '2025-01-15',
    status: 'present',
    markedBy: 'fc001'
  },
  {
    id: 'att002',
    studentId: 'st001',
    courseId: 'cs302',
    date: '2025-01-15',
    status: 'present',
    markedBy: 'fc001'
  }
];

export const mockGrades: Grade[] = [
  {
    id: 'gr001',
    studentId: 'st001',
    courseId: 'cs301',
    examType: 'midterm',
    marks: 85,
    maxMarks: 100,
    date: '2025-01-10',
    semester: 5,
    year: 2025
  },
  {
    id: 'gr002',
    studentId: 'st001',
    courseId: 'cs302',
    examType: 'assignment',
    marks: 92,
    maxMarks: 100,
    date: '2025-01-12',
    semester: 5,
    year: 2025
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'not001',
    title: 'Grade Updated',
    message: 'Your grade for CS301 Midterm has been updated.',
    type: 'info',
    timestamp: '2025-01-15T10:30:00Z',
    read: false
  },
  {
    id: 'not002',
    title: 'Assignment Due',
    message: 'CS302 Assignment 2 is due tomorrow.',
    type: 'warning',
    timestamp: '2025-01-14T15:00:00Z',
    read: false
  }
];