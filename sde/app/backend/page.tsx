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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem("dace-backend-done") || "{}"));
      setNotes(JSON.parse(localStorage.getItem("dace-backend-notes") || "{}"));
      setMistakes(JSON.parse(localStorage.getItem("dace-backend-mistakes") || "{}"));
      setCode(JSON.parse(localStorage.getItem("dace-backend-code") || "{}"));
      setAttachments(JSON.parse(localStorage.getItem("dace-backend-attachments") || "{}"));
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-done", JSON.stringify(done)); }, [done, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-notes", JSON.stringify(notes)); }, [notes, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-mistakes", JSON.stringify(mistakes)); }, [mistakes, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-code", JSON.stringify(code)); }, [code, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dace-backend-attachments", JSON.stringify(attachments)); }, [attachments, hydrated]);

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
    ["dace-backend-done","dace-backend-notes","dace-backend-mistakes","dace-backend-code","dace-backend-attachments"].forEach(k => localStorage.removeItem(k));
    location.reload();
  };

  return (
    <main className="min-h-screen dace-grid text-white">
      <div className="cosmic-bg cosmic-nebula" aria-hidden="true" />
      <header className="sticky top-0 z-40 glass border-b border-[#202a38] px-5 md:px-8 h-16 flex items-center gap-3">
        <a href="/" className="text-xs text-[#7e8ca0] hover:text-white">← DACE</a>
        <div className="h-5 w-px bg-[#263346]" />
        <div>
          <div className="font-black tracking-tight">Backend / SDE</div>
          <div className="text-[9px] tracking-[.18em] text-cyan-200">12 WEEKS · 84 DAYS · TOP-SDE ORIENTED</div>
        </div>
        <div className="ml-auto text-xs text-[#9aa8ba]">{completedDays}/{days.length} days · {progress}%</div>
      </header>

      <div className="max-w-[1100px] mx-auto p-4 md:p-7">
        

        <section className="min-w-0">
          <div className="panel rounded-2xl p-6"><div className="text-[10px] tracking-[.2em] text-cyan-200">TODAY</div><div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2"><div><div className="text-xs text-[#657387]">DAY {day.day} OF 84 · {topic.title}</div><h1 className="text-3xl font-black mt-2">{day.target}</h1><p className="text-sm text-[#8391a4] mt-2">~45–90 minutes. Learn one thing, practice it, add it to the project, then check yourself.</p></div><div className="text-xs text-[#9aa8ba]">{completedDays}/84 complete · {progress}%</div></div></div><details className="mt-4"><summary className="cursor-pointer list-none panel rounded-2xl p-4 text-xs text-[#9aa8ba] hover:text-white">Roadmap, topic details and all daily targets <span className="float-right text-cyan-200">▾</span></summary><div className="mt-3"><div className="panel rounded-2xl p-5 mt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="text-[10px] tracking-[.2em] text-cyan-200">STAGE {String(currentTopicIndex+1).padStart(2,"0")}</div>
                <h1 className="text-2xl md:text-3xl font-black mt-2">{topic.title}</h1>
                <p className="text-sm text-[#8391a4] mt-2 max-w-3xl">{topic.goal}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#7d8b9f]">{topicProgress}/{topic.days} complete</div>
                <div className="w-44 h-2 bg-[#18212d] rounded-full mt-2 overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-300 to-violet-400 rounded-full" style={{width:`${(topicProgress/topic.days)*100}%`}} /></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mt-5">
              <InfoBox title="BEFORE YOU START" items={topic.prerequisites} />
              <InfoBox title="TOPIC CHECKLIST" items={topic.checklist} />
            </div>

            <div className="mt-5 p-4 rounded-xl border border-violet-300/10 bg-violet-300/[.03]">
              <div className="text-[10px] tracking-widest text-violet-200">MINI PROJECT · CUMULATIVE</div>
              <div className="font-semibold mt-1">{topic.miniProject}</div>
              <div className="text-[11px] text-[#718096] mt-1">Every stage adds to the same engineering progression. You do not throw away previous work.</div>
            </div>
          </div>

          <div className="panel rounded-2xl p-5 mt-4">
            <div className="flex items-center justify-between gap-3">
              <div><div className="text-[10px] tracking-widest text-cyan-200">DAILY TARGETS</div><h2 className="text-xl font-black mt-1">Small enough for college days</h2></div>
              <div className="text-[10px] text-[#657387]">~45–90 min/day</div>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2 mt-4">
              {topicDays.map(d => (
                <button key={d.day} onClick={() => setSelectedDay(d.day)}
                  className={`text-left p-4 rounded-xl border transition ${selectedDay===d.day ? "border-cyan-300/25 bg-cyan-300/[.05]" : "border-white/5 bg-[#0a1017] hover:border-white/10"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-widest text-[#657387]">DAY {d.day}</span>
                    <span className={done[d.day] ? "text-green-300 text-[10px]" : "text-[#657387] text-[10px]"}>{done[d.day] ? "DONE" : "OPEN"}</span>
                  </div>
                  <div className="font-semibold text-sm mt-2">{d.target}</div>
                  <div className="text-[10px] text-[#68778c] mt-2">{d.practice}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid xl:grid-cols-[1.15fr_.85fr] gap-4 mt-4">
            <div className="panel rounded-2xl p-5">
              <div className="text-[10px] tracking-widest text-cyan-200">DAY {day.day} WORKSPACE</div>
              <h2 className="text-2xl font-black mt-1">{day.target}</h2>

              <div className="mt-5 p-4 rounded-xl border border-white/5 bg-white/[.02]">
                <div className="text-[10px] tracking-widest text-[#718096]">2-MINUTE REVISION</div>
                <p className="text-xs text-[#a1adbd] mt-2">Before coding today, write what you already know from the previous topics. Do not open the answer first.</p>
                <textarea value={notes[`revision-${day.day}`] || ""} onChange={e => setText(setNotes,`revision-${day.day}`,e.target.value)}
                  placeholder="What do I remember? What connects to today's target?"
                  className="w-full mt-3 min-h-24 bg-[#090f16] border border-[#253245] rounded-xl p-3 text-xs outline-none focus:border-cyan-300/30" />
              </div>

              <div className="mt-4">
                <label className="text-[10px] tracking-widest text-cyan-200">MY NOTES / UNDERSTANDING</label>
                <textarea value={notes[topic.id] || ""} onChange={e => setText(setNotes,topic.id,e.target.value)}
                  placeholder="Explain the concept in your own words. Keep it short."
                  className="w-full mt-2 min-h-32 bg-[#090f16] border border-[#253245] rounded-xl p-3 text-xs outline-none focus:border-cyan-300/30" />
              </div>

              <div className="mt-4">
                <label className="text-[10px] tracking-widest text-violet-200">MY CODE / COMMANDS</label>
                <textarea value={code[topic.id] || ""} onChange={e => setText(setCode,topic.id,e.target.value)}
                  placeholder="Paste your code, SQL, Docker commands, curl examples, etc."
                  className="w-full mt-2 min-h-44 bg-[#090f16] border border-[#253245] rounded-xl p-3 text-xs font-mono outline-none focus:border-violet-300/30" />
              </div>

              <div className="mt-4">
                <label className="text-[10px] tracking-widest text-rose-200">MY MISTAKES</label>
                <textarea value={mistakes[topic.id] || ""} onChange={e => setText(setMistakes,topic.id,e.target.value)}
                  placeholder="What confused me? What did I implement wrong? What is the correct mental model?"
                  className="w-full mt-2 min-h-28 bg-[#090f16] border border-[#253245] rounded-xl p-3 text-xs outline-none focus:border-rose-300/30" />
              </div>

              <div className="mt-4 p-4 rounded-xl border border-white/5">
                <div className="text-[10px] tracking-widest text-[#718096]">ATTACHMENTS</div>
                <p className="text-[10px] text-[#657387] mt-1">Attach reference PDFs, screenshots, .py, .sql, .md or other study material. DACE keeps the attachment list locally.</p>
                <label className="inline-flex mt-3 px-3 py-2 rounded-lg border border-[#273447] text-xs cursor-pointer hover:bg-white/5">
                  + Attach file
                  <input type="file" multiple onChange={handleFiles} className="hidden" />
                </label>
                <div className="mt-3 space-y-1">
                  {(attachments[topic.id] || []).map((f,i) => (
                    <div key={i} className="flex justify-between gap-3 text-[10px] bg-[#0a1017] rounded-lg px-3 py-2">
                      <span className="truncate">{f.name}</span><span className="text-[#657387]">{Math.max(1,Math.round(f.size/1024))} KB</span>
                    </div>
                  ))}
                  {!attachments[topic.id]?.length && <div className="text-[10px] text-[#566477]">No files attached yet.</div>}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => setDone(x => ({...x,[day.day]:!x[day.day]}))}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold ${done[day.day] ? "bg-green-300 text-black" : "bg-white text-black"}`}>
                  {done[day.day] ? "✓ Day completed" : "Mark day complete"}
                </button>
                {day.day < days.length && <button onClick={() => {
                  const next = days[day.day];
                  setSelectedDay(next.day);
                  setSelectedTopic(next.topicId);
                }} className="px-4 py-2.5 rounded-xl border border-[#273447] text-xs">Next target →</button>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="panel rounded-2xl p-5">
                <div className="text-[10px] tracking-widest text-violet-200">CHECKPOINT</div>
                <h3 className="font-bold mt-2">Don't move on just because the checkbox looks nice.</h3>
                <p className="text-xs text-[#8391a4] mt-2">{day.checkpoint}</p>
                <div className="mt-4 text-[11px] text-[#657387]">If you cannot explain it, mark the day incomplete and revise.</div>
              </div>

              <div className="panel rounded-2xl p-5">
                <div className="text-[10px] tracking-widest text-cyan-200">PROJECT PROGRESSION</div>
                <h3 className="font-bold mt-2">{topic.miniProject}</h3>
                <p className="text-xs text-[#8391a4] mt-2">{day.project}</p>
                <div className="mt-4 h-2 bg-[#18212d] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-300 to-violet-400 rounded-full" style={{width:`${((currentTopicIndex+1)/topics.length)*100}%`}} /></div>
                <div className="text-[10px] text-[#657387] mt-2">Stage {currentTopicIndex+1} of {topics.length}</div>
              </div>

              <div className="panel rounded-2xl p-5">
                <div className="text-[10px] tracking-widest text-[#718096]">NEXT / PREVIOUS</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button disabled={currentTopicIndex===0} onClick={() => selectTopic(topics[currentTopicIndex-1]?.id)} className="px-3 py-3 rounded-xl border border-[#273447] text-xs disabled:opacity-30">← Previous</button>
                  <button disabled={currentTopicIndex===topics.length-1} onClick={() => selectTopic(topics[currentTopicIndex+1]?.id)} className="px-3 py-3 rounded-xl border border-[#273447] text-xs disabled:opacity-30">Next →</button>
                </div>
              </div>
            </div>
          </div>
</div></details>
        </section>
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
