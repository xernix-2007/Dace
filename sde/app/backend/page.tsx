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
        "Relational database mental model",
        "SELECT",
        "WHERE",
        "INSERT/UPDATE/DELETE",
        "ORDER BY",
        "GROUP BY/HAVING",
        "INNER JOIN",
        "LEFT JOIN",
        "Subqueries",
        "CTEs",
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
        "pytest setup",
        "Assertions/fixtures",
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

    const list = maps[d.topicId] || [d.target];
    const idx = days.filter(x => x.topicId === d.topicId).findIndex(x => x.day === d.day);
    const focus = list[idx] || d.target;

    return [
      `1. Understand: ${focus}`,
      `2. Trace: ${focus} through a real backend request`,
      `3. Implement: ${focus} in code`,
      `4. Integrate: ${focus} into TaskFlow`,
      `5. Debug + explain: ${focus}`,
    ];
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
  walkthrough: string;
  realExample: string;
  project: string;
  practice: string;
  mistakes: string;
  interview: string;
  summary: string;
};

function lessonContent(d: Day, lesson: string): LessonContent {
  const stageMatch = lesson.match(/^([1-5])\.\s*([^:]+):\s*(.*)$/);
  const stage = stageMatch ? Number(stageMatch[1]) : 1;
  const focus = stageMatch ? stageMatch[3].replace(/ through a real backend request$/,"").replace(/ in code$/,"").replace(/ into TaskFlow$/,"").replace(/$/,"") : lesson;
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

  const beginnerDefinition: Record<string,string> = {
    "Client vs server and the request/response pipeline": String.raw\`# WHAT IS A CLIENT?
A client is the program that asks another computer or service to do something.

Examples:
• Chrome or another browser
• A mobile app
• A React frontend
• Postman
• curl
• Another backend service

If you open your browser and request https://example.com, your browser is acting as the client.

# WHAT IS A SERVER?
A server is a program running on a computer that waits for requests and sends responses.

The computer can be your laptop during development or a cloud machine in production.

For our backend:
Uvicorn runs the FastAPI server.
FastAPI contains our API routes and backend logic.
PostgreSQL stores persistent data.

# CLIENT VS SERVER
Client = asks for something.
Server = receives the request, does the work, and responds.

They are roles in communication. The same computer can run both roles.

# WHAT IS A REQUEST?
A request is the message sent by the client.

Example:
GET /tasks/42

It can contain:
• method
• URL/path
• headers
• query parameters
• body

# WHAT IS A RESPONSE?
A response is the message sent back by the server.

It contains:
• status code
• headers
• response body

# COMPLETE FLOW
Browser
→ sends HTTP request
→ server receives request
→ router finds endpoint
→ validation checks input
→ business logic runs
→ database/cache may be used
→ server creates response
→ browser receives response

# REAL EXAMPLE
When you open a website:
1. Browser is the client.
2. It sends a request.
3. A server receives it.
4. Server may query a database.
5. Server sends HTML/JSON/data.
6. Browser displays the result.

Only after understanding this flow should you learn FastAPI routes.\`,
    "HTTP method + URL + headers + body": String.raw\`# WHAT IS HTTP?
HTTP is a protocol: a set of rules for communication between clients and web servers.

Think of HTTP as the format both sides agree to use.

# WHAT IS A METHOD?
A method tells the server what kind of operation the client wants.

GET → read
POST → create/send data
PUT → replace
PATCH → partially update
DELETE → remove

# WHAT IS A URL?
A URL tells the client where the resource/service is.

Example:
http://localhost:8000/tasks/42

localhost = this computer
8000 = server port
/tasks/42 = requested resource

# WHAT ARE HEADERS?
Headers are extra metadata about the request or response.

Examples:
Content-Type: application/json
Authorization: Bearer <token>

# WHAT IS A BODY?
The body carries data.

Example:
{"title":"Learn FastAPI"}

GET requests commonly do not need a body; POST/PATCH commonly carry one.

# PUTTING IT TOGETHER
POST /tasks
Content-Type: application/json

{"title":"Learn backend"}

Method = POST
Path = /tasks
Header = Content-Type
Body = JSON data\`,
    "Status codes: 2xx, 3xx, 4xx, 5xx": String.raw\`# WHAT IS A STATUS CODE?
A status code is a number in the HTTP response that tells the client what happened.

# MAIN GROUPS
2xx = request succeeded
3xx = redirection/another response location
4xx = problem with the request or client's access
5xx = server failed while handling the request

# IMPORTANT CODES
200 OK → successful request
201 Created → new resource created
204 No Content → successful operation with no response body
400 Bad Request → invalid request
401 Unauthorized → authentication is missing/invalid
403 Forbidden → caller is known but not allowed
404 Not Found → resource does not exist
409 Conflict → request conflicts with current state
422 Unprocessable Content → validation failed
429 Too Many Requests → rate limit reached
500 Internal Server Error → unexpected server failure

# WHY IT MATTERS
The frontend should not have to guess whether an operation worked.

Status code + response body form part of the API contract.\`,
    "JSON, path parameters and query parameters": String.raw\`# WHAT IS JSON?
JSON is a text format commonly used to exchange structured data.

Example:
{"title":"Learn FastAPI","completed":false}

It has objects, arrays, strings, numbers, booleans and null.

# WHAT IS A PATH PARAMETER?
A path parameter identifies a specific resource.

GET /tasks/42

42 is the task_id.

# WHAT IS A QUERY PARAMETER?
Query parameters modify how a collection is returned.

GET /tasks?completed=false&limit=20

completed=false and limit=20 are query parameters.

# SIMPLE RULE
Path → WHICH resource?
Query → HOW should I get/filter the resource?
Body → WHAT data am I sending?\`,
    "REST resources, CORS, cookies and sessions": String.raw\`# WHAT IS REST?
REST is a style for designing network APIs around resources.

For tasks:
GET /tasks
GET /tasks/42
POST /tasks
PATCH /tasks/42
DELETE /tasks/42

# WHAT IS CORS?
CORS is a browser security mechanism controlling whether JavaScript from one origin can access another origin.

Example:
Frontend: http://localhost:3000
Backend: http://localhost:8000

Different origins may require CORS configuration.

# WHAT IS A COOKIE?
A cookie is small data stored by the browser and associated with a website. Browsers can automatically send matching cookies with requests.

# WHAT IS A SESSION?
A session is a way to associate multiple requests with the same user/state.

Do not confuse:
cookie = storage/transport mechanism
session = application concept for maintaining state\`,
    "FastAPI app, route and Uvicorn": String.raw\`# WHAT IS FASTAPI?
FastAPI is a Python framework for building APIs.

It helps us define routes, validate input, serialize output and handle HTTP requests.

# WHAT IS A ROUTE?
A route connects an HTTP method + URL path to Python code.

@app.get("/tasks/42")
means:
"When a GET request arrives at /tasks/42, run this function."

# WHAT IS UVICORN?
Uvicorn is an ASGI server. It runs the Python web application and handles the network/server side of receiving requests.

Flow:
browser/curl
→ Uvicorn
→ FastAPI
→ route function
→ response

# CODE
from fastapi import FastAPI

app = FastAPI()

@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    return {"id": task_id}

Run:
uvicorn main:app --reload\`,
    "Path/query parameters and request bodies": String.raw\`# THREE INPUT LOCATIONS

PATH:
GET /tasks/42
→ task_id = 42

QUERY:
GET /tasks?limit=20
→ limit = 20

BODY:
POST /tasks
{"title":"Learn FastAPI"}
→ structured input

# WHY SEPARATE THEM?
They answer different questions.

Path = which resource?
Query = how should the collection be returned?
Body = what data should be created/changed?

FastAPI uses Python type hints to parse and validate these values.\`,
    "Pydantic validation and schemas": String.raw\`# WHAT IS VALIDATION?
Validation checks whether incoming data has the shape and values your application expects.

Clients cannot be trusted.

Example expected:
title = string
completed = boolean

Bad input:
{"title":123}

# WHAT IS PYDANTIC?
Pydantic is a Python library used by FastAPI for data validation and serialization.

# FLOW
JSON request
→ Pydantic schema
→ validation
→ typed Python object
→ business logic

# CODE
from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str

If the client sends invalid data, FastAPI can reject it before business logic runs.\`,
    "Tables, rows, columns and relationships": String.raw\`# WHAT IS A DATABASE?
A database is software that stores and retrieves data reliably.

# WHAT IS A TABLE?
A table stores records of one kind of entity.

tasks table

# WHAT IS A ROW?
One row = one task.

# WHAT IS A COLUMN?
A column describes one property.

id | title | completed

# WHAT IS A PRIMARY KEY?
A primary key uniquely identifies a row.

# WHAT IS A FOREIGN KEY?
A foreign key connects one table to another.

tasks.user_id → users.id

This is how relational databases represent relationships.\`,
    "SELECT": String.raw\`# WHAT IS SELECT?
SELECT reads data from a database.

Example:
SELECT id, title
FROM tasks;

The database finds rows in tasks and returns only the requested columns.

# WHY NOT SELECT *?
Because APIs often need only a few fields. Selecting what you need can reduce unnecessary data transfer and processing.\`,
    "WHERE": String.raw\`# WHAT IS WHERE?
WHERE filters rows.

SELECT id, title
FROM tasks
WHERE user_id = 7;

Only rows matching the condition are returned.

# IMPORTANT
Filtering in the database is usually better than loading every row into Python and filtering afterward.\`,
    "Indexes and why they speed reads": String.raw\`# WHAT IS AN INDEX?
An index is an additional data structure maintained by the database to find rows more efficiently for certain queries.

Think of a book:
Without an index → scan many pages.
With an index → jump closer to the answer.

# EXAMPLE
CREATE INDEX idx_tasks_user_id
ON tasks(user_id);

Then a query filtering by user_id may become faster.

# TRADE-OFF
Indexes consume storage and make some writes more expensive because the index must also be updated.

Never assume every column needs an index.\`,
    "Transactions and ACID": String.raw\`# WHAT IS A TRANSACTION?
A transaction groups database operations into one logical unit.

Example: transferring money.

1. Remove money from account A.
2. Add money to account B.
3. Commit both.

If step 2 fails, we do not want step 1 permanently saved.

# ACID
Atomicity → all or nothing
Consistency → valid database state
Isolation → concurrent transactions are controlled
Durability → committed data survives failures according to the database's guarantees\`,
    "Authentication vs authorization": String.raw\`# WHAT IS AUTHENTICATION?
Authentication answers:
"Who are you?"

Example:
You enter email + password.
The server verifies them.
It identifies you as user 42.

# WHAT IS AUTHORIZATION?
Authorization answers:
"What are you allowed to do?"

User 42 may be allowed to edit their own task but not another user's task.

# EASY MEMORY TRICK
Authentication = identity
Authorization = permission

Login is authentication.
Checking ownership is authorization.\`,
    "Never store plain passwords: hashing": String.raw\`# WHY NOT STORE PASSWORDS?
If the database leaks and raw passwords are stored, every password is immediately exposed.

# WHAT IS HASHING?
A password hash is a one-way representation designed for password verification.

Registration:
password
→ password hashing algorithm
→ stored hash

Login:
entered password + stored hash
→ verification
→ match / reject

Use a password-hashing library designed for passwords. Do not invent your own hashing algorithm.\`,
    "JWT structure and signed access tokens": String.raw\`# WHAT IS A JWT?
JWT means JSON Web Token.

It is a signed token commonly used to carry claims between a client and server.

Typical shape:
header.payload.signature

# IMPORTANT
The payload is not a secret by default. Do not put passwords or sensitive secrets inside it.

The signature helps detect tampering.

# ACCESS FLOW
login
→ verify credentials
→ issue access token
→ client sends token later
→ server verifies token
→ server identifies user
→ authorization check\`,
    "Pagination for large result sets": String.raw\`# WHAT IS PAGINATION?
Pagination means returning a manageable portion of a large collection instead of everything at once.

Example:
GET /tasks?limit=20&offset=40

limit = how many
offset = how far into the collection

# WHY?
If a user has 100,000 tasks, returning all of them wastes memory, bandwidth and time.

For very large changing datasets, cursor/keyset pagination can provide more stable performance.\`,
    "pytest setup": String.raw\`# WHAT IS A TEST?
A test is executable code that checks whether expected behavior still works.

Example:
"If I create a task with a valid title, the API should return 201."

# PYTEST
pytest is a Python testing framework.

Basic test:
def test_addition():
    assert 2 + 2 == 4

A backend test should focus on behavior, not merely whether lines were executed.\`,
    "Redis keys, values and fast temporary state": String.raw\`# WHAT IS REDIS?
Redis is an in-memory data store designed for very fast operations.

It stores values under keys.

Example:
task:42 → {"id":42,"title":"Learn Redis"}

# WHY USE IT?
Common uses:
• caching
• counters
• rate limiting
• temporary state
• queues/brokers in some architectures

PostgreSQL can remain the durable source of truth while Redis handles fast temporary data.\`,
    "Why queues and workers exist": String.raw\`# WHAT IS A QUEUE?
A queue holds work that should be processed asynchronously.

Imagine an email request.

Without a queue:
HTTP request → generate email → send email → wait → response

With a queue:
HTTP request → put job in queue → respond
worker → takes job → sends email

# WHAT IS A WORKER?
A worker is a separate process that consumes jobs and performs the work.

This prevents slow background operations from unnecessarily blocking the user request.\`,
    "Image vs container": String.raw\`# WHAT IS A CONTAINER IMAGE?
An image is a packaged filesystem and configuration used to create containers.

# WHAT IS A CONTAINER?
A container is a running instance of an image.

Think:
image = recipe/package
container = running instance

One image can create multiple containers.

# WHY?
It helps make the runtime environment reproducible across machines.\`,
    "What CI/CD actually solves": String.raw\`# WHAT IS CI?
Continuous Integration means automatically checking changes as code is pushed or proposed.

Typical:
push
→ install dependencies
→ run tests
→ report result

# WHAT IS CD?
Continuous Delivery/Deployment extends the pipeline toward releasing the application.

Typical:
test
→ build artifact
→ deploy
→ health check

# WHY?
The goal is repeatability. Humans should not have to remember 20 manual deployment commands every time.\`
  };

  const focusDetail: Record<string,string> = {
    "Client vs server and the request/response pipeline": beginnerDefinition["Client vs server and the request/response pipeline"],
    "HTTP method + URL + headers + body": beginnerDefinition["HTTP method + URL + headers + body"],
    "Status codes: 2xx, 3xx, 4xx, 5xx": beginnerDefinition["Status codes: 2xx, 3xx, 4xx, 5xx"],
    "JSON, path parameters and query parameters": beginnerDefinition["JSON, path parameters and query parameters"],
    "REST resources, CORS, cookies and sessions": beginnerDefinition["REST resources, CORS, cookies and sessions"],
    "FastAPI app, route and Uvicorn": beginnerDefinition["FastAPI app, route and Uvicorn"],
    "Path/query parameters and request bodies": beginnerDefinition["Path/query parameters and request bodies"],
    "Pydantic validation and schemas": beginnerDefinition["Pydantic validation and schemas"],
    "Tables, rows, columns and relationships": beginnerDefinition["Tables, rows, columns and relationships"],
    "SELECT": beginnerDefinition["SELECT"],
    "WHERE": beginnerDefinition["WHERE"],
    "Indexes and why they speed reads": beginnerDefinition["Indexes and why they speed reads"],
    "Transactions and ACID": beginnerDefinition["Transactions and ACID"],
    "Authentication vs authorization": beginnerDefinition["Authentication vs authorization"],
    "Never store plain passwords: hashing": beginnerDefinition["Never store plain passwords: hashing"],
    "JWT structure and signed access tokens": beginnerDefinition["JWT structure and signed access tokens"],
    "Pagination for large result sets": beginnerDefinition["Pagination for large result sets"],
    "pytest setup": beginnerDefinition["pytest setup"],
    "Redis keys, values and fast temporary state": beginnerDefinition["Redis keys, values and fast temporary state"],
    "Why queues and workers exist": beginnerDefinition["Why queues and workers exist"],
    "Image vs container": beginnerDefinition["Image vs container"],
    "What CI/CD actually solves": beginnerDefinition["What CI/CD actually solves"],
  };

  const deepConcepts: Record<string, { what: string; why: string; flow: string; example: string; code: string }> = {
    "Design the first version of the Task/Notes API": { what: "API design decides resources, URLs, methods, inputs, outputs and errors before implementation.", why: "A clear contract prevents clients and backend code from inventing different shapes.", flow: "resource → endpoint → request schema → response schema → error contract → ownership", example: "POST /tasks creates; GET /tasks lists; GET /tasks/42 reads one; PATCH /tasks/42 changes it; DELETE /tasks/42 removes it.", code: "POST /tasks\nContent-Type: application/json\n\n{\"title\":\"Learn backend\"}\n\n201 Created\n{\"id\":42,\"title\":\"Learn backend\",\"completed\":false}" },
    "Repository, working tree and staging area": { what: "Git has a working tree, staging area and repository history.", why: "Knowing the three states lets you control exactly what enters a commit.", flow: "edit → working tree → git add → staging area → git commit → repository", example: "Stage only the file containing the logical change you want to commit.", code: "git status\ngit diff\ngit add app/backend.py\ngit diff --staged\ngit commit -m \"Add task endpoint\"" },
    "Small commits and useful commit messages": { what: "A commit is a named snapshot of a logical change.", why: "Small commits are easier to review, revert and debug.", flow: "one logical change → test → commit → next change", example: "Separate 'Add task model' from 'Add task pagination'.", code: "git add app/models.py\ngit commit -m \"Add task model\"" },
    "Branches, merge and conflict resolution": { what: "A branch is a separate line of commits; a merge combines histories.", why: "Branches let developers work independently.", flow: "main → feature branch → commits → merge", example: "A conflict means Git cannot safely choose between two edits.", code: "git switch -c feature/tasks\ngit commit -am \"Build tasks\"\ngit switch main\ngit merge feature/tasks" },
    "Pull request workflow and code review": { what: "A pull request is a proposed change that others inspect before merging.", why: "Review catches bugs, unclear APIs, missing tests and unnecessary complexity.", flow: "branch → push → PR → review → tests → merge", example: "A reviewer checks that task updates verify ownership.", code: "git push -u origin feature/tasks\n# open PR\n# fix review comments\n# run tests" },
    "Rebase basics and clean project history": { what: "Rebase replays your commits on a new base.", why: "It can keep a feature branch current and make history easier to follow.", flow: "fetch → rebase → resolve conflicts → test", example: "Rebase your feature branch onto current main before merging when appropriate.", code: "git fetch origin\ngit rebase origin/main\ngit add .\ngit rebase --continue" },
    "README, issues and engineering hygiene": { what: "Project hygiene is the documentation and practices that make a repository understandable.", why: "Someone else should be able to clone, configure, run and test the project.", flow: "clone → README → install → configure → run → test", example: "Document database setup, migrations, environment variables and test commands.", code: "python -m venv .venv\npip install -r requirements.txt\nuvicorn app.main:app --reload\npytest" },
    "Response models and HTTP status codes": { what: "A response model defines what the API promises to return.", why: "Database objects may contain fields that should not become public API fields.", flow: "database object → response schema → serialization → HTTP response", example: "A User response should not expose password_hash.", code: "class TaskResponse(BaseModel):\n    id: int\n    title: str\n    completed: bool" },
    "CRUD routes and error handling": { what: "CRUD means Create, Read, Update and Delete exposed through API operations.", why: "Real APIs must distinguish invalid input, missing resources and unexpected failures.", flow: "request → validate → find/change → success or correct error", example: "GET /tasks/99 should return 404 when task 99 does not exist.", code: "task = find_task(task_id)\nif task is None:\n    raise HTTPException(404, \"Task not found\")" },
    "Routers, dependencies and project structure": { what: "Routers group endpoints and dependencies provide reusable request-time components.", why: "Large applications become hard to maintain when everything lives in one file.", flow: "router → dependency → service → repository → database", example: "get_db and get_current_user can be reused by many routes.", code: "app/\n  main.py\n  routers/tasks.py\n  schemas/tasks.py\n  services/tasks.py\n  models/task.py\n  dependencies.py" },
    "Configuration and environment variables": { what: "Configuration is information that changes between environments.", why: "Code should not contain production passwords or machine-specific settings.", flow: "environment → settings → application components", example: "Local PostgreSQL and production PostgreSQL can use different URLs without changing code.", code: "DATABASE_URL=...\nREDIS_URL=...\nJWT_SECRET=..." },
    "Middleware and CORS": { what: "Middleware wraps many HTTP requests; CORS controls browser cross-origin access.", why: "Middleware handles cross-cutting concerns such as timing, request IDs and logging.", flow: "request → middleware → route → middleware → response", example: "Frontend on :3000 calling API on :8000 may require an allowed origin.", code: "app.add_middleware(CORSMiddleware, allow_origins=[\"http://localhost:3000\"], allow_methods=[\"*\"], allow_headers=[\"*\"])" },
    "Async vs sync endpoint work": { what: "Synchronous code waits; async code can yield while compatible I/O is waiting.", why: "Backend servers spend significant time waiting for I/O.", flow: "request → await I/O → event loop handles other work → result", example: "Async database clients can allow other requests to progress while a query waits.", code: "async def get_task(task_id: int):\n    return await repository.get(task_id)" },
    "Request → validation → service → response flow": { what: "Layered backend flow separates HTTP handling, business rules and persistence.", why: "Clear boundaries make code easier to test and change.", flow: "HTTP → router → schema → service → repository → database → response", example: "The route should not contain every SQL statement and business rule.", code: "task = task_service.create(current_user, payload)\nreturn TaskResponse.model_validate(task)" },
    "Test the API manually with /docs": { what: "FastAPI /docs provides an interactive API explorer.", why: "Manual exploration is useful while learning and debugging the API contract.", flow: "start server → /docs → choose endpoint → enter input → inspect response", example: "Try valid and invalid POST requests and compare status codes.", code: "uvicorn app.main:app --reload\n# open http://localhost:8000/docs" },
    "Build and review Task API v1": { what: "A milestone is a complete small version of the project, not unrelated demos.", why: "End-to-end building forces concepts to work together.", flow: "schema → route → service → database → tests → docs", example: "v1 should create, list, read, update and delete tasks with validation and errors.", code: "POST /tasks\nGET /tasks\nGET /tasks/{id}\nPATCH /tasks/{id}\nDELETE /tasks/{id}" },
    "Relational database mental model": { what: "A relational database stores structured data in tables and connects tables with keys.", why: "Relationships and constraints keep business data consistent.", flow: "entity → table → row → key → relationship → query", example: "A task can reference its owner through user_id.", code: "users(id, email)\ntasks(id, user_id, title)\ntasks.user_id → users.id" },
    "INSERT/UPDATE/DELETE": { what: "INSERT adds rows, UPDATE changes rows and DELETE removes rows.", why: "They are the core database write operations behind CRUD.", flow: "validate → execute write → check affected rows → commit", example: "A missing WHERE on UPDATE or DELETE can affect many rows.", code: "INSERT INTO tasks(title) VALUES ('Learn SQL');\nUPDATE tasks SET completed=TRUE WHERE id=7;\nDELETE FROM tasks WHERE id=7;" },
    "ORDER BY": { what: "ORDER BY explicitly controls result ordering.", why: "Without it, result order should not be treated as stable.", flow: "filter → sort → return page", example: "A task feed can show newest tasks first with a deterministic tie-breaker.", code: "SELECT id,title,created_at FROM tasks ORDER BY created_at DESC,id DESC;" },
    "GROUP BY/HAVING": { what: "GROUP BY creates groups for aggregation; HAVING filters groups.", why: "It answers questions such as counts per user.", flow: "FROM → WHERE → GROUP BY → aggregate → HAVING", example: "Find users who own more than ten tasks.", code: "SELECT user_id,COUNT(*) FROM tasks GROUP BY user_id HAVING COUNT(*) > 10;" },
    "INNER JOIN": { what: "INNER JOIN combines rows when the join condition matches on both sides.", why: "Related data is often stored in separate normalized tables.", flow: "left table → matching key → right table → matching rows", example: "Get tasks with their owner's email.", code: "SELECT tasks.id,users.email,tasks.title FROM tasks JOIN users ON users.id=tasks.user_id;" },
    "LEFT JOIN": { what: "LEFT JOIN keeps every row from the left table and adds matching right data when available.", why: "It is useful when missing relationships must still appear.", flow: "all left rows → attempt match → matched data or NULL", example: "Show every user, including users with zero tasks.", code: "SELECT users.id,tasks.id FROM users LEFT JOIN tasks ON tasks.user_id=users.id;" },
    "Subqueries": { what: "A subquery is a query nested inside another query.", why: "It expresses a smaller calculation consumed by an outer query.", flow: "inner query → value/set → outer query", example: "Find tasks owned by active users.", code: "SELECT * FROM tasks WHERE user_id IN (SELECT id FROM users WHERE active=TRUE);" },
    "CTEs": { what: "A Common Table Expression names an intermediate result using WITH.", why: "Complex SQL becomes easier to read when steps have names.", flow: "WITH intermediate result → main query", example: "First identify active users, then fetch their tasks.", code: "WITH active_users AS (SELECT id FROM users WHERE active=TRUE) SELECT * FROM tasks WHERE user_id IN (SELECT id FROM active_users);" },
    "CASE and window functions": { what: "CASE creates conditional values; window functions calculate across related rows without collapsing rows.", why: "They solve reporting, ranking and per-group calculations.", flow: "rows → partition/order → calculation → original rows remain", example: "Number each user's tasks from newest to oldest.", code: "ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC)" },
    "Primary keys, foreign keys and constraints": { what: "Constraints are database rules that prevent invalid data.", why: "The database should enforce important invariants even when application code has bugs.", flow: "write → constraint check → accept or reject", example: "A task should not reference a nonexistent user.", code: "id BIGSERIAL PRIMARY KEY,\nuser_id BIGINT REFERENCES users(id),\ntitle TEXT NOT NULL" },
    "One-to-one, one-to-many and many-to-many": { what: "Relationship cardinality describes how many records can relate.", why: "It determines schema structure and query design.", flow: "one-to-one → one-to-one; one-to-many → parent/many children; many-to-many → junction table", example: "User→tasks is one-to-many; user↔project is often many-to-many.", code: "project_members(user_id, project_id, PRIMARY KEY(user_id,project_id))" },
    "Normalization and avoiding duplicated data": { what: "Normalization stores each fact in an appropriate place rather than copying it unnecessarily.", why: "Duplicated facts cause update and consistency problems.", flow: "fact → owning table → foreign-key reference", example: "Store a user's email once in users, not inside every task.", code: "users(id,email)\ntasks(id,user_id,title)" },
    "Isolation and concurrent database work": { what: "Isolation controls what concurrent transactions can observe.", why: "Multiple API requests can modify the same data at once.", flow: "transaction A + transaction B → isolation/locks → consistent result", example: "Two requests trying to claim the same resource need concurrency control.", code: "BEGIN;\nSELECT id FROM tasks WHERE id=42 FOR UPDATE;\nUPDATE tasks SET completed=TRUE WHERE id=42;\nCOMMIT;" },
    "Design the Task API database": { what: "Database design maps API entities into tables, keys, constraints and indexes.", why: "A weak schema creates expensive problems later.", flow: "requirements → entities → relationships → constraints → indexes → migrations", example: "Users own tasks; tasks can have notes; task queries commonly filter by user_id.", code: "users(id,email)\ntasks(id,user_id,title,completed,created_at)\nnotes(id,task_id,body)" },
    "Why an ORM exists and what SQL it hides": { what: "An ORM maps database records and relationships to application objects and query APIs.", why: "It reduces repetitive mapping while preserving a Python programming model.", flow: "Python query → ORM → SQL → PostgreSQL → rows → objects", example: "SQLAlchemy can generate SQL for a Task query.", code: "stmt = select(Task).where(Task.user_id == user_id)\ntasks = session.scalars(stmt).all()" },
    "Engine and database connection": { what: "A SQLAlchemy engine manages database connectivity and pooling.", why: "The application should reuse managed connections instead of creating random connections per request.", flow: "application → engine/pool → connection → PostgreSQL", example: "Create the engine during application setup.", code: "engine = create_engine(DATABASE_URL,pool_pre_ping=True)" },
    "Sessions and transaction boundaries": { what: "A Session coordinates ORM work and transactions.", why: "Clear transaction boundaries make commits and rollbacks predictable.", flow: "request → session → work → commit/rollback → close", example: "A request can receive one database session dependency.", code: "with Session(engine) as session:\n    session.add(task)\n    session.commit()" },
    "SQLAlchemy models and mapped columns": { what: "A model maps Python attributes to database columns.", why: "The ORM needs an explicit mapping between application objects and relational tables.", flow: "class → mapped columns → metadata → SQL", example: "Task.title maps to tasks.title.", code: "class Task(Base):\n    __tablename__='tasks'\n    id: Mapped[int] = mapped_column(primary_key=True)\n    title: Mapped[str] = mapped_column(String(200))" },
    "CRUD with select/add/commit/refresh": { what: "SQLAlchemy APIs implement database CRUD through a Session.", why: "These operations form the persistence layer of CRUD endpoints.", flow: "build query/object → session → SQL → commit → refreshed state", example: "refresh can load generated database values after commit.", code: "session.add(task)\nsession.commit()\nsession.refresh(task)\nresult=session.execute(select(Task))" },
    "Relationships and loading related data": { what: "SQLAlchemy relationships represent foreign-key connections between models.", why: "They make related data easier to work with, but loading strategy still matters.", flow: "foreign key → relationship → loading strategy → query", example: "User.tasks can represent tasks owned by that user.", code: "tasks: Mapped[list['Task']] = relationship(back_populates='user')" },
    "Queries, transactions and service/repository separation": { what: "This separation keeps HTTP, business rules and persistence concerns distinct.", why: "It prevents endpoints from becoming giant functions.", flow: "router → service → repository → session/database", example: "The service checks business rules while the repository performs database access.", code: "task = repo.get_owned(session, task_id, user.id)\ntask_service.rename(task, title)" },
    "Alembic migrations and schema versioning": { what: "A migration is a versioned database schema change.", why: "Production databases contain existing data; changing a Python model does not migrate that data safely.", flow: "model change → migration → review → upgrade database", example: "Adding completed to tasks should be a migration.", code: "alembic revision --autogenerate -m 'add completed'\nalembic upgrade head" },
    "Login → token → Authorization: Bearer flow": { what: "Bearer authentication sends an access token with later requests.", why: "The server needs a way to recognize a caller after login.", flow: "login → verify → issue token → client sends header → verify token → identify user", example: "GET /me can identify the current user from a valid token.", code: "Authorization: Bearer eyJ..." },
    "Protected routes with dependencies": { what: "A protected route requires authentication before business logic executes.", why: "Authentication should be implemented once and reused.", flow: "request → auth dependency → current user → route", example: "Task routes can receive current_user from one dependency.", code: "def update_task(task_id:int,current_user=Depends(get_current_user)): ..." },
    "Current user and user-owned resources": { what: "Ownership ties a resource to the authenticated user.", why: "Never trust a client-supplied user_id for authorization.", flow: "token → current user → query resource + owner → allow/deny", example: "User 42 should not update user 7's task.", code: "select(Task).where(Task.id==task_id,Task.user_id==current_user.id)" },
    "Roles, permissions and authorization checks": { what: "Authorization policies decide which identities may perform which actions.", why: "Authentication only establishes identity.", flow: "identity → role/permission → policy → operation", example: "Members can manage their own tasks; admins can manage users.", code: "if not user.is_admin: raise HTTPException(403)" },
    "Filtering and search": { what: "Filtering narrows results; search matches records based on user input.", why: "Large collections need ways to request only relevant data.", flow: "query params → validate → parameterized query → results", example: "GET /tasks?completed=false&q=fastapi", code: "SELECT id,title FROM tasks WHERE completed=FALSE AND title ILIKE '%'||:q||'%';" },
    "Sorting and stable API responses": { what: "Sorting controls order; stable sorting adds a deterministic tie-breaker.", why: "Unstable ordering can cause duplicate or missing records across pages.", flow: "allowed field → ORDER BY → tie-breaker → pagination", example: "Use created_at DESC, id DESC rather than an arbitrary client string.", code: "ORDER BY created_at DESC,id DESC" },
    "API versioning and consistent error contracts": { what: "Versioning lets clients keep using a known contract while the API evolves.", why: "Unexpected response changes break clients.", flow: "client → /v1 → stable contract → implementation", example: "A future /v2 can make incompatible changes without silently changing /v1.", code: "GET /v1/tasks\n{\"error\":\"TASK_NOT_FOUND\",\"message\":\"Task 42 was not found\"}" },
    "Idempotency, logging and production API rules": { what: "Idempotency makes repeated operations have the same intended effect; logs provide operational evidence.", why: "Networks retry and production debugging needs useful context.", flow: "request → idempotency policy → operation → result + structured logs", example: "A payment-like POST can use an idempotency key to prevent duplicate processing.", code: "Idempotency-Key: 8d7...\n# store key + result" },
    "Assertions/fixtures": { what: "Assertions state expected behavior; fixtures provide reusable test setup.", why: "Tests need clear expectations without repeated setup.", flow: "fixture setup → action → assertion → cleanup", example: "A client fixture can be shared by API tests.", code: "@pytest.fixture\ndef client(): return TestClient(app)" },
    "Unit tests for business logic": { what: "A unit test checks one small business behavior in isolation.", why: "Business rules should be fast to test without the whole stack.", flow: "arrange → call service → assert result/error", example: "Test that an empty task title is rejected.", code: "def test_title_required():\n    with pytest.raises(ValueError): create_task('')" },
    "API tests with TestClient/httpx": { what: "API tests exercise the application through its HTTP boundary.", why: "They catch routing, validation, status and serialization problems.", flow: "test client → request → application → response → assertions", example: "POST /tasks should return 201 and the created task.", code: "r=client.post('/tasks',json={'title':'Learn'})\nassert r.status_code==201" },
    "Database/integration tests": { what: "Integration tests verify multiple components working together with a database.", why: "Unit tests cannot prove SQL mappings and transactions work against a real database.", flow: "API → service → SQLAlchemy → test database → result", example: "Create a task through HTTP and read it back from the database.", code: "r=client.post('/tasks',json={'title':'DB test'})\nassert r.status_code==201" },
    "Authentication, authorization, edge cases and coverage": { what: "A serious suite tests security boundaries and unusual states, not only happy paths.", why: "Production failures often occur around invalid or unexpected input.", flow: "normal → missing auth → wrong owner → invalid input → conflict", example: "A user must not modify another user's task.", code: "assert client.get('/tasks/42').status_code==401" },
    "TTL and automatic expiration": { what: "TTL means time-to-live: Redis automatically expires a key after a period.", why: "Temporary data should not live forever.", flow: "set + expiration → key exists → TTL decreases → expires", example: "Password-reset codes can expire after ten minutes.", code: "redis.setex('reset:abc',600,'user:42')" },
    "Cache-aside: read cache → fallback to DB": { what: "Cache-aside reads cache first and falls back to the database on a miss.", why: "Frequently requested data can be served faster.", flow: "request → cache hit? → return; miss → DB → cache → return", example: "PostgreSQL remains the source of truth.", code: "value=redis.get('task:42')\nif value is None: value=load_from_db(42)" },
    "Connect Redis to FastAPI safely": { what: "Redis should be configured as shared application infrastructure.", why: "Connection management and cache failure behavior must be predictable.", flow: "settings → Redis client/pool → service → endpoint", example: "If Redis is down, a safe cache read can fall back to PostgreSQL.", code: "redis_client=redis.Redis.from_url(REDIS_URL,decode_responses=True)" },
    "Cache invalidation and basic rate limiting": { what: "Invalidation removes stale cache entries; rate limiting restricts request frequency.", why: "Caches need freshness rules and APIs need protection from abuse or accidental bursts.", flow: "write DB → invalidate cache; request → counter → allow/deny", example: "After PATCH /tasks/42, delete task:42 from Redis.", code: "session.commit()\nredis.delete('task:42')\ncount=redis.incr('rate:user:42')" },
    "Celery app, task and worker": { what: "Celery uses an application configuration, task definitions and worker processes.", why: "Slow or retryable work should run outside the HTTP request.", flow: "FastAPI → broker → worker → task → result/log", example: "A signup request can queue a welcome email.", code: "@celery_app.task\ndef send_email(user_id): send_welcome_email(user_id)\nsend_email.delay(42)" },
    "Redis as broker and result backend": { what: "A broker transports task messages; a result backend can store task state/results.", why: "Workers need messages and some systems need observable task state.", flow: "producer → broker → worker → optional result backend", example: "FastAPI can send Celery messages through Redis.", code: "Celery('tasks',broker='redis://redis:6379/0',backend='redis://redis:6379/1')" },
    "Retries and failure handling": { what: "Retries repeat failed background work when the failure may be temporary.", why: "Networks and third-party services can fail temporarily.", flow: "task → failure → backoff → retry → success/permanent failure", example: "A provider timeout may be retryable; invalid data may not be.", code: "@celery_app.task(autoretry_for=(TimeoutError,),retry_backoff=True,max_retries=3)\ndef sync(): ..." },
    "Scheduled jobs and Celery Beat": { what: "Beat schedules task messages; workers execute them.", why: "Some work must happen on a schedule without a user request.", flow: "Beat → task message → broker → worker → job", example: "Delete expired temporary data every night.", code: "beat_schedule={'cleanup':{'task':'app.cleanup','schedule':86400}}" },
    "Linux CLI, files and processes": { what: "The Linux command line controls files, programs and processes.", why: "Most backend servers and containers are Linux-based.", flow: "shell → OS → process/filesystem → output", example: "Production debugging often starts in a terminal.", code: "pwd\nls -la\nps aux\ngrep -R 'ERROR' logs/" },
    "Permissions and SSH basics": { what: "Linux permissions control access; SSH provides secure remote terminal access.", why: "Production systems need controlled access and correct file ownership.", flow: "SSH → identity → permissions → command", example: "A deployment user should not need unrestricted root access.", code: "ssh user@server\nls -l .env\nchmod 600 .env" },
    "Dockerfile and reproducible builds": { what: "A Dockerfile describes how an image is built.", why: "The same instructions can create a predictable runtime environment.", flow: "base image → dependencies → source → command", example: "Build the Python backend into an image.", code: "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . ." },
    "Volumes, networks and ports": { what: "Volumes persist data, networks connect containers and ports expose services.", why: "Containers are disposable but services still need communication and persistent state.", flow: "host port → container; container → network → container; volume → persistent files", example: "PostgreSQL data belongs in a volume.", code: "ports:\n  - '8000:8000'\nvolumes:\n  - postgres_data:/var/lib/postgresql/data" },
    "Environment variables and service configuration": { what: "Environment variables inject runtime configuration.", why: "The same image should run across environments without changing application code.", flow: "environment → settings → service clients", example: "Production can provide a different DATABASE_URL to the same image.", code: "DATABASE_URL=...\nREDIS_URL=...\nJWT_SECRET=..." },
    "Docker Compose for API + PostgreSQL + Redis": { what: "Compose defines multiple related containers and their connections.", why: "Real backends often need API, database, cache and worker together.", flow: "compose → api + postgres + redis + worker → network/volumes", example: "Inside Compose, the API connects to the service name postgres, not localhost.", code: "services:\n  api:\n    build: .\n    depends_on: [postgres,redis]\n  postgres:\n    image: postgres:16\n  redis:\n    image: redis:7" },
    "Run and debug the complete stack": { what: "Stack debugging means finding which service or boundary actually failed.", why: "Blindly restarting everything hides the root cause.", flow: "status → logs → health → config → network → dependency → endpoint", example: "If API cannot connect to PostgreSQL, inspect the API URL and database logs.", code: "docker compose ps\ndocker compose logs api\ndocker compose logs postgres\ncurl -i http://localhost:8000/health" },
    "GitHub Actions and automated tests": { what: "GitHub Actions runs automated workflows on repository events.", why: "Every change can be checked consistently.", flow: "push/PR → runner → checkout → setup → install → test", example: "A pull request should fail when backend tests fail.", code: "- uses: actions/checkout@v4\n- uses: actions/setup-python@v5\n- run: pip install -r requirements.txt\n- run: pytest" },
    "Secrets and environment configuration": { what: "Secrets are sensitive values such as passwords, API keys and signing keys.", why: "Committing a secret can expose production systems.", flow: "secret store → deployment environment → application", example: "CI should receive deployment credentials from its secret store.", code: "env:\n  JWT_SECRET: secret-store-value" },
    "Build the application image": { what: "Image building turns source and dependencies into a deployable artifact.", why: "Immutable artifacts reduce differences between build and runtime.", flow: "commit → build → tag → test → registry → deploy", example: "Tag with the Git commit SHA to identify exactly what is running.", code: "docker build -t task-api:$GIT_SHA .\ndocker run --rm task-api:$GIT_SHA" },
    "Deploy, health checks and logs": { what: "Deployment makes a new version available; health checks and logs show whether it works.", why: "A process starting does not prove the service is usable.", flow: "deploy → start → health check → traffic → observe", example: "A service can start while database connectivity is broken.", code: "GET /health\n200 OK\n{\"status\":\"ok\"}" },
    "HTTPS, rollback and final production checklist": { what: "Production readiness includes encrypted transport, safe releases, observability and rollback.", why: "Running code is only one part of operating a backend safely.", flow: "build → deploy → health → observe → rollback if needed", example: "If release B fails health checks, return traffic to known-good release A.", code: "release A = known good\nrelease B = new\nif B fails: route traffic to A" },
  };

  for (const [name, item] of Object.entries(deepConcepts)) {
    focusDetail[name] =
      "# WHAT IS THIS?\n" + item.what +
      "\n\n# WHY DOES IT EXIST?\n" + item.why +
      "\n\n# HOW DOES IT WORK?\n" + item.flow +
      "\n\n# REAL BACKEND EXAMPLE\n" + item.example +
      "\n\n# CODE\n" + item.code +
      "\n\n# READ THE CODE\nRead from top to bottom. Identify the input, the important operation, the output, and the failure path. Change one part and run it again so you can observe the effect.";
  }

  const stageGuide: Record<number,string> = {
    1: "# STEP 1 — UNDERSTAND\nBuild the mental model before touching syntax.",
    2: "# STEP 2 — TRACE\nFollow the concept through a real request from input to output.",
    3: "# STEP 3 — IMPLEMENT\nWrite the smallest working version, run it and change one thing.",
    4: "# STEP 4 — INTEGRATE\nPut the concept into the cumulative TaskFlow backend rather than a disconnected demo.",
    5: "# STEP 5 — DEBUG + EXPLAIN\nBreak it deliberately, debug the failure, then explain the design without notes."
  };

  const detail = (stageGuide[stage] || "") + "\n\n" + (focusDetail[focus] || (
    "# WHAT IS THIS?\n" +
    focus +
    "\n\nStart by defining the thing in plain English. Identify what problem it solves, where it lives in a backend, and what would happen if we did not have it.\n\n" +
    "# BUILD THE MENTAL MODEL\n" +
    "1. What enters the system?\n" +
    "2. What component receives it?\n" +
    "3. What processing happens?\n" +
    "4. What state or dependency is used?\n" +
    "5. What comes out?\n" +
    "6. What can fail?\n\n" +
    "# LEARN BY DOING\n" +
    "Write the smallest working example. Change one input. Run it again. Observe the output. Then connect the same idea to TaskFlow.\n\n" +
    "# IMPORTANT\n" +
    "Do not memorise this concept yet. You should be able to explain what it is, why it exists, how it works, and where it belongs before moving on."
  ));

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
