export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  avatar?: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  department: string;
  year: number;
  semester: number;
  enrolledCourses: string[];
  gpa: number;
}

export interface Faculty extends User {
  role: 'faculty';
  facultyId: string;
  department: string;
  designation: string;
  courses: string[];
  experience: number;
}

export interface Admin extends User {
  role: 'admin';
  adminId: string;
  permissions: string[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  semester: number;
  facultyId: string;
  facultyName: string;
  schedule: {
    day: string;
    time: string;
    room: string;
  }[];
  enrolledStudents: string[];
  maxCapacity: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  examType: 'quiz' | 'midterm' | 'final' | 'assignment';
  marks: number;
  maxMarks: number;
  date: string;
  semester: number;
  year: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}