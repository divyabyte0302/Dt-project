export interface DocSection {
  title: string;
  id: string;
  content: string;
}

export const ACADEMIC_SECTIONS = [
  {
    id: "abstract",
    title: "1. Project Abstract",
    content: "Modern higher education struggles with real-time feedback loops regarding student engagement, classroom attentiveness, and personalized guidance. This project introduces a comprehensive, multi-layered Artificial Intelligence framework designed to analyze classroom dynamics and empower student self-regulation. The system architecture coordinates an edge-intelligent Computer Vision module (utilizing OpenCV and TensorFlow) to evaluate real-time engagement markers—such as gaze direction, head orientation, and facial micro-expressions—with a secure Firebase Cloud backend. The collected behavioral metrics are fused with historical academic records through a Personalized AI Recommendation Engine. Students receive adaptive daily tasks, career path mappings, and dedicated mentoring from 'Clarissa', an onboard LLM-driven Chatbot powered by Google Gemini API. Concurrently, teachers are provided with classroom-wide attention maps to optimize delivery, making this a true closed-loop Smart Pedagogical Framework.",
  },
  {
    id: "problem_statement",
    title: "2. Problem Statement",
    content: "Traditional classroom environments operate in an analytical vacuum. Instructors lack quantifiable, objective feedback on whether their lecture pace and materials are engaging. Furthermore, current academic warning systems are reactive, identifying student distress post-facto via failed exams. On the student. side, singular, rigid curricula fail to accommodate individual learning paces or address localized weak subjects. Students frequently struggle with lack of structure, suboptimal study habits, and a severe absence of targeted, data-backed career guidance aligned with their realistic capabilities and interests.",
  },
  {
    id: "objectives",
    title: "3. Project Objectives",
    content: `The critical goals of the proposed framework are:
1. Real-Time Vision Tracking: Create an automated attention monitoring module to evaluate visual focus, blink rates, and distraction cycles during lectures.
2. Academic Predictive Models: Implement a light heuristic machine learning classifier to forecast final academic GPAs based on combined factors of engagement, test grades, and attendance ratio.
3. Multi-Role Analytics Hub: Deploy a seamless client experience targeting three essential user classes: Students, Teachers, and Administrators.
4. Gemini-Powered Chatbot: Deliver instant, highly contextualized responses for student counseling, curriculum doubts, and career path certifications.
5. Cloud Synchronization: Architect fully secured Firebase interactions to preserve engagement trends and study plans dynamically.`,
  },
  {
    id: "literature_survey",
    title: "4. Literature Survey",
    content: `• Research Paper 1 (Visual Attention Tracking, 2023): Investigated convolutional neural networks (CNNs) for eye-gaze tracking. Proved that landmark extraction enables facial alignment inside diverse room lighting, although computational overhead on mobile remains a constraint.
• Research Paper 2 (Predictive Learning Analytics, 2024): Demonstrated that fusion models incorporating both behavioral engagement (attendance, video logs) and academic quizzes achieve a 14% higher predictive validation rate than static GPA measures alone.
• Research Paper 3 (Conversational Agents in Higher Ed, 2022): Discovered that students talking with rule-based bots quickly experience advice fatigue. Highlighting the supreme value of deploying modern Large Language Models (LLMs) to promote sustained student mentorship and self-actualization.`,
  },
  {
    id: "methodology",
    title: "5. Methodology",
    content: `Our closed-loop pipeline involves:
1. Image Acquisition: Video inputs from classroom cameras or student screens are captured at 5 FPS to reduce high cloud processing costs.
2. OpenCV Gaze & Pose Estimation: Detects facial bounding frames, tracking eyes and cranial Euler angles (pitch, yaw, roll).
3. Engagement Fusing: Merges attention ratio (time focused vs. time distracted) with baseline class attendance.
4. Recommendation Heuristics: Feed-forward calculation of student weakness weights triggers automatic prompt expansion to the Gemini API, yielding targeted study sequences.
5. Notification & Feedback Loop: Sends alert signals back to the student's daily planner in case attention flags lower significantly.`,
  },
  {
    id: "testing",
    title: "6. Testing Procedures",
    content: `• Unit Testing: Validating attention level estimators on standard test cards (focused gaze vs extreme yaw rotations).
• API Integration Testing: Simulating HTTP payloads with missing environment variables to guarantee successful fallback modes for Clarissa bot.
• Firebase Simulation Security Review: Validating rules so that students can read only their own documents, while authorized instructors can batch-read class aggregates.
• User Sandbox Testing: Verifying correct response times for GPA predictors on bad data bounds.`,
  }
];
