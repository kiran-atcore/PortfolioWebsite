export interface HeroCardData {
  id: string;
  src: string;
  tag: string;
  badgeColor: string;
  offsetClass: string;
  entryConfig: { x: number; y: number; rotate: number; scale: number };
  accentHex: number;
  themeColor: "cyan" | "magenta";
  roleTitle: string;
  roleSubtitle: string;
  telemetryCode: string;
  description: string;
  highlights: string[];
  techStack: string[];
  stats: { label: string; value: string }[];
}

export const HERO_CARDS: HeroCardData[] = [
  {
    id: "pose-1",
    src: "/hero-pose-1.jpg",
    tag: "// ARCHITECT // 01",
    badgeColor: "text-info border-info",
    offsetClass: "card-offset-1",
    entryConfig: { x: -60, y: -80, rotate: -15, scale: 0.8 },
    accentHex: 0x00f2fe,
    themeColor: "cyan",
    roleTitle: "Full-Stack Software Engineer",
    roleSubtitle: "Next.js • React • Python • Django REST • PostgreSQL",
    telemetryCode: "SYS-ARCH // TIER-1 // 01",
    description:
      "Computer Science graduate and full-stack developer with hands-on experience building scalable web and mobile applications. Adept at architecting modular REST APIs, real-time WebSocket communication, and robust relational data models with Django REST Framework and PostgreSQL.",
    highlights: [
      "Architected & deployed DispatchR, streamlining multi-source ingestion for 50+ endpoints",
      "Engineered Vicinio: Geolocation mobile platform with real-time WebSockets & radar maps",
      "Clean modular codebases with strict TypeScript contracts and structured MVC patterns",
    ],
    techStack: ["Next.js", "React.js", "Python", "Django REST", "PostgreSQL", "TypeScript", "Redis"],
    stats: [
      { label: "Endpoints Ingested", value: "50+" },
      { label: "Core Projects", value: "4+" },
      { label: "Architecture", value: "REST / WS" },
    ],
  },
  {
    id: "pose-3",
    src: "/hero-pose-3.jpg",
    tag: "// PRODUCTION // 02",
    badgeColor: "text-magenta border-magenta",
    offsetClass: "card-offset-2",
    entryConfig: { x: 80, y: -40, rotate: 15, scale: 0.9 },
    accentHex: 0xec4899,
    themeColor: "magenta",
    roleTitle: "Cloud & Automated Pipelines",
    roleSubtitle: "AWS Cloud • Cron Automation • Enterprise Delivery",
    telemetryCode: "PROD-REL // TIER-2 // 02",
    description:
      "Specializing in automated reporting workflows and cloud deployments. Proven track record at Alpha Innovation cutting manual reporting turnaround by 75% via ReportLab dynamic PDF generation and cron-scheduled automated distribution, backed by multiple AWS cloud certifications.",
    highlights: [
      "Reduced manual reporting time by 75% via ReportLab & automated cron distribution",
      "Hands-on cloud infrastructure across AWS EC2, S3, RDS, Lambda, and SageMaker",
      "Certified: AWS Cloud Practitioner, AWS GenAI Practitioner & DataBricks MLOps",
    ],
    techStack: ["AWS (EC2/S3/RDS)", "AWS Lambda", "Cron Jobs", "ReportLab", "Git / GitHub", "Supabase"],
    stats: [
      { label: "Reporting Lag Cut", value: "75%" },
      { label: "Cloud Certifications", value: "9+" },
      { label: "Automated Delivery", value: "100%" },
    ],
  },
  {
    id: "pose-2",
    src: "/hero-pose-2.jpg",
    tag: "// INFERENCE // 03",
    badgeColor: "text-magenta border-magenta",
    offsetClass: "card-offset-3",
    entryConfig: { x: -40, y: 80, rotate: 10, scale: 0.9 },
    accentHex: 0xec4899,
    themeColor: "magenta",
    roleTitle: "Applied AI & Computer Vision",
    roleSubtitle: "Deep Learning • Groq LLMs • XceptionNet • Amazon Bedrock",
    telemetryCode: "AI-INFER // TIER-3 // 03",
    description:
      "Engineering practical, high-impact AI systems. Built an AI-powered media authenticator integrating a fine-tuned XceptionNet model with OpenCV for deepfake detection, and developed a mock interview simulator supporting 15+ concurrent sessions with sub-second latency conversational AI.",
    highlights: [
      "Fine-tuned XceptionNet with OpenCV, processing 100+ media requests (+40% reliability)",
      "Built AI Interview platform with Groq LLM & Google TTS (sub-second response speed)",
      "Designed live code execution via Piston/Monaco, boosting user prep efficiency by ~60%",
    ],
    techStack: ["Groq LLM", "Amazon Bedrock", "OpenCV", "XceptionNet", "Google TTS", "Python", "Piston API"],
    stats: [
      { label: "Media Reliability", value: "+40%" },
      { label: "Concurrent AI", value: "15+ Users" },
      { label: "Prep Efficiency", value: "+60%" },
    ],
  },
  {
    id: "pose-4",
    src: "/hero-pose-4.jpg",
    tag: "// COGNITION // 04",
    badgeColor: "text-info border-info",
    offsetClass: "card-offset-4",
    entryConfig: { x: 60, y: 60, rotate: -10, scale: 0.85 },
    accentHex: 0x00f2fe,
    themeColor: "cyan",
    roleTitle: "Mobile & Real-Time Experience",
    roleSubtitle: "React Native (Expo) • WebSockets • Fluid UI/UX",
    telemetryCode: "COG-INTF // TIER-4 // 04",
    description:
      "Crafting responsive, user-centric mobile and web software with fluid micro-interactions. Developed the Vicinio geolocation mobile app in React Native and Expo, connecting 50+ local workers and customers with interactive radar maps, live WebSocket chat, and multi-strike moderation.",
    highlights: [
      "Engineered Vicinio (React Native/Expo) with live radar geolocation & interactive maps",
      "Built real-time WebSocket chat and admin dashboard securing 100% of user transactions",
      "Implemented smooth physics-based UI transitions using Framer Motion and modern CSS",
    ],
    techStack: ["React Native", "Expo", "WebSockets", "Framer Motion", "Bootstrap", "HTML5 / CSS3"],
    stats: [
      { label: "Local Users", value: "50+" },
      { label: "Secure Txns", value: "100%" },
      { label: "Live Latency", value: "<100ms" },
    ],
  },
];

