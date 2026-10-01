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

  const stageGuide: Record<number,string> = {
    1: "# STEP 1 — UNDERSTAND\nBuild the mental model before touching syntax.",
    2: "# STEP 2 — TRACE\nFollow the concept through a real request from input to output.",
    3: "# STEP 3 — IMPLEMENT\nWrite the smallest working version, run it and change one thing.",
    4: "# STEP 4 — INTEGRATE\nPut the concept into the cumulative TaskFlow backend rather than a disconnected demo.",
    5: "# STEP 5 — DEBUG + EXPLAIN\nBreak it deliberately, debug the failure, then explain the design without notes."
  };

  const detail = (stageGuide[stage] || "") + "\n\n" + (focusDetail[focus] || (
    "# CORE CONCEPT\n" + target +
    "\n\n# HOW TO THINK\n1. Identify the input.\n2. Identify the output.\n3. Understand the normal flow.\n4. Identify failure cases.\n5. Implement the smallest example.\n6. Connect it to the TaskFlow backend."
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
