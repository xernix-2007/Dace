"use client";

import { useEffect, useMemo, useState } from "react";

type Topic = {
  id: string;
  title: string;
  days: number;
  goal: string;
  prerequisites: string[];
  miniProject: string;
  checklist: string[];
};

type Day = {
  day: number;
  topicId: string;
  target: string;
  practice: string;
  project: string;
  checkpoint: string;
};

const topics: Topic[] = [
  {
    id: "http",
    title: "HTTP, Web & REST",
    days: 6,
    goal: "Understand how real web applications communicate before touching the framework.",
    prerequisites: ["Basic Python", "Basic networking awareness"],
    miniProject: "REST Notes API design",
    checklist: ["Client/server", "HTTP/HTTPS", "Methods", "Status codes", "Headers", "JSON", "URLs", "Path/query params", "Cookies/sessions", "REST", "Idempotency", "CORS"],
  },
  {
    id: "git",
    title: "Git & GitHub",
    days: 4,
    goal: "Work like an engineer: branches, commits, pull requests and clean history.",
    prerequisites: ["Basic terminal usage"],
    miniProject: "Put the Notes API under Git with feature branches and a clean PR workflow.",
    checklist: ["init/clone/status", "add/commit", "branch/merge", "rebase basics", "remote/push/pull", "PRs", "conflict resolution", "README/issues"],
  },
  {
    id: "fastapi",
    title: "FastAPI",
    days: 12,
    goal: "Build a structured production-style API instead of tutorial CRUD.",
    prerequisites: ["HTTP & REST", "Git basics"],
    miniProject: "Task API v1 — routes, validation, CRUD, dependencies, errors and API docs.",
    checklist: ["Routes", "Request body", "Path/query params", "Pydantic", "Response models", "CRUD", "Routers", "Dependencies", "Config/.env", "Errors", "Middleware/CORS", "async/await"],
  },
  {
    id: "postgres",
    title: "SQL & PostgreSQL",
    days: 14,
    goal: "Become strong in SQL and database reasoning; ORM comes later.",
    prerequisites: ["HTTP/API basics"],
    miniProject: "Task Management Database — users, projects, tasks and comments with real relationships.",
    checklist: ["Tables/rows/columns", "SELECT", "WHERE", "INSERT/UPDATE/DELETE", "ORDER/GROUP/HAVING", "JOINs", "Subqueries/CTEs", "CASE/window functions", "PK/FK", "Constraints", "Relationships", "Normalization", "Indexes", "Transactions/ACID/isolation"],
  },
  {
    id: "sqlalchemy",
    title: "SQLAlchemy & Alembic",
    days: 8,
    goal: "Connect FastAPI to PostgreSQL without hiding database concepts behind an ORM.",
    prerequisites: ["SQL/PostgreSQL", "FastAPI"],
    miniProject: "Task API v2 — FastAPI + PostgreSQL + SQLAlchemy + Alembic.",
    checklist: ["ORM concept", "Engine", "Sessions", "Models", "CRUD", "Relationships", "Queries", "Transactions", "Async SQLAlchemy", "Repository/service split", "Alembic migrations", "Upgrade/downgrade"],
  },
  {
    id: "auth",
    title: "Authentication & Authorization",
    days: 7,
    goal: "Build secure multi-user APIs and understand what each security layer does.",
    prerequisites: ["FastAPI", "PostgreSQL", "SQLAlchemy"],
    miniProject: "Multi-user Task System — registration, login, JWT, protected resources and roles.",
    checklist: ["Auth vs authorization", "Password hashing", "JWT", "Access tokens", "Refresh tokens", "Protected routes", "Current user", "RBAC/permissions", "OAuth basics", "Secrets"],
  },
  {
    id: "api",
    title: "Production API Engineering",
    days: 5,
    goal: "Move from tutorial API to an API that is designed for real clients and traffic.",
    prerequisites: ["FastAPI", "PostgreSQL", "Authentication"],
    miniProject: "Job API — versioning, pagination, filtering, search, sorting, consistent errors and idempotency.",
    checklist: ["Pagination", "Filtering", "Search", "Sorting", "API versioning", "Error contracts", "Logging", "Config", "Rate limiting concepts", "Idempotency"],
  },
  {
    id: "testing",
    title: "Testing & Reliability",
    days: 6,
    goal: "Prove your backend works instead of manually hoping it works.",
    prerequisites: ["Production API", "Database", "Auth"],
    miniProject: "Tested Backend — unit, integration and authenticated API tests with fixtures.",
    checklist: ["pytest", "Assertions", "Fixtures", "Unit tests", "API tests", "Integration tests", "Test DB", "Mocking", "Auth tests", "Edge cases", "Coverage"],
  },
  {
    id: "redis",
    title: "Redis",
    days: 5,
    goal: "Understand caching, TTL and fast temporary state in real applications.",
    prerequisites: ["FastAPI", "PostgreSQL"],
    miniProject: "Cached Job API — cache-aside reads, TTL and basic rate limiting.",
    checklist: ["Redis model", "Keys/values", "TTL", "Cache-aside", "Invalidation", "FastAPI integration", "Connection management", "Rate limiting basics"],
  },
  {
    id: "celery",
    title: "Celery & Background Processing",
    days: 5,
    goal: "Move slow/retryable work outside the HTTP request lifecycle.",
    prerequisites: ["FastAPI", "Redis"],
    miniProject: "Notification Processing System — Celery workers, retries and scheduled jobs.",
    checklist: ["Why queues", "Broker/worker/task", "Celery setup", "Redis broker", "Retries", "Failure handling", "Scheduled tasks", "Celery Beat", "Monitoring basics"],
  },
  {
    id: "docker",
    title: "Docker & Linux",
    days: 8,
    goal: "Run the whole backend as reproducible infrastructure and understand the Linux environment underneath it.",
    prerequisites: ["FastAPI", "PostgreSQL", "Redis", "Celery"],
    miniProject: "Containerized Backend — FastAPI + PostgreSQL + Redis + Celery through Docker Compose.",
    checklist: ["Linux CLI", "Processes/files/permissions", "SSH basics", "Docker images", "Containers", "Dockerfile", ".dockerignore", "Volumes", "Networks", "Ports", "Environment variables", "Compose"],
  },
  {
    id: "cicd",
    title: "CI/CD & Deployment",
    days: 4,
    goal: "Ship the backend repeatably instead of running everything only on your laptop.",
    prerequisites: ["GitHub", "Docker", "Linux"],
    miniProject: "Deploy the cumulative backend with automated tests/build and a production environment.",
    checklist: ["CI concept", "GitHub Actions", "Secrets", "Build/test pipeline", "Cloud basics", "HTTPS/domain", "Logs", "Deployment rollback"],
  },
];

const dayTopics: string[][] = [
  ["Web request lifecycle","HTTP methods and safe/idempotent operations","Status codes and headers","JSON, URLs and parameters","Cookies, sessions and CORS","REST API design + mini-project"],
  ["Git basics","Commits and useful history","Branches and merges","Pull requests + project workflow"],
  ["FastAPI setup and routes","Request bodies and validation","Path/query parameters","Pydantic models","Response models","CRUD endpoints","Routers and project structure","Dependencies","Configuration and .env","Errors, middleware and CORS","async/await in APIs","Build Task API v1 + review"],
  ["Relational database mental model","SELECT","WHERE","INSERT/UPDATE/DELETE","ORDER BY","GROUP BY/HAVING","INNER JOIN","LEFT JOIN","Subqueries","CTEs","CASE/window functions","Keys and constraints","Relationships + normalization","Indexes, transactions, ACID and isolation"],
  ["ORM mental model","SQLAlchemy engine","Sessions","Models","CRUD","Relationships","Queries/transactions","Alembic + cumulative project"],
  ["Authentication vs authorization","Password hashing","JWT structure","Access tokens","Refresh tokens","Protected routes and current user","RBAC/permissions + secure project review"],
  ["Pagination","Filtering","Search","Sorting/versioning","Idempotency + logging + production API review"],
  ["pytest setup","Assertions/fixtures","Unit tests","API tests","Integration/test DB","Auth/edge cases/coverage + reliability review"],
  ["Redis basics","Keys/TTL","Cache-aside","FastAPI integration","Invalidation + rate limiting mini-project"],
  ["Queues and workers","Celery setup","Redis broker + tasks","Retries/failures","Scheduled jobs + cumulative project"],
  ["Linux CLI/files/processes","Permissions + SSH","Docker concepts","Dockerfile","Images/containers","Volumes/networks/ports","Docker Compose","Run full stack + infrastructure review"],
  ["CI/CD concepts","GitHub Actions + secrets","Build/test + cloud deployment","HTTPS/logs/rollback + ship final project"],
];

function buildDays(): Day[] {
  const days: Day[] = [];
  let n = 1;
  topics.forEach((topic, ti) => {
    const labels = dayTopics[ti];
    labels.forEach((label, i) => {
      const finalDay = i === labels.length - 1;
      days.push({
        day: n++,
        topicId: topic.id,
        target: label,
        practice: finalDay ? "Review the topic and write the idea in your own words before moving on." : "Write a small example or implement the concept; do not only watch/read.",
        project: finalDay ? topic.miniProject : `Add this day's concept to: ${topic.miniProject}`,
        checkpoint: finalDay ? `Can you explain ${topic.title} without opening notes?` : `Can you implement ${label.toLowerCase()} without copying the solution?`,
      });
    });
  });
  return days;
}

const days = buildDays();

export default function BackendSDEPage() {
  const [selectedTopic, setSelectedTopic] = useState("http");
  const [selectedDay, setSelectedDay] = useState(1);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [mistakes, setMistakes] = useState<Record<string, string>>({});
  const [code, setCode] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<Record<string, {name:string;size:number;type:string}[]>>({});
  const [subtopicDone, setSubtopicDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem("dace-backend-done") || "{}"));
      setNotes(JSON.parse(localStorage.getItem("dace-backend-notes") || "{}"));
      setMistakes(JSON.parse(localStorage.getItem("dace-backend-mistakes") || "{}"));
      setCode(JSON.parse(localStorage.getItem("dace-backend-code") || "{}"));
      setAttachments(JSON.parse(localStorage.getItem("dace-backend-attachments") || "{}"));
      setSubtopicDone(JSON.parse(localStorage.getItem("dace-backend-subtopics") || "{}"));
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-done", JSON.stringify(done)); }, [done, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-notes", JSON.stringify(notes)); }, [notes, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-mistakes", JSON.stringify(mistakes)); }, [mistakes, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-code", JSON.stringify(code)); }, [code, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-attachments", JSON.stringify(attachments)); }, [attachments, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-subtopics", JSON.stringify(subtopicDone)); }, [subtopicDone, hydrated]);

  const topic = topics.find(t => t.id === selectedTopic) || topics[0];
  const topicDays = days.filter(d => d.topicId === topic.id);
  const day = days.find(d => d.day === selectedDay) || topicDays[0];
  const completedDays = Object.values(done).filter(Boolean).length;
  const progress = Math.round((completedDays / days.length) * 100);
  const topicProgress = topicDays.filter(d => done[d.day]).length;
  const currentTopicIndex = topics.findIndex(t => t.id === selectedTopic);

  const selectTopic = (id: string) => {
    setSelectedTopic(id);
    const first = days.find(d => d.topicId === id);
    if (first) setSelectedDay(first.day);
  };

  const setText = (setter: React.Dispatch<React.SetStateAction<Record<string,string>>>, key: string, value: string) => {
    setter(prev => ({ ...prev, [key]: value }));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachments(prev => ({
      ...prev,
      [topic.id]: [...(prev[topic.id] || []), ...files.map(f => ({name:f.name,size:f.size,type:f.type}))]
    }));
    e.currentTarget.value = "";
  };

  const resetWorkspace = () => {
    if (!confirm("Reset Backend/SDE learning notes and progress? Export anything important first.")) return;
    ["dace-backend-done","dace-backend-notes","dace-backend-mistakes","dace-backend-code","dace-backend-attachments","dace-backend-subtopics"].forEach(k => localStorage.removeItem(k));
    location.reload();
  };

  const sprintMinutes = topicDays.length * 65;
  const sprintHours = Math.floor(sprintMinutes / 60);
  const sprintMins = sprintMinutes % 60;
  const lessonsFor = (d: Day) => {
    const maps: Record<string, string[]> = {
      http: [
        "Client vs server and the request/response pipeline",
        "HTTP method + URL + headers + body",
        "Status codes: 2xx, 3xx, 4xx, 5xx",
        "JSON, path parameters and query parameters",
        "REST resources, CORS, cookies and sessions",
        "Design the first version of the Task/Notes API",
      ],
      git: [
        "Repository, working tree and staging area",
        "Small commits and useful commit messages",
        "Branches, merge and conflict resolution",
        "Pull request workflow and code review",
        "Rebase basics and clean project history",
        "README, issues and engineering hygiene",
      ],
      fastapi: [
        "FastAPI app, route and Uvicorn",
        "Path/query parameters and request bodies",
        "Pydantic validation and schemas",
        "Response models and HTTP status codes",
        "CRUD routes and error handling",
        "Routers, dependencies and project structure",
        "Configuration and environment variables",
        "Middleware and CORS",
        "Async vs sync endpoint work",
        "Request → validation → service → response flow",
        "Test the API manually with /docs",
        "Build and review Task API v1",
      ],
      postgres: [
        "Tables, rows, columns and relationships",
        "SELECT and filtering with WHERE",
        "INSERT, UPDATE and DELETE",
        "ORDER BY, GROUP BY and HAVING",
        "INNER JOIN and LEFT JOIN",
        "Subqueries and CTEs",
        "CASE and window functions",
        "Primary keys, foreign keys and constraints",
        "One-to-one, one-to-many and many-to-many",
        "Normalization and avoiding duplicated data",
        "Indexes and why they speed reads",
        "Transactions and ACID",
        "Isolation and concurrent database work",
        "Design the Task API database",
      ],
      sqlalchemy: [
        "Why an ORM exists and what SQL it hides",
        "Engine and database connection",
        "Sessions and transaction boundaries",
        "SQLAlchemy models and mapped columns",
        "CRUD with select/add/commit/refresh",
        "Relationships and loading related data",
        "Queries, transactions and service/repository separation",
        "Alembic migrations and schema versioning",
      ],
      auth: [
        "Authentication vs authorization",
        "Never store plain passwords: hashing",
        "JWT structure and signed access tokens",
        "Login → token → Authorization: Bearer flow",
        "Protected routes with dependencies",
        "Current user and user-owned resources",
        "Roles, permissions and authorization checks",
      ],
      api: [
        "Pagination for large result sets",
        "Filtering and search",
        "Sorting and stable API responses",
        "API versioning and consistent error contracts",
        "Idempotency, logging and production API rules",
      ],
      testing: [
        "pytest setup and assertions",
        "Fixtures and reusable test setup",
        "Unit tests for business logic",
        "API tests with TestClient/httpx",
        "Database/integration tests",
        "Authentication, authorization, edge cases and coverage",
      ],
      redis: [
        "Redis keys, values and fast temporary state",
        "TTL and automatic expiration",
        "Cache-aside: read cache → fallback to DB",
        "Connect Redis to FastAPI safely",
        "Cache invalidation and basic rate limiting",
      ],
      celery: [
        "Why queues and workers exist",
        "Celery app, task and worker",
        "Redis as broker and result backend",
        "Retries and failure handling",
        "Scheduled jobs and Celery Beat",
      ],
      docker: [
        "Linux CLI, files and processes",
        "Permissions and SSH basics",
        "Image vs container",
        "Dockerfile and reproducible builds",
        "Volumes, networks and ports",
        "Environment variables and service configuration",
        "Docker Compose for API + PostgreSQL + Redis",
        "Run and debug the complete stack",
      ],
      cicd: [
        "What CI/CD actually solves",
        "GitHub Actions and automated tests",
        "Secrets and environment configuration",
        "Build the application image",
        "Deploy, health checks and logs",
        "HTTPS, rollback and final production checklist",
      ],
    };
    const list = maps[d.topicId] || [];
    if (list.length) {
      const idx = days.filter(x => x.topicId === d.topicId).findIndex(x => x.day === d.day);
      const focus = list[idx % list.length];
      return [
        focus,
        "Simple explanation + real backend example",
        "Write or run a tiny example yourself",
        d.project,
        d.checkpoint,
      ];
    }
    return [d.target, "Simple explanation + real backend example", "Build a tiny example", d.project, d.checkpoint];
  };

  const subtopicKey = (dayNumber: number, lesson: string) => `${dayNumber}::${lesson}`;
  const currentLessons = lessonsFor(day);
  const currentChecked = currentLessons.filter(lesson => subtopicDone[subtopicKey(day.day, lesson)]).length;
  const toggleSubtopic = (lesson: string) => {
    const key = subtopicKey(day.day, lesson);
    setSubtopicDone(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const allDone = currentLessons.length > 0 && currentLessons.every(item => next[subtopicKey(day.day, item)]);
      setDone(prevDone => ({ ...prevDone, [day.day]: allDone }));
      return next;
    });
  };

  return (
    <main className="min-h-screen dace-grid text-white">
      <div className="cosmic-bg cosmic-nebula" aria-hidden="true" />

      <header className="sticky top-0 z-40 glass border-b border-[#202a38] h-[74px] px-5 md:px-8 flex items-center gap-4">
        <a href="/" className="text-xs text-[#7e8ca0] hover:text-white">← DACE</a>
        <div className="h-7 w-px bg-[#263346]" />
        <div>
          <div className="font-black tracking-tight text-base">Backend / SDE</div>
          <div className="text-[9px] tracking-[.2em] text-cyan-200 mt-0.5">BACKEND ENGINEERING · 84 DAYS</div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-400/10 text-blue-300 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            Sprint {currentTopicIndex + 1}
          </div>
          <div className="hidden md:block text-xs text-[#9aa8ba]">
            Est. {sprintHours}h {sprintMins}m · {completedDays > 0 ? "In progress" : "Not started"}
          </div>
          <div className="text-xs text-[#9aa8ba]">{completedDays}/{days.length} · {progress}%</div>
        </div>
      </header>

      <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[.2em] text-cyan-200">LEARNING ROADMAP</div>
            <h1 className="text-2xl md:text-3xl font-black mt-2">Build the backend. One day at a time.</h1>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-[10px] text-[#657387]">CURRENT</div>
            <div className="text-sm font-semibold mt-1">Day {day.day} · {topic.title}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#202a38] bg-[#090e15]/95 overflow-hidden shadow-2xl">
          {topics.map((t, ti) => {
            const stageDays = days.filter(d => d.topicId === t.id);
            const stageDone = stageDays.filter(d => done[d.day]).length;
            const isCurrentSprint = t.id === topic.id;
            const minutes = stageDays.length * 65;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;

            return (
              <details key={t.id} open={isCurrentSprint} className="group border-b border-[#202a38] last:border-b-0">
                <summary className="list-none cursor-pointer px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 hover:bg-white/[.018]">
                  <div className="w-9 h-9 rounded-full border border-[#29384c] flex items-center justify-center text-[10px] text-[#718096] shrink-0">
                    {stageDone === stageDays.length ? "✓" : ""}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-lg border border-blue-400/30 text-[10px] text-blue-300">Sprint {ti + 1}</span>
                      <span className="font-bold text-sm md:text-base truncate">{t.title}</span>
                    </div>
                    <div className="text-[10px] text-[#657387] mt-1 truncate">{t.goal}</div>
                  </div>

                  <div className="hidden sm:block text-right shrink-0">
                    <div className="text-xs text-[#9aa8ba]">{stageDone}/{stageDays.length} days</div>
                    <div className="text-[10px] text-[#657387] mt-0.5">Est. {hours}h {mins}m</div>
                  </div>
                  <span className="text-[#657387] text-xl transition-transform group-open:rotate-90">›</span>
                </summary>

                <div className="bg-[#070c12] border-t border-[#202a38]">
                  {stageDays.map((d, di) => {
                    const open = selectedDay === d.day;
                    const lessonList = lessonsFor(d);
                    const lessonMinutes = Math.max(10, Math.round(65 / lessonList.length));

                    return (
                      <div key={d.day} className={`border-b border-white/[.035] last:border-b-0 ${open ? "bg-[#0a1017]" : ""}`}>
                        <button
                          onClick={() => setSelectedDay(d.day)}
                          className="w-full text-left px-4 md:px-8 py-4 flex items-center gap-3 hover:bg-white/[.02]"
                        >
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] border shrink-0 ${done[d.day] ? "border-green-300/30 bg-green-300/10 text-green-300" : open ? "border-blue-300/40 text-blue-300 bg-blue-300/5" : "border-[#2b384b] text-[#657387]"}`}>
                            {done[d.day] ? "✓" : ""}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-[#657387]">DAY {di + 1}</span>
                              {open && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-300/10 text-blue-300">TODAY</span>}
                            </div>
                            <div className={`text-sm font-semibold mt-1 ${done[d.day] ? "text-[#707c8c]" : "text-[#c4ccd7]"}`}>{d.target}</div>
                          </div>

                          <span className="hidden sm:block text-[10px] text-[#78869a]">Est. 1h 05m</span>
                          <span className={`text-[#657387] text-lg transition-transform ${open ? "rotate-90" : ""}`}>›</span>
                        </button>

                        {open && (
                          <div className="px-4 md:px-8 pb-4">
                            <div className="ml-10 rounded-xl border border-[#202a38] overflow-hidden">
                              <div className="px-4 py-3 flex items-center justify-between bg-white/[.018] border-b border-white/[.035]">
                                <div>
                                  <div className="text-[9px] tracking-[.16em] text-cyan-200">TODAY'S SUBTOPICS</div>
                                  <div className="text-[10px] text-[#657387] mt-1">{currentChecked}/{lessonList.length} checked</div>
                                </div>
                                <div className="w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                  <div className="h-full bg-cyan-300 rounded-full transition-all" style={{width:`${lessonList.length ? currentChecked / lessonList.length * 100 : 0}%`}} />
                                </div>
                              </div>
                              {lessonList.map((lesson) => {
                                const checked = !!subtopicDone[subtopicKey(d.day, lesson)];
                                const lessonKey = subtopicKey(d.day, lesson);
                                const isExpanded = expandedLesson === lessonKey;

                                return (
                                  <div key={lesson} className="border-b border-white/[.035] last:border-b-0">
                                    <div className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[.025]">
                                      <button
                                        onClick={() => toggleSubtopic(lesson)}
                                        aria-label={checked ? `Mark ${lesson} incomplete` : `Mark ${lesson} complete`}
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${checked ? "bg-cyan-300 border-cyan-300 text-black" : "border-[#46546a] text-transparent"}`}
                                      >
                                        {checked ? "✓" : ""}
                                      </button>

                                      <button
                                        onClick={() => setExpandedLesson(isExpanded ? null : lessonKey)}
                                        className="text-left flex-1 min-w-0 group/lesson"
                                        aria-expanded={isExpanded}
                                      >
                                        <span className={`text-xs group-hover/lesson:text-cyan-200 transition ${checked ? "text-[#64748b] line-through" : "text-[#aeb8c6]"}`}>
                                          {lesson}
                                        </span>
                                      </button>

                                      <span className={`text-[#657387] text-sm transition-transform ${isExpanded ? "rotate-180" : ""}`}>⌄</span>
                                      <span className="hidden sm:inline text-[10px] text-[#78869a] ml-1">Est. {lessonMinutes} min</span>
                                    </div>

                                    {isExpanded && (() => {
                                      const content = lessonContent(d, lesson);
                                      return (
                                        <div className="mx-4 mb-4 rounded-xl border border-cyan-300/10 bg-[#080d14] overflow-hidden">
                                          <div className="px-4 py-3 border-b border-white/[.04]">
                                            <div className="text-[9px] tracking-[.16em] text-cyan-200">LESSON SLIDE</div>
                                            <div className="text-sm font-bold mt-1 text-white">{lesson}</div>
                                          </div>

                                          <div className="grid gap-4 p-4">
                                            <section>
                                              <div className="text-[9px] tracking-[.15em] text-blue-200"># WHY</div>
                                              <p className="text-xs leading-6 text-[#b5bfcd] mt-1">{content.why}</p>
                                            </section>
                                            <section>
                                              <div className="text-[9px] tracking-[.15em] text-blue-200"># CONCEPT + LOGIC</div>
                                              <pre className="whitespace-pre-wrap text-[11px] leading-5 text-[#c9d3df] mt-2">{content.explanation}</pre>
                                            </section>
                                            <section>
                                              <div className="text-[9px] tracking-[.15em] text-blue-200"># CODE</div>
                                              <pre className="overflow-x-auto whitespace-pre text-[11px] leading-5 text-[#d8e1ec] mt-2 p-3 rounded-lg bg-black/40 border border-white/[.04] font-mono">{content.code}</pre>
                                            </section>
                                            <section>
                                              <div className="text-[9px] tracking-[.15em] text-cyan-200"># CODE WALKTHROUGH</div>
                                              <pre className="whitespace-pre-wrap text-[11px] leading-5 text-[#b9c5d4] mt-2">{content.walkthrough}</pre>
                                            </section>
                                            <section>
                                              <div className="text-[9px] tracking-[.15em] text-indigo-200"># REAL BACKEND EXAMPLE</div>
                                              <p className="text-xs leading-6 text-[#b5bfcd] mt-1">{content.realExample}</p>
                                            </section>
                                            <section>
                                              <div className="text-[9px] tracking-[.15em] text-violet-200"># PROJECT</div>
                                              <p className="text-xs leading-6 text-[#b5bfcd] mt-1">{content.project}</p>
                                            </section>
                                            <section>
                                              <div className="text-[9px] tracking-[.15em] text-green-200"># PRACTICE</div>
                                              <p className="text-xs leading-6 text-[#b5bfcd] mt-1">{content.practice}</p>
                                            </section>
                                            <section>
                                              <div className="text-[9px] tracking-[.15em] text-amber-200"># COMMON MISTAKES</div>
                                              <p className="text-xs leading-6 text-[#b5bfcd] mt-1">{content.mistakes}</p>
                                            </section>
                                            <section>
                                              <div className="text-[9px] tracking-[.15em] text-amber-200"># INTERVIEW CHECK</div>
                                              <pre className="whitespace-pre-wrap text-[11px] leading-5 text-[#b9c5d4] mt-2">{content.interview}</pre>
                                            </section>
                                            <section className="rounded-lg bg-cyan-300/[.035] border border-cyan-300/10 p-3">
                                              <div className="text-[9px] tracking-[.15em] text-cyan-200"># CHECK YOURSELF</div>
                                              <p className="text-xs leading-6 text-[#c8d2df] mt-1">{content.summary}</p>
                                            </section>
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              })}                          </div>

                            <div className="ml-10 mt-3 flex flex-col sm:flex-row gap-3">
                              <div className="flex-1 rounded-xl border border-violet-300/10 bg-violet-300/[.025] px-4 py-3">
                                <div className="text-[9px] tracking-[.16em] text-violet-200">PROJECT</div>
                                <div className="text-xs font-semibold mt-1">{d.project}</div>
                              </div>
                              <div className="flex-1 rounded-xl border border-cyan-300/10 bg-cyan-300/[.025] px-4 py-3">
                                <div className="text-[9px] tracking-[.16em] text-cyan-200">CHECKPOINT</div>
                                <div className="text-xs mt-1 text-[#a4afbd]">{d.checkpoint}</div>
                              </div>
                            </div>

                            <div className="ml-10 mt-4 grid lg:grid-cols-2 gap-3">
                              <div className="rounded-2xl border border-violet-300/10 bg-[#080d14] p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-[9px] tracking-[.16em] text-violet-200">THOUGHTS / NOTES</div>
                                    <div className="text-[10px] text-[#5f6d80] mt-1">Write what you understood in your own words.</div>
                                  </div>
                                  <span className="text-[9px] text-[#536174]">AUTO-SAVED</span>
                                </div>
                                <textarea
                                  value={notes[String(d.day)] || ""}
                                  onChange={e => setText(setNotes, String(d.day), e.target.value)}
                                  placeholder="What did you learn? What confused you? What would you explain in an interview?"
                                  className="mt-3 w-full min-h-[150px] resize-y rounded-xl border border-white/8 bg-[#050a10] p-3 text-xs text-[#c6cfdb] outline-none focus:border-violet-300/30"
                                />
                              </div>
                              <div className="rounded-2xl border border-cyan-300/10 bg-[#080d14] p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-[9px] tracking-[.16em] text-cyan-200">MY CODE</div>
                                    <div className="text-[10px] text-[#5f6d80] mt-1">Keep your own implementation here.</div>
                                  </div>
                                  <span className="text-[9px] text-[#536174]">AUTO-SAVED</span>
                                </div>
                                <textarea
                                  value={code[String(d.day)] || ""}
                                  onChange={e => setText(setCode, String(d.day), e.target.value)}
                                  placeholder="# Paste or write the code you wrote today..."
                                  spellCheck={false}
                                  className="mt-3 w-full min-h-[190px] resize-y rounded-xl border border-white/8 bg-[#050a10] p-3 text-xs text-cyan-100 font-mono outline-none focus:border-cyan-300/30"
                                />
                              </div>
                            </div>

                            <div className="ml-10 mt-3 flex flex-wrap gap-2">
                              <button
                                onClick={() => setDone(x => ({...x, [d.day]: !x[d.day]}))}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold ${done[d.day] ? "bg-green-300 text-black" : "bg-white text-black"}`}
                              >
                                {done[d.day] ? "✓ Day complete" : "Complete day"}
                              </button>
                              {d.day < days.length && (
                                <button
                                  onClick={() => setSelectedDay(d.day + 1)}
                                  className="px-4 py-2.5 rounded-xl border border-[#2b384b] text-xs text-[#a7b2c1]"
                                >
                                  Next day →
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="px-4 md:px-8 py-4 flex items-center gap-3 bg-white/[.018]">
                    <span className="text-[9px] tracking-[.16em] text-violet-200">PROJECT</span>
                    <span className="text-[10px] text-[#68778c]">{t.miniProject}</span>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </main>
  );
}


type LessonContent = {
  why: string;
  explanation: string;
  code: string;
  project: string;
  practice: string;
  mistakes: string;
  summary: string;
};

type LessonContent = {
  why: string;
  explanation: string;
  code: string;
  walkthrough: string;
  realExample: string;
  project: string;
  practice: string;
  mistakes: string;
  interview: string;
  summary: string;
};

function lessonContent(d: Day, lesson: string): LessonContent {
  const focus = lesson;
  const topic = d.topicId;
  const target = d.target;

  const why: Record<string,string> = {
    http: "HTTP is the language between clients and servers. Learn the protocol first so FastAPI becomes a tool instead of magic.",
    git: "Backend code changes constantly. Git gives you history, safe experiments and collaboration.",
    fastapi: "FastAPI implements HTTP concepts in Python. The important skill is request → validation → business logic → response.",
    postgres: "Real backends need durable state. SQL teaches how that state is stored, queried and protected.",
    sqlalchemy: "SQLAlchemy maps database work into Python, but you still need to understand the SQL and transaction behavior underneath.",
    auth: "A multi-user system must identify callers and enforce what each caller is allowed to do.",
    api: "Production APIs must remain predictable with large, repeated, invalid and concurrent requests.",
    testing: "Tests make backend behavior repeatable and protect the project as it grows.",
    redis: "Redis provides very fast temporary state for caching, counters and rate limiting.",
    celery: "Slow, retryable or scheduled work should not block an HTTP request.",
    docker: "Containers make the same backend runtime reproducible across machines.",
    cicd: "CI/CD turns shipping into a repeatable validate → build → deploy process."
  };

  const code: Record<string,string> = {
    http: `curl -i "http://localhost:8000/tasks?completed=false&limit=10"

HTTP/1.1 200 OK
Content-Type: application/json

{"items":[{"id":1,"title":"Learn HTTP","completed":false}]}`,
    git: `git status
git diff
git add app/
git diff --staged
git commit -m "Add task listing endpoint"
git log --oneline --decorate -5`,
    fastapi: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class TaskCreate(BaseModel):
    title: str

@app.post("/tasks", status_code=201)
def create_task(data: TaskCreate):
    if not data.title.strip():
        raise HTTPException(400, "Title is required")
    return {"id": 1, "title": data.title, "completed": False}`,
    postgres: `CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT NOT NULL
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);

SELECT id, title, completed
FROM tasks
WHERE user_id = 7
ORDER BY id DESC
LIMIT 20;`,
    sqlalchemy: `from sqlalchemy import create_engine, String, Boolean
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session

class Base(DeclarativeBase):
    pass

class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    completed: Mapped[bool] = mapped_column(Boolean, default=False)

engine = create_engine("postgresql+psycopg://user:pass@localhost/app")

with Session(engine) as session:
    task = Task(title="Learn SQLAlchemy")
    session.add(task)
    session.commit()
    session.refresh(task)`,
    auth: `from pwdlib import PasswordHash
passwords = PasswordHash.recommended()

hashed = passwords.hash("my-password")
assert passwords.verify("my-password", hashed)

# In the real app, issue a short-lived signed access token
# only after the password has been verified.`,
    api: `from fastapi import Query

@app.get("/v1/tasks")
def list_tasks(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    completed: bool | None = None,
):
    return load_tasks(limit, offset, completed)`,
    testing: `def test_create_task(client):
    response = client.post("/tasks", json={"title": "Learn testing"})
    assert response.status_code == 201
    assert response.json()["title"] == "Learn testing"`,
    redis: `import redis, json

cache = redis.Redis(host="localhost", port=6379, decode_responses=True)
cache.setex("task:7", 60, json.dumps({"id": 7, "title": "Learn Redis"}))
value = cache.get("task:7")`,
    celery: `from celery import Celery

celery_app = Celery("tasks", broker="redis://localhost:6379/0")

@celery_app.task(autoretry_for=(Exception,), retry_backoff=True, max_retries=3)
def send_notification(user_id: int):
    print("send notification to", user_id)`,
    docker: `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]`,
    cicd: `name: Backend CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest`
  };

  const focusDetail: Record<string,string> = {
    "Client vs server and the request/response pipeline": `# CORE IDEA
Client starts the request. Server owns the application logic and returns a response.

# FLOW
client → HTTP request → router → validation → business logic → database/cache → HTTP response → client

# IMPORTANT
FastAPI does not replace this flow. It gives Python tools for implementing the server side.`,
    "HTTP method + URL + headers + body": `# METHOD
GET reads, POST creates, PUT/PATCH changes, DELETE removes.

# URL
/tasks/42 identifies a resource.

# HEADERS
Metadata such as Content-Type and Authorization.

# BODY
Structured input such as {"title":"Learn HTTP"}.

Each part has a different job.`,
    "Status codes: 2xx, 3xx, 4xx, 5xx": `200 success read
201 resource created
204 success with no body
400 invalid request
401 missing/invalid authentication
403 authenticated but not allowed
404 resource missing
409 state conflict
422 validation failure
429 rate limited
500 unexpected server failure

The status code is part of the API contract.`,
    "JSON, path parameters and query parameters": `PATH: /tasks/42 → which resource?
QUERY: /tasks?completed=false&limit=20 → how should the collection be returned?
BODY: {"title":"Learn FastAPI"} → what data should be created?

Keep identity in the path, collection controls in query parameters and structured input in the body.`,
    "REST resources, CORS, cookies and sessions": `REST uses resource-oriented URLs:
GET /tasks
GET /tasks/42
POST /tasks
PATCH /tasks/42
DELETE /tasks/42

CORS controls which browser origins may read cross-origin responses.
Cookies are automatically sent by browsers.
Sessions associate requests with server-side state.`,
    "Design the first version of the Task/Notes API": `Resources: users, tasks, notes.

Start with:
POST /tasks
GET /tasks
GET /tasks/{id}
PATCH /tasks/{id}
DELETE /tasks/{id}

Define request bodies, response bodies, errors and ownership before writing framework code.`,
    "Repository, working tree and staging area": `Working tree = files being edited.
Staging area = changes selected for the next commit.
Repository = committed history.

Flow:
edit → diff → add → staged diff → commit.

Stage intentionally so every commit tells one clear story.`,
    "Small commits and useful commit messages": `One commit should represent one logical change.

Good:
Add task creation endpoint
Validate task titles
Add PostgreSQL task repository

Bad:
stuff
changes
final final

A useful commit helps future debugging and review.`,
    "Branches, merge and conflict resolution": `A branch is a separate line of development.

main → feature/task-api → commits → merge

A conflict means Git cannot safely combine changes. Inspect both versions, choose the correct result, run tests, then commit the resolution.`,
    "Pull request workflow and code review": `Create branch → push → PR → review → fix → tests → merge.

Review questions:
Does it work?
Is the contract clear?
Are errors handled?
Are tests present?
Is complexity justified?`,
    "Rebase basics and clean project history": `Rebase replays your commits on a new base.

It can create a cleaner linear history, but rewriting shared history can disrupt teammates. Use it deliberately and understand which commits are being rewritten.`,
    "FastAPI app, route and Uvicorn": `FastAPI = application framework.
Route = method + path → Python function.
Uvicorn = ASGI server.

GET /tasks/7
→ route matches
→ function runs
→ Python data is serialized into the response.`,
    "Path/query parameters and request bodies": `Path parameter identifies a resource.
Query parameter controls a collection.
Request body carries structured input.

FastAPI parses typed values for you, giving the endpoint a clear input contract.`,
    "Pydantic validation and schemas": `Incoming data is untrusted.

Pydantic creates a boundary:
JSON → validation → typed Python data → business logic.

Invalid input should fail at this boundary rather than causing a deeper application error.`,
    "Response models and HTTP status codes": `A response model is the public contract of the endpoint.

Do not blindly return a database object containing fields the client should not see.

Use explicit success/error status codes so clients can reliably react.`,
    "CRUD routes and error handling": `CRUD:
Create → POST
Read → GET
Update → PATCH/PUT
Delete → DELETE

Lookup missing resource → 404.
Invalid input → validation error.
Unexpected failure → 500 and a useful server log.

Do not turn every error into 500.`,
    "Routers, dependencies and project structure": `Separate responsibilities:
routes = HTTP
schemas = contracts
services = business rules
repositories = persistence
models = database mapping

Dependencies provide reusable objects such as database sessions and current users.`,
    "Configuration and environment variables": `Secrets and environment-specific values belong outside source code.

Examples:
DATABASE_URL
JWT_SECRET
REDIS_URL

The same application code can then run with different configuration in development and production.`,
    "Middleware and CORS": `Middleware wraps many requests.

request → middleware before → endpoint → middleware after → response

Good middleware concerns:
request IDs, timing, logging, CORS.

Do not put route-specific business rules into global middleware.`,
    "async/await in APIs": `Async helps when code spends time waiting for I/O.

Network/database wait → async can help.
Heavy CPU calculation → async alone does not make it faster.

Use async consistently with async-compatible libraries and do not mix blocking work carelessly into the event loop.`,
    "Request → validation → service → response flow": `Clean backend flow:
HTTP request
→ router
→ schema validation
→ service/business rule
→ repository/database
→ response schema
→ HTTP response

Each layer should have a clear responsibility.`,
    "Test the API manually with /docs": `Use /docs to explore the API:
1. Start the server.
2. Open /docs.
3. Try valid input.
4. Try invalid input.
5. Try a missing resource.
6. Inspect status, headers and JSON.

Manual testing is useful for exploration; automated tests provide repeatability.`,
    "Build and review Task API v1": `Milestone checklist:
create task
list tasks
read one
update one
delete one
validate bad input
return 404 for missing data
keep project structure understandable

This is a usable milestone, not the end of the backend.`,
    "Relational database mental model": `Tables hold related entities.
Rows are records.
Columns are attributes.
Foreign keys connect records.

Example:
users.id ← tasks.user_id

The database should help prevent invalid states, not merely store whatever Python sends.`,
    "SELECT": `SELECT chooses columns.

SELECT id, title
FROM tasks;

Prefer selecting the fields the API actually needs rather than blindly selecting everything.`,
    "WHERE": `WHERE filters rows inside the database.

SELECT id, title
FROM tasks
WHERE user_id = 7
  AND completed = false;

Database filtering is normally better than loading every row into Python first.`,
    "INSERT/UPDATE/DELETE": `INSERT creates.
UPDATE changes.
DELETE removes.

Always ask which rows are affected. A missing WHERE clause on UPDATE or DELETE can change the entire table.`,
    "ORDER BY": `SQL does not promise a useful order without ORDER BY.

ORDER BY created_at DESC, id DESC

The second field provides a stable tie-breaker, which matters for predictable pagination.`,
    "GROUP BY/HAVING": `GROUP BY creates groups for aggregation.

WHERE filters individual rows before grouping.
HAVING filters groups after aggregation.

Example question:
Which users have more than 10 tasks?`,
    "INNER JOIN": `INNER JOIN returns matching rows from both sides.

users JOIN tasks
ON tasks.user_id = users.id

Use it when records without a match should be excluded.`,
    "LEFT JOIN": `LEFT JOIN keeps every row from the left table.

Useful question:
Show every user and their tasks, including users who have zero tasks.

That is different from INNER JOIN.`,
    "Subqueries": `A subquery produces data used by another query.

Use it when the inner calculation has a clear purpose. Prefer the simplest query that communicates the relationship correctly.`,
    "CTEs": `WITH creates a named intermediate result.

WITH active_tasks AS (...)
SELECT ...
FROM active_tasks;

CTEs can make multi-step SQL much easier to read and debug.`,
    "CASE and window functions": `CASE creates conditional values.

Window functions calculate across related rows without collapsing them.

ROW_NUMBER() OVER (
  PARTITION BY user_id
  ORDER BY created_at DESC
)

This can find the newest task per user.`,
    "Primary keys, foreign keys and constraints": `Primary key = unique row identity.
Foreign key = relationship.
NOT NULL = required value.
UNIQUE = no duplicates.
CHECK = allowed values.

Constraints move important correctness rules into the database.`,
    "One-to-one, one-to-many and many-to-many": `One-to-one: user → profile.
One-to-many: user → many tasks.
Many-to-many: users ↔ projects.

Many-to-many normally uses a junction table such as project_members(user_id, project_id).`,
    "Normalization and avoiding duplicated data": `Store each fact in the right place.

If a user's name is copied into thousands of task rows, changing it becomes error-prone.

Normalize first. Denormalize later only when there is a measured reason.`,
    "Indexes and why they speed reads": `An index is a lookup structure.

Good candidate:
WHERE user_id = ?
ORDER BY created_at

Trade-off:
more storage and slower writes.

Use query plans and measurements rather than indexing everything.`,
    "Transactions and ACID": `A transaction groups related writes.

BEGIN → operation A → operation B → COMMIT

Failure → ROLLBACK

ACID means atomicity, consistency, isolation and durability.`,
    "Isolation and concurrent database work": `Two requests can touch the same data concurrently.

Isolation controls what one transaction can observe from another.

Think about dirty reads, non-repeatable reads, lost updates and locking when correctness depends on concurrent writes.`,
    "Design the Task API database": `Initial schema:
users
tasks
notes

tasks.user_id → users.id
notes.task_id → tasks.id

Add constraints and indexes based on real API queries.`,
    "Why an ORM exists and what SQL it hides": `An ORM maps database records to application objects.

It reduces repetitive mapping code, but it does not remove SQL concepts. You still need SELECT, JOIN, transactions, constraints and indexes.`,
    "Engine and database connection": `The engine manages database connectivity.

engine → connection → SQL → PostgreSQL

Create the engine as application infrastructure, not once per request. Keep the database URL in configuration.`,
    "Sessions and transaction boundaries": `A Session coordinates ORM work.

request → session → query/change → commit or rollback → close

Keep transaction boundaries explicit and short enough to avoid unnecessary locks.`,
    "SQLAlchemy models and mapped columns": `A model maps Python attributes to database columns.

The model describes persistence, not the entire API contract. Keep response schemas separate when clients should see a different shape.`,
    "CRUD with select/add/commit/refresh": `Create:
session.add(obj)
session.commit()
session.refresh(obj)

Read:
session.execute(select(Task).where(...))

Update:
change object → commit

Delete:
session.delete(obj) → commit`,
    "Relationships and loading related data": `Relationships represent foreign-key connections in Python.

Be deliberate about loading. Accidental lazy loading can create an N+1 query problem when an API loops through many records.`,
    "Queries, transactions and service/repository separation": `Router handles HTTP.
Service handles business rules.
Repository handles persistence.

This separation keeps database details from spreading across every endpoint and makes business logic easier to test.`,
    "Alembic migrations and schema versioning": `A migration records a schema change over time.

v1 → tasks
v2 → completed
v3 → owner_id

Changing a Python model does not safely migrate an existing production database by itself. Migrations make schema evolution explicit and reviewable.`,
    "Authentication vs authorization": `Authentication asks: who are you?
Authorization asks: are you allowed?

A valid login does not automatically grant permission to every resource.`,
    "Never store plain passwords: hashing": `Registration:
password → slow password hash → database

Login:
password + stored hash → verify → success/failure

Never store raw passwords. Password hashing and encryption solve different problems.`,
    "JWT structure and signed access tokens": `JWT commonly looks like:
header.payload.signature

The signature detects tampering.
Claims can contain identity and expiry.

A valid signature still does not prove the requested action is authorized.`,
    "Login → token → Authorization: Bearer flow": `Login → verify password → issue token.

Later:
Authorization: Bearer <token>
→ verify token
→ identify user
→ apply authorization rules
→ perform operation

The token proves identity information; the endpoint still decides permission.`,
    "Protected routes with dependencies": `A dependency can read the Authorization header, validate the token and load the current user.

Then protected routes receive the already-validated user instead of repeating authentication code.`,
    "Current user and user-owned resources": `Never trust a client-supplied user_id for ownership.

Correct:
current authenticated user = 7
→ query task 42 WHERE id=42 AND user_id=7

This prevents one user from modifying another user's resources.`,
    "Roles, permissions and authorization checks": `Role-based access control maps roles to permissions.

Example:
admin → manage users
member → manage own tasks

Authorization must be enforced on the server even if the UI hides a button.`,
    "Pagination for large result sets": `Returning 100,000 rows is expensive.

limit + offset returns a small page.
For very large changing datasets, cursor/keyset pagination can be more stable and efficient than large offsets.`,
    "Filtering and search": `Filters narrow a collection:
tasks?completed=false

Search might use:
tasks?q=fastapi

Validate values, use parameterized queries and index important search/filter patterns.`,
    "Sorting and stable API responses": `Allow only known sortable fields.

Use stable ordering:
created_at DESC, id DESC

Never concatenate an arbitrary client string into raw SQL.`,
    "API versioning and consistent error contracts": `Version boundaries protect clients:
 /v1/tasks

Use predictable errors:
{"error":"TASK_NOT_FOUND","message":"Task 42 was not found"}

Clients should not have to parse random server messages.`,
    "Idempotency, logging and production API rules": `GET is naturally idempotent.
PUT is designed to be idempotent.
POST often is not unless an idempotency key is used.

Logs should contain useful request context without leaking passwords, tokens or secrets.`,
    "pytest setup": `Create a tests/ directory and run pytest.

A test should answer one behavior question and fail clearly when the behavior breaks.`,
    "Assertions/fixtures": `Assertions express expected behavior.
Fixtures prepare reusable state such as a test client, database session or authenticated user.

Use fixtures to remove duplication without hiding important test setup.`,
    "Unit tests for business logic": `Unit tests isolate one business rule.

Arrange → call service → assert result/error.

They should be fast and should not require the entire HTTP stack for every rule.`,
    "API tests with TestClient/httpx": `API tests call the real application boundary.

POST /tasks
→ inspect status
→ inspect JSON
→ verify the contract

They catch routing, validation and serialization problems.`,
    "Database/integration tests": `Integration tests exercise:
API → service → SQLAlchemy → test database

Keep test data isolated and clean so one test does not silently depend on another.`,
    "Authentication, authorization, edge cases and coverage": `Test failures deliberately:
no token → 401
wrong owner → forbidden/not found according to your contract
missing task → 404
bad body → validation error
duplicate unique value → conflict/error

Coverage is a signal, not proof of correctness.`,
    "Redis keys, values and fast temporary state": `Redis stores values under keys.

Examples:
task:42
user:7:rate
session:abc

Good key naming makes ownership, debugging and invalidation easier.`,
    "TTL and automatic expiration": `A TTL removes temporary data automatically.

SETEX task:42 60 value

After 60 seconds the key expires.

Useful for cache entries, codes and rate-limit windows.`,
    "Cache-aside: read cache → fallback to DB": `Read Redis first.
If hit → return.
If miss → read PostgreSQL → store result in Redis → return.

PostgreSQL remains the source of truth.`,
    "Connect Redis to FastAPI safely": `Create Redis as application infrastructure and read REDIS_URL from configuration.

Decide the failure policy. A cache outage should not automatically turn every read request into a 500 if the database can still serve it.`,
    "Cache invalidation and basic rate limiting": `After changing task 42:
database update → invalidate task:42 cache.

For rate limiting, use an expiring Redis counter.

Caching is easy to add and hard to invalidate correctly, so design the invalidation path at the same time as the cache.`,
    "Why queues and workers exist": `HTTP request:
validate → enqueue → return quickly.

Worker:
receive job → perform slow work → retry/fail → record outcome.

Use queues for email, notifications, reports and other work that should not block the user request.`,
    "Celery app, task and worker": `Celery app = configuration.
Task = unit of background work.
Worker = process that executes tasks.

FastAPI sends a task message. A separate worker executes it.`,
    "Redis as broker and result backend": `Broker transports task messages.

A result backend can store task state/results when the application needs them.

Do not confuse the queue with PostgreSQL's durable business data.`,
    "Retries and failure handling": `Temporary failure → wait/backoff → retry.

Permanent failure → stop retrying and record the failure.

Use limits and backoff. Unlimited immediate retries can create a retry storm.`,
    "Scheduled jobs and Celery Beat": `Beat decides when a scheduled task should be sent.
Worker executes it.

Example:
every night → cleanup expired data.

Make scheduled jobs safe to run repeatedly where possible.`,
    "Linux CLI, files and processes": `pwd = current directory
ls = files
cd = change directory
cat = read
grep = search
ps = processes
kill = stop

Backend deployment requires comfort with the terminal.`,
    "Permissions and SSH basics": `Linux permissions control owner/group/other access.

SSH gives remote terminal access.

Understand ownership and permission bits before reaching for sudo.`,
    "Image vs container": `Image = packaged application/runtime artifact.
Container = running instance of an image.

One image can create multiple containers with different runtime configuration.`,
    "Dockerfile and reproducible builds": `A Dockerfile describes image construction:
base image → dependencies → source → runtime command.

Keep builds reproducible and avoid unnecessary files/dependencies in the final image.`,
    "Volumes, networks and ports": `Volume = persistent data.
Network = container communication.
Port = exposed service entry point.

Example:
host:8000 → api:8000.`,
    "Environment variables and service configuration": `Keep DATABASE_URL, REDIS_URL and JWT_SECRET outside source code.

One image should work across environments by changing configuration, not application code.`,
    "Docker Compose for API + PostgreSQL + Redis": `Compose can run:
api
postgres
redis
worker

Inside the Compose network, the API connects to the database using the service name postgres, not localhost.`,
    "Run and debug the complete stack": `Debug from the failing boundary:
1. docker compose ps
2. inspect logs
3. check health
4. check environment
5. check network/ports
6. test API
7. test dependencies

Do not randomly restart everything before finding the failure.`,
    "What CI/CD actually solves": `push → install → checks → tests → build → deploy → health check

The value is repeatability and fast feedback, not magic automation.`,
    "GitHub Actions and automated tests": `A workflow runs on GitHub's runner.

checkout → setup runtime → install → test

A trusted deployment path should not release code when required tests fail.`,
    "Secrets and environment configuration": `Never commit passwords, API keys, JWT secrets or production database URLs.

Store secrets in the CI/deployment platform and expose them as environment variables at runtime.`,
    "Build the application image": `Build an image with an immutable identifier such as the commit SHA.

docker build -t task-api:$GIT_SHA .

Test the exact artifact you intend to deploy.`,
    "Deploy, health checks and logs": `Deployment:
new version → start → health check → receive traffic → observe

Logs explain what happened. Health checks tell you whether the service is alive/ready. Both are part of production engineering.`,
    "HTTPS, rollback and final production checklist": `Production checklist:
HTTPS
secure secrets
database backups
health checks
logs
monitoring
resource limits
migration plan
rollback plan

A deployment is not finished just because the process starts.`
  };

  const detail = focusDetail[focus] || (
    "# CORE CONCEPT\n" + target +
    "\n\n# HOW TO THINK\n1. Identify the input.\n2. Identify the output.\n3. Understand the normal flow.\n4. Identify failure cases.\n5. Implement the smallest example.\n6. Connect it to the TaskFlow backend."
  );

  const walkthrough =
    "# READ THE CODE TOP → BOTTOM\n" +
    "1. Identify imports and configuration.\n" +
    "2. Find the input entering the program.\n" +
    "3. Find validation/checks.\n" +
    "4. Follow the main operation.\n" +
    "5. Find the output.\n" +
    "6. Ask what happens when input or a dependency fails.\n\n" +
    "# CHANGE IT\nChange one value, run it, observe the result, and explain why the result changed.";

  const realExample =
    "Real backend flow: a client sends a request, the API validates it, business logic decides what should happen, persistence/cache performs the required data operation, and the API returns a predictable response. This lesson is one part of that same TaskFlow system.";

  const project =
    "Cumulative TaskFlow integration:\n" +
    d.project +
    "\n\nDo not build a disconnected demo. Add today's concept to the same backend so the project becomes progressively more complete.";

  const practice =
    "# PRACTICE\n" +
    "1. Explain \"" + focus + "\" without notes.\n" +
    "2. Write the smallest version yourself.\n" +
    "3. Run it.\n" +
    "4. Intentionally create one failure and debug it.\n" +
    "5. Add the concept to TaskFlow.\n" +
    "6. Write one sentence explaining what changed.";

  const mistakes =
    "# COMMON MISTAKES\n" +
    "• Memorising syntax before understanding the problem.\n" +
    "• Copying code without modifying or testing it.\n" +
    "• Ignoring invalid input and failure paths.\n" +
    "• Mixing HTTP, business logic and database responsibilities unnecessarily.\n" +
    "• Using production tools without understanding their trade-offs.\n" +
    "• Calling a demo complete when you cannot explain why it works.";

  const interview =
    "# INTERVIEW CHECK\n" +
    "Be able to answer:\n" +
    "1. What problem does this solve?\n" +
    "2. How does it work at a high level?\n" +
    "3. Where is it used in a real backend?\n" +
    "4. What can fail?\n" +
    "5. What trade-off does it introduce?\n" +
    "6. Can you write a small version without notes?";

  const summary =
    "Complete this lesson only when you can explain " + focus +
    ", implement a small example, debug one failure, and connect it to TaskFlow without copying.";

  return {
    why: why[topic] || "This is a core backend building block. Understand the problem first, then the implementation.",
    explanation: detail,
    code: code[topic] || "# " + focus + "\n\n# Start with the smallest runnable example and connect it to TaskFlow.",
    walkthrough,
    realExample,
    project,
    practice,
    mistakes,
    interview,
    summary
  };
}

function topicProgressFor(id: string, done: Record<number,boolean>, allDays: Day[]) {
  return allDays.filter(d => d.topicId === id && done[d.day]).length;
}

function Metric({label,value,sub}:{label:string;value:string;sub:string}) {
  return <div className="panel rounded-2xl p-4"><div className="text-[10px] tracking-widest text-[#64748b]">{label}</div><div className="text-2xl font-black mt-2">{value}</div><div className="text-[10px] text-[#68778c] mt-1">{sub}</div></div>;
}

function InfoBox({title,items}:{title:string;items:string[]}) {
  return <div className="rounded-xl border border-white/5 bg-[#0a1017] p-4"><div className="text-[10px] tracking-widest text-[#718096]">{title}</div><div className="flex flex-wrap gap-2 mt-3">{items.map(x=><span key={x} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-[#9aa8ba]">{x}</span>)}</div></div>;
}
