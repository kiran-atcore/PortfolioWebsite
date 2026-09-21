export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: "Full Stack" | "AI & ML" | "Mobile";
  techStack: string[];
  summary: string;
  metrics: string[];
  highlights: string[];
  challenges: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  project: string;
  description: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  badgeColor: string;
}

export const PERSONAL_INFO = {
  name: "Kiran Chand S",
  title: "Software Engineer | Full Stack Developer",
  tagline: "React • Next.js • Python • Django REST • Applied AI",
  location: "Trivandrum, India",
  email: "kiranchand.0987@gmail.com",
  phone: "+91 8848314304",
  linkedin: "https://linkedin.com/in/kiranchand-s",
  github: "https://github.com/kiran-atcore",
  resumeUrl: "/Kiran_Chand_S_CV.pdf",
  bio: "Computer Science graduate and full-stack engineer experienced in architecting scalable web and mobile applications using Next.js, React Native, Python, and Django REST. Passionate about real-time systems, cron workflows, cloud infrastructure (AWS), and integrating cutting-edge AI models into practical business solutions.",
  stats: [
    { label: "Production & AI Projects", value: "4+" },
    { label: "Reporting Time Reduced", value: "75%" },
    { label: "API Endpoints Architected", value: "50+" },
    { label: "Cloud & AI Certifications", value: "8+" },
  ],
};

export const EXPERIENCES: ExperienceItem[] = [
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
    githubUrl: "https://github.com/kiran-atcore/AutomatedEmailReporter",
    liveUrl: "https://dispatchr-reporter.vercel.app",
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "deepfake-detection",
    slug: "deepfake-detection",
    title: "DeepFake Detection App",
    tagline: "AI-Powered Media Authenticator",
    category: "AI & ML",
    techStack: ["Next.js", "Django", "DRF", "OpenCV", "XceptionNet"],
    summary: "An AI-powered media authenticator integrating a fine-tuned XceptionNet model with robust confidence scoring.",
    metrics: ["100+ Media Requests Processed", "40% Reliability Boost"],
    highlights: [
      "Integrated fine-tuned XceptionNet neural network model for deepfake video/image authentication.",
      "Designed automated frame extraction pipeline via OpenCV.",
      "Built historical tracking analytics dashboard for request logs with DRF and Next.js.",
    ],
    challenges: "Handling large media uploads and extracting video frames in real time without bottlenecking the backend server.",
    githubUrl: "https://github.com/kiran-atcore/DeepFakeDetection",
  },
  {
    id: "ai-interview-practice",
    slug: "ai-interview-practice",
    title: "AI Interview Practice Platform",
    tagline: "Intelligent Mock Interview Simulator",
    category: "AI & ML",
    techStack: ["Next.js", "Django", "Groq", "Google TTS", "Piston API"],
    summary: "Interactive mock interview simulator supporting concurrent sessions with sub-second latency conversational AI.",
    metrics: ["15+ Concurrent Sessions", "Sub-second AI Latency", "~60% Prep Efficiency Boost"],
    highlights: [
      "Ultra-low latency conversational AI engine powered by Groq and Google TTS.",
      "Embedded in-browser live code editor powered by Monaco and Piston API for real-time code execution.",
      "Automated evaluation engine producing instant dynamic PDF feedback reports.",
    ],
    challenges: "Achieving conversational real-time responsiveness while synchronizing audio playback and code evaluation concurrently.",
    githubUrl: "https://github.com/kiran-atcore/AiInterviewPracticePlatform",
  },
  {
    id: "vicinio",
    slug: "vicinio-local-worker-finder",
    title: "Vicinio – Local Worker Finder",
    tagline: "Geolocation Mobile Application",
    category: "Mobile",
    techStack: ["React Native", "Expo", "Django", "PostgreSQL", "WebSockets"],
    summary: "Geolocation mobile app connecting local workers with customers via interactive radar maps and real-time messaging.",
    metrics: ["50+ Active Workers/Clients", "100% Secure Transactions", "Live WebSocket Chat"],
    highlights: [
      "Real-time interactive radar map showing available local workers in radius.",
      "Bidirectional WebSocket messaging system for client-provider negotiations.",
      "Admin dispute dashboard equipped with multi-strike ban mechanics to safeguard transactions.",
    ],
    challenges: "Battery-efficient background GPS tracking and maintaining low-latency bidirectional WebSocket chat states.",
    githubUrl: "https://github.com/kiran-atcore/LocalWorkerFinderApp",
    liveUrl: "https://drive.google.com/file/d/10BrKVremhE2PoB2JNfGaSQBHBeE0Z2Q0/view",
  },
  {
    id: "dispatchr",
    slug: "dispatchr-automated-reporting",
    title: "DispatchR Reporting Suite",
    tagline: "Automated Enterprise Reporting & Email Engine",
    category: "Full Stack",
    techStack: ["Next.js", "Django REST", "ReportLab", "PostgreSQL", "Cron"],
    summary: "Production reporting web application architected during internship at Alpha Innovation, streamlining multi-source ingestion.",
    metrics: ["50+ Endpoints Ingested", "75% Reduction in Reporting Time"],
    highlights: [
      "Streamlined multi-source data ingestion pipeline covering 50+ business endpoints.",
      "Dynamic PDF generation engine using Python ReportLab.",
      "Cron-scheduled automated email distribution with delivery guarantees.",
    ],
    challenges: "Optimizing database queries across disparate sources for high-throughput scheduled report compilation.",
    githubUrl: "https://github.com/kiran-atcore/AutomatedEmailReporter",
    liveUrl: "https://dispatchr-reporter.vercel.app",
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages",
    icon: "bi-code-slash",
    skills: ["Python", "JavaScript", "TypeScript", "Java", "C", "HTML5", "CSS3"],
  },
  {
    title: "Frontend & Mobile",
    icon: "bi-window-sidebar",
    skills: ["React.js", "Next.js", "React Native (Expo)", "Bootstrap", "Framer Motion"],
  },
  {
    title: "Backend & Database",
    icon: "bi-hdd-network",
    skills: ["Django", "Django REST Framework", "PostgreSQL", "Supabase", "Redis"],
  },
  {
    title: "Cloud & AI Tools",
    icon: "bi-clouds",
    skills: ["AWS (EC2, S3, RDS, Lambda)", "Amazon Bedrock", "SageMaker", "Groq", "OpenCV", "Git & GitHub"],
  },
  {
    title: "Concepts & Architecture",
    icon: "bi-diagram-3",
    skills: ["REST APIs", "MVC", "WebSockets", "Cron Jobs", "System Architecture", "Machine Learning Basics"],
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  { title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", badgeColor: "warning" },
  { title: "AWS Certified Generative AI Practitioner", issuer: "Amazon Web Services", badgeColor: "warning" },
  { title: "Infosys Springboard AWS Certified Developer - Associate", issuer: "Infosys Springboard", badgeColor: "primary" },
  { title: "DataBricks AI Agent Fundamentals", issuer: "DataBricks", badgeColor: "danger" },
  { title: "DataBricks Prompt Engineering Fundamentals", issuer: "DataBricks", badgeColor: "danger" },
  { title: "DataBricks Machine Learning Operations", issuer: "DataBricks", badgeColor: "danger" },
  { title: "IBM Web Development Fundamentals", issuer: "IBM", badgeColor: "info" },
  { title: "IBM Cybersecurity Fundamentals", issuer: "IBM", badgeColor: "info" },
  { title: "HP Life Digital Business Skills", issuer: "HP LIFE", badgeColor: "secondary" },
];

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
}

export const EDUCATION: EducationItem[] = [
  {
    degree: "Bachelor of Technology, Computer Science & Engineering",
    institution: "University Of Engineering Kariavattom",
    location: "Trivandrum",
    period: "2022 – 2026",
    description: "Rigorous coursework in Data Structures, Algorithms, Database Systems, Computer Networks, Operating Systems, and Machine Learning.",
  },
];

