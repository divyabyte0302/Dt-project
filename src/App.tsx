import React, { useState, useEffect, useRef } from "react";
import {
  User,
  BookOpen,
  Users,
  Shield,
  MessageSquare,
  Sparkles,
  Camera,
  Activity,
  Award,
  CheckCircle,
  FileText,
  HelpCircle,
  Clock,
  Play,
  RotateCcw,
  Plus,
  Compass,
  ArrowRight,
  UserCheck,
  Briefcase,
  Layout,
  RefreshCw,
  Send,
  Loader2,
  GraduationCap,
  Search,
  Menu,
  Bell,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Check,
  AlertCircle,
  Calendar,
  Trophy
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_COURSES,
  INITIAL_TASKS,
  INITIAL_ASSIGNMENTS
} from "./data/mockDatabase";
import { ACADEMIC_SECTIONS } from "./data/academicDocumentation";
import { OPENCV_TENSORFLOW_SCRIPT, FLASK_BACKEND_SCRIPT, STUDENT_UI_UX_FLOWS } from "./data/blueprintDocumentation";
import { Student, Task, Assignment, Course, Teacher, ChatMessage } from "./types";

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<"dashboard" | "students" | "attendance" | "performance" | "assignments" | "ai-engine" | "student" | "teacher" | "admin" | "dossier" | "blueprint_hub">("dashboard");
  const [systemAlertMessage, setSystemAlertMessage] = useState<string | null>(
    "Welcome to the AI Classroom Engine. Access camera to begin live gaze monitoring."
  );

  // Core Data States (Pre-loaded from simulated Firestore DB)
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);

  // Active Simulated Student Profile (Alex Rivera)
  const [currentStudentId, setCurrentStudentId] = useState<string>("std01");
  const activeStudent = students.find((s) => s.id === currentStudentId) || students[0];

  // Forms / Input States
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseInstructor, setNewCourseInstructor] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentGPA, setNewStudentGPA] = useState("3.5");
  const [newStudentInterests, setNewStudentInterests] = useState("Information Retrieval, App Development");
  const [newStudentWeaknesses, setNewStudentWeaknesses] = useState("Advanced Calculus");

  // Chatbot State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      role: "model",
      content: "Hello! I am Clarissa, your AI companion. I can help analyze your performance, generate personalized study blocks, or suggest career trajectories. What are we studying today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // AI Personalized Path Generator State
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [activeBlueprintSubTab, setActiveBlueprintSubTab] = useState<"ai_cv" | "backend_flask" | "student_ui_ux">("ai_cv");
  const [personalizedPlan, setPersonalizedPlan] = useState<{
    careerPath: string;
    careerDescription: string;
    certifications: string[];
    recommendedStudyHoursPerWeek: number;
    actionableDailyTip: string;
    studySchedule: { day: string; focusSubject: string; durationMinutes: number; technique: string }[];
  } | null>(null);

  // Web camera / Video simulation state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Custom CV Control states for presentation simulation
  const [simulatedGazeOffset, setSimulatedGazeOffset] = useState<number>(12); // deg
  const [simulatedBlinkRate, setSimulatedBlinkRate] = useState<number>(14); // blinks/min
  const [simulatedAttentionClass, setSimulatedAttentionClass] = useState<"ACTIVE" | "DISTRACTED" | "SLEEPY" | "PHONE">("ACTIVE");
  const [computedEngagementScore, setComputedEngagementScore] = useState<number>(88);
  const [realtimeHistory, setRealtimeHistory] = useState<{ timestamp: string; engagement: number }[]>([
    { timestamp: "09:00", engagement: 82 },
    { timestamp: "09:05", engagement: 88 },
    { timestamp: "09:10", engagement: 91 },
    { timestamp: "09:15", engagement: 74 },
    { timestamp: "09:20", engagement: 88 },
  ]);

  // Handle live calculation of computed engagement from dials
  useEffect(() => {
    let base = 95;
    if (simulatedAttentionClass === "DISTRACTED") base = 48;
    if (simulatedAttentionClass === "SLEEPY") base = 35;
    if (simulatedAttentionClass === "PHONE") base = 15;

    // Adjust based on gaze error
    const gazePenalty = Math.max(0, (simulatedGazeOffset - 10) * 1.5);
    // Blink abnormalities
    const blinkPenalty = simulatedBlinkRate > 22 || simulatedBlinkRate < 6 ? 10 : 0;

    const finalScore = Math.min(100, Math.max(0, Math.round(base - gazePenalty - blinkPenalty)));
    setComputedEngagementScore(finalScore);

    // Update active student's engagement score dynamically to keep full-stack state in sync
    setStudents(prev => prev.map(s => {
      if (s.id === currentStudentId) {
        return {
          ...s,
          engagementScore: finalScore,
          attentionHistory: [
            ...s.attentionHistory.slice(-10),
            { timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), score: finalScore }
          ]
        };
      }
      return s;
    }));
  }, [simulatedAttentionClass, simulatedGazeOffset, simulatedBlinkRate, currentStudentId]);

  // Periodic visual network simulation ticks
  useEffect(() => {
    const timer = setInterval(() => {
      // Add a slight variance to the parameters for dynamic presentation aesthetics
      if (Math.random() > 0.6) {
        setSimulatedGazeOffset(prev => Math.min(30, Math.max(2, prev + (Math.random() * 4 - 2))));
        setSimulatedBlinkRate(prev => Math.min(25, Math.max(4, prev + (Math.random() * 2 - 1))));
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Web camera activation controller
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 300 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setSystemAlertMessage("Local hardware video pipeline activated. Model executing in browser sandbox.");
      }
    } catch (err: any) {
      console.warn("Camera hardware access failed or blocked.", err);
      setCameraError("Front camera hardware blocked/unreachable. Simulating visual attention vectors.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setSystemAlertMessage("Camera stopped. Switched to high-fidelity face tracking visualization.");
  };

  // Canvas loop to draw the custom "OpenCV style Landmark Mesh Overlay"
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tick = 0;
    const renderLoop = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // If active camera with a real feed, overlay transparent grid
      if (cameraActive && videoRef.current) {
        // Draw real-time detection telemetry overlay
        ctx.fillStyle = "rgba(79, 70, 229, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Render stylized academic vector face outline for presentation simulation
        ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
        ctx.lineWidth = 1.5;
        
        // Draw head boundary box
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(40, 30, 200, 220);
        ctx.setLineDash([]);

        // Brain logic wave lines inside visual feed
        ctx.beginPath();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
        ctx.arc(140, 140, 65, 0, Math.PI * 2);
        ctx.stroke();

        // Eye bounding nodes
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(115, 120, 4, 0, Math.PI * 2);
        ctx.arc(165, 120, 4, 0, Math.PI * 2);
        ctx.fill();

        // Gaze tracking arrows
        ctx.strokeStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(115, 120);
        ctx.lineTo(115 + (simulatedGazeOffset - 12) * 2, 120 + Math.sin(tick * 0.05) * 5);
        ctx.moveTo(165, 120);
        ctx.lineTo(165 + (simulatedGazeOffset - 12) * 2, 120 + Math.sin(tick * 0.05) * 5);
        ctx.stroke();

        // Mouth curvature depending on emotional attention class
        ctx.strokeStyle = "#818cf8";
        ctx.beginPath();
        if (simulatedAttentionClass === "ACTIVE") {
          ctx.arc(140, 165, 20, 0.1, Math.PI - 0.1);
        } else if (simulatedAttentionClass === "SLEEPY") {
          ctx.arc(140, 185, 10, 0, Math.PI * 2);
        } else {
          ctx.moveTo(125, 175);
          ctx.lineTo(155, 175);
        }
        ctx.stroke();

        // Pupil / Gaze Vector texts
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "10px monospace";
        ctx.fillText(`GAZE VECTOR: [${(simulatedGazeOffset * 0.8).toFixed(1)}°]`, 50, 230);
        ctx.fillText(`PITCH & YAW: [${(simulatedGazeOffset * 0.4).toFixed(1)}°, ${(simulatedGazeOffset * 1.1).toFixed(1)}°]`, 50, 242);
      }

      // Consistent OpenCV style dynamic bounding tags
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 1;
      // Active facial boundary highlights
      ctx.beginPath();
      // TL corner
      ctx.moveTo(35, 25); ctx.lineTo(60, 25); ctx.lineTo(35, 50);
      // TR corner
      ctx.moveTo(245, 25); ctx.lineTo(220, 25); ctx.lineTo(245, 50);
      ctx.stroke();

      // Detection indicators
      ctx.fillStyle = "#6366f1";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("FACEMESH_ACTIVE: TRUE", 15, 15);
      ctx.fillStyle = computedEngagementScore > 70 ? "#10b981" : "#f43f5e";
      ctx.fillText(`ENGAGEMENT: ${computedEngagementScore}%`, 180, 15);

      animationId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationId);
  }, [cameraActive, simulatedGazeOffset, simulatedAttentionClass, computedEngagementScore]);

  // Handle chatbot communications
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatInput("");

    const newMsg: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      content: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: chatMessages.map((m) => ({ role: m.role, content: m.content })),
          context: {
            name: activeStudent.name,
            grade: activeStudent.grade,
            gpa: activeStudent.gpa,
            weakSubjects: activeStudent.weakSubjects,
            interests: activeStudent.interests,
          },
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: "m-" + Date.now(),
        role: "model",
        content: data.reply || "Sorry, I am facing connectivity issues right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: "err-" + Date.now(),
        role: "model",
        content: "I ran into a server error processing that query. Here is a baseline recommendation tip: Ensure to devote at least 45 minutes to spaced learning patterns on your weakest engineering metrics.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Generate Personalized Guidance schedule from AI API
  const generateAIRecommendation = async () => {
    setIsGeneratingPlan(true);
    setSystemAlertMessage("Invoking Gemini smart recommendation pipelines...");
    try {
      const res = await fetch("/api/recommend-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: activeStudent.interests.join(", "),
          weakSubjects: activeStudent.weakSubjects.join(", "),
          academicGpa: activeStudent.gpa,
          attendance: `${activeStudent.attendance}%`,
        }),
      });
      const data = await res.json();
      setPersonalizedPlan(data);
      setSystemAlertMessage("Personalized study modules compiled & loaded securely.");
    } catch (err) {
      console.error("Failed model response generation:", err);
      // Set decent offline defaults
      setPersonalizedPlan({
        careerPath: "Advanced Cloud Native Architect",
        careerDescription: "Your cognitive tracking metrics and strong interest points recommend scaling decentralized databases alongside modern ML models.",
        certifications: [
          "AWS Certified Developer Associate",
          "Terraform Associate Certified Specialist",
          "CompTIA Security+ Framework"
        ],
        recommendedStudyHoursPerWeek: 14,
        actionableDailyTip: "Prioritize coding deep-dive seminars first thing in the morning when your visual eye focus triggers peak metrics.",
        studySchedule: [
          { day: "Mon", focusSubject: "Applied Mathematics", durationMinutes: 60, technique: "Pomodoro" },
          { day: "Tue", focusSubject: "Neural Architectures", durationMinutes: 120, technique: "Active Recall" },
          { day: "Wed", focusSubject: "Complexity Theory", durationMinutes: 90, technique: "Structured Drills" },
          { day: "Thu", focusSubject: "System Optimizations", durationMinutes: 80, technique: "Feynman approach" },
          { day: "Fri", focusSubject: "Simulation Labs", durationMinutes: 120, technique: "Peer-to-peer coding" }
        ]
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Run automatically when student context matches
  useEffect(() => {
    generateAIRecommendation();
  }, [currentStudentId]);

  // Handle tasks manipulation
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const item: Task = {
      id: "tsk-" + Date.now(),
      title: newTaskTitle,
      dueTime: "Before midnight today",
      category: "Study",
      completed: false,
    };
    setTasks(prev => [item, ...prev]);
    setNewTaskTitle("");
    setSystemAlertMessage(`Task "${item.title}" initialized.`);
  };

  // Add course
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName || !newCourseCode) return;
    const courseItem: Course = {
      id: "crs-" + Date.now(),
      code: newCourseCode.toUpperCase(),
      name: newCourseName,
      credits: 4,
      instructor: newCourseInstructor || "Dr. Catherine Bennett"
    };
    setCourses(prev => [...prev, courseItem]);
    setNewCourseName("");
    setNewCourseCode("");
    setNewCourseInstructor("");
    setSystemAlertMessage(`Course ${courseItem.code} successfully registered.`);
  };

  // Add Student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;
    const stdItem: Student = {
      id: "std-" + Date.now(),
      name: newStudentName,
      email: newStudentEmail,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      rollNo: `CS2026-0${Math.floor(Math.random() * 90) + 10}`,
      grade: "A-",
      gpa: parseFloat(newStudentGPA) || 3.4,
      attendance: 90,
      weakSubjects: newStudentWeaknesses.split(",").map(s => s.trim()),
      interests: newStudentInterests.split(",").map(i => i.trim()),
      engagementScore: 85,
      attentionHistory: [
        { timestamp: "09:00 AM", score: 80 },
        { timestamp: "10:00 AM", score: 90 }
      ]
    };
    setStudents(prev => [...prev, stdItem]);
    setNewStudentName("");
    setNewStudentEmail("");
    setNewStudentGPA("3.5");
    setNewStudentInterests("Python, Databases");
    setNewStudentWeaknesses("Calculus");
    setSystemAlertMessage(`Student ${stdItem.name} onboarded into Firestore.`);
  };

  return (
    <div className="bg-[#F8F9FC] text-slate-800 flex flex-col lg:flex-row font-sans min-h-screen">
      
      {/* ────────────────── HIGH-FIDELITY SIDEBAR NAVIGATION RAIL (Full height, dark-blue) ────────────────── */}
      <aside className="w-full lg:w-64 bg-[#0A1B33] p-4 flex flex-col gap-1 shrink-0 text-slate-200 border-r border-[#152e4d]">
        
        {/* LOGO & BRAND SECTION */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-[#122842]">
          <div className="w-9 h-9 bg-[#1C60F2] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#1c60f2]/35">
            <GraduationCap size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-none tracking-tight uppercase">Smart Classroom</h1>
            <span className="text-[10px] text-blue-400 font-bold block mt-0.5">AI Based Analysis System</span>
          </div>
        </div>

        {/* SECTION: MAIN */}
        <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest px-3.5 mb-1.5 mt-2">
          Main
        </div>
        
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left transition-all text-xs font-bold ${
              activeTab === "dashboard"
                ? "bg-[#1C60F2] text-white font-extrabold shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Layout size={15} className={activeTab === "dashboard" ? "text-white" : "text-slate-400"} />
              <span>Dashboard</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left transition-all text-xs font-bold ${
              activeTab === "students"
                ? "bg-[#1C60F2] text-white font-extrabold shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users size={15} className={activeTab === "students" ? "text-white" : "text-slate-400"} />
              <span>Students</span>
            </div>
            <span className="text-[9px] bg-slate-900 text-slate-400 font-mono px-1 rounded">ROSTER</span>
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left transition-all text-xs font-bold ${
              activeTab === "attendance"
                ? "bg-[#1C60F2] text-white font-extrabold shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck size={15} className={activeTab === "attendance" ? "text-white" : "text-slate-400"} />
              <span>Attendance</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("performance")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left transition-all text-xs font-bold ${
              activeTab === "performance"
                ? "bg-[#1C60F2] text-white font-extrabold shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Activity size={15} className={activeTab === "performance" ? "text-white" : "text-slate-400"} />
              <span>Performance</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("assignments")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left transition-all text-xs font-bold ${
              activeTab === "assignments"
                ? "bg-[#1C60F2] text-white font-extrabold shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText size={15} className={activeTab === "assignments" ? "text-white" : "text-slate-400"} />
              <span>Assignments</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("ai-engine")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left transition-all text-xs font-bold ${
              activeTab === "ai-engine"
                ? "bg-[#1C60F2] text-white font-extrabold shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Camera size={15} className={activeTab === "ai-engine" ? "text-white" : "text-slate-400"} />
              <span>AI Insights</span>
            </div>
            <span className="text-[9px] bg-red-600/30 text-red-400 font-mono px-1 rounded font-bold">CV</span>
          </button>

          <button
            onClick={() => setActiveTab("dossier")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left transition-all text-xs font-bold ${
              activeTab === "dossier"
                ? "bg-[#1C60F2] text-white font-extrabold shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={15} className={activeTab === "dossier" ? "text-white" : "text-slate-400"} />
              <span>Reports</span>
            </div>
          </button>
        </div>

        {/* SECTION: COMMUNICATION */}
        <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest px-3.5 mb-1.5 mt-4">
          Communication
        </div>

        <div className="space-y-1">
          <button
            onClick={() => {
              setSystemAlertMessage("Displaying latest Attendance and Performance notifications inside Alert Ticker.");
              setActiveTab("dashboard");
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left transition-all text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900/30"
          >
            <div className="flex items-center gap-3">
              <Bell size={15} className="text-slate-400" />
              <span>Notifications</span>
            </div>
            <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded-full">8</span>
          </button>

          <button
            onClick={() => setActiveTab("student")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left transition-all text-xs font-bold ${
              activeTab === "student"
                ? "bg-[#1C60F2] text-white font-extrabold shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={15} className={activeTab === "student" ? "text-white" : "text-slate-400"} />
              <span>Messages (Student App)</span>
            </div>
          </button>
        </div>

        {/* SECTION: DEVELOPER HUB */}
        <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest px-3.5 mb-1.5 mt-4">
          Developer Platform
        </div>
        <button
          onClick={() => setActiveTab("blueprint_hub")}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left transition-all text-xs font-bold ${
            activeTab === "blueprint_hub"
              ? "bg-[#1C60F2] text-white font-extrabold shadow-md shadow-blue-500/15"
              : "text-slate-400 hover:text-white hover:bg-slate-900/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles size={15} className={activeTab === "blueprint_hub" ? "text-white" : "text-slate-400"} />
            <span>API Specs & Blueprints</span>
          </div>
        </button>

        {/* SIDEBAR FOOTER WIDGET: AI ASSISTANT CARD */}
        <div className="mt-auto p-3.5 bg-[#0F2847] rounded-xl border border-[#1b3e69] m-1 text-center">
          <div className="w-8 h-8 bg-[#1C60F2]/10 text-[#1C60F2] rounded-full flex items-center justify-center mx-auto mb-2 text-md">
            🤖
          </div>
          <h4 className="text-[11px] font-bold text-white mb-1 leading-tight">AI Assistant</h4>
          <p className="text-[10px] text-slate-400 mb-2 leading-snug">
            Get AI powered suggestions for better teaching.
          </p>
          <button
            onClick={() => {
              setActiveTab("student");
              setSystemAlertMessage("Landed on AI Student Messaging Engine. Chat with counselor Clarissa live!");
            }}
            className="w-full text-center block text-[10px] font-black uppercase text-[#1C60F2] hover:text-white bg-[#0A1B33]/60 hover:bg-[#1C60F2] py-1.5 rounded transition"
          >
            Ask AI &rarr;
          </button>
        </div>

        <div className="pt-2 px-3 flex flex-col gap-0.5 text-[9px] text-slate-500 font-mono border-t border-[#122842] mt-2">
          <div className="flex justify-between">
            <span>Class Code:</span>
            <span className="text-slate-400">10-A</span>
          </div>
          <div className="flex justify-between">
            <span>Academic Year:</span>
            <span className="text-slate-400">2023-24</span>
          </div>
        </div>

      </aside>

      {/* ────────────────── RIGHT COLUMN: CONTAINER STAGE ────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* ────────── DYNAMIC LIGHT-THEMED TOP HEADER ────────── */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          
          {/* SEARCH INTERFACE AREA */}
          <div className="flex items-center gap-3 w-1/3">
            <Menu className="text-slate-400 hover:text-slate-600 block lg:hidden cursor-pointer shrink-0" size={18} />
            <div className="relative w-full">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students, classes, reports..."
                className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-full pl-9 pr-4 py-2 outline-none focus:bg-slate-100 border border-transparent focus:border-slate-300 transition"
              />
            </div>
          </div>

          {/* RIGHT SIDE USER AND CONTROLS PROFILE */}
          <div className="flex items-center gap-4">
            
            {/* Sync diagnostics */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                System Sync
              </span>
              <div className="flex gap-1 justify-end mt-0.5 items-center">
                <span className="text-[9px] font-mono font-bold text-emerald-600">FIRESTORE CONNECTED</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

            <button
              onClick={() => {
                setSystemAlertMessage("Classroom Alerts Ledger: 8 high priority telemetry events logged.");
              }}
              className="relative p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-6 w-[1px] bg-slate-200"></div>

            {/* Teacher digital badge metadata */}
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                alt="Rahul Sharma"
                className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden sm:block text-left leading-tight">
                <h4 className="text-xs font-black text-slate-800 leading-none">Mr. Rahul Sharma</h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Teacher</span>
              </div>
            </div>

          </div>
        </header>

        {/* ────────── MAIN CONTENT STAGE ────────── */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-[#F8F9FC]">
          
          {/* ALERT NOTIFICATION TICKER */}
          {systemAlertMessage && (
            <div className="mb-6 bg-blue-100/60 border border-blue-200 px-4 py-3 rounded-xl flex items-center justify-between text-xs text-blue-700 font-medium">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-500 animate-pulse shrink-0" />
                <span><strong>AI Insights Alert:</strong> {systemAlertMessage}</span>
              </div>
              <button onClick={() => setSystemAlertMessage(null)} className="text-blue-500 hover:text-blue-800 ml-2 text-[10px] font-black uppercase">
                Dismiss
              </button>
            </div>
          )}

          {/* ────────────────── EXTENDED HIGH-FIDELITY MODULE: CLASSROOM OVERVIEW DASHBOARD ────────────────── */}
          {activeTab === "dashboard" && (() => {
            const barChartData = [
              { name: 'Mon', attendance: 92 },
              { name: 'Tue', attendance: 88 },
              { name: 'Wed', attendance: 90 },
              { name: 'Thu', attendance: 85 },
              { name: 'Fri', attendance: 93 },
              { name: 'No Class', attendance: 0 },
            ];

            const doughnutData = [
              { name: 'Excellent (90-100%)', value: 8, color: '#10B981' },
              { name: 'Good (75-89%)', value: 18, color: '#3B82F6' },
              { name: 'Average (60-74%)', value: 10, color: '#F59E0B' },
              { name: 'Needs Improvement (<60%)', value: 6, color: '#EF4444' },
            ];

            const assignmentDonutData = [
              { name: 'Completed', value: 8, color: '#10B981' },
              { name: 'Pending', value: 4, color: '#F59E0B' },
              { name: 'Overdue', value: 2, color: '#EF4444' },
            ];

            return (
              <div className="space-y-6 animate-fade-in text-slate-800">
                
                {/* Main Subheading */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#0B1E36] tracking-tight">Dashboard Overview</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Welcome back, Mr. Rahul Sharma! Here's what's happening in your classroom.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-full border border-slate-200 flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition">
                      <Calendar size={13} className="text-blue-500" /> May 24, 2024 &rarr;
                    </span>
                  </div>
                </div>

                {/* 5 Dynamic Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  
                  {/* Stat 1: Total Students */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Students</span>
                      <span className="text-2xl font-black text-slate-800 block mt-1">{students.length}</span>
                      <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                        +4 this month &darr;
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                      <Users size={18} />
                    </div>
                  </div>

                  {/* Stat 2: Present Today */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Present Today</span>
                      <span className="text-2xl font-black text-slate-800 block mt-1 font-mono">
                        {students.filter(s => s.attendance >= 75).length}
                      </span>
                      <span className="text-[9px] text-teal-600 font-bold bg-teal-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                        {Math.round((students.filter(s => s.attendance >= 75).length / students.length) * 100)}% Attendance
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={18} />
                    </div>
                  </div>

                  {/* Stat 3: Average Performance */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Average Perf.</span>
                      <span className="text-2xl font-black text-slate-800 block mt-1 font-mono">78.6%</span>
                      <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                        +6.2% this month &uarr;
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Activity size={18} />
                    </div>
                  </div>

                  {/* Stat 4: Active Assignments */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Assignments</span>
                      <span className="text-2xl font-black text-slate-800 block mt-1 font-mono">{assignments.length}</span>
                      <span className="text-[9px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                        2 due this week
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                  </div>

                  {/* Stat 5: AI Risk Students */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">AI Risk Students</span>
                      <span className="text-2xl font-black text-rose-600 block mt-1 font-mono">5</span>
                      <span className="text-[9px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                        Needs Attention
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shrink-0">
                      <AlertCircle size={18} />
                    </div>
                  </div>

                </div>

                {/* 3 Columns charts middle division */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Left block: Attendance bar chart */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Attendance Overview</h3>
                        <span className="text-[11px] text-slate-500 font-bold block mt-0.5 flex items-center gap-1">
                          <Calendar size={12} className="text-teal-500 font-bold" /> This Week
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip />
                          <Bar dataKey="attendance" fill="#0EA5E9" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <span className="w-3 h-3 bg-[#0EA5E9] rounded-sm"></span>
                      <span className="text-[10px] text-slate-500 font-bold">Attendance %</span>
                    </div>
                  </div>

                  {/* Center Block: Performance doughnut */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <div>
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Performance Overview</h3>
                      <span className="text-[11px] text-slate-500 font-bold block mt-0.5">This Month</span>
                    </div>
                    <div className="relative w-full h-44 flex items-center justify-center mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={doughnutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={73}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {doughnutData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute text-center mt-1">
                        <span className="text-2xl font-black text-slate-800">78.6%</span>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-widest mt-0.5">Average</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2 text-[10px] leading-tight">
                      {doughnutData.map((d, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                          <span className="text-slate-500 font-medium truncate">{d.name}: <strong className="text-slate-800">{d.value}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Block: AI Insights alert lists */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center text-sm">
                        🤖
                      </div>
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">AI Generated Insights</h3>
                    </div>
                    <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                      
                      <button
                        onClick={() => {
                          setSystemAlertMessage("Directing you to Roster view to inspect student warning parameters.");
                          setActiveTab("students");
                        }}
                        className="w-full text-left p-3 rounded-xl border border-red-100 bg-red-50/40 hover:bg-red-50 transition flex justify-between items-center gap-3"
                      >
                        <div className="flex gap-2.5 items-start">
                          <span className="text-lg mt-0.5">🔴</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">5 Students at Academic Risk</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">AI has identified students who need immediate session attention.</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0" />
                      </button>

                      <button
                        onClick={() => {
                          setSystemAlertMessage("Dispatched self-regulation task block reminder: Low Active Participation cohort notified.");
                        }}
                        className="w-full text-left p-3 rounded-xl border border-amber-100 bg-amber-50/40 hover:bg-amber-50 transition flex justify-between items-center gap-3"
                      >
                        <div className="flex gap-2.5 items-start">
                          <span className="text-lg mt-0.5">🟡</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Low Active Participation</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Multiple students recorded as passive during recent curriculum logs.</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0" />
                      </button>

                      <button
                        onClick={() => {
                          setSystemAlertMessage("Classroom mean efficiency index increased significantly by +6.2% since last evaluation.");
                        }}
                        className="w-full text-left p-3 rounded-xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition flex justify-between items-center gap-3"
                      >
                        <div className="flex gap-2.5 items-start">
                          <span className="text-lg mt-0.5">🟢</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Improvement Trend Detected</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Overall class mean performance boosted by 6.2% this month.</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-emerald-500 shrink-0" />
                      </button>

                    </div>
                  </div>

                </div>

                {/* Bottom Row Grid 3 divisions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* 1. Top Performers with sparkling sparkles */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <Trophy size={14} className="text-amber-500" /> Top Performers
                      </h3>
                      <span className="text-[10px] text-emerald-600 font-mono font-black">ACTIVE STATUS</span>
                    </div>
                    <div className="space-y-2.5">
                      {students.slice(0, 5).map((std, i) => (
                        <div key={std.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-bold text-slate-400 w-2 shrink-0">{i+1}</span>
                            <img src={std.avatar} alt="logo" className="w-7.5 h-7.5 object-cover rounded-full border border-slate-100" />
                            <div className="leading-tight">
                              <h4 className="text-xs font-bold text-slate-800">{std.name}</h4>
                              <span className="text-[9px] text-slate-400 font-mono">{std.rollNo}</span>
                            </div>
                          </div>
                          <div className="text-right leading-tight">
                            <span className="text-xs font-black text-slate-800 block">{(94 - i * 3)}%</span>
                            <span className="text-[8px] text-emerald-600 font-bold block flex items-center gap-0.5 font-mono">
                              <TrendingUp size={8} /> +0.8%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Assignment status donut progress */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <div>
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Assignment Status</h3>
                      <span className="text-[10px] block text-slate-400 mt-1">Syllabus Submissions</span>
                    </div>
                    <div className="relative w-full h-36 flex items-center justify-center mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assignmentDonutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={62}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {assignmentDonutData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute text-center mt-1">
                        <span className="text-xl font-black text-slate-800">14</span>
                        <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-widest">Total</span>
                      </div>
                    </div>
                    <div className="flex justify-around text-[10px] mt-1.5 leading-tight">
                      {assignmentDonutData.map((col, k) => (
                        <div key={k} className="text-center font-semibold">
                          <span className="text-[9px] block uppercase font-bold" style={{ color: col.color }}>{col.name}</span>
                          <span className="text-xs font-extrabold text-[#0B1E36]">{col.value} items</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveTab("assignments")}
                      className="w-full text-center block text-[10px] py-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition font-bold text-blue-600 mt-3"
                    >
                      View All Assignments &rarr;
                    </button>
                  </div>

                  {/* 3. Recent classroom notifications logs */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Recent Notifications</h3>
                      <button onClick={() => { setSystemAlertMessage("Broadcasted standard telemetry clear signal."); }} className="text-[10px] text-blue-600 font-bold hover:underline">
                        View All
                      </button>
                    </div>
                    <div className="space-y-3.5 flex-1">
                      
                      <div className="flex gap-3 text-xs leading-tight">
                        <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0 animate-ping"></span>
                        <div>
                          <h4 className="font-extrabold text-[#0B1E36]">Rohit Kumar was absent today</h4>
                          <span className="text-[9.5px] text-slate-400 block mt-0.5">10:30 AM • Attendance Alert</span>
                        </div>
                      </div>

                      <div className="flex gap-3 text-xs leading-tight">
                        <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                        <div>
                          <h4 className="font-extrabold text-[#0B1E36]">'Maths Assignment' is due tomorrow</h4>
                          <span className="text-[9.5px] text-slate-400 block mt-0.5">09:15 AM • Assignment Due</span>
                        </div>
                      </div>

                      <div className="flex gap-3 text-xs leading-tight">
                        <span className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
                        <div>
                          <h4 className="font-extrabold text-[#0B1E36]">Monthly performance report is ready</h4>
                          <span className="text-[9.5px] text-slate-400 block mt-0.5">08:45 AM • New Report Generated</span>
                        </div>
                      </div>

                      <div className="flex gap-3 text-xs leading-tight">
                        <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
                        <div>
                          <h4 className="font-extrabold text-[#0B1E36]">Meeting with parents on May 28, 2024</h4>
                          <span className="text-[9.5px] text-slate-400 block mt-0.5">Yesterday • Parent Meeting</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Bottom footer bar */}
                <div className="bg-slate-100 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center text-[10px] text-[#0B1E36] font-mono gap-2 border border-slate-250">
                  <div className="flex items-center gap-4">
                    <span>CLASS: 10 - A</span>
                    <span>ACADEMIC YEAR: 2023-24</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span>System Status: All Systems Operational</span>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ────────────────── SUB-MODULE: STUDENTS REGISTER & ROSTER ────────────────── */}
          {activeTab === "students" && (
            <div className="space-y-6 animate-fade-in text-slate-800">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0B1E36] tracking-tight">Academic Cohort</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage active database enrollments and onboard students to Firestore context variables.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSystemAlertMessage("Onboarding component triggered. Complete the registry form below.");
                  }}
                  className="bg-[#1C60F2] text-white hover:bg-blue-700 font-bold text-xs px-4 py-2 rounded-xl transition shadow"
                >
                  + Register New Student
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Students Roster table representation */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Class 10-A Enrollment</h3>
                    <span className="text-[10px] text-slate-400">Click student to make active companion</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/30 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                          <th className="p-3.5">Student Name</th>
                          <th className="p-3.5">Roll Number</th>
                          <th className="p-3.5">GPA Core</th>
                          <th className="p-3.5 text-center">Simulated Attention</th>
                          <th className="p-3.5 text-right font-mono">Operations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students.map((student) => (
                          <tr
                            key={student.id}
                            onClick={() => {
                              setCurrentStudentId(student.id);
                              setSystemAlertMessage(`Context student focus switched to: ${student.name}`);
                            }}
                            className={`hover:bg-slate-50 transition cursor-pointer ${
                              student.id === currentStudentId ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <td className="p-3.5 font-bold text-slate-800 flex items-center gap-2">
                              <img src={student.avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200" />
                              {student.name}
                            </td>
                            <td className="p-3.5 font-mono text-slate-500 font-semibold">{student.rollNo}</td>
                            <td className="p-3.5 font-mono font-bold text-blue-600">{student.gpa.toFixed(2)}</td>
                            <td className="p-3.5 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                student.engagementScore >= 80 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                              }`}>
                                {student.engagementScore}% engagement
                              </span>
                            </td>
                            <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setSystemAlertMessage(`Dispatched self-regulation telemetry trigger notification to ${student.name}'s mobile!`);
                                }}
                                className="text-rose-600 hover:text-white hover:bg-rose-600 px-3 py-1 rounded-xl transition text-[10px] font-bold border border-rose-100 bg-rose-50/20"
                              >
                                Alert Student
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Firestore Register Addition Card Form */}
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Onboard Student registry</h3>
                  
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-1">Full Pupil Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Ananya Sharma"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-lg p-2.5 outline-none border border-transparent focus:border-blue-400 transition"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-1">Academic Email</label>
                      <input
                        type="email"
                        required
                        placeholder="ananya.sharma@school.edu"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-lg p-2.5 outline-none border border-transparent focus:border-blue-400 transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-1">GPA (Out of 4.0)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1.0"
                          max="4.0"
                          value={newStudentGPA}
                          onChange={(e) => setNewStudentGPA(e.target.value)}
                          className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-lg p-2.5 outline-none border border-transparent focus:border-blue-400 transition font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-1">Roll ID Number</label>
                        <input
                          type="text"
                          required
                          placeholder="CS-2024-42"
                          className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-lg p-2.5 outline-none border border-transparent focus:border-blue-400 transition font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-1">Interests (Comma Separated)</label>
                      <input
                        type="text"
                        value={newStudentInterests}
                        onChange={(e) => setNewStudentInterests(e.target.value)}
                        placeholder="Python, AI, Robotics"
                        className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-lg p-2.5 outline-none border border-transparent focus:border-blue-400 transition"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-1">Weaknesses (Comma Separated)</label>
                      <input
                        type="text"
                        value={newStudentWeaknesses}
                        onChange={(e) => setNewStudentWeaknesses(e.target.value)}
                        placeholder="Linear Algebra, Chemistry"
                        className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-lg p-2.5 outline-none border border-transparent focus:border-blue-400 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#1C60F2] text-white hover:bg-blue-700 py-2.5 rounded-xl text-xs font-black uppercase transition shadow-md shadow-blue-500/10"
                    >
                      Sync & Register Student
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* ────────────────── SUB-MODULE: ATTENDANCE LEDGER TAKER ────────────────── */}
          {activeTab === "attendance" && (
            <div className="space-y-6 animate-fade-in text-slate-800">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0B1E36] tracking-tight">Interactive Classroom Attendance</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Mark physical or remote status parameters to dynamically recalculate overall cockpit analytics scores.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setStudents(prev => prev.map(s => ({ ...s, attendance: 95 })));
                      setSystemAlertMessage("Marked all student entities as Present today! Registry ledger synchronized.");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => {
                      setSystemAlertMessage("Dispatched attendance warning summaries to respective guardians.");
                    }}
                    className="bg-indigo-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Send Digest Report
                  </button>
                </div>
              </div>

              {/* Attendance Checklist grid */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => {
                    const isPresent = student.attendance >= 75;
                    return (
                      <div
                        key={student.id}
                        className={`p-4 rounded-xl border transition flex items-center justify-between ${
                          isPresent ? "bg-emerald-50/40 border-emerald-100 text-slate-800" : "bg-red-50/40 border-red-100 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={student.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                          <div>
                            <h4 className="text-xs font-black truncate">{student.name}</h4>
                            <span className="text-[10px] text-slate-400 block font-mono">{student.rollNo}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setStudents(prev => prev.map(s => {
                                if (s.id === student.id) {
                                  return { ...s, attendance: 90 };
                                }
                                return s;
                              }));
                              setSystemAlertMessage(`Marked ${student.name} as Present.`);
                            }}
                            className={`px-2.5 py-1 text-[9px] font-black uppercase rounded ${
                              isPresent ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => {
                              setStudents(prev => prev.map(s => {
                                if (s.id === student.id) {
                                  return { ...s, attendance: 60 };
                                }
                                return s;
                              }));
                              setSystemAlertMessage(`Marked ${student.name} as Absent - triggered risk classification.`);
                            }}
                            className={`px-2.5 py-1 text-[9px] font-black uppercase rounded ${
                              !isPresent ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── SUB-MODULE: PERFORMANCE MATRIX LEDGER ────────────────── */}
          {activeTab === "performance" && (
            <div className="space-y-6 animate-fade-in text-slate-800">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0B1E36] tracking-tight">Grade Ledger & Analytics</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Visualise class mean grade points, student performance indexing, and learning efficiency metrics.
                  </p>
                </div>
                <div className="bg-[#1C60F2]/10 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold font-mono">
                  CLASS MEAN GPA: 3.39 / 4.00
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                
                {/* GPA Projection visual line list */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Class Performance Index</h3>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800">{student.name}</span>
                          <span className="font-mono font-bold text-blue-600">GPA {student.gpa.toFixed(2)} ({student.grade})</span>
                        </div>
                        <div className="w-full bg-[#F3F4F6] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all"
                            style={{ width: `${(student.gpa / 4.0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject-Wise Mastery statistics panel */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Subject-Wise Mastery Logs</h3>
                  
                  <div className="p-4 rounded-xl border border-teal-100 bg-teal-50/20 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Python & Advanced Automation</span>
                      <span>91% Mastery</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Excellent understanding of loops, structures, and libraries recorded by AI companion logs.</p>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/20 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Database Management & SQL</span>
                      <span>84% Mastery</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Strong querying precision demonstrated during recent virtual code submissions.</p>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20 text-xs">
                    <div className="flex justify-between font-bold text-slate-800 text-rose-700">
                      <span>Advanced Calculus & Algebra</span>
                      <span>54% Mastery (Action Recommended)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Requires targeted math study sequences. Dispatched custom planner tasks to respective student view.</p>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ────────────────── SUB-MODULE: TEACHER ASSIGNMENTS MATRIX ────────────────── */}
          {activeTab === "assignments" && (
            <div className="space-y-6 animate-fade-in text-slate-800">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0B1E36] tracking-tight">Active Classroom Assignments</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Assign linear coursework, evaluate progress metrics with real time submissions synchronization.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Assignments record list tab */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Active Assignment Tasks ledger</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {assignments.map((asg) => (
                      <div key={asg.id} className="p-4.5 flex justify-between items-start hover:bg-slate-50 transition gap-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-800">{asg.title}</h4>
                          <div className="flex gap-3 text-[10px] text-slate-400 font-semibold">
                            <span>Subject: <strong className="text-slate-600">{asg.subject}</strong></span>
                            <span>Due Date: <strong className="text-indigo-600">{asg.dueDate}</strong></span>
                          </div>
                        </div>
                        <div className="text-right whitespace-nowrap leading-tight">
                          <span className="text-xs font-black text-slate-800">{asg.maxScore} Max GPA</span>
                          <span className="text-[9.5px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded block mt-1.5 w-fit ml-auto">
                            {asg.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create Custom Assignment sheet panel */}
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Create Assignment</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Course Assignment Title</label>
                      <input
                        type="text"
                        placeholder="Neural Network Basics Lab 4"
                        className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-lg p-2.5 outline-none border border-transparent focus:border-blue-400 transition"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Target Curriculum Subject</label>
                      <select className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-lg p-2.5 outline-none border border-transparent focus:border-blue-400 transition cursor-pointer">
                        <option>Computer Architecture</option>
                        <option>Advanced Machine Learning</option>
                        <option>Linear Algebra & Vectors</option>
                        <option>Software Architecture Design</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">Points Weight</label>
                        <input
                          type="number"
                          placeholder="100"
                          className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-lg p-2.5 outline-none border border-transparent focus:border-blue-400 transition"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">Target Due Date</label>
                        <input
                          type="text"
                          placeholder="May 29, 2024"
                          className="w-full bg-[#F3F4F6] text-xs text-slate-800 rounded-lg p-2.5 outline-none border border-transparent focus:border-blue-400 transition"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSystemAlertMessage("New academic course assignment dispatched to student companion ledgers.");
                      }}
                      className="w-full bg-[#1C60F2] text-white hover:bg-blue-700 font-black uppercase py-2.5 rounded-xl block text-center transition mt-4"
                    >
                      Publish Assignment
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ────────────────── MODULE 1: COMPUTER VISION & LIVE ATTENTION MODULE ────────────────── */}
          {activeTab === "ai-engine" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Camera className="text-indigo-500" /> Module 4: Real-time OpenCV Attention Tracker
                  </h2>
                  <p className="text-xs text-slate-400">
                    Calculates Gaze Euler vector deviations, facial feature coordinate extraction, and dynamic blink tracking variables via virtual OpenCV engine.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={cameraActive ? stopCamera : startCamera}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                      cameraActive ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                    }`}
                  >
                    <Camera size={14} />
                    {cameraActive ? "Deactivate Camera" : "Authorize Student Webcam"}
                  </button>
                </div>
              </div>

              {/* Grid split for live visualizer AND metrics variables */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visualizer Feed Grid Box */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                  <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                        OPENCV_CORE_MESH_PIPE (Buffered)
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">
                      FEED: HOST_DEVICE_WEBCAM
                    </span>
                  </div>

                  <div className="relative bg-slate-950 aspect-video flex items-center justify-center p-2">
                    {/* Real Video Element */}
                    <video
                      ref={videoRef}
                      className={`absolute inset-0 w-full h-full object-cover rounded-md ${
                        cameraActive ? "opacity-90 block" : "hidden"
                      }`}
                      playsInline
                      muted
                    ></video>

                    {/* Landmark Vector Graphic Canvas */}
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={260}
                      className="absolute z-10 pointer-events-none drop-shadow-lg"
                    />

                    {/* Standard Vector Backing if Camera is Offline */}
                    {!cameraActive && (
                      <div className="text-center p-6 z-0 max-w-sm">
                        <div className="w-12 h-12 bg-slate-900 border border-slate-700 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Compass className="animate-spin" size={20} />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">Synthesizing Computational Graph</h4>
                        <p className="text-xs text-slate-500">
                          To bind raw high-speed user landmarks, toggle the Webcam Authorization flag above. Simulating active vector tracking maps in the interim.
                        </p>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                      <span className="bg-slate-900/90 text-[10px] border border-slate-700 font-mono text-indigo-400 px-2 py-1 rounded">
                        GAZE CLASSIFIER: {simulatedAttentionClass}
                      </span>
                    </div>
                  </div>

                  {/* Physical CV sliders & preset selectors for user playtesting */}
                  <div className="p-4 bg-slate-900/60 border-t border-slate-800 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                          Visual Signal Simulator Controls
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Manipulate simulation telemetry parameters to observe recalculation cycles on our scoring models.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => {
                            setSimulatedAttentionClass("ACTIVE");
                            setSimulatedGazeOffset(4);
                            setSimulatedBlinkRate(12);
                          }}
                          className={`px-2.5 py-1 text-[10px] rounded border transition font-bold ${
                            simulatedAttentionClass === "ACTIVE"
                              ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/40"
                              : "bg-slate-850 hover:bg-slate-800 text-slate-400 border-slate-800"
                          }`}
                        >
                          Focused Active
                        </button>
                        <button
                          onClick={() => {
                            setSimulatedAttentionClass("DISTRACTED");
                            setSimulatedGazeOffset(27);
                            setSimulatedBlinkRate(16);
                          }}
                          className={`px-2.5 py-1 text-[10px] rounded border transition font-bold ${
                            simulatedAttentionClass === "DISTRACTED"
                              ? "bg-amber-600/20 text-amber-400 border-amber-500/40"
                              : "bg-slate-850 hover:bg-slate-800 text-slate-400 border-slate-800"
                          }`}
                        >
                          Looking Away (Distracted)
                        </button>
                        <button
                          onClick={() => {
                            setSimulatedAttentionClass("SLEEPY");
                            setSimulatedGazeOffset(6);
                            setSimulatedBlinkRate(3);
                          }}
                          className={`px-2.5 py-1 text-[10px] rounded border transition font-bold ${
                            simulatedAttentionClass === "SLEEPY"
                              ? "bg-violet-600/20 text-violet-400 border-violet-500/40"
                              : "bg-slate-850 hover:bg-slate-800 text-slate-400 border-slate-800"
                          }`}
                        >
                          Drowsy / Sleepy (Low Blinks)
                        </button>
                        <button
                          onClick={() => {
                            setSimulatedAttentionClass("PHONE");
                            setSimulatedGazeOffset(29);
                            setSimulatedBlinkRate(19);
                          }}
                          className={`px-2.5 py-1 text-[10px] rounded border transition font-bold ${
                            simulatedAttentionClass === "PHONE"
                              ? "bg-rose-600/20 text-rose-400 border-rose-500/40"
                              : "bg-slate-850 hover:bg-slate-800 text-slate-400 border-slate-800"
                          }`}
                        >
                          Phone Usage / Heads Down
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono text-slate-400">
                          <span>Euler Yaw & Pitch Deviation</span>
                          <span className="text-white font-bold">{simulatedGazeOffset.toFixed(1)}° (Max 30)</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          step="0.5"
                          value={simulatedGazeOffset}
                          onChange={(e) => setSimulatedGazeOffset(parseFloat(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-800 rounded"
                        />
                        <span className="text-[9px] text-slate-500 block">Values above 15° trigger a non-engagement warning.</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono text-slate-400">
                          <span>Blink Frequency (Hz baseline)</span>
                          <span className="text-white font-bold">{simulatedBlinkRate} / min</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          value={simulatedBlinkRate}
                          onChange={(e) => setSimulatedBlinkRate(parseInt(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-800 rounded"
                        />
                        <span className="text-[9px] text-slate-500 block">Typical focus rate resides inside 10 - 18 range.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Computational Analytics Panel - Right Column */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Gauge metrics */}
                  <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-xl shadow mt-0">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">
                      Real-time Computed Engagement Index
                    </h3>
                    
                    <div className="flex items-center gap-6">
                      <div className="relative w-28 h-28 flex items-center justify-center rounded-full border border-slate-800/50 bg-slate-950/40 shrink-0">
                        <div className="text-center">
                          <span className="text-3xl font-black text-white font-mono leading-none">
                            {computedEngagementScore}%
                          </span>
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest block mt-0.5">
                            SCORE
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 flex-1">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Gaze Telemetry Assessment</span>
                          <p className="text-xs text-slate-300 font-medium">
                            {simulatedAttentionClass === "ACTIVE" 
                              ? "Excellent. Eye-gaze lock matches spatial orientation vectors exactly."
                              : simulatedAttentionClass === "DISTRACTED"
                              ? "Distracted. Eye alignment registers away from active viewport boundaries."
                              : simulatedAttentionClass === "SLEEPY"
                              ? "CRITICAL. Low eye activity coupled with sustained eyelids down flags drowsy warning."
                              : "Alert! Student is focused towards personal device outside classroom scope."}
                          </p>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-350 rounded-full ${
                              computedEngagementScore > 75
                                ? "bg-emerald-500"
                                : computedEngagementScore > 50
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${computedEngagementScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Over Time Chart */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex-1 flex flex-col">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">
                      Live Attention Trend (Last 5 mins)
                    </h3>
                    
                    <div className="h-44 w-full text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={realtimeHistory.concat([{ timestamp: "Now", engagement: computedEngagementScore }])}
                          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" stroke="#64748b" />
                          <YAxis domain={[0, 100]} stroke="#64748b" />
                          <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                          <Area type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorEngage)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="text-sm">🤖</span>
                      <span>
                        <strong>AI Edge Prediction:</strong> Focus level baseline of <strong>{activeStudent.name}</strong> is currently on track for student goal achievement. No visual intervention triggers registered.
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ────────────────── MODULE 2: PERSONALIZED STUDENT MOBILE SIMULATOR ────────────────── */}
          {activeTab === "student" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User className="text-indigo-500" /> Module 1: Personalized Student Mobile Hub
                  </h2>
                  <p className="text-xs text-slate-400">
                    High-density viewport simulator showing active interactive goals, daily guide study plans, and live chat queries with Gemini advisor Clarissa.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Simulating Device:</span>
                  <span className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded text-slate-300 font-mono">
                    PIXEL_8_LANDSCAPE
                  </span>
                </div>
              </div>

              {/* Multi-pane high fidelity Student layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT BLOCK: Profile Stats & Core Tasks */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* 1. Student Digital Bio ID */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                    <img
                      src={activeStudent.avatar}
                      alt={activeStudent.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/40"
                    />
                    <div>
                      <h3 className="text-md font-bold text-white leading-tight">{activeStudent.name}</h3>
                      <span className="text-xs text-indigo-400 block font-mono">{activeStudent.rollNo}</span>
                      <div className="flex gap-2 mt-1.5 matches-box">
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          GPA: {activeStudent.gpa}
                        </span>
                        <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded font-mono">
                          Attn: {activeStudent.attendance}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Personal Learning Constraints and Interests Editor */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3 block">
                      Individual Profile Diagnostics
                    </h4>

                    {/* Interests display */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">
                          Academic Interests & Specalities
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {activeStudent.interests.map((int, idx) => (
                            <span key={idx} className="bg-indigo-900/20 text-indigo-200 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded-full">
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">
                          Weak Core Disciplines (Targeted for Study Planner)
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {activeStudent.weakSubjects.map((wk, idx) => (
                            <span key={idx} className="bg-rose-950/40 text-rose-300 border border-rose-800/30 text-[10px] px-2 py-0.5 rounded-full">
                              {wk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-850">
                      <span className="text-[10px] text-slate-500 block mb-2 leading-tight">
                        Update Student Characteristics to recalculate AI guidelines in real-time.
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setStudents(prev => prev.map(s => {
                              if (s.id === currentStudentId) {
                                return {
                                  ...s,
                                  interests: ["Cyber Security", "Penetration Testing", "Linux OS"],
                                  weakSubjects: ["Calculus", "Abstract Algebra"]
                                };
                              }
                              return s;
                            }));
                            setSystemAlertMessage("Custom profiles matched. AI Planner recalculated.");
                          }}
                          className="bg-slate-950 hover:bg-slate-850 p-1.5 rounded text-left text-[10px] border border-slate-800 text-slate-300"
                        >
                          👔 System Security Focus
                        </button>
                        <button
                          onClick={() => {
                            setStudents(prev => prev.map(s => {
                              if (s.id === currentStudentId) {
                                return {
                                  ...s,
                                  interests: ["Computer Vision", "Robotics", "Mechanical Dynamics"],
                                  weakSubjects: ["System Programming"]
                                };
                              }
                              return s;
                            }));
                            setSystemAlertMessage("Profile shifted to Intelligent Mechatronics.");
                          }}
                          className="bg-slate-950 hover:bg-slate-850 p-1.5 rounded text-left text-[10px] border border-slate-800 text-slate-300"
                        >
                          🤖 Vision AI / Systems Focus
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Daily task listing inside student app */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
                        Interactive Task List
                      </h4>
                      <span className="text-[10px] font-mono bg-indigo-900/30 text-indigo-300 px-1.5 rounded">
                        {tasks.filter(t => !t.completed).length} Pending
                      </span>
                    </div>

                    {/* New Task Inline Form */}
                    <form onSubmit={handleCreateTask} className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Add a daily custom study task..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="bg-slate-950 text-xs text-white border border-slate-800 px-3 py-1.5 rounded-lg flex-1 outline-none focus:border-indigo-500 transition"
                      />
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg text-xs font-bold transition shrink-0">
                        <Plus size={14} />
                      </button>
                    </form>

                    {/* Dynamic List */}
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition ${
                            task.completed
                              ? "bg-slate-950/40 border-slate-850 text-slate-500 line-through"
                              : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={task.completed ? "text-emerald-500" : "text-slate-600"}>
                              <CheckCircle size={14} />
                            </span>
                            <span>{task.title}</span>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono italic shrink-0">
                            {task.dueTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* MIDDLE & RIGHT BLOCK: Study Planner AI Recommendations + Clarissa chatbot */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  
                  {/* TAB SWITCH FOR PLANNERS VS CHAT ASSISTANT */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* LEFT CELL: Dynamic Generated Schedule Output */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col">
                      <div className="flex justify-between items-center mb-2.5">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                          Adaptive AI Career Guidance & Study Core
                        </h3>
                        <button
                          onClick={generateAIRecommendation}
                          disabled={isGeneratingPlan}
                          className="text-[10px] text-indigo-400 hover:text-white flex items-center gap-1 font-bold cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw size={10} className={isGeneratingPlan ? "animate-spin" : ""} />
                          Recalculate Path
                        </button>
                      </div>

                      {isGeneratingPlan ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12">
                          <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                          <span className="text-xs text-slate-400">Consulting Gemini modeling pipeline...</span>
                        </div>
                      ) : personalizedPlan ? (
                        <div className="space-y-4 flex-1">
                          
                          {/* Recommended Career Target Title */}
                          <div className="bg-indigo-950/20 border border-indigo-500/25 p-3 rounded-lg">
                            <span className="text-[9px] font-mono uppercase bg-indigo-500 text-white px-1.5 py-0.5 rounded inline-block mb-1 font-bold">
                              AI Target Career Profile
                            </span>
                            <h4 className="text-sm font-bold text-white">{personalizedPlan.careerPath}</h4>
                            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                              {personalizedPlan.careerDescription}
                            </p>
                          </div>

                          {/* Dynamic Study Tip */}
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 italic">
                            <strong>Daily Focus Tip:</strong> "{personalizedPlan.actionableDailyTip}"
                          </div>

                          {/* Recommended Certifications */}
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-black block mb-1.5">
                              Recommended Industry Certifications
                            </span>
                            <div className="space-y-1">
                              {personalizedPlan.certifications.map((cert, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                                  <span>{cert}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Computed Weekly Hours target */}
                          <div className="flex justify-between items-center text-xs py-2 border-t border-slate-850">
                            <span className="text-slate-400">Recommended hours / week:</span>
                            <span className="text-indigo-400 font-bold font-mono">
                              {personalizedPlan.recommendedStudyHoursPerWeek} Hours
                            </span>
                          </div>

                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-center py-12 text-slate-500 text-xs">
                          No active study path. Trigger recalculated layout metrics.
                        </div>
                      )}
                    </div>

                    {/* RIGHT CELL: Beautiful Chatbot Assistant backed by real express route */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[400px]">
                      <div className="border-b border-slate-800 pb-3 mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                          <span className="text-xs font-black uppercase text-slate-300 tracking-wider">
                            Ask Clarissa (AI Assistant)
                          </span>
                        </div>
                        <span className="text-[10px] bg-slate-800 text-indigo-400 font-mono px-1.5 rounded">
                          GEMINI CLOUD
                        </span>
                      </div>

                      {/* Message History Space */}
                      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin text-xs">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col max-w-[85%] ${
                              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                            }`}
                          >
                            <span className="text-[9px] text-slate-500 mb-0.5 font-mono">
                              {msg.role === "user" ? "Student" : "Clarissa Bot"} &bull; {msg.timestamp}
                            </span>
                            <div
                              className={`p-2.5 rounded-lg leading-relaxed ${
                                msg.role === "user"
                                  ? "bg-indigo-600/90 text-white rounded-tr-none"
                                  : "bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none font-sans"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {isChatLoading && (
                          <div className="mr-auto flex items-center gap-2 p-1 text-slate-500">
                            <Loader2 className="animate-spin" size={14} />
                            <span className="text-[10px] font-mono italic">Clarissa is formulating response...</span>
                          </div>
                        )}
                      </div>

                      {/* Chat Input form */}
                      <form onSubmit={handleSendMessage} className="flex gap-2 mt-3 pt-3 border-t border-slate-850">
                        <input
                          type="text"
                          placeholder="Ask about your academic performance, weak subjects..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="bg-slate-950 text-xs text-white border border-slate-800 px-3 py-2 rounded-lg flex-1 outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition shrink-0"
                          disabled={isChatLoading || !chatInput.trim()}
                        >
                          <Send size={14} />
                        </button>
                      </form>
                    </div>

                  </div>

                  {/* BOTTOM BLOCK: Study Schedule Timeline representation */}
                  {personalizedPlan && (
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-3">
                        AI Recommended Interactive Study Blocks
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {personalizedPlan.studySchedule.map((sched, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] bg-slate-900 text-indigo-400 font-mono px-1 rounded block w-fit mb-1 font-bold">
                                {sched.day.toUpperCase()}
                              </span>
                              <h5 className="text-xs font-bold text-white line-clamp-1">{sched.focusSubject}</h5>
                              <p className="text-[10px] text-slate-400 mt-0.5 italic">
                                {sched.technique}
                              </p>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono block mt-2 text-right">
                              ⏱️ {sched.durationMinutes} Min
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          )}

          {/* ────────────────── MODULE 3: TEACHER PORTAL ────────────────── */}
          {activeTab === "teacher" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="text-indigo-500" /> Module 2: Teacher Classroom Dashboard
                  </h2>
                  <p className="text-xs text-slate-400">
                    Sustained roster monitoring tools, assignment grades overview, and interactive manual intervention buttons to counsel students.
                  </p>
                </div>

                <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
                  <span className="text-xs text-slate-300 font-mono px-3 py-1 bg-slate-800 rounded text-center">
                    LOGGED IN: DR. CATHERINE BENNETT
                  </span>
                </div>
              </div>

              {/* Quick Teacher stat tiles */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-widest">
                    REGISTERED COHORTS
                  </span>
                  <span className="text-2xl font-black text-white font-mono block mt-1">
                    28 Students
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                    100% active database synchronization
                  </span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-widest">
                    CLASSROOM ATTENTION INDEX
                  </span>
                  <span className="text-2xl font-black text-indigo-400 font-mono block mt-1">
                    {Math.round(students.reduce((acc, curr) => acc + curr.engagementScore, 0) / students.length)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Optimal range evaluated by live AI model
                  </span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-widest">
                    GPA CLASS MEAN
                  </span>
                  <span className="text-2xl font-black text-white font-mono block mt-1">
                    3.39 / 4.00
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono block mt-0.5">
                    Above university engineering threshold
                  </span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-widest">
                    ACTIVE ASSIGNMENTS
                  </span>
                  <span className="text-2xl font-black text-white font-mono block mt-1">
                    {assignments.length} Submissions
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">
                    Auto-synced with learning modules
                  </span>
                </div>
              </div>

              {/* Core Student lists & addition layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Side: Student Roster Management list - 8 col */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                  <div className="px-5 py-3.5 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
                    <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                      Academic Cohort & Gaze Analytics Roster
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Click names to preview student parameters
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-850 bg-slate-950/30 text-slate-400 uppercase tracking-widest text-[9px] font-mono">
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Roll Number</th>
                          <th className="p-3">Attendance Ratio</th>
                          <th className="p-3 text-center">Class Grade</th>
                          <th className="p-3 text-center">Attention Factor</th>
                          <th className="p-3 text-right">Intervention Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {students.map((student) => (
                          <tr
                            key={student.id}
                            className={`hover:bg-slate-850/45 transition cursor-pointer ${
                              student.id === currentStudentId ? "bg-indigo-950/20" : ""
                            }`}
                            onClick={() => setCurrentStudentId(student.id)}
                          >
                            <td className="p-3 font-semibold text-white flex items-center gap-2">
                              <img src={student.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover shrink-0" />
                              {student.name}
                            </td>
                            <td className="p-3 font-mono text-slate-400">{student.rollNo}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5 font-bold">
                                <span className={student.attendance < 75 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                                  {student.attendance}%
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-center font-bold font-mono text-indigo-300">
                              {student.grade} (GPA: {student.gpa.toFixed(2)})
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className={`text-xs font-bold ${
                                  student.engagementScore > 75
                                    ? "text-emerald-400"
                                    : student.engagementScore > 50
                                    ? "text-amber-400"
                                    : "text-rose-400"
                                }`}>
                                  {student.engagementScore}%
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setSystemAlertMessage(`Self-regulation request dispatched to ${student.name}'s daily task ledger!`);
                                }}
                                className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-2.5 py-1 rounded text-[10px] transition border border-indigo-500/20 font-bold"
                              >
                                Trigger Warning
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Side: Quick Add Student & Syllabus controls - 4 col */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Onboarding Student form */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-3">
                      Onboard Student into System
                    </h3>
                    
                    <form onSubmit={handleAddStudent} className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g., Jane Watson"
                          value={newStudentName}
                          onChange={(e) => setNewStudentName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Email</label>
                          <input
                            type="email"
                            required
                            placeholder="jane@university.edu"
                            value={newStudentEmail}
                            onChange={(e) => setNewStudentEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Target GPA</label>
                          <input
                            type="text"
                            required
                            placeholder="3.5"
                            value={newStudentGPA}
                            onChange={(e) => setNewStudentGPA(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase block">Student Interset tags (comma separated)</label>
                        <input
                          type="text"
                          placeholder="Discrete Math, Graph Theory"
                          value={newStudentInterests}
                          onChange={(e) => setNewStudentInterests(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1 font-mono">
                        <label className="text-[10px] text-slate-500 uppercase block">Weak subjects (Syllabus guidance targets)</label>
                        <input
                          type="text"
                          placeholder="Advanced Algebra"
                          value={newStudentWeaknesses}
                          onChange={(e) => setNewStudentWeaknesses(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded transition"
                      >
                        Register Student & Recalculate
                      </button>
                    </form>
                  </div>

                  {/* Class-wide broadcast systems */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-2">
                      Class attention Alerts
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-normal mb-3">
                      Evaluate active attention metrics across all device hubs. Triggering a broadcast transmits a subtle vibrotactile alert pattern back to modern companion wearables.
                    </p>
                    <button
                      onClick={() => {
                        setSystemAlertMessage("Broadcast Attention Warning dispatched successfully to 28 device nodes.");
                      }}
                      className="w-full p-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded text-xs transition font-black"
                    >
                      🚨 BROADCAST ATTENTION REQUEST
                    </button>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ────────────────── MODULE 4: ADMINISTRATOR DESK ────────────────── */}
          {activeTab === "admin" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Shield className="text-indigo-500" /> Module 3: University Administrator Desk
                  </h2>
                  <p className="text-xs text-slate-400">
                    Oversee cross-departmental operations, edit central courses lists, inspect faculty rosters, and evaluate overall deployment integrity.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-xs font-mono">
                  LEVEL: ENTERPRISE_ROOT_ADMIN
                </div>
              </div>

              {/* Dual grid for system reports and course listings */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Side: Central Course Master List - 7 columns */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                      Registered Engineering Course syllabus
                    </h3>
                    <span className="text-xs font-mono text-indigo-400 font-bold">
                      {courses.length} Active Courses
                    </span>
                  </div>

                  <div className="divide-y divide-slate-850">
                    {courses.map((course) => (
                      <div key={course.id} className="p-4 flex justify-between items-center hover:bg-slate-850/30 transition">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-slate-950 border border-slate-800 text-indigo-300 font-mono px-1.5 py-0.5 rounded">
                              {course.code}
                            </span>
                            <h4 className="text-sm font-bold text-white">{course.name}</h4>
                          </div>
                          <span className="text-xs text-slate-500 block mt-1">
                            Instructor of record: {course.instructor}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-slate-400">
                          {course.credits} Credits
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Inline Course creator */}
                  <div className="p-4 bg-slate-950/40 border-t border-slate-850">
                    <h4 className="text-xs font-bold text-slate-300 mb-2">Register New Engineering Module</h4>
                    <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Syllabus Code (CSE-401)"
                        required
                        value={newCourseCode}
                        onChange={(e) => setNewCourseCode(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-xs px-2.5 py-1.5 rounded outline-none focus:border-indigo-500 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Syllabus Title (Neural Networks)"
                        required
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-xs px-2.5 py-1.5 rounded outline-none focus:border-indigo-500 text-white"
                      />
                      <div className="flex gap-1">
                        <select
                          value={newCourseInstructor}
                          onChange={(e) => setNewCourseInstructor(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-xs px-2 py-1.5 rounded outline-none text-white flex-1"
                        >
                          <option value="">Roster Faculty</option>
                          {teachers.map(t => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 font-bold rounded transition">
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Right Side: System statistics and Teachers roster - 5 columns */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Faculty overview */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-4">
                      Academic Faculty Roster
                    </h3>

                    <div className="space-y-4">
                      {teachers.map((teacher) => (
                        <div key={teacher.id} className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex items-start gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                            FT
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white">{teacher.name}</h4>
                            <span className="text-[10px] text-slate-500 block leading-none">{teacher.department}</span>
                            <div className="flex gap-1.5 mt-1">
                              {teacher.courses.map((c, i) => (
                                <span key={i} className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1 rounded font-mono">
                                  {c.split(":")[0]}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Central Fire base syncing diagnostics */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-3">
                      Cloud Resource Metrics
                    </h3>
                    
                    <div className="space-y-2.5 text-xs text-slate-400">
                      <div className="flex justify-between font-mono py-1.5 border-b border-slate-850">
                        <span>Firestore Writes / hr:</span>
                        <span className="text-white font-bold">14,289</span>
                      </div>
                      <div className="flex justify-between font-mono py-1.5 border-b border-slate-850">
                        <span>Active Firebase Auth leases:</span>
                        <span className="text-white font-bold">2,109 Tokens</span>
                      </div>
                      <div className="flex justify-between font-mono py-1.5">
                        <span>Operational Model:</span>
                        <span className="text-indigo-400 font-bold">gemini-3.5-flash</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ────────────────── ACADEMIC VERIFICATION DOSSIER ────────────────── */}
          {activeTab === "dossier" && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <FileText className="text-indigo-400" /> Academic Project Specification Portfolio
                </h2>
                <p className="text-xs text-slate-400">
                  Formally documented engineering requirements, Level 0-2 Data Flow Architecture, Use Case mapping, ER Entity diagrams, and diagnostic guidelines.
                </p>
              </div>

              {/* DIAGRAMS REPOSITORIES (Interactive Vector Architectures) */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-8">
                
                {/* 1. System overall network architecture render */}
                <div>
                  <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-3">
                    A. System Architecture Design
                  </h3>
                  
                  {/* Beautiful SVG diagram rendering */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 overflow-x-auto">
                    <div className="min-w-[600px] flex items-center justify-between py-6 px-4">
                      
                      {/* Node A */}
                      <div className="w-32 bg-slate-900 border border-slate-800 p-3 rounded-lg text-center shadow">
                        <span className="text-xs font-black text-indigo-400 font-mono block">DEVICE COMPONENT</span>
                        <span className="text-xs font-bold text-white block mt-1">Classroom Web Camera</span>
                        <span className="text-[9px] text-slate-500 block font-mono mt-0.5">Captures raw frame feed</span>
                      </div>

                      <div className="text-slate-600 font-bold">&#10142;</div>

                      {/* Node B */}
                      <div className="w-32 bg-slate-900 border border-indigo-500/30 p-3 rounded-lg text-center shadow">
                        <span className="text-xs font-black text-indigo-400 font-mono block">CV ENGINE</span>
                        <span className="text-xs font-bold text-white block mt-1">OpenCV / Gaze Predictor</span>
                        <span className="text-[9px] text-slate-500 block font-mono mt-0.5">Pitch-Yaw & Blink analysis</span>
                      </div>

                      <div className="text-slate-600 font-bold">&#10142;</div>

                      {/* Node C */}
                      <div className="w-32 bg-indigo-950/40 border border-indigo-500/40 p-3 rounded-lg text-center shadow">
                        <span className="text-[9px] font-mono text-indigo-300 font-black">CLOUD PERSISTENCE</span>
                        <span className="text-xs font-bold text-white block mt-1">Firebase Firestore</span>
                        <span className="text-[9px] text-slate-500 block font-mono mt-0.5">Stores engagement records</span>
                      </div>

                      <div className="text-slate-600 font-bold">&#10142;</div>

                      {/* Node D */}
                      <div className="w-40 bg-slate-900 border border-slate-800 p-3 rounded-lg text-center shadow">
                        <span className="text-xs font-black text-indigo-400 font-mono block">PERSONALIZED APP</span>
                        <span className="text-xs font-bold text-white block mt-1">Gemini AI Guidance Planner</span>
                        <span className="text-[9px] text-slate-500 block font-mono mt-0.5">Direct chat counseling</span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* 2. LEVEL 0, 1 & 2 DFD (Responsive Layout) */}
                <div>
                  <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-3">
                    B. Data Flow Diagrams (DFD Levels 0, 1, 2)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Level 0 */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold block w-fit mb-2">
                        LEVEL 0 - CONTEXT MODEL
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Evaluates visual stream data and student academic input directly into a single central AI Classroom controller ecosystem, yielding immediate alerts back to target endpoints.
                      </p>
                    </div>

                    {/* Level 1 */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold block w-fit mb-2">
                        LEVEL 1 - SUBSYSTEM FUSION
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Data partitions separate the Attention Telemetry Pipeline, Career Certifications recommender, and prompt wrappers for LLM Clarissa chat endpoints before sync with Firestore.
                      </p>
                    </div>

                    {/* Level 2 */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold block w-fit mb-2">
                        LEVEL 2 - GRAPH LOGIC
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Tracks granular gaze indices, mapping 5 FPS camera telemetry onto rolling time queues to compute engagement ratios before updating relational schemas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Entity Relation (ER) Diagram Schema Map */}
                <div>
                  <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-3">
                    C. Relational Database & Entity Relationship (ER) Schema
                  </h3>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs font-mono text-slate-300 space-y-4">
                    <div>
                      <span className="text-white font-bold block mb-1">TABLE Student_Profile</span>
                      <p className="text-slate-400 leading-normal">
                        uid (Primary Key) | rollNo | email | baselineGpa | registeredInterests (Enum List) | rawWeaknessTags
                      </p>
                    </div>

                    <div>
                      <span className="text-white font-bold block mb-1">TABLE Engagement_History</span>
                      <p className="text-slate-400 leading-normal">
                        recordId (PK) | studentId (Foreign Ref) | gazePitchDeviation | blinkRate | attentionClassifierState | epochTimestamp
                      </p>
                    </div>

                    <div>
                      <span className="text-white font-bold block mb-1">TABLE Syllabus_Course</span>
                      <p className="text-slate-400 leading-normal">
                        courseCode (PK) | coreTitle | assignedCredits | assignedFacultyRef
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* DETAILED PROJECT DOCTRINE TEXTS */}
              <div className="space-y-6">
                {ACADEMIC_SECTIONS.map((section) => (
                  <div key={section.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-md font-bold text-white mb-3 tracking-wide">{section.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* ALGORITHIM SPECIFICATION */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-md font-bold text-white mb-3">Mathematical Engine Algorithm Selection</h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs font-mono text-slate-300 overflow-x-auto space-y-4">
                  <div>
                    <span className="text-indigo-400 block font-bold mb-1">// Algorithm 1: Dynamic Visual Attention Index Tracking</span>
                    <p className="pl-3 border-l border-slate-800 leading-relaxed">
                      For each captured camera frame (at interval interval T = 200ms):<br />
                      &nbsp;&nbsp;1. Extract head orientation pitch (θ), yaw (ψ), roll (φ)<br />
                      &nbsp;&nbsp;2. Compute eye aspect ratio (EAR) based on landmarks 36 to 41<br />
                      &nbsp;&nbsp;3. If ψ &gt; 15° or θ &gt; 12°:<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Distraction_Counter += 1;<br />
                      &nbsp;&nbsp;4. If EAR &lt; threshold_drowsy for &gt; 1.5 seconds:<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Classifier_State = "Drowsy_Warning";<br />
                      &nbsp;&nbsp;5. Calculate unified engagement rating matching current constraints list.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ────────────────── MODULE 5: TECHNICAL BLUEPRINT & ARCHITECTURES HUB ────────────────── */}
          {activeTab === "blueprint_hub" && (
            <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Sparkles className="text-indigo-400" /> Engineering Architecture & Developer Hub
                  </h2>
                  <p className="text-xs text-slate-400">
                    Surgical code specifications, fully operational Python algorithms, Firebase setups, and Student App UI/UX layouts.
                  </p>
                </div>

                {/* Sub-tab Selection Bar */}
                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveBlueprintSubTab("ai_cv")}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition ${
                      activeBlueprintSubTab === "ai_cv"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    AI CV Engine
                  </button>
                  <button
                    onClick={() => setActiveBlueprintSubTab("backend_flask")}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition ${
                      activeBlueprintSubTab === "backend_flask"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Flask API Routes
                  </button>
                  <button
                    onClick={() => setActiveBlueprintSubTab("student_ui_ux")}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition ${
                      activeBlueprintSubTab === "student_ui_ux"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Student UI/UX Flows
                  </button>
                </div>
              </div>

              {/* SECTION 1: AI CV ENGINE SPECIFICATION */}
              {activeBlueprintSubTab === "ai_cv" && (
                <div className="space-y-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <Camera className="text-indigo-400" size={18} /> Face Detection & Gaze Estimation Module
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      The core algorithmic client leverages an edge-intelligent Python package mapping 468 points on the student's face. 
                      By calculating relative Euclidean landmark metrics, we track the Eye Aspect Ratio (EAR) for drowsy classification. 
                      Using <strong>cv2.solvePnP</strong>, we map 2D coordinates against a 3D standard head topology to deduce Gaze Euler Deviation (Pitch & Yaw).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <span className="text-[10px] text-indigo-400 font-mono font-bold block uppercase mb-1">HAAR CASCADES</span>
                        <h4 className="text-xs font-bold text-slate-200 mb-1">Optical Extraction</h4>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Initial facial bounding box tracking is executed via high-frequency classifiers. Restricts processing only to dynamic region-of-interests to scale execution down to 11ms.
                        </p>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <span className="text-[10px] text-indigo-400 font-mono font-bold block uppercase mb-1">SOLVE PNP MODEL</span>
                        <h4 className="text-xs font-bold text-slate-200 mb-1">Euler Angling Topology</h4>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          By matching 6 foundational coordinates (nose tip, corners of mouth, chin, outer eyes corner) we calculate precise roll, yaw, and pitch metrics without stereoscopic depth lenses.
                        </p>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <span className="text-[10px] text-indigo-400 font-mono font-bold block uppercase mb-1">FIRESTORE BACKUP</span>
                        <h4 className="text-xs font-bold text-slate-200 mb-1">Server Telemetry Sync</h4>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Compiles current eye status, gaze pitch, and attention states, writing records to child directories <code>students/stdId/engagement_history/</code> in transaction threads.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-slate-950 border-x border-t border-slate-800 p-3 rounded-t-xl">
                        <span className="text-xs font-mono font-bold text-slate-300">attention_analysis_module.py</span>
                        <span className="text-[10px] bg-slate-800 text-indigo-400 font-mono px-2 py-0.5 rounded">PYTHON 3 + TENSORFLOW</span>
                      </div>
                      <div className="relative">
                        <pre className="bg-slate-950 p-5 rounded-b-xl border border-slate-800 text-[11px] font-mono whitespace-pre text-slate-300 overflow-x-auto overflow-y-auto max-h-[480px]">
                          <code>{OPENCV_TENSORFLOW_SCRIPT}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: FLASK BACKEND API SPECIFICATION */}
              {activeBlueprintSubTab === "backend_flask" && (
                <div className="space-y-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <Layout className="text-indigo-400" size={18} /> Flask Backend API & Firebase Authorization Routing
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      The core analytical coordinator is built on Flask, providing secure REST endpoints. 
                      All write endpoints require authorized bearer tokens validated through the Firebase Admin SDK decorator. 
                      Custom user roles (e.g., student vs. teacher) are verified at the gateway level to restrict profile deletions or attendance updates.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase mb-1">GET /api/students</span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Fetches complete lists of engineering profiles. Secured with custom role validations.
                        </p>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase mb-1">POST /api/attendance</span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Bulk commits attendance records. Triggers Firestore triggers to rewrite overall percentage weights.
                        </p>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <span className="text-[10px] text-indigo-400 font-mono font-bold block uppercase mb-1">JWT VERIFY</span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Parses inbound authorization headers, matching cryptographic tokens with Firebase Admin SDK routines.
                        </p>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <span className="text-[10px] text-indigo-400 font-mono font-bold block uppercase mb-1">STATS COMPILE</span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Aggregates active telemetry in Firestore to compute classroom-wide attention warning states.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-slate-950 border-x border-t border-slate-800 p-3 rounded-t-xl">
                        <span className="text-xs font-mono font-bold text-slate-300">teacher_api_service.py</span>
                        <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded">PYTHON FLASK + FIRESTORE</span>
                      </div>
                      <pre className="bg-slate-950 p-5 rounded-b-xl border border-slate-800 text-[11px] font-mono whitespace-pre text-slate-300 overflow-x-auto overflow-y-auto max-h-[480px]">
                        <code>{FLASK_BACKEND_SCRIPT}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: STUDENT APP UI/UX SPECIFICATION */}
              {activeBlueprintSubTab === "student_ui_ux" && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* UX Philosophy overview */}
                  <div className="bg-indigo-950/20 border border-indigo-500/20 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <User className="text-indigo-400" size={18} /> Student Companion UI/UX Flow Philosophy
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Designed with an **Adaptive Mobile-First Layout**, the student app focuses on minimizing friction. 
                      By eliminating separate tab hierarchies and presenting a single-screen cognitive dashboard, tasks feed directly into focus schedules. 
                      Typography uses a strict Inter Sans display pairing to maximize reading speeds on smaller, glare-heavy devices.
                    </p>
                  </div>

                  {/* Loop and render bento grids for UIUX screens list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {STUDENT_UI_UX_FLOWS.map((flow, index) => (
                      <div key={index} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                            <span className="w-5 h-5 bg-indigo-600/10 text-indigo-400 text-xs font-bold rounded flex items-center justify-center">
                              {index + 1}
                            </span>
                            <h4 className="text-sm font-black text-white uppercase tracking-wide">
                              {flow.screenName}
                            </h4>
                          </div>

                          {/* Design Tags list */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                              <span className="text-[9px] text-slate-500 block uppercase font-bold">Vibe & Styling</span>
                              <p className="text-[11px] text-slate-300 leading-normal mt-0.5">{flow.vibe}</p>
                            </div>
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                              <span className="text-[9px] text-slate-500 block uppercase font-bold">Color Palette Code</span>
                              <p className="text-[11px] text-slate-300 leading-normal mt-0.5">{flow.colors}</p>
                            </div>
                          </div>

                          {/* Layout wireframe schematic mapping */}
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 mb-4">
                            <span className="text-[9px] text-indigo-400 font-mono font-bold block uppercase mb-1.5">// Responsive Schematic Layout</span>
                            <div className="space-y-1 text-[11px] font-mono text-slate-300">
                              {flow.layoutWireframe.map((line, lidx) => (
                                <div key={lidx} className="bg-slate-900/60 p-1 rounded border border-slate-800/40 text-[10px]">
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action journey details */}
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block mb-1.5">User Journey Iterations</span>
                            <div className="space-y-1.5 text-xs text-slate-400 pl-1">
                              {flow.userJourney.map((step, sidx) => (
                                <div key={sidx} className="flex gap-2">
                                  <span className="text-indigo-400 select-none">•</span>
                                  <p className="leading-normal">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

        </main>

      </div>



    </div>
  );
}
