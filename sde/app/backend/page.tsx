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

  const resourceFor = (d: Day) => {
    const resources: Record<string, { youtube: string; site: string; siteLabel: string }> = {
      http: { youtube: "https://www.youtube.com/results?search_query=HTTP+REST+API+tutorial+beginner+Traversy+Media", site: "https://developer.mozilla.org/en-US/docs/Web/HTTP", siteLabel: "MDN HTTP" },
      git: { youtube: "https://www.youtube.com/results?search_query=Git+GitHub+tutorial+beginner+freeCodeCamp", site: "https://git-scm.com/book/en/v2", siteLabel: "Pro Git" },
      fastapi: { youtube: "https://www.youtube.com/results?search_query=FastAPI+tutorial+beginner+Hitesh+Choudhary", site: "https://fastapi.tiangolo.com/tutorial/", siteLabel: "FastAPI Docs" },
      postgres: { youtube: "https://www.youtube.com/results?search_query=PostgreSQL+SQL+tutorial+beginner+freeCodeCamp", site: "https://www.postgresql.org/docs/current/tutorial.html", siteLabel: "PostgreSQL" },
      sqlalchemy: { youtube: "https://www.youtube.com/results?search_query=SQLAlchemy+2.0+tutorial+beginner+Python", site: "https://docs.sqlalchemy.org/en/20/tutorial/", siteLabel: "SQLAlchemy" },
      auth: { youtube: "https://www.youtube.com/results?search_query=FastAPI+JWT+authentication+tutorial+beginner", site: "https://fastapi.tiangolo.com/tutorial/security/", siteLabel: "FastAPI Security" },
      api: { youtube: "https://www.youtube.com/results?search_query=REST+API+best+practices+pagination+versioning+tutorial", site: "https://www.rfc-editor.org/rfc/rfc9110", siteLabel: "HTTP Semantics" },
      testing: { youtube: "https://www.youtube.com/results?search_query=pytest+FastAPI+testing+tutorial+beginner", site: "https://docs.pytest.org/en/stable/", siteLabel: "pytest Docs" },
      redis: { youtube: "https://www.youtube.com/results?search_query=Redis+tutorial+beginner+caching+FastAPI", site: "https://redis.io/docs/latest/develop/", siteLabel: "Redis Docs" },
      celery: { youtube: "https://www.youtube.com/results?search_query=Celery+Redis+background+tasks+Python+tutorial", site: "https://docs.celeryq.dev/en/stable/getting-started/introduction.html", siteLabel: "Celery Docs" },
      docker: { youtube: "https://www.youtube.com/results?search_query=Docker+tutorial+beginner+freeCodeCamp", site: "https://docs.docker.com/get-started/", siteLabel: "Docker Docs" },
      cicd: { youtube: "https://www.youtube.com/results?search_query=GitHub+Actions+CI+CD+tutorial+beginner", site: "https://docs.github.com/en/actions", siteLabel: "GitHub Actions" },
    };
    return resources[d.topicId] || resources.http;
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
                                const resource = resourceFor(d);
                                return (
                                  <div
                                    key={lesson}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-white/[.035] last:border-b-0 hover:bg-white/[.025]"
                                  >
                                    <button
                                      onClick={() => toggleSubtopic(lesson)}
                                      aria-label={checked ? `Mark ${lesson} incomplete` : `Mark ${lesson} complete`}
                                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${checked ? "bg-cyan-300 border-cyan-300 text-black" : "border-[#46546a] text-transparent"}`}
                                    >
                                      {checked ? "✓" : ""}
                                    </button>
                                    <a
                                      href={resource.youtube}
                                      target="_blank"
                                      rel="noreferrer"
                                      title="Learn on YouTube"
                                      className={`text-xs flex-1 hover:text-cyan-200 transition ${checked ? "text-[#64748b] line-through" : "text-[#aeb8c6]"}`}
                                    >
                                      {lesson}
                                    </a>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <a href={resource.youtube} target="_blank" rel="noreferrer" title="YouTube" className="w-7 h-7 rounded-lg border border-red-300/15 bg-red-300/5 flex items-center justify-center text-[10px] text-red-200 hover:bg-red-300/10">▶</a>
                                      <a href={resource.site} target="_blank" rel="noreferrer" title={resource.siteLabel} className="w-7 h-7 rounded-lg border border-blue-300/15 bg-blue-300/5 flex items-center justify-center text-[10px] text-blue-200 hover:bg-blue-300/10">↗</a>
                                      <span className="hidden sm:inline text-[10px] text-[#78869a] ml-1">Est. {lessonMinutes} min</span>
                                    </div>
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

function topicProgressFor(id: string, done: Record<number,boolean>, allDays: Day[]) {
  return allDays.filter(d => d.topicId === id && done[d.day]).length;
}

function Metric({label,value,sub}:{label:string;value:string;sub:string}) {
  return <div className="panel rounded-2xl p-4"><div className="text-[10px] tracking-widest text-[#64748b]">{label}</div><div className="text-2xl font-black mt-2">{value}</div><div className="text-[10px] text-[#68778c] mt-1">{sub}</div></div>;
}

function InfoBox({title,items}:{title:string;items:string[]}) {
  return <div className="rounded-xl border border-white/5 bg-[#0a1017] p-4"><div className="text-[10px] tracking-widest text-[#718096]">{title}</div><div className="flex flex-wrap gap-2 mt-3">{items.map(x=><span key={x} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-[#9aa8ba]">{x}</span>)}</div></div>;
}
