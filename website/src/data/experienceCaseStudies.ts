export interface CaseStudySpec {
  slug: string;
  title: string;
  subtitle: string;
  company: string;
  role: string;
  period: string;
  location: string;
  githubUrl: string;
  liveUrl: string;
  executiveSummary: {
    domain: string;
    primaryStack: string[];
    keyIntegrations: string[];
    deploymentModel: string;
    coreValue: string;
    narrative: string;
  };
  kpis: {
    label: string;
    value: string;
    detail: string;
  }[];
  problems: {
    title: string;
    friction: string[];
    biLimitations: string[];
  };
  pillars: {
    num: string;
    title: string;
    desc: string;
  }[];
  deepDives: {
    id: string;
    title: string;
    tag: string;
    summary: string;
    points: string[];
  }[];
  benchmarks: {
    stage: string;
    manual: string;
    automated: string;
    impact: string;
  }[];
  scenarios: {
    title: string;
    source: string;
    output: string;
    directive: string;
    delivery: string;
  }[];
  schemaModels: {
    model: string;
    fields: string[];
  }[];
  topology: {
    layer: string;
    service: string;
    role: string;
  }[];
  lessons: string[];
  roadmap: string[];
}

export const EXPERIENCE_CASE_STUDIES: Record<string, CaseStudySpec> = {
  "dispatchr-automated-reporting": {
    slug: "dispatchr-automated-reporting",
    title: "Automated Email Reporter",
    subtitle: "Architecting an End-to-End Enterprise Reporting & Dispatch Automation Platform",
    company: "Alpha Innovation",
    role: "Full Stack Developer Intern",
    period: "June 2026 – August 2026",
    location: "Trivandrum",
    githubUrl: "https://github.com/kiran-atcore/AutomatedEmailReporter",
    liveUrl: "https://dispatchr-reporter.vercel.app",
    executiveSummary: {
      domain: "Data Automation, Business Intelligence, Scheduled Delivery, Document Synthesis",
      primaryStack: ["Django 6.0+", "Django REST Framework", "Next.js 16 (App Router)", "React 19", "TypeScript", "Bootstrap 5.3"],
      keyIntegrations: ["ReportLab", "Matplotlib", "Groq LLM API", "APScheduler", "Brevo (Anymail)", "Supabase / PostgreSQL"],
      deploymentModel: "Hybrid Cloud (Render Web + Background Worker, Vercel, Supabase Storage)",
      coreValue: "Eliminates manual metric extraction, ad-hoc spreadsheet synthesis, and scheduled distribution toil.",
      narrative: "An open-source, production-ready reporting automation platform designed to fully automate the enterprise metrics lifecycle. It ingests data from heterogeneous sources (REST APIs, SQL databases, Google Sheets, Airtable), applies Groq-powered LLM synthesis for executive commentary, programmatically compiles branded vector-quality PDF documents with Matplotlib charts, and dispatches them on custom recurring schedules.",
    },
    kpis: [
      { label: "Labor Cost Reduction", value: "98%", detail: "From 45-105 mins down to ~4s execution" },
      { label: "Endpoints Ingested", value: "50+", detail: "REST APIs, PostgreSQL, Sheets & Airtable" },
      { label: "Infrastructure Cost", value: "$0/mo", detail: "Zero-cost serverless & free-tier feasibility" },
      { label: "On-Time Dispatch", value: "100%", detail: "Idempotent catch-up webhook & APScheduler" },
    ],
    problems: {
      title: "The Friction of Manual Operational Reporting",
      friction: [
        "Fragmented Data Silos: Critical data scattered across transactional PostgreSQL/MySQL databases, SaaS REST endpoints, and collaborative spreadsheets.",
        "Repetitive Human Labor: Analysts logging into multiple portals daily or weekly, executing repetitive queries, and manually formatting numbers.",
        "Layout Inconsistencies & Human Error: Formula breaks, copy-paste errors, and forgotten dispatches undermine trust in reporting.",
        "Context Overload: Decision-makers receiving raw tables without actionable anomaly highlights or trend narratives.",
      ],
      biLimitations: [
        "Enterprise BI Overkill: Looker, Tableau, or Power BI are expensive, complex, and require paid viewer licenses for every recipient.",
        "Rigid Dashboarding: BI platforms demand users log in rather than passively pushing synthesized briefings into executive inboxes.",
        "Fragile DIY Scripts: Ad-hoc cron scripts lack unified encryption, template builders, or interactive failure diagnostics.",
      ],
    },
    pillars: [
      {
        num: "01",
        title: "Pluggable Data Ingestion",
        desc: "Standardized 2D array abstraction querying raw SQL databases, polling authenticated REST APIs, and extracting Google Sheets/Airtable.",
      },
      {
        num: "02",
        title: "Zero-Overhead AI Synthesis",
        desc: "Low-latency natural-language executive summaries, anomaly detection, Text-to-SQL, and cron generation via Groq LLMs.",
      },
      {
        num: "03",
        title: "Programmatic PDF Compilation",
        desc: "Deterministic vector PDF generation using ReportLab Platypus, dynamic column width balancing, and headless Matplotlib charts.",
      },
      {
        num: "04",
        title: "Resilient Background Execution",
        desc: "Autonomous scheduling with APScheduler 3.x, in-memory DB polling, timezone normalization, and idempotent catch-up webhooks.",
      },
      {
        num: "05",
        title: "Defense-in-Depth Security",
        desc: "Symmetric Fernet encryption at rest for database credentials and tokens, strict multi-tenant ownership, and stateless JWT/OAuth.",
      },
      {
        num: "06",
        title: "Zero-Cost Deployment Feasibility",
        desc: "Architected for $0/mo operation across Render web/worker, Supabase PostgreSQL & Storage, Vercel frontend, and Brevo SMTP.",
      },
    ],
    deepDives: [
      {
        id: "ingestion",
        title: "Heterogeneous Ingestion Router & Normalization",
        tag: "Ingestion Engine",
        summary: "Normalizes arbitrary JSON, SQL resultsets, and cloud spreadsheets into an identical 2D tabular array.",
        points: [
          "Recursive Dictionary Unwrapping: Automatically unwraps nested metadata (e.g., { status: 200, data: { items: [...] } }) to extract target schema keys.",
          "Direct SQLAlchemy Reflection: Instantiates isolated SQLAlchemy engines, executing parameterized queries without retaining connection locks.",
          "Zero-Auth Google Sheets Streaming: Regex extraction of document ID & sheet GID, streaming directly via Google's CSV export endpoint.",
          "Sparse Airtable Record Aggregation: Aggregates heterogeneous field keys across sparse records into clean string column vectors.",
        ],
      },
      {
        id: "ai-groq",
        title: "Text-to-SQL & Natural Language Cron via Groq LLM",
        tag: "AI Inference",
        summary: "Leverages Groq LLMs (openai/gpt-oss-120b) to translate plain-English user intent into validated SQL queries and cron expressions.",
        points: [
          "Automated Schema Inspection: Inspects table schemas using SQLAlchemy inspect() before submitting query prompts to Groq.",
          "Markdown Stripping & Syntax Validation: Cleans model output of backticks and runs syntax checks before persistence.",
          "Safe Cron Synthesis: Enforces platform limits (rejects sub-hourly cron like */5 to prevent API hammering, locks minute field to 0 for daily runs).",
          "Automated Executive Commentary: Produces HTML-ready bulleted anomaly insights with normalized ASCII punctuation.",
        ],
      },
      {
        id: "reportlab",
        title: "Deterministic PDF Document Synthesis & Charting",
        tag: "Document Engineering",
        summary: "Overcomes ReportLab print formatting traps through mathematical column balancing and flowable wrapping.",
        points: [
          "Dynamic Column Width Allocation: Evenly distributes 552pt printable Letter page width across columns to prevent horizontal overflow.",
          "CJK Word Wrapping: Wraps every cell in Platypus Paragraph with wordWrap='CJK' and XML character escaping to prevent text clipping.",
          "Headless Matplotlib Charts: Detects numeric columns and compiles high-res (150 DPI) bar/pie charts into an in-memory BytesIO buffer.",
          "Unicode Sanitization: Replaces unicode typographical quotes with standard ASCII characters to eliminate UnicodeEncodeErrors.",
        ],
      },
      {
        id: "scheduler",
        title: "Dual-Engine APScheduler & Catch-Up Webhook",
        tag: "Worker Orchestration",
        summary: "Maintains zero-downtime schedule synchronization even when hosting on ephemeral cloud tiers.",
        points: [
          "30-Second In-Memory Poller: sync_db_jobs polls the database every 30s to dynamically register new/modified jobs without worker restarts.",
          "Timezone-Aware Cron Triggers: Validates user schedules against target local timezones (UTC, America/New_York, Asia/Kolkata).",
          "Stateless Catch-Up Webhook: External cron triggers /api/reports/trigger-due-jobs/ to run any jobs missed during container sleep.",
          "Audit Logging & Self-Healing: Logs every run status, response time, and stack traces with one-click failure resolution in the dashboard.",
        ],
      },
      {
        id: "security",
        title: "Fernet Field-Level Encryption & Multi-Tenant Isolation",
        tag: "Data Security",
        summary: "Prevents credential leaks and unauthorized data inspection using symmetric cryptography and tenant filters.",
        points: [
          "Fernet AES-128-CBC Encryption: All database passwords and bearer tokens are encrypted prior to DB writes via EncryptedCharField.",
          "Transparent Model Decryption: Secrets decrypt exclusively in-memory upon authorized model instantiation.",
          "Tenant-Scoped Querysets: All API viewsets strictly scope querysets to request.user (get_queryset filters by owner).",
          "JWT & Google OAuth 2.0: Stateless authentication with configurable access token expiration and refresh rotation.",
        ],
      },
    ],
    benchmarks: [
      { stage: "Data Pull & Querying", manual: "15–30 mins across portals", automated: "1.2s automated fetch", impact: "95%+ time savings" },
      { stage: "Data Cleansing & Math", manual: "10–20 mins in spreadsheet", automated: "Sub-second parsing", impact: "Zero formula breaks" },
      { stage: "Executive Summary Drafting", manual: "15–20 mins analyst writing", automated: "2.5s Groq LLM inference", impact: "Instant narrative insights" },
      { stage: "Document Formatting & Charts", manual: "15–30 mins styling document", automated: "<1s ReportLab compilation", impact: "Deterministic vector layout" },
      { stage: "Email Delivery & Dispatch", manual: "5 mins manual attachments", automated: "Automated SMTP / Brevo", impact: "100% on-time execution" },
      { stage: "Total Labor Per Report", manual: "45 to 105 minutes", automated: "~4 seconds total run", impact: "~98% reduction in cost" },
    ],
    scenarios: [
      {
        title: "E-Commerce Daily Executive Brief",
        source: "Shopify REST API (/admin/api/orders.json)",
        output: "Gross Merchandise Value (GMV), top 5 SKU breakdown, conversion rates, and Matplotlib sales chart.",
        directive: "Identify revenue spikes, inventory velocity anomalies, and discount usage outliers.",
        delivery: "Daily at 07:00 AM EST to Founders & VP of Growth.",
      },
      {
        title: "DevOps Infrastructure Health Monitor",
        source: "Internal PostgreSQL Cluster Telemetry",
        output: "Node CPU/RAM consumption table, p99 latencies, and service error rate histograms.",
        directive: "Flag nodes exceeding 85% CPU or baseline deviations in 5xx responses.",
        delivery: "Mondays at 08:00 AM UTC to On-Call Engineers.",
      },
      {
        title: "Digital Marketing Weekly Client Scorecard",
        source: "Airtable Agency Campaign Base",
        output: "Aggregated ad spend, CTR, CPC, and blended ROAS styled with client agency branding palette.",
        directive: "Summarize campaign efficiency gains and highlight top-performing ad creatives.",
        delivery: "Fridays at 17:00 local client time.",
      },
    ],
    schemaModels: [
      { model: "DataSource", fields: ["id", "name", "connection_type (sql|rest|sheets|airtable)", "endpoint", "auth_token (Fernet Encrypted)", "config (JSON)"] },
      { model: "ReportTemplate", fields: ["id", "name", "layout", "header_text", "branding_color", "branding_logo", "has_chart", "ai_prompt", "email_subject"] },
      { model: "Schedule", fields: ["id", "name", "frequency", "time_of_day", "cron_expression", "timezone", "recipients (CSV/Array)"] },
      { model: "Job", fields: ["id", "name", "data_source_id (FK)", "template_id (FK)", "schedule_id (FK)", "is_active", "created_at"] },
      { model: "ExecutionLog", fields: ["id", "job_id (FK)", "job_name_snapshot", "status (success|failed)", "error_message", "report_file (PDF)", "executed_at"] },
    ],
    topology: [
      { layer: "Presentation / UI", service: "Vercel Edge Network", role: "Next.js 16 (App Router), React 19, Bootstrap 5.3, Recharts telemetry" },
      { layer: "API & Control Plane", service: "Render Web Service", role: "Django 6.0+, Django REST Framework, JWT middleware, Fernet crypto" },
      { layer: "Background Orchestration", service: "Render Background Worker", role: "APScheduler 3.x, in-memory DB polling, idempotent catch-up webhooks" },
      { layer: "Database & Storage", service: "Supabase Cloud Platform", role: "PostgreSQL 15+ relational database & S3-compatible Object Storage for PDFs" },
      { layer: "Inference & Delivery", service: "Groq Cloud & Brevo", role: "Groq openai/gpt-oss-120b for text-to-SQL & summaries; Brevo Anymail for SMTP" },
    ],
    lessons: [
      "ReportLab Flowable Determinism: Dynamic text must always be encapsulated in Platypus Paragraph flowables with calculated column widths; raw table strings inevitably break margins.",
      "LLM Output Normalization: Models frequently produce markdown symbols and smart punctuation. Pre-compilation regex cleaning and ASCII conversion prevent PDF parser crashes.",
      "Decoupled Worker Architecture: Keeping the HTTP web server stateless while offloading batch report builds to an independent worker prevents request thread starvation.",
    ],
    roadmap: [
      "Bi-directional Webhook Triggers: Trigger on-demand report generation from external events (GitHub releases, Stripe webhooks).",
      "Slack & Microsoft Teams Dispatch: Push executive briefs and PDF attachments directly into enterprise chat channels.",
      "Interactive HTML Report Previews: Live web-based document preview alongside the downloadable vector PDF.",
      "Automated Anomaly Alerting: Real-time statistical alerts triggered when queried metrics breach dynamic confidence intervals.",
    ],
  },
};
