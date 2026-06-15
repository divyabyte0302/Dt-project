import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized.");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
  }
} else {
  console.log("No GEMINI_API_KEY found. Chatbot will run in simulation mode.");
}

// 1. AI Chatbot API Route
app.post("/api/chat", async (req, res) => {
  const { message, history, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // If Gemini API is available and key is configured, use it
  if (ai) {
    try {
      const studentContext = context ? `Context for current student:
- Name: ${context.name || 'Student'}
- Grade/Performance: ${context.grade || 'Average'} (GPA: ${context.gpa || '3.2'})
- Weak Subjects: ${(context.weakSubjects || []).join(', ') || 'None'}
- Top Interests: ${(context.interests || []).join(', ') || 'General Science'}
` : "General student context.";

      const systemInstruction = `You are "Clarissa", the intelligent companion AI chatbot for the "AI-Based Smart Classroom Analysis & Daily Guidance System".
Your role is to offer students academic coaching, career guidance, and general subject support.
Keep responses engaging, professional, inspiring, and concise. Format with markdown if needed.
${studentContext}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...((history || []).map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
          }))),
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "I was unable to formulate a response at this time. Let's try again in a bit!";
      return res.json({ reply });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      return res.status(500).json({ 
        error: "Failed to communicate with Gemini API.",
        details: error.message,
        simulated: true,
        reply: generateSimulatedReply(message)
      });
    }
  } else {
    // Return high-quality offline simulated responses
    return res.json({
      reply: generateSimulatedReply(message),
      simulated: true
    });
  }
});

// Helper for offline fallback
function generateSimulatedReply(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hello there! I'm Clarissa, your AI Academic & Career assistant. How can I help you today with your studies, performance analysis, or career planning?";
  }
  if (msg.includes("career") || msg.includes("job") || msg.includes("future")) {
    return "Based on engineering performance analytics, highly recommended pathways include **Data Engineering**, **Machine Learning Systems**, and **Full Stack Development**. I suggest starting with an AWS Cloud Practitioner or TensorFlow developer certificate to build competitive leverage!";
  }
  if (msg.includes("study") || msg.includes("schedule") || msg.includes("weak")) {
    return "I recommend allocating **45 minutes daily** to your weak topics, followed by a self-assessment quiz. Let's create a Pomodoro study plan for you in the 'Study Planner' tab!";
  }
  if (msg.includes("attention") || msg.includes("engage") || msg.includes("camera")) {
    return "Our computer vision feedback tracks focus through head orientation and eye gaze indicators. If your current engagement score is below 70%, try taking a 5-minute cognitive break!";
  }
  return `That is a great question. For academic excellence, I suggest diving deeper into your subject syllabus. Under the project methodology, breaking complex concepts into smaller visual blocks is shown to increase attention level by up to 24%. Let me know if you want a custom study outline!`;
}

// 2. AI Performance Guidance & Path Recommender API Route
app.post("/api/recommend-plan", async (req, res) => {
  const { interests, weakSubjects, academicGpa, attendance } = req.body;

  if (ai) {
    try {
      const prompt = `Generate a personalized study strategy and prospective career pathways for a student with:
- Interests: ${interests || 'Software Engineering'}
- Weak Subjects: ${weakSubjects || 'Data Structures'}
- Academic GPA: ${academicGpa || '3.2'}
- Attendance Ratio: ${attendance || '85%'}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an advanced academic counselor and engineering project evaluator. Generate high-quality JSON matches that fit career guidance, certification tracks, and dynamic micro-lessons.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              careerPath: { type: Type.STRING, description: "Recommended title for primary career target" },
              careerDescription: { type: Type.STRING, description: "Explanation of why this path fits their profiles" },
              certifications: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 highly relevant career industry certifications"
              },
              recommendedStudyHoursPerWeek: { type: Type.NUMBER },
              actionableDailyTip: { type: Type.STRING },
              studySchedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING },
                    focusSubject: { type: Type.STRING },
                    durationMinutes: { type: Type.INTEGER },
                    technique: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["careerPath", "careerDescription", "certifications", "recommendedStudyHoursPerWeek", "actionableDailyTip", "studySchedule"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      return res.json(data);
    } catch (err: any) {
      console.error("AI Recommender error, returning backup model response:", err);
      return res.json(generateFallbackPlan(interests, weakSubjects));
    }
  } else {
    return res.json(generateFallbackPlan(interests, weakSubjects));
  }
});

function generateFallbackPlan(interests: string, weakSubjects: string) {
  return {
    careerPath: "AI Systems Architect / Developer",
    careerDescription: `Based on your interest in "${interests || 'Systems Engineering'}" and academic profile, targeting complex backend intelligence pipelines matches your behavioral tracking. Focus on bridging theory with applied code!`,
    certifications: [
      "Google Cloud Certified Associate Cloud Engineer",
      "TensorFlow Developer Certificate",
      "HashiCorp Terraform Associate"
    ],
    recommendedStudyHoursPerWeek: 12,
    actionableDailyTip: "Dedicate your first golden hour of study exclusively to your weakest module: " + (weakSubjects || 'Complex Algorithms') + ".",
    studySchedule: [
      { day: "Monday", focusSubject: weakSubjects || "Data Structures", durationMinutes: 90, technique: "Feynman Technique" },
      { day: "Tuesday", focusSubject: interests || "Full Stack Apps", durationMinutes: 120, technique: "Project-Based Coding" },
      { day: "Wednesday", focusSubject: weakSubjects || "Database Management", durationMinutes: 60, technique: "Spaced Repetition" },
      { day: "Thursday", focusSubject: interests || "AI Architectures", durationMinutes: 90, technique: "Collaborative Peer Review" },
      { day: "Friday", focusSubject: "Interactive Review", durationMinutes: 60, technique: "Active Recall Quiz" }
    ]
  };
}

// Vite and Static assets server integration logic
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite Development Middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA Fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Classroom Server running on port ${PORT}`);
  });
}

bootstrap();
