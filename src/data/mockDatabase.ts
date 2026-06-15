import { Student, Task, Assignment, Course, Teacher } from "../types";

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "std01",
    name: "Alex Rivera",
    email: "alex@university.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    rollNo: "CS2026-042",
    grade: "A",
    gpa: 3.82,
    attendance: 94,
    weakSubjects: ["Discrete Mathematics", "Operating Systems"],
    interests: ["Artificial Intelligence", "Machine Learning", "Mobile Development"],
    engagementScore: 88,
    attentionHistory: [
      { timestamp: "09:00 AM", score: 85 },
      { timestamp: "09:15 AM", score: 92 },
      { timestamp: "09:30 AM", score: 70 },
      { timestamp: "09:45 AM", score: 94 },
      { timestamp: "10:00 AM", score: 86 },
    ],
  },
  {
    id: "std02",
    name: "Meera Nair",
    email: "meera.n@university.edu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rollNo: "CS2026-081",
    grade: "B+",
    gpa: 3.45,
    attendance: 87,
    weakSubjects: ["System Programming", "Probability & Statistics"],
    interests: ["Data Engineering", "Cloud Architectures", "Web Automation"],
    engagementScore: 78,
    attentionHistory: [
      { timestamp: "09:00 AM", score: 72 },
      { timestamp: "09:15 AM", score: 80 },
      { timestamp: "09:30 AM", score: 64 },
      { timestamp: "09:45 AM", score: 85 },
      { timestamp: "10:00 AM", score: 79 },
    ],
  },
  {
    id: "std03",
    name: "John Chen",
    email: "john.chen@university.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rollNo: "CS2026-015",
    grade: "C+",
    gpa: 2.91,
    attendance: 74,
    weakSubjects: ["Database Management Systems", "Data Structures"],
    interests: ["Cyber Security", "Linux Systems", "Game Design"],
    engagementScore: 61,
    attentionHistory: [
      { timestamp: "09:00 AM", score: 55 },
      { timestamp: "09:15 AM", score: 62 },
      { timestamp: "09:30 AM", score: 48 },
      { timestamp: "09:45 AM", score: 70 },
      { timestamp: "10:00 AM", score: 60 },
    ],
  },
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "tea01",
    name: "Dr. Catherine Bennett",
    email: "c.bennett@university.edu",
    department: "Computer Science & Engineering",
    courses: ["AI-101: Artificial Intelligence", "DS-301: Data Structures"],
  },
  {
    id: "tea02",
    name: "Prof. Robert Thorne",
    email: "r.thorne@university.edu",
    department: "Information Technology",
    courses: ["DB-202: Database Management Systems", "OS-401: Operating Systems"],
  },
];

export const INITIAL_COURSES: Course[] = [
  { id: "c01", code: "CSE-401", name: "Artificial Intelligence & Networks", credits: 4, instructor: "Dr. Catherine Bennett" },
  { id: "c02", code: "CSE-302", name: "Data Structures & Algorithm Design", credits: 4, instructor: "Dr. Catherine Bennett" },
  { id: "c03", code: "CSE-204", name: "Database Management Systems", credits: 3, instructor: "Prof. Robert Thorne" },
  { id: "c04", code: "MAT-211", name: "Discrete Mathematical Foundations", credits: 3, instructor: "Dr. Catherine Bennett" },
];

export const INITIAL_TASKS: Task[] = [
  { id: "t01", title: "Complete Neural Network Lab Quiz", dueTime: "04:30 PM Today", category: "Study", completed: false },
  { id: "t02", title: "Review DBMS Normalization rules", dueTime: "09:00 PM Tomorrow", category: "Assignment", completed: false },
  { id: "t03", title: "Take Attention Level AI diagnostics", dueTime: "02:00 PM Tomorrow", category: "Exam", completed: true },
  { id: "t04", title: "Read Cloud Native career outline", dueTime: "08:00 PM Friday", category: "Career", completed: false },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: "a01", title: "Practical Backpropagation Implementation", subject: "Artificial Intelligence", dueDate: "June 18, 2026", submittedCount: 24, totalCount: 28, averageGrade: "A-" },
  { id: "a02", title: "B-Tree indexing assignment", subject: "Database Management Systems", dueDate: "June 22, 2026", submittedCount: 18, totalCount: 28, averageGrade: "B+" },
  { id: "a03", title: "Critical design review paper draft", subject: "Technical Seminar", dueDate: "June 29, 2026", submittedCount: 5, totalCount: 28, averageGrade: "N/A" },
];
