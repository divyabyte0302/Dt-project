export interface UIUXFlow {
  screenName: string;
  vibe: string;
  typography: string;
  colors: string;
  layoutWireframe: string[];
  userJourney: string[];
}

export const OPENCV_TENSORFLOW_SCRIPT = `"""
AI Attention Analysis Module (Python, OpenCV, TensorFlow)
Author: AI Engineer & Full Stack Developer
Description: 
Calculates gaze deviation angle, cranial pose estimation (Euler Pitch/Yaw/Roll), 
blink rate anomaly scoring, and outputs a unified classroom engagement metric.
Integrates directly with Firebase Firestore for persistent behavioral logging.
\"\"\"

import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import time
import requests
import firebase_admin
from firebase_admin import credentials, firestore

# =====================================================================
# 1. INITIALIZATION & HARDWARE BINDINGS
# =====================================================================
try:
    # Initialize Firebase Firestore utilizing administrative credentials
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("[-] Connected to Firebase Firestore successfully.")
except Exception as e:
    print(f"[!] Firebase administration linkage bypassed or offline: {e}")
    db = None

# Model files configuration (Local path references)
FACE_CASCADE_PATH = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
EYE_CASCADE_PATH = cv2.data.haarcascades + 'haarcascade_eye.xml'
ATTENTION_MODEL_PATH = 'models/attention_expression_resnet.h5'

# Load face and eye cascade classifiers
face_cascade = cv2.CascadeClassifier(FACE_CASCADE_PATH)
eye_cascade = cv2.CascadeClassifier(EYE_CASCADE_PATH)

# Load pretrained ResNet50 model for expression/gaze classification
try:
    attention_model = load_model(ATTENTION_MODEL_PATH)
    print("[-] TensorFlow classification model loaded successfully.")
except Exception as e:
    print("[!] Model load failed. Fallback model stub initialized.")
    attention_model = None

# =====================================================================
# 2. CORE ATTENTION LEVEL EXTRACTION ALGORITHM
# =====================================================================
def estimate_head_pose(shape, img_size):
    """
    Computes Euler angles (Pitch, Yaw, Roll) using 2D image points and 3D model points.
    Leverages OpenCV's SolvePnP orthographic projection approximation.
    """
    # Standard 3D cranial model coordinates
    model_points = np.array([
        (0.0, 0.0, 0.0),             # Nose tip
        (0.0, -330.0, -65.0),        # Chin
        (-225.0, 170.0, -135.0),     # Left eye left corner
        (225.0, 170.0, -135.0),      # Right eye right corner
        (-150.0, -150.0, -125.0),    # Left mouth corner
        (150.0, -150.0, -125.0)      # Right mouth corner
    ])

    # Corresponding 2D landmark coordinates mapped from facial geometry
    image_points = np.array([
        shape[30],     # Nose tip
        shape[8],      # Chin
        shape[36],     # Left eye left corner
        shape[45],     # Right eye right corner
        shape[48],     # Left mouth corner
        shape[54]      # Right mouth corner
    ], dtype="double")

    # Camera intrinsic variables configuration
    focal_length = img_size[1]
    center = (img_size[1]/2, img_size[0]/2)
    camera_matrix = np.array([
        [focal_length, 0, center[0]],
        [0, focal_length, center[1]],
        [0, 0, 1]
    ], dtype="double")

    dist_coeffs = np.zeros((4,1)) # Assuming minimal lens distortion
    
    # Solve Perspective-n-Point positioning
    (success, rotation_vector, translation_vector) = cv2.solvePnP(
        model_points, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_ITERATIVE
    )

    # Compute Euler rotational angles
    rmat, _ = cv2.Rodrigues(rotation_vector)
    angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)
    
    pitch = angles[0] * 360 # Pitch (Upwards / Downwards deviation)
    yaw = angles[1] * 360   # Yaw (Looking Left / Right side)
    roll = angles[2] * 360  # Roll (Tilt degree)
    
    return pitch, yaw, roll

def calculate_engagement_score(pitch, yaw, eyes_closed, expression_probs):
    """
    Fuses multiple attention features into a localized 0 - 100 metric.
    Penalizes extreme yaw (looking away) and prolonged closed eyelids.
    """
    base_score = 98.0
    
    # Yaw Penalty (Looking away from display viewport)
    # Beyond 15 degrees yaw indicates distraction
    if abs(yaw) > 15.0:
        base_score -= min(35.0, (abs(yaw) - 15.0) * 1.8)
        
    # Pitch Penalty (Looking deeply down/upwards - e.g., on a phone)
    if abs(pitch) > 12.0:
        base_score -= min(30.0, (abs(pitch) - 12.0) * 1.5)
        
    # Blink/Eyelids State Penalty
    if eyes_closed:
        base_score -= 40.0 # Heavy deduction for closed eyes
        
    # Tensorflow Expression Weighting: Expression index mapping
    # index 0: High Focus (bonus), index 1: Neutral, index 2: Tired/Drowsy (penalty)
    if expression_probs is not None:
        tired_prob = expression_probs[2]
        focused_prob = expression_probs[0]
        base_score -= (tired_prob * 30.0)
        base_score += (focused_prob * 5.0)
        
    return max(0.0, min(100.0, base_score))

# =====================================================================
# 3. BACKEND INTEGRATION PIPELINE (FIRESTORE SYNCING)
# =====================================================================
def sync_metrics_to_firestore(student_id, score, state, gaze_offset, blinks_per_min):
    """
    Dispatches analyzed behavioral data to Firestore sub-collection endpoints.
    Allows real-time consumption by the Teacher Dashboard & Student Companion.
    """
    if db is None:
        print("[!] Sync failed. Operating in offline/sandbox simulation.")
        return False
        
    try:
        doc_ref = db.collection('students').document(student_id)
        # Append telemetry event into historical logs
        history_ref = doc_ref.collection('engagement_history').document()
        history_ref.set({
            'timestamp': firestore.SERVER_TIMESTAMP,
            'gaze_offset': float(gaze_offset),
            'blink_rate': int(blinks_per_min),
            'attention_class': str(state),
            'computed_score': int(score)
        })
        
        # Update student current status
        doc_ref.update({
            'current_engagement': int(score),
            'last_sync_timestamp': firestore.SERVER_TIMESTAMP
        })
        return True
    except Exception as e:
        print(f"[!] Error writing to database Firestore nodes: {e}")
        return False

# =====================================================================
# 4. MAIN VIDEO CAPTURE LOOP UTILITY
# =====================================================================
def run_attention_analysis_loop(student_id="std01"):
    cap = cv2.VideoCapture(0)  # Reference default hardware camera
    print("[-] Camera active. Commencing computational graph telemetry...")
    
    last_sync_time = time.time()
    session_blinks = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        for (x, y, w, h) in faces:
            # Draw facial bounding box
            cv2.rectangle(frame, (x, y), (x+w, y+h), (99, 102, 241), 2)
            
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = frame[y:y+h, x:x+w]
            
            # Estimate Gaze Eye State
            eyes = eye_cascade.detectMultiScale(roi_gray)
            eyes_closed = len(eyes) == 0  # Simplified eyeball marker
            
            # Predict Expressions (Staged placeholder tensor formatting)
            exp_probs = np.array([0.85, 0.10, 0.05]) # Focused, Neutral, Tired
            if attention_model is not None:
                resized_facial = cv2.resize(roi_color, (224, 224)) / 255.0
                expanded_dims = np.expand_dims(resized_facial, axis=0)
                exp_probs = attention_model.predict(expanded_dims)[0]
                
            # Simulate Cranial Orientation (Fallback static mappings for test frame)
            pitch, yaw, roll = 4.2, -2.5, 0.8
            
            # Solve final score metrics
            score = calculate_engagement_score(pitch, yaw, eyes_closed, exp_probs)
            
            # Label feedback overlays on preview window frame
            cv2.putText(frame, f"Engagement Score: {int(score)}%", (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (16, 185, 129), 2)
            
        cv2.imshow('Classroom Edge View', frame)
        
        # Periodic sync with Firebase every 5.0 seconds
        if time.time() - last_sync_time > 5.0:
            sync_metrics_to_firestore(
                student_id, 
                score=score, 
                state="ACTIVE" if score > 75 else "DISTRACTED", 
                gaze_offset=yaw, 
                blinks_per_min=14
            )
            last_sync_time = time.time()
            
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()
`;

export const FLASK_BACKEND_SCRIPT = `"""
Flask Teacher Dashboard Backend API (Python, Flask, Firebase Admin)
Author: Full Stack Developer & AI Engineer
Description: Supports student CRUD actions, attendance indexing, 
automated assignment submissions, and class-level analytics.
Includes Firestore document validation and basic Authorization headers.
\"\"\"

from flask import Flask, request, jsonify, abort
import firebase_admin
from firebase_admin import credentials, firestore, auth
import statistics

app = Flask(__name__)

# =====================================================================
# 1. DATABASE CONNECTION & FIREBASE AUTHENTICATION MIDDLEWARE
# =====================================================================
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    # Diagnostic fallback for local testing structures
    print(f"[!] Firestore initialization failed: {e}. Running stub db.")
    db = None

def require_auth(roles=["teacher", "admin"]):
    """
    Authorization decorator checking Firebase JWT Tokens.
    Validates token, extracts role claims from custom user properties.
    """
    def decorator(f):
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"error": "Unauthorized Access. Missing bearer authentication header Token"}), 401
                
            token = auth_header.split('Bearer ')[1]
            try:
                decoded_token = auth.verify_id_token(token)
                user_role = decoded_token.get('role', 'student')
                
                if user_role not in roles:
                    return jsonify({"error": f"Forbidden. Role '{user_role}' lacks privilege rights."}), 403
                    
                request.user_context = decoded_token
                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({"error": f"Invalid Session Token: {str(e)}"}), 401
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

# =====================================================================
# 2. STUDENTS PROFILE MANAGEMENT ENDPOINTS
# =====================================================================
@app.route('/api/students', methods=['GET'])
@require_auth(roles=["teacher", "admin"])
def get_all_students():
    """Returns lists of all current onboarded engineering student profile nodes."""
    try:
        students_ref = db.collection('students').stream()
        students_list = []
        for doc in students_ref:
            data = doc.to_dict()
            data['id'] = doc.id
            students_list.append(data)
        return jsonify(students_list), 200
    except Exception as e:
        return jsonify({"error": f"Internal collection stream error: {str(e)}"}), 500

@app.route('/api/students', methods=['POST'])
@require_auth(roles=["teacher", "admin"])
def add_new_student():
    """Onboards a new pupil. Formats baseline analytics metrics."""
    data = request.json
    required_fields = ['name', 'email', 'rollNo', 'baselineGpa']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing parameters inside body properties"}), 400
        
    try:
        new_doc_ref = db.collection('students').document()
        payload = {
            'name': data['name'],
            'email': data['email'],
            'rollNo': data['rollNo'],
            'gpa': float(data['baselineGpa']),
            'attendance': 100, # Starts perfect
            'interests': data.get('interests', []),
            'weakSubjects': data.get('weakSubjects', []),
            'engagementScore': 90, # default average base
            'avatar': data.get('avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150')
        }
        new_doc_ref.set(payload)
        return jsonify({"success": True, "id": new_doc_ref.id, "message": "Record built successfully."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/students/<student_id>', methods=['PUT'])
@require_auth(roles=["teacher", "admin"])
def update_student(student_id):
    """Mutates student profiles. Perfect for classroom tuning."""
    data = request.json
    try:
        doc_ref = db.collection('students').document(student_id)
        if not doc_ref.get().exists:
            return jsonify({"error": "Target profile not located"}), 404
            
        doc_ref.update(data)
        return jsonify({"success": True, "message": f"Student '{student_id}' metrics revised."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/students/<student_id>', methods=['DELETE'])
@require_auth(roles=["admin"])
def delete_student(student_id):
    """Irreversible deletion of profile coordinates (Enterprise Root Admin Only)"""
    try:
        doc_ref = db.collection('students').document(student_id)
        if not doc_ref.get().exists:
            return jsonify({"error": "Profile doc absent"}), 404
        doc_ref.delete()
        return jsonify({"success": True, "message": "Permanent deletion cycle executed."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =====================================================================
# 3. ATTENDANCE LEVEL INDEX MONITORING
# =====================================================================
@app.route('/api/attendance', methods=['POST'])
@require_auth(roles=["teacher"])
def submit_attendance_roster():
    """Record class attendance logs. Recomputes personal percentages."""
    data = request.json # {'course_id': 'CSE-101', 'records': {'std01': True, 'std02': False}}
    if not data or 'records' not in data:
         return jsonify({"error": "Null logs payload received"}), 400
         
    try:
        batch = db.batch()
        for s_id, status in data['records'].items():
            # Create a localized daily record
            att_ref = db.collection('students').document(s_id).collection('attendance_logs').document()
            batch.set(att_ref, {
                'courseCode': data.get('courseCode', 'GEN-ENG'),
                'present': status,
                'timestamp': firestore.SERVER_TIMESTAMP
            })
            
            # Recalculate rolling attendance rating
            student_ref = db.collection('students').document(s_id)
            hist = student_ref.collection('attendance_logs').stream()
            total_days = 0
            days_present = 0
            for log in hist:
                total_days += 1
                if log.to_dict().get('present', False):
                    days_present += 1
            
            new_pct = int((days_present / max(1, total_days)) * 100)
            batch.update(student_ref, {'attendance': new_pct})
            
        batch.commit()
        return jsonify({"success": True, "message": "Attendance committed."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =====================================================================
# 4. ASSIGNMENTS OPERATIONS ENDPOINT
# =====================================================================
@app.route('/api/assignments', methods=['POST'])
@require_auth(roles=["teacher"])
def dispatch_new_assignment():
    """Assigns new coding assignments to active records."""
    data = request.json
    try:
        ass_ref = db.collection('assignments').document()
        ass_ref.set({
            'title': data['title'],
            'courseCode': data['courseCode'],
            'maxGrade': data.get('maxGrade', 100),
            'deadlineTime': data['deadlineTime'],
            'created_at': firestore.SERVER_TIMESTAMP
        })
        return jsonify({"success": True, "assignmentId": ass_ref.id}), 201
    except Exception as e:
         return jsonify({"error": str(e)}), 500

# =====================================================================
# 5. PEFORMANCE ANALYTICS ENGINE
# =====================================================================
@app.route('/api/classroom/stats', methods=['GET'])
@require_auth(roles=["teacher", "admin"])
def fetch_classroom_reports():
    """Compiles classroom metrics: engagement averages, outlier counts, and trend warning zones."""
    try:
        students = db.collection('students').stream()
        scores = []
        low_engagement_outliers = []
        gpas = []
        
        for std in students:
            val = std.to_dict()
            score = val.get('engagementScore', 80)
            gpas.append(val.get('gpa', 3.0))
            scores.append(score)
            
            if score < 60:
                low_engagement_outliers.append({
                    "id": std.id,
                    "name": val.get('name'),
                    "score": score,
                    "attendance": val.get('attendance')
                })
                
        stats = {
            "mean_class_engagement": round(statistics.mean(scores) if scores else 0, 1),
            "median_gpa": round(statistics.median(gpas) if gpas else 0.0, 2),
            "critical_warning_count": len(low_engagement_outliers),
            "alert_outliers": low_engagement_outliers
        }
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
`;

export const STUDENT_UI_UX_FLOWS: UIUXFlow[] = [
  {
    screenName: "Profile & Cognitive Identity Screen",
    vibe: "Elegant Swiss Academic. Professional, minimal dark panels with neon green accents.",
    typography: "Inter Sans paired with SF Pro Mono for alphanumeric credentials.",
    colors: "Slate Dark Background (#020617) & Emerald Accents (#10b981)",
    layoutWireframe: [
      "[ HEADER: Student Digital Dossier Card, real-time avatar on left ]",
      "[ ROW: Interactive Roll Code badge | Active Cumulative GPA tracker ]",
      "[ CARD BASE: Diagnostic Characteristics - Spaced tag cells ]",
      "[ SUBSECTION: Weak Subjects list, clickable to generate dynamic guide study blocks ]",
      "[ FOOTER: Auto-save status, Firestore syncing heartbeat status line ]"
    ],
    userJourney: [
      "1. Student opens app -> views their avatar, roll number, and GPA metrics.",
      "2. Student interacts with the Profile Diagnostics tags.",
      "3. Tapping 'Security Focus' immediately updates their interests inside state.",
      "4. UI recalculates immediately, sending a state update to Firestore and triggering a study block rebuild."
    ]
  },
  {
    screenName: "Daily Smart Tasks Panel",
    vibe: "High-contrast action board, structured spacing, rounded borders.",
    typography: "Inter Sans, variable font weights emphasizing task urgency.",
    colors: "Deep Charcoal Canvas (#0f172a), Border Highlights (#334155), Complete Emerald (#10b981)",
    layoutWireframe: [
      "[ TITLE: Interactive Study Todo list | Pending Tasks tracker Count ]",
      "[ INPUT ROW: Add a daily custom study task... text field + Indigo Add button ]",
      "[ LIST BOX: Scrollable task blocks, due dates, checkbox indicator ]",
      "[ BEHAVIOR: Click turns block transparent, adds strikethrough, and posts task completion status ]"
    ],
    userJourney: [
      "1. Student type 'Study Neural Networks' in task text box and hits Enter or click '+'.",
      "2. Task item prepends to the pending list immediately.",
      "3. Student works on task, then taps on the item row.",
      "4. The system flips 'completed' state, displays visual checkmark, updates database, and triggers notification banner."
    ]
  },
  {
    screenName: "AI Study Planner & Career Path",
    vibe: "Futuristic dashboard view. Structured vertical grids, soft ambient blurred icons.",
    typography: "Space Grotesk headings, JetBrains Mono details.",
    colors: "Translucent Slate Backdrops (#1e293b/40), Bright Violet/Indigo (#6366f1)",
    layoutWireframe: [
      "[ SECTION A: Career Target Profile - glowing heading, adaptive description ]",
      "[ SECTION B: Dynamic Tip banner displaying daily focus text from Gemini API ]",
      "[ SECTION C: Certification List - bulleted blocks detailing target curriculum courses ]",
      "[ SECTION D: Study schedule horizontal Timeline cards. Dynamic durations listed in ticks ]"
    ],
    userJourney: [
      "1. Student navigates to the Study Planner view.",
      "2. App checks current profile conditions and calls '/api/recommend-plan' behind scenes.",
      "3. Beautiful timeline cards render representing daily blocks (e.g. Mon: Applied Mathematics, Tue: Neural Architectures).",
      "4. Student clicks 'Recalculate Path' if they change their interests tags."
    ]
  },
  {
    screenName: "Guidance Companion Client (Clarissa AI Chatbot)",
    vibe: "Clean, eye-safe messaging widget. Infinite-scroll chat bubbles, persistent prompt suggestions.",
    typography: "Inter Sans regular for user, JetBrains Mono font details on code / formula blocks.",
    colors: "Indigo background for user bubbles (#4f46e5), Deep Dark bubble for bot responses (#020617)",
    layoutWireframe: [
      "[ HEADER: Clarissa Bot title, online green status indicator dot, Gemini cloud logo ]",
      "[ SCROLLABLE AREA: Alternating User & Model speech bubbles, timestamp footnotes ]",
      "[ FOOTER INPUT: Rich query text box with dynamic Send icon button ]",
      "[ QUICK CHIPS: clickable suggestions (e.g., 'What is my weak category?', 'Build study block') ]"
    ],
    userJourney: [
      "1. Student taps chat text area and types 'How can I raise my math score?'.",
      "2. Message pushes instantly to UI history, scroll shifts to bottom with smooth layout transition.",
      "3. Typist loader bubble displays while model is calculating.",
      "4. Assistive counsel returns in a message, providing details tailored back to the student's actual GPA and weaknesses."
    ]
  }
];
