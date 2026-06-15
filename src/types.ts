/**
 * Types and schema for the AI-Based Smart Classroom Analysis System
 */

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rollNo: string;
  grade: string;
  gpa: number;
  attendance: number;
  weakSubjects: string[];
  interests: string[];
  engagementScore: number;
  attentionHistory: { timestamp: string; score: number }[];
}

export interface Task {
  id: string;
  title: string;
  dueTime: string;
  category: "Study" | "Assignment" | "Career" | "Exam";
  completed: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submittedCount: number;
  totalCount: number;
  averageGrade: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string[];
}
