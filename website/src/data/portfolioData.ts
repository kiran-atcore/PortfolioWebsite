export interface ProjectChallenge {
  title: string;
  problem: string;
  solution: string;
}

export interface ProjectHighlight {
  title: string;
  detail: string;
}

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
  detailedHighlights?: ProjectHighlight[];
  challenges: string;
  detailedChallenges?: ProjectChallenge[];
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
    detailedHighlights: [
      {
        title: "Fine-Tuned XceptionNet Neural Authentication Engine",
        detail: "Trained and deployed an XceptionNet deep learning architecture fine-tuned on the FaceForensics++ and Deepfake Detection Challenge (DFDC) benchmark datasets. The model utilizes depthwise separable convolutions to isolate spatial manipulation artifacts, blending inconsistencies, and unnatural boundary transitions across facial landmarks. Predictions output real-time confidence scores and heatmaps indicating localized probability of forgery.",
      },
      {
        title: "Automated OpenCV Keyframe Extraction Pipeline",
        detail: "Architected a multi-threaded video decoding and frame preprocessing engine using OpenCV in Python. Incoming video streams are downsampled to target keyframe intervals with normalized color channels and automated face-detection bounding boxes via MTCNN/Haar cascades. This eliminates redundant frame compute while standardizing spatial crops for neural network ingestion.",
      },
      {
        title: "Historical Tracking & Verification Analytics Dashboard",
        detail: "Constructed an end-to-end auditability and analytics dashboard utilizing Django REST Framework endpoints and Next.js reactive charts. Every verification request is logged with timestamped metadata, processing latencies, model confidence percentiles, and media hashes. Administrators can filter past requests by risk tier, inspect flagged frames, and export audit trails.",
      },
    ],
    challenges: "Handling large media uploads and extracting video frames in real time without bottlenecking the backend server.",
    detailedChallenges: [
      {
        title: "Video Ingestion & Frame Extraction Pipeline",
        problem: "Ingesting 1080p video files and processing every frame sequentially consumed excessive RAM (>2GB per stream), leading to memory spikes and worker timeout aborts.",
        solution: "Engineered an asynchronous OpenCV chunking pipeline utilizing uniform interval sampling (evaluating every nth keyframe rather than raw 60fps), slashing server memory overhead by ~65% while maintaining high classification fidelity.",
      },
      {
        title: "Neural Inference Throughput & Tensor Bottlenecks",
        problem: "Evaluating frames one by one through XceptionNet incurred severe CPU/GPU synchronization penalties, causing user turnaround times to exceed 14 seconds.",
        solution: "Restructured inference into vectorized tensor mini-batches with cached face-crop bounding boxes, cutting end-to-end evaluation latency from 14s down to ~2.8s per video.",
      },
      {
        title: "Lighting & Compression False Positives",
        problem: "Compression artifacts from re-encoded social media video uploads triggered erratic false-positive manipulation flags around facial boundaries.",
        solution: "Formulated a sliding-window temporal aggregation algorithm that computes confidence averages across contiguous frames, dampening single-frame variance and improving overall verification reliability by 40%.",
      },
    ],
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
    detailedHighlights: [
      {
        title: "Sub-Second Conversational AI Loop (Groq + Google TTS)",
        detail: "Engineered an event-driven conversational loop leveraging Groq LPU hardware acceleration and Google Cloud Text-to-Speech. Using server-sent events (SSE) and token boundary detection, the backend begins streaming synthesized audio buffers before the LLM has completed generating the full paragraph, reducing perceived system latency below 800ms for continuous, lifelike dialogue.",
      },
      {
        title: "Embedded Monaco Code Studio & Piston Sandbox Execution",
        detail: "Integrated the VS Code-grade Monaco Editor with real-time syntax highlighting, autocompletion, and multi-language support (Python, JS, C++, Java). Code submissions are piped through the isolated Piston runtime execution sandbox, streaming stdin/stdout results with execution metrics back to the client while the AI interviewer evaluates algorithmic complexity on the fly.",
      },
      {
        title: "Automated Competency Rubrics & Dynamic PDF Generation",
        detail: "Designed an automated multi-criteria evaluation engine that scores candidates across problem-solving approach, code cleanliness, algorithmic efficiency, and communication clarity. Post-interview, background workers compile a dynamic multi-page PDF report using ReportLab, detailing line-by-line feedback, time complexity breakdowns, and actionable preparation recommendations.",
      },
    ],
    challenges: "Achieving conversational real-time responsiveness while synchronizing audio playback and code evaluation concurrently.",
    detailedChallenges: [
      {
        title: "Sub-Second Conversational AI & Voice Pipelining",
        problem: "Chaining sequential LLM token completion with subsequent Google Cloud TTS audio generation introduced a 3.5s+ latency gap, disrupting realistic conversational interview pacing.",
        solution: "Architected a dual-stream pipeline with Groq LPU inference that buffers token output up to punctuation boundaries, triggering asynchronous audio synthesis on initial sentences while downstream tokens stream concurrently.",
      },
      {
        title: "Sandboxed Concurrent Code Execution",
        problem: "Permitting arbitrary multi-language code runs submitted via the Monaco editor risked runaway processes, infinite loops, and host environment security compromises.",
        solution: "Integrated isolated stateless execution containers using the Piston API with hardened memory quotas (128MB limits), 5-second process execution caps, and automatic process recycling.",
      },
      {
        title: "Dynamic Assessment Compilation & PDF Delivery",
        problem: "Generating comprehensive multi-dimensional rubrics with syntax-highlighted code diffs and scoring radar charts caused synchronous UI freezes at interview conclusion.",
        solution: "Decoupled evaluation scoring into background Celery/ReportLab workers that assemble structured dynamic PDF dossiers while streaming immediate scorecard metrics to the candidate UI.",
      },
    ],
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
    detailedHighlights: [
      {
        title: "Interactive Geolocation Radar Map & PostGIS Spatial Clustered Discovery",
        detail: "Engineered an interactive geolocation radar map within React Native utilizing Expo Location and Mapbox/Google Maps SDKs. Spatial distance queries are computed using PostGIS spatial indexing in PostgreSQL, dynamically clustering active service providers within selectable radius circles (1km - 15km) and updating pins as workers move.",
      },
      {
        title: "Bidirectional WebSocket Messaging Engine (Django Channels + Redis)",
        detail: "Developed a real-time messaging pipeline built on Django Channels, ASGI, and Redis Pub/Sub. The mobile client maintains persistent WebSocket channels with automatic reconnect logic, message delivery receipts, unread badges, and end-to-end encrypted payload transmission for price negotiations and service confirmations.",
      },
      {
        title: "Administrative Control Plane & Multi-Strike Dispute Resolution",
        detail: "Architected a central administrative control plane for dispute resolution, client-provider verification, and platform integrity. The system implements an automated strike tracking engine that flags suspicious cancellations, reviews geolocation check-in proofs, and executes progressive access restrictions or account freezes for bad actors.",
      },
    ],
    challenges: "Battery-efficient background GPS tracking and maintaining low-latency bidirectional WebSocket chat states.",
    detailedChallenges: [
      {
        title: "Battery-Efficient Background GPS Geolocation",
        problem: "Continuous high-accuracy GPS polling drained mobile worker devices within 4 hours and triggered aggressive background process kills by iOS/Android power managers.",
        solution: "Built an adaptive location tracking engine using Expo Location that switches to distance-based delta updates (querying coordinates only upon >50m movement or accelerometer triggers), extending device battery life to 12+ hours.",
      },
      {
        title: "WebSocket Connectivity on Unstable Mobile Radios",
        problem: "Fluctuating 4G/5G mobile cell transitions caused frequent WebSocket drops, lost in-flight messages, and phantom active connection states on the server.",
        solution: "Implemented Django Channels with persistent Redis session tracking, paired with client-side optimistic UI caching, sequence IDs for automated deduplication, and exponential backoff reconnection.",
      },
      {
        title: "Marketplace Trust & Dispute Resolution Engine",
        problem: "Managing user disputes and fraudulent job cancellations across unmonitored peer-to-peer mobile transactions created risk for service workers.",
        solution: "Created an admin dispute control plane featuring automated multi-strike sanction rules, location-verified arrival confirmations, and audit logs to protect transaction fairness.",
      },
    ],
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
    detailedHighlights: [
      {
        title: "Multi-Source Enterprise Ingestion Pipeline (50+ Endpoints)",
        detail: "Orchestrated an automated data ingestion pipeline interfacing with over 50 internal REST and relational endpoints across Alpha Innovation's operational databases. Employed batched asynchronous HTTP calls with data validation schemas, error-handling circuit breakers, and deduplication staging tables before report compilation.",
      },
      {
        title: "Dynamic PDF Generation Engine with Streaming ReportLab Flowables",
        detail: "Built a high-performance programmatic document synthesis engine utilizing ReportLab Platypus. The engine transforms normalized database queries into publication-quality executive reports featuring dynamic tables, automated page pagination, corporate branding headers, and embedded vector charts compiled in streaming memory buffers.",
      },
      {
        title: "Cron-Orchestrated Automated Email Distribution Pipeline",
        detail: "Implemented an enterprise-grade automated dispatch schedule utilizing Linux cron tasks paired with Django management commands. The pipeline features retry queues, SMTP connection pooling, delivery status webhooks, and automated email alerts, delivering daily and weekly operational intelligence to senior stakeholders with zero missed schedules.",
      },
    ],
    challenges: "Optimizing database queries across disparate sources for high-throughput scheduled report compilation.",
    detailedChallenges: [
      {
        title: "Multi-Source Database Query Optimization",
        problem: "Ingesting operational data across 50+ relational endpoints for scheduled morning reports created severe DB connection saturation and row locking on active production tables.",
        solution: "Architected batched read-replica querying with indexed intermediate view caches, shifting query execution into asynchronous cron stages during off-peak hours and reducing reporting compile time by 75%.",
      },
      {
        title: "High-Volume PDF Memory Allocation",
        problem: "Building 200+ page enterprise reports containing extensive tables and charts caused Django Python processes to exceed server RAM allocation limits and crash workers.",
        solution: "Engineered streaming ReportLab flowables using disk-backed temp file buffers and paginated incremental rendering, decreasing server peak memory consumption by ~70%.",
      },
      {
        title: "Automated Cron Delivery Guarantees",
        problem: "External SMTP provider throttling and transient network timeouts resulted in dropped scheduled email deliveries without automated recovery.",
        solution: "Constructed an idempotent delivery pipeline with persistent retry queues, exponential backoff, transaction logs, and webhook alert triggers guaranteeing reliable dispatch.",
      },
    ],
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
  branch: string;
  institution: string;
  location: string;
  period: string;
  description: string;
}

export const EDUCATION: EducationItem[] = [
  {
    degree: "Bachelor of Technology",
    branch: "Computer Science & Engineering",
    institution: "University Of Engineering Kariavattom",
    location: "Trivandrum",
    period: "2022 – 2026",
    description: "Rigorous coursework in Data Structures, Algorithms, Database Systems, Computer Networks, Operating Systems, and Machine Learning.",
  },
];

