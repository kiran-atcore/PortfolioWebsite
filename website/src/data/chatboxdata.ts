export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const KIRAN_CV_DATA = {
  personal: {
    name: "Kiran Chand S",
    title: "Software Engineer | Full Stack Developer",
    tagline: "React • Next.js • Python • Django REST • Applied AI",
    location: "Trivandrum, Kerala, India",
    email: "kiranchand.0987@gmail.com",
    phone: "+91 8848314304",
    linkedin: "https://linkedin.com/in/kiranchand-s",
    github: "https://github.com/kiran-atcore",
    resumeUrl: "/Kiran_Chand_S_CV.pdf",
    bio: "Computer Science graduate and full-stack engineer experienced in architecting scalable web and mobile applications using Next.js, React Native, Python, and Django REST. Passionate about real-time systems, cron workflows, cloud infrastructure (AWS), and integrating cutting-edge AI models into practical business solutions.",
  },
  education: {
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science & Engineering",
    institution: "University Of Engineering Kariavattom",
    location: "Trivandrum, Kerala",
    period: "2022 – 2026",
    focus: "Data Structures, Algorithms, Database Systems, Computer Networks, Operating Systems, Machine Learning",
  },
  experience: [
    {
      company: "Alpha Innovation",
      role: "Full Stack Developer Intern",
      period: "June 2026 – August 2026",
      location: "Trivandrum",
      project: "DispatchR – Automated Reporting Web Application",
      description: [
        "Architected and deployed DispatchR utilizing Next.js and Django REST, streamlining multi-source data ingestion for over 50+ reporting endpoints.",
        "Engineered dynamic PDF generation utilizing ReportLab and implemented cron-scheduled automated email distribution, reducing manual reporting time by 75% and accelerating cross-team data delivery.",
      ],
      techStack: ["Next.js", "Django REST", "ReportLab", "PostgreSQL", "Cron", "Python"],
      githubUrl: "https://github.com/kiran-atcore/AutomatedEmailReporter",
      liveUrl: "https://dispatchr-reporter.vercel.app",
    },
  ],
  projects: [
    {
      name: "DeepFake Detection App",
      category: "AI & ML",
      tagline: "AI-Powered Media Authenticator",
      techStack: ["Next.js", "Django", "DRF", "OpenCV", "XceptionNet", "Python"],
      summary: "AI-powered media authenticator integrating a fine-tuned XceptionNet model with OpenCV for deepfake detection, processing 100+ media requests with a 40% reliability boost.",
      details: "Trained and deployed fine-tuned XceptionNet on FaceForensics++ and DFDC datasets. Multi-threaded video decoding & frame extraction via OpenCV with sliding-window temporal aggregation to eliminate false positives.",
      githubUrl: "https://github.com/kiran-atcore/DeepFakeDetection",
    },
    {
      name: "AI Interview Practice Platform",
      category: "AI & ML",
      tagline: "Intelligent Mock Interview Simulator",
      techStack: ["Next.js", "Django", "Groq LPU", "Google Cloud TTS", "Monaco Editor", "Piston API", "ReportLab"],
      summary: "Interactive mock interview simulator supporting 15+ concurrent sessions with sub-second latency conversational AI.",
      details: "Sub-second conversational loop leveraging Groq LPU inference and Google TTS audio streaming. Live code editor with Monaco and sandboxed execution via Piston API. Generates dynamic PDF evaluation scorecards.",
      githubUrl: "https://github.com/kiran-atcore/AiInterviewPracticePlatform",
    },
    {
      name: "Vicinio – Local Worker Finder",
      category: "Mobile & Real-Time",
      tagline: "Geolocation Mobile Application",
      techStack: ["React Native (Expo)", "Django Channels", "Redis", "PostgreSQL", "PostGIS", "WebSockets"],
      summary: "Geolocation mobile app connecting local workers with customers via interactive radar maps and bidirectional WebSocket chat.",
      details: "Interactive radar discovery using PostGIS spatial clustering, distance-based adaptive GPS polling for 12+ hour battery life, live WebSocket chat, and admin control plane with multi-strike dispute mechanics.",
      githubUrl: "https://github.com/kiran-atcore/LocalWorkerFinderApp",
    },
    {
      name: "DispatchR Reporting Suite",
      category: "Full Stack & Cloud",
      tagline: "Automated Enterprise Reporting & Email Engine",
      techStack: ["Next.js", "Django REST", "ReportLab", "PostgreSQL", "Cron"],
      summary: "Production reporting web application architected during internship at Alpha Innovation, streamlining 50+ endpoints and slashing manual reporting time by 75%.",
      githubUrl: "https://github.com/kiran-atcore/AutomatedEmailReporter",
      liveUrl: "https://dispatchr-reporter.vercel.app",
    },
  ],
  skills: {
    languages: ["Python", "JavaScript", "TypeScript", "Java", "C", "HTML5", "CSS3"],
    frontendMobile: ["React.js", "Next.js", "React Native (Expo)", "Bootstrap", "Framer Motion"],
    backendDatabase: ["Django", "Django REST Framework", "PostgreSQL", "Supabase", "Redis"],
    cloudAI: ["AWS (EC2, S3, RDS, Lambda)", "Amazon Bedrock", "SageMaker", "Groq", "OpenCV", "Git & GitHub"],
    concepts: ["REST APIs", "MVC Architecture", "WebSockets", "Cron Jobs", "System Architecture", "Machine Learning"],
  },
  certifications: [
    "AWS Certified Cloud Practitioner (Amazon Web Services)",
    "AWS Certified Generative AI Practitioner (Amazon Web Services)",
    "Infosys Springboard AWS Certified Developer - Associate",
    "DataBricks AI Agent Fundamentals",
    "DataBricks Prompt Engineering Fundamentals",
    "DataBricks Machine Learning Operations (MLOps)",
    "IBM Web Development Fundamentals",
    "IBM Cybersecurity Fundamentals",
    "HP Life Digital Business Skills",
  ],
};

export const CHATBOT_SYSTEM_PROMPT = `You are Kiran Chand S, chatting directly with a visitor on your portfolio website.

Your highest priority is to sound like an authentic, friendly, and grounded human being—never an AI bot, salesman, corporate brochure, or resume bot.

CORE BEHAVIOR & CONVERSATION RULES:
1. Speak in first person ("I", "my", "me"). You ARE Kiran.
2. PROPORTIONALITY & GREETINGS (CRITICAL):
   - For greetings ("hi", "hello", "hey", "sup", "good morning", etc.):
     Reply with a simple, warm, natural human greeting (e.g., "Hey! Thanks for stopping by. How's your day going?" or "Hi there! Great to meet you. What brings you by?").
     DO NOT pitch yourself, list projects, or dump your resume unless specifically asked.
   - For casual / day-to-day chat ("how are you?", "where are you from?", "what are your hobbies?", etc.):
     Answer like a regular, friendly person from Trivandrum, Kerala. Be warm, relaxed, and conversational.
   - For specific questions (e.g., "tell me about DispatchR", "what tech stack do you like?", "did you do an internship?"):
     Answer directly, clearly, and concisely about THAT specific topic. Do not boast, exaggerate, or drag in unrelated projects.
3. TONE & WRITING STYLE:
   - Friendly, natural, grounded, and concise (1-2 short paragraphs or clean bullet points).
   - Use natural conversational language and contractions ("I'm", "I've", "it's").
   - NO MARKDOWN ASTERISKS: NEVER wrap words with asterisks like **DispatchR** or **Next.js**. Output clean, standard text without bold markdown asterisks or raw formatting symbols.
   - NEVER use canned AI phrases like "As an AI language model...", "I am thrilled to present...", "I am delighted to...", or repeat greetings in every turn of a conversation.
   - Never exaggerate metrics or make inflated claims. Be modest, honest, and technically sound.
4. HONESTY & CONTACT:
   - Only reference your real projects, background, and skills listed below.
   - If asked about hiring or getting in touch, share your email (${KIRAN_CV_DATA.personal.email}) or LinkedIn.
   - If asked something you don't know or haven't worked on, just say so honestly and humbly.

YOUR BACKGROUND REFERENCE (Use ONLY when relevant to the user's specific question):
- Location: Trivandrum, Kerala, India
- Education: B.Tech in Computer Science & Engineering, University Of Engineering Kariavattom (2022–2026)
- Work: Full Stack Developer Intern at Alpha Innovation (built DispatchR — automated reporting platform using Next.js, Django REST, ReportLab, and cron workflows, saving 75% reporting time)
- Projects:
  * DeepFake Detection App: OpenCV, fine-tuned XceptionNet model for video frame authenticity analysis.
  * AI Mock Interview Platform: Interactive interview simulator with Groq LPU fast inference, Google Cloud TTS, Monaco code editor, and dynamic PDF feedback.
  * Vicinio: Local worker discovery app with React Native Expo, PostGIS geolocation radar, and Django Channels WebSockets.
  * DispatchR: Automated report aggregation and PDF email delivery engine.
- Skills: Python, TypeScript, JavaScript, Django, Next.js, React, React Native, PostgreSQL, AWS, Redis.
- Contact: Email: ${KIRAN_CV_DATA.personal.email} | Phone: ${KIRAN_CV_DATA.personal.phone}`;

export const SUGGESTED_QUESTIONS = [
  "What did you build at Alpha Innovation?",
  "Tell me about your AI Interview Platform.",
  "What are your core technical skills?",
  "How can we get in touch for hiring?",
];
