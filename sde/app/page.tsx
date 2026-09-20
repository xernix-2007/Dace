"use client";

import problemsData from "../data/problems.json";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowUpRight, BarChart3, BookOpen, BriefcaseBusiness, CalendarDays,
  Check, CheckCircle2, ChevronRight, CircleHelp, Clock3, Code2, Download,
  Flame, Gauge, Github, GraduationCap, LayoutDashboard, ListChecks, Menu,
  Play, RotateCcw, Search, Settings, ShieldCheck, Sparkles, Target, Timer,
  Trophy, Upload, UserRound, X, Zap
} from "lucide-react";

type Difficulty="Easy"|"Medium"|"Hard";
type Status="unsolved"|"solved"|"revision"|"failed";
type View="overview"|"today"|"problems"|"companies"|"analytics"|"interview"|"settings";
type Problem={
 id:number; title:string; difficulty:Difficulty; topics:string[]; companies:string[];
 url:string; estimate:number;
};

const problems:Problem[] = problemsData as Problem[];
const difficulties:Difficulty[]=["Easy","Medium","Hard"];
const companies=["All",...Array.from(new Set(problems.flatMap(p=>p.companies)))].sort((a,b)=>a.localeCompare(b));
const topicList=Array.from(new Set(problems.flatMap(p=>p.topics))).sort();

function dateKey(date=new Date()){return date.toLocaleDateString("en-CA");}
function hashSeed(s:string){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function shuffle<T>(items:T[],seed:string){const a=[...items];let x=hashSeed(seed);for(let i=a.length-1;i>0;i--){x=(Math.imul(x,1664525)+1013904223)>>>0;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function fmt(sec:number){return `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`}
function diffClass(d:Difficulty){return d==="Easy"?"diff-easy":d==="Medium"?"diff-medium":"diff-hard"}

function Icon({name,size=17}:{name:string;size?:number}){
 const common={size,strokeWidth:1.8};
 const icons:any={dashboard:LayoutDashboard,calendar:CalendarDays,list:ListChecks,company:BriefcaseBusiness,analytics:BarChart3,interview:Target,settings:Settings,search:Search,clock:Clock3,play:Play,check:Check,code:Code2,spark:Sparkles,flame:Flame,trophy:Trophy,book:BookOpen,github:Github,upload:Upload,download:Download,menu:Menu,x:X,arrow:ArrowUpRight,reset:RotateCcw,gauge:Gauge,shield:ShieldCheck,user:UserRound,help:CircleHelp,zap:Zap,activity:Activity};
 const C=icons[name]||Code2;return <C {...common}/>;
}

export default function Home(){
 const [view,setView]=useState<View>("overview");
 const [mobileOpen,setMobileOpen]=useState(false);
 const [company,setCompany]=useState("All");
 const [target,setTarget]=useState({Easy:1,Medium:2,Hard:2});
 const [solved,setSolved]=useState<number[]>([]);
 const [status,setStatus]=useState<Record<number,Status>>({});
 const [daily,setDaily]=useState<Record<string,number[]>>({});
 const [timeSpent,setTimeSpent]=useState<Record<number,number>>({});
 const [attempts,setAttempts]=useState<Record<number,number>>({});
 const [hints,setHints]=useState<Record<number,number>>({});
 const [active,setActive]=useState<Problem|null>(null);
 const [seconds,setSeconds]=useState(0);
 const [running,setRunning]=useState(false);
 const [search,setSearch]=useState("");
 const [difficulty,setDifficulty]=useState<"All"|Difficulty>("All");
 const [topic,setTopic]=useState("All");
 const [interviewTime,setInterviewTime]=useState(45);
 const todayKey=dateKey();

 useEffect(()=>{
  try{
   const load=(k:string)=>localStorage.getItem(k);
   if(load("dace-solved"))setSolved(JSON.parse(load("dace-solved")!));
   if(load("dace-status"))setStatus(JSON.parse(load("dace-status")!));
   if(load("dace-daily"))setDaily(JSON.parse(load("dace-daily")!));
   if(load("dace-time"))setTimeSpent(JSON.parse(load("dace-time")!));
   if(load("dace-attempts"))setAttempts(JSON.parse(load("dace-attempts")!));
   if(load("dace-hints"))setHints(JSON.parse(load("dace-hints")!));
   if(load("dace-target"))setTarget(JSON.parse(load("dace-target")!));
   if(load("dace-company"))setCompany(load("dace-company")!);
  }catch{}
 },[]);
 useEffect(()=>localStorage.setItem("dace-solved",JSON.stringify(solved)),[solved]);
 useEffect(()=>localStorage.setItem("dace-status",JSON.stringify(status)),[status]);
 useEffect(()=>localStorage.setItem("dace-daily",JSON.stringify(daily)),[daily]);
 useEffect(()=>localStorage.setItem("dace-time",JSON.stringify(timeSpent)),[timeSpent]);
 useEffect(()=>localStorage.setItem("dace-attempts",JSON.stringify(attempts)),[attempts]);
 useEffect(()=>localStorage.setItem("dace-hints",JSON.stringify(hints)),[hints]);
 useEffect(()=>localStorage.setItem("dace-target",JSON.stringify(target)),[target]);
 useEffect(()=>localStorage.setItem("dace-company",company),[company]);
 useEffect(()=>{if(!running)return;const t=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(t)},[running]);

 const topicStats=useMemo(()=>{
  const all:Record<string,{solved:number;total:number}>= {};
  for(const p of problems)for(const t of p.topics){all[t]??={solved:0,total:0};all[t].total++;if(solved.includes(p.id))all[t].solved++}
  return all;
 },[solved]);

 const recentIds=useMemo(()=>{
  const ids:number[]=[];
  for(let i=1;i<=14;i++){const d=new Date();d.setDate(d.getDate()-i);ids.push(...(daily[dateKey(d)]||[]))}
  return new Set(ids);
 },[daily]);

 const score=(p:Problem,seed:string)=>{
  const weak=p.topics.reduce((best,t)=>Math.max(best,1-(topicStats[t]?.solved||0)/Math.max(1,topicStats[t]?.total||1)),.25);
  const revision=status[p.id]==="revision"?1.5:0;
  const failed=status[p.id]==="failed"?1.0:0;
  const fresh=recentIds.has(p.id)?-2:1;
  const companyBoost=company!=="All"&&p.companies.includes(company)?1.2:0;
  const jitter=(hashSeed(seed+p.id)*0.000001)%1;
  return weak*4+revision+failed+fresh+companyBoost+jitter;
 };

 const todayIds=useMemo(()=>{
  if(daily[todayKey])return daily[todayKey];
  const available=problems.filter(p=>!solved.includes(p.id));
  const picked:number[]=[];
  for(const d of difficulties){
   const count=target[d];
   const ranked=available.filter(p=>p.difficulty===d&&(company==="All"||p.companies.includes(company)))
     .sort((a,b)=>score(b,todayKey+d)-score(a,todayKey+d));
   const candidatePool=ranked.slice(0,Math.max(count*4,8));
   for(const p of shuffle(candidatePool,todayKey+d)){if(picked.length>=5)break;if(picked.filter(id=>problems.find(x=>x.id===id)?.difficulty===d).length<count&&!picked.includes(p.id))picked.push(p.id)}
  }
  if(picked.length<5){
   const fallback=shuffle(available.filter(p=>!picked.includes(p.id)&&(company==="All"||p.companies.includes(company))),todayKey+"fallback");
   for(const p of fallback){if(picked.length>=5)break;picked.push(p.id)}
  }
  setDaily(x=>({...x,[todayKey]:picked}));
  return picked;
 },[daily,todayKey,solved,company,target,topicStats,recentIds]);

 const today=todayIds.map(id=>problems.find(p=>p.id===id)).filter(Boolean) as Problem[];
 const solvedToday=today.filter(p=>solved.includes(p.id)).length;
 const totalTime=Object.values(timeSpent).reduce((a,b)=>a+b,0);
 const totalSolved=solved.length;
 const completion=Math.round(totalSolved/problems.length*100);
 const streak=useMemo(()=>{
  let n=0;
  for(let i=0;i<365;i++){const d=new Date();d.setDate(d.getDate()-i);const ids=daily[dateKey(d)]||[];if(!ids.length||!ids.every(id=>solved.includes(id)))break;n++}
  return n;
 },[daily,solved]);

 const filtered=useMemo(()=>problems.filter(p=>
  (difficulty==="All"||p.difficulty===difficulty)&&
  (topic==="All"||p.topics.includes(topic))&&
  (company==="All"||p.companies.includes(company))&&
  p.title.toLowerCase().includes(search.toLowerCase())
 ),[difficulty,topic,company,search]);

 const weeklySolved=useMemo(()=>{
  let n=0;for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);n+=(daily[dateKey(d)]||[]).filter(id=>solved.includes(id)).length}return n;
 },[daily,solved]);

 function regenerateToday(){
  setDaily(x=>{const y={...x};delete y[todayKey];return y});
 }
 function mark(p:Problem,s:Status){
  setStatus(x=>({...x,[p.id]:s}));
  setSolved(x=>s==="solved"?(x.includes(p.id)?x:[...x,p.id]):x.filter(id=>id!==p.id));
 }
 function openTimer(p:Problem){
  setActive(p);setSeconds(0);setRunning(false);
  setAttempts(x=>({...x,[p.id]:(x[p.id]||0)+1}));
 }
 function closeTimer(save=true){
  if(!active)return;
  if(save)setTimeSpent(x=>({...x,[active.id]:(x[active.id]||0)+seconds}));
  setRunning(false);setActive(null);setSeconds(0);
 }
 function exportData(){
  const blob=new Blob([JSON.stringify({solved,status,daily,timeSpent,attempts,hints,target,company,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="dace-progress.json";a.click();URL.revokeObjectURL(url);
 }
 function importData(e:React.ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];if(!file)return;const r=new FileReader();
  r.onload=()=>{try{const d=JSON.parse(String(r.result));if(d.solved)setSolved(d.solved);if(d.status)setStatus(d.status);if(d.daily)setDaily(d.daily);if(d.timeSpent)setTimeSpent(d.timeSpent);if(d.attempts)setAttempts(d.attempts);if(d.hints)setHints(d.hints);if(d.target)setTarget(d.target);if(d.company)setCompany(d.company)}catch{alert("Invalid DACE backup file.")}};
  r.readAsText(file);
 }
 function resetAll(){if(confirm("Reset all DACE local progress? This cannot be undone unless you have exported a backup.")){localStorage.clear();location.reload()}}

 const nav=[
  ["overview","Overview","dashboard"],["today","Today","calendar"],["problems","Problems","list"],
  ["companies","Companies","company"],["analytics","Analytics","analytics"],["interview","Interview","interview"],["settings","Settings","settings"]
 ] as [View,string,string][];

 return <main className="min-h-screen dace-grid">
  <header className="h-16 border-b border-[#202a38] sticky top-0 z-40 glass flex items-center px-4 md:px-6 gap-3">
   <button className="md:hidden p-2 rounded-lg hover:bg-white/5" onClick={()=>setMobileOpen(!mobileOpen)}><Icon name="menu"/></button>
   <button onClick={()=>setView("overview")} className="flex items-center gap-2.5">
    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 border border-pink-300/20 flex items-center justify-center"><Icon name="code" size={19}/></span>
    <span className="font-black tracking-[-.03em] text-lg"><span className="text-pink-300">D</span>ACE</span>
   </button>
   <span className="hidden sm:block text-[10px] tracking-[.2em] text-[#637187]">DAILY ADAPTIVE CODING</span>
   <div className="ml-auto flex items-center gap-3">
    <div className="hidden sm:flex items-center gap-2 text-xs text-[#9aa8ba]"><span className="w-2 h-2 rounded-full bg-pink-400 pulse-dot"/>LOCAL MODE</div>
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#263346] bg-[#0b1017] text-xs"><Icon name="flame" size={14}/><span>{streak}</span></div>
    <div className="w-8 h-8 rounded-full border border-[#334155] bg-[#141c28] flex items-center justify-center"><Icon name="user" size={15}/></div>
   </div>
  </header>

  {mobileOpen&&<div className="fixed inset-0 z-50 md:hidden"><div className="absolute inset-0 bg-black/60" onClick={()=>setMobileOpen(false)}/><aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0a0f16] border-r border-[#202a38] p-4 float-in">{nav.map(([k,l,i])=><NavButton key={k} active={view===k} label={l} icon={i} onClick={()=>{setView(k);setMobileOpen(false)}}/>)}</aside></div>}

  <div className="flex min-h-[calc(100vh-64px)]">
   <aside className="hidden md:block w-60 border-r border-[#202a38] p-4 shrink-0">
    <div className="text-[10px] tracking-[.2em] text-[#59687c] px-3 py-3">WORKSPACE</div>
    {nav.map(([k,l,i])=><NavButton key={k} active={view===k} label={l} icon={i} onClick={()=>setView(k)}/>)}
    <div className="mt-7 panel rounded-xl p-4 glow-cyan">
     <div className="flex items-center gap-2 text-xs font-semibold"><Icon name="spark" size={14}/> Adaptive engine</div>
     <p className="text-[11px] leading-5 text-[#77869a] mt-2">Selection weighs weakness, revisions, freshness and company preference.</p>
    </div>
    <div className="mt-4 px-3 text-[10px] tracking-[.18em] text-[#59687c]">DAILY TARGET</div>
    <div className="px-3 mt-2 text-xs text-[#9aa8ba]">{target.Easy}E · {target.Medium}M · {target.Hard}H</div>
   </aside>

   <section className="flex-1 min-w-0">
    {view==="overview"&&<Overview today={today} solvedToday={solvedToday} streak={streak} weeklySolved={weeklySolved} completion={completion} totalTime={totalTime} setView={setView} openTimer={openTimer}/>}
    {view==="today"&&<TodayPage today={today} solved={solved} status={status} solvedToday={solvedToday} company={company} companies={companies} setCompany={(c)=>{setCompany(c);regenerateToday()}} openTimer={openTimer} mark={mark} regenerate={regenerateToday}/>}
    {view==="problems"&&<ProblemsPage problems={filtered} solved={solved} status={status} search={search} setSearch={setSearch} difficulty={difficulty} setDifficulty={setDifficulty} topic={topic} setTopic={setTopic} openTimer={openTimer} mark={mark}/>}
    {view==="companies"&&<CompaniesPage company={company} companies={companies} setCompany={(c)=>{setCompany(c);regenerateToday();setView("today")}} problems={problems} solved={solved}/>}
    {view==="analytics"&&<AnalyticsPage problems={problems} solved={solved} status={status} timeSpent={timeSpent} topicStats={topicStats} streak={streak} totalTime={totalTime}/>}
    {view==="interview"&&<InterviewPage problems={problems} interviewTime={interviewTime} setInterviewTime={setInterviewTime} openTimer={openTimer}/>}
    {view==="settings"&&<SettingsPage target={target} setTarget={setTarget} company={company} setCompany={c=>{setCompany(c);regenerateToday()}} companies={companies} exportData={exportData} importData={importData} resetAll={resetAll}/>}
   </section>
  </div>

  {active&&<TimerModal active={active} seconds={seconds} running={running} hints={hints[active.id]||0} onToggle={()=>setRunning(!running)} onReset={()=>setSeconds(0)} onHint={()=>setHints(x=>({...x,[active.id]:(x[active.id]||0)+1}))} onClose={()=>closeTimer(true)} onSolved={()=>{mark(active,"solved");closeTimer(true)}}/>}
 </main>;
}

function NavButton({active,label,icon,onClick}:{active:boolean;label:string;icon:string;onClick:()=>void}){
 return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1.5 transition ${active?"bg-gradient-to-r from-cyan-300/10 to-violet-400/10 border border-cyan-300/10 text-white":"text-[#8391a5] hover:text-white hover:bg-white/[.035]"}`}><Icon name={icon} size={17}/><span>{label}</span>{active&&<span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-300"/>}</button>
}

function Overview({today,solvedToday,streak,weeklySolved,completion,totalTime,setView,openTimer}:{today:Problem[];solvedToday:number;streak:number;weeklySolved:number;completion:number;totalTime:number;setView:(v:View)=>void;openTimer:(p:Problem)=>void}){
 const focus=today.filter(p=>p.difficulty!=="Easy").slice(0,3);
 return <div className="max-w-7xl mx-auto p-5 md:p-8">
  <div className="fade-up panel rounded-3xl p-6 md:p-9 relative overflow-hidden glow-cyan">
   <div className="absolute right-0 top-0 w-72 h-72 bg-cyan-300/10 blur-3xl rounded-full"/>
   <div className="relative">
    <div className="flex items-center gap-2 text-[10px] tracking-[.22em] text-cyan-200"><span className="w-2 h-2 rounded-full bg-cyan-300 pulse-dot"/> TODAY'S SYSTEM</div>
    <div className="mt-4 grid lg:grid-cols-[1fr_420px] gap-8 items-center">
     <div><h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[.98]">Build skill.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-fuchsia-300 to-violet-300">Measure it.</span></h1><p className="max-w-xl text-sm md:text-base text-[#8998ac] mt-5 leading-7">DACE turns daily coding practice into a feedback loop: mixed problems, real solving time, revisions, company coverage and adaptive selection.</p>
      <div className="flex flex-wrap gap-2 mt-6"><button onClick={()=>setView("today")} className="px-4 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-pink-100 transition flex items-center gap-2"><Icon name="play" size={15}/> Start today's set</button><button onClick={()=>setView("analytics")} className="px-4 py-2.5 rounded-xl border border-[#2b384a] text-sm hover:bg-white/5 transition flex items-center gap-2"><Icon name="analytics" size={15}/> View analytics</button></div>
     </div>
     <div className="relative h-[310px] report-card rounded-[28px] overflow-hidden p-5">
      <div className="report-orb w-56 h-40 -right-8 -top-8 opacity-95"/>
      <div className="report-orb two w-44 h-28 -left-10 bottom-8 opacity-90"/>
      <div className="report-orb three w-28 h-24 right-16 bottom-[-24px] opacity-80"/>
      <div className="relative z-10 h-full flex flex-col justify-between">
       <div className="flex items-center justify-between"><span className="text-[9px] tracking-[.22em] text-pink-200">DACE / DAILY REPORT</span><span className="text-[9px] text-[#69778a]">01</span></div>
       <div><div className="text-5xl font-black tracking-tight">{solvedToday}/5</div><div className="text-xs text-[#8290a3] mt-1">problems completed today</div><div className="mt-5 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full magenta-line rounded-full transition-all" style={{width:`${solvedToday/5*100}%`}}/></div></div>
       <div className="grid grid-cols-3 gap-2"><MiniMetric label="Streak" value={`${streak}d`} sub="current"/><MiniMetric label="Week" value={String(weeklySolved)} sub="solved"/><MiniMetric label="Time" value={Math.floor(totalTime/60)+"m"} sub="tracked"/></div>
      </div>
     </div>
    </div>
   </div>
  </div>

  <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5 mt-5">
   <div className="panel rounded-2xl p-5 fade-up-2">
    <SectionTitle title="Today's set" icon="calendar" action="Open daily" onClick={()=>setView("today")}/>
    <div className="mt-4 space-y-2">{today.map((p,i)=><button key={p.id} onClick={()=>openTimer(p)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#202a38] hover:border-cyan-300/20 hover:bg-white/[.025] transition text-left"><span className="w-7 h-7 rounded-lg bg-[#151e2b] text-[10px] text-[#7d8ca1] flex items-center justify-center">{String(i+1).padStart(2,"0")}</span><span className="flex-1 min-w-0"><span className="block text-sm truncate">{p.title}</span><span className="block text-[11px] text-[#69788d] mt-1">{p.topics.join(" · ")}</span></span><span className={`text-[10px] px-2 py-1 rounded-full border ${diffClass(p.difficulty)}`}>{p.difficulty}</span><Icon name="arrow" size={14}/></button>)}</div>
   </div>
   <div className="panel rounded-2xl p-5 fade-up-3">
    <SectionTitle title="Adaptive focus" icon="spark"/>
    <p className="text-xs text-[#718096] mt-1">The engine watches where your performance is weakest.</p>
    <div className="mt-5 space-y-4">{focus.map(p=><div key={p.id}><div className="flex justify-between text-xs mb-2"><span>{p.topics[0]}</span><span className="text-[#6d7d92]">{p.difficulty}</span></div><div className="h-1.5 bg-[#1c2633] rounded-full"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{width:p.difficulty==="Hard"?"88%":p.difficulty==="Medium"?"64%":"42%"}}/></div></div>)}</div>
    <button onClick={()=>setView("analytics")} className="mt-6 text-xs text-cyan-200 hover:text-white flex items-center gap-1">See full weakness map <ChevronRight size={14}/></button>
   </div>
  </div>

  <div className="mt-5 grid md:grid-cols-3 gap-4">
   <FeatureCard icon="timer" title="Solve with intent" text="Track actual time, expected time, attempts and hints."/>
   <FeatureCard icon="shield" title="Own your data" text="Local-first progress with export/import backup."/>
   <FeatureCard icon="trophy" title="Prepare for interviews" text="Company filters, revision loops and interview mode."/>
  </div>
 </div>
}

function TodayPage({today,solved,status,solvedToday,company,companies,setCompany,openTimer,mark,regenerate}:{today:Problem[];solved:number[];status:Record<number,Status>;solvedToday:number;company:string;companies:string[];setCompany:(c:string)=>void;openTimer:(p:Problem)=>void;mark:(p:Problem,s:Status)=>void;regenerate:()=>void}){
 const completion=Math.round(solvedToday/5*100);
 return <div className="max-w-7xl mx-auto p-5 md:p-8">
  <div className="fade-up grid xl:grid-cols-[1fr_460px] gap-7 items-stretch mb-7">
   <div className="min-h-[330px] rounded-[30px] report-card relative overflow-hidden p-7 md:p-9 flex flex-col justify-between">
    <div className="report-orb w-64 h-48 -right-10 -top-10 opacity-90"/><div className="report-orb two w-52 h-32 -left-16 bottom-2 opacity-80"/>
    <div className="relative z-10 flex items-center justify-between"><div><div className="text-[10px] tracking-[.24em] text-pink-200">DACE / DAILY CHAPTER</div><div className="text-xs text-[#778398] mt-2">{dateKey()} · adaptive set</div></div><button onClick={regenerate} className="p-2.5 rounded-xl border border-white/10 bg-black/20 hover:bg-white/10" title="Regenerate"><Icon name="reset" size={15}/></button></div>
    <div className="relative z-10"><h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[.92]">Today's<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-fuchsia-300 to-violet-300">Problems.</span></h1><p className="text-sm text-[#9aa5b5] mt-5 max-w-xl">Five mixed interview questions. Your history changes what comes next.</p></div>
    <div className="relative z-10 grid grid-cols-3 gap-3 mt-7"><MiniMetric label="Complete" value={`${solvedToday}/5`} sub={`${completion}% today`}/><MiniMetric label="Target" value="1E · 2M · 2H" sub="daily mix"/><MiniMetric label="Focus" value={company==="All"?"All":company} sub="company bias"/></div>
   </div>
   <div className="rounded-[30px] bg-[#0a0d12] border border-white/8 p-6 md:p-7 flex flex-col justify-between">
    <div><div className="text-[10px] tracking-[.24em] text-[#78869a]">CHAPTER INDEX</div><div className="text-2xl font-black mt-3">Today's set</div><p className="text-xs text-[#68778c] mt-2">One easy · two medium · two hard</p></div>
    <div className="space-y-3 my-6">{today.map((p,i)=><div key={p.id} className="flex items-center gap-3"><span className="text-[10px] text-[#5e6b7d] w-5">0{i+1}</span><div className="h-px flex-1 bg-white/10"/><span className="text-xs truncate max-w-[190px]">{p.title}</span><span className={`text-[10px] ${p.difficulty==="Easy"?"text-emerald-300":p.difficulty==="Medium"?"text-amber-300":"text-pink-300"}`}>{p.difficulty}</span></div>)}</div>
    <select value={company} onChange={e=>{setCompany(e.target.value);regenerate()}} className="w-full bg-[#11151c] border border-white/10 rounded-xl px-3 py-3 text-xs"><option value="All">All companies</option>{companies.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select>
   </div>
  </div>
  <div className="flex items-center justify-between mb-3"><div><div className="text-[10px] tracking-[.22em] text-pink-200">CHAPTERS / 05</div><h2 className="text-xl font-black mt-1">Solve today's set</h2></div><div className="text-xs text-[#657387]">{solvedToday}/5 complete</div></div>
  <div className="space-y-3">{today.map((p,i)=><DailyCard key={p.id} p={p} index={i} solved={solved.includes(p.id)} status={status[p.id]||"unsolved"} openTimer={openTimer} mark={mark}/>)}</div>
  {today.length<5&&<div className="mt-5 panel rounded-xl p-4 text-xs text-amber-300">Not enough problems matched the current company/difficulty filter. DACE is using the available pool.</div>}
 </div>
}
function DailyCard({p,index,solved,status,openTimer,mark}:{p:Problem;index:number;solved:boolean;status:Status;openTimer:(p:Problem)=>void;mark:(p:Problem,s:Status)=>void}){
 return <article className={`report-card rounded-2xl p-4 md:p-5 transition hover:-translate-y-0.5 ${solved?"border-green-400/25":""}`}>
  <div className="flex gap-4 items-center">
   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/15 to-violet-500/15 border border-pink-300/10 flex items-center justify-center text-xs text-[#aab3c0]">{String(index+1).padStart(2,"0")}</div>
   <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><h2 className="font-semibold truncate">{p.title}</h2>{solved&&<CheckCircle2 size={15} className="text-green-400"/>}</div><div className="text-xs text-[#728198] mt-1">{p.topics.slice(0,3).join(" · ")} · {p.companies.slice(0,2).join(" · ")} · ~{p.estimate}m</div></div>
   <span className={`text-[10px] px-2.5 py-1.5 rounded-full border ${diffClass(p.difficulty)}`}>{p.difficulty}</span>
   <button onClick={()=>openTimer(p)} className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white text-xs font-semibold hover:brightness-110"><Icon name="clock" size={14}/> Timer</button>
  </div>
  <div className="mt-3 pt-3 border-t border-white/[.06] flex flex-wrap items-center gap-2">
   <select value={status} onChange={e=>mark(p,e.target.value as Status)} className="bg-[#0b0e13] border border-[#253245] rounded-lg px-2.5 py-2 text-[11px]"><option value="unsolved">Unsolved</option><option value="solved">Solved</option><option value="revision">Need revision</option><option value="failed">Couldn't solve</option></select>
   <a href={p.url} target="_blank" rel="noreferrer" className="ml-auto text-[11px] px-3 py-2 rounded-lg border border-[#253245] text-[#9aa8ba] hover:text-white flex items-center gap-1">LeetCode <Icon name="arrow" size={12}/></a>
   <button onClick={()=>openTimer(p)} className="sm:hidden text-[11px] px-3 py-2 rounded-lg bg-white text-black font-semibold">Timer</button>
  </div>
 </article>
}
function ProblemsPage({problems,solved,status,search,setSearch,difficulty,setDifficulty,topic,setTopic,openTimer,mark}:{problems:Problem[];solved:number[];status:Record<number,Status>;search:string;setSearch:(s:string)=>void;difficulty:"All"|Difficulty;setDifficulty:(d:"All"|Difficulty)=>void;topic:string;setTopic:(t:string)=>void;openTimer:(p:Problem)=>void;mark:(p:Problem,s:Status)=>void}){
 return <div className="max-w-7xl mx-auto p-5 md:p-8"><div className="fade-up"><div className="text-[10px] tracking-[.2em] text-violet-300">PROBLEM BANK</div><h1 className="text-3xl md:text-4xl font-black mt-2">Problems</h1><p className="text-sm text-[#748398] mt-2 mb-6">Search, filter, revise and launch the timer.</p></div>
  <div className="panel rounded-2xl p-3 mb-4 flex flex-wrap gap-2"><div className="flex-1 min-w-52 flex items-center gap-2 bg-[#0b1119] border border-[#243145] rounded-xl px-3"><Icon name="search" size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search problems..." className="bg-transparent outline-none py-2.5 text-sm w-full"/></div>{["All",...difficulties].map(d=><button key={d} onClick={()=>setDifficulty(d as any)} className={`px-3 py-2 rounded-xl text-xs border ${difficulty===d?"border-cyan-300/30 bg-cyan-300/10 text-cyan-100":"border-[#253245] text-[#8391a5] hover:bg-white/5"}`}>{d}</button>)}<select value={topic} onChange={e=>setTopic(e.target.value)} className="bg-[#0b1119] border border-[#253245] rounded-xl px-3 text-xs"><option>All</option>{topicList.map(t=><option key={t}>{t}</option>)}</select></div>
  <div className="text-xs text-[#68778c] mb-3">{problems.length} problems shown</div>
  <div className="space-y-2">{problems.map((p,i)=><DailyCard key={p.id} p={p} index={i} solved={solved.includes(p.id)} status={status[p.id]||"unsolved"} openTimer={openTimer} mark={mark}/>)}</div>
 </div>
}

function CompaniesPage({company,companies,setCompany,problems,solved}:{company:string;companies:string[];setCompany:(c:string)=>void;problems:Problem[];solved:number[]}){
 return <div className="max-w-6xl mx-auto p-5 md:p-8"><div className="text-[10px] tracking-[.2em] text-cyan-200">COMPANY PREP</div><h1 className="text-3xl md:text-4xl font-black mt-2">Companies</h1><p className="text-sm text-[#748398] mt-2 mb-7">Choose a company focus and DACE will bias future daily sets toward it.</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{companies.filter(c=>c!=="All").map(c=>{const n=problems.filter(p=>p.companies.includes(c)).length;const done=problems.filter(p=>p.companies.includes(c)&&solved.includes(p.id)).length;return <button key={c} onClick={()=>setCompany(c)} className={`panel rounded-2xl p-5 text-left hover:-translate-y-0.5 transition ${company===c?"border-cyan-300/30 glow-cyan":""}`}><div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-[#151f2c] flex items-center justify-center"><Icon name="company"/></div><Icon name="arrow" size={15}/></div><div className="mt-5 font-semibold">{c}</div><div className="text-xs text-[#748398] mt-1">{done} solved · {n} loaded problems</div></button>})}</div></div>
}

function AnalyticsPage({problems,solved,status,timeSpent,topicStats,streak,totalTime}:{problems:Problem[];solved:number[];status:Record<number,Status>;timeSpent:Record<number,number>;topicStats:Record<string,{solved:number;total:number}>;streak:number;totalTime:number}){
 const avgSolved=solved.length?Math.round(solved.reduce((a,id)=>a+(timeSpent[id]||0),0)/solved.length/60):0;
 const topics=Object.entries(topicStats).sort((a,b)=>(a[1].solved/Math.max(1,a[1].total))-(b[1].solved/Math.max(1,b[1].total)));
 return <div className="max-w-7xl mx-auto p-5 md:p-8"><div className="text-[10px] tracking-[.2em] text-violet-300">PERFORMANCE LAB</div><h1 className="text-3xl md:text-4xl font-black mt-2">Analytics</h1><p className="text-sm text-[#748398] mt-2 mb-7">A factual view of your current practice data. DACE uses this signal for future selection.</p>
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3"><Stat label="Solved" value={String(solved.length)} icon="check"/><Stat label="Streak" value={streak+"d"} icon="flame"/><Stat label="Avg solve" value={avgSolved+"m"} icon="clock"/><Stat label="Tracked" value={Math.floor(totalTime/60)+"m"} icon="activity"/></div>
  <div className="grid lg:grid-cols-2 gap-5 mt-5">
   <div className="panel rounded-2xl p-5"><SectionTitle title="Topic weakness map" icon="analytics"/><div className="mt-5 space-y-4">{topics.slice(0,10).map(([t,v])=>{const pct=Math.round(v.solved/Math.max(1,v.total)*100);return <div key={t}><div className="flex justify-between text-xs mb-2"><span>{t}</span><span className="text-[#718096]">{v.solved}/{v.total} · {pct}%</span></div><div className="h-2 rounded-full bg-[#18212d] overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-400 to-cyan-300 rounded-full transition-all" style={{width:pct+"%"}}/></div></div>})}</div></div>
   <div className="panel rounded-2xl p-5"><SectionTitle title="Difficulty profile" icon="gauge"/><div className="mt-5 space-y-5">{difficulties.map(d=>{const total=problems.filter(p=>p.difficulty===d).length;const done=problems.filter(p=>p.difficulty===d&&solved.includes(p.id)).length;return <div key={d}><div className="flex justify-between text-xs mb-2"><span>{d}</span><span>{done}/{total}</span></div><div className="h-3 rounded-full bg-[#18212d] overflow-hidden"><div className={`h-full rounded-full ${d==="Easy"?"bg-green-400":d==="Medium"?"bg-amber-400":"bg-rose-400"}`} style={{width:Math.min(100,done/Math.max(1,total)*100)+"%"}}/></div></div>})}<div className="mt-7 p-4 rounded-xl bg-[#0b1119] border border-[#202c3c] text-xs text-[#77869a]">Revision queue: <b className="text-white">{Object.values(status).filter(x=>x==="revision").length}</b> problems.</div></div>
  </div>
 </div>
}

function InterviewPage({problems,interviewTime,setInterviewTime,openTimer}:{problems:Problem[];interviewTime:number;setInterviewTime:(n:number)=>void;openTimer:(p:Problem)=>void}){
 const [started,setStarted]=useState(false);
 const [set,setSet]=useState<Problem[]>([]);
 const start=()=>{const pool=shuffle(problems.filter(p=>p.difficulty!=="Easy"),"interview"+Date.now());setSet(pool.slice(0,3));setStarted(true)};
 return <div className="max-w-5xl mx-auto p-5 md:p-8"><div className="text-[10px] tracking-[.2em] text-cyan-200">INTERVIEW MODE</div><h1 className="text-3xl md:text-4xl font-black mt-2">Simulate the pressure.</h1><p className="text-sm text-[#748398] mt-2 mb-7">A distraction-light session with a fixed time box and mixed interview-style problems.</p>
  {!started?<div className="panel rounded-3xl p-6 md:p-9 glow-cyan"><div className="w-14 h-14 rounded-2xl bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center"><Icon name="target" size={25}/></div><h2 className="text-2xl font-bold mt-5">Mock interview</h2><p className="text-sm text-[#77869a] max-w-lg mt-2">Pick a time box. DACE will create a fresh 3-problem set. Use the timer and open each original LeetCode problem.</p><div className="flex gap-2 mt-6">{[45,60,90].map(n=><button key={n} onClick={()=>setInterviewTime(n)} className={`px-4 py-2.5 rounded-xl border text-sm ${interviewTime===n?"border-cyan-300/30 bg-cyan-300/10":"border-[#273447]"}`}>{n} min</button>)}</div><button onClick={start} className="mt-5 px-5 py-3 rounded-xl bg-white text-black font-semibold text-sm">Start interview <ArrowUpRight size={15} className="inline ml-1"/></button></div>:<div><div className="panel rounded-2xl p-5 mb-4 flex items-center"><div><div className="text-xs text-[#718096]">TIME BOX</div><div className="text-3xl font-black">{interviewTime}:00</div></div><button onClick={()=>setStarted(false)} className="ml-auto text-xs text-[#7d8ca1]">End session</button></div><div className="space-y-3">{set.map((p,i)=><DailyCard key={p.id} p={p} index={i} solved={false} status="unsolved" openTimer={()=>openTimer(p)} mark={()=>{}}/>)}</div></div>}
 </div>
}

function SettingsPage({target,setTarget,company,setCompany,companies,exportData,importData,resetAll}:{target:{Easy:number;Medium:number;Hard:number};setTarget:React.Dispatch<React.SetStateAction<{Easy:number;Medium:number;Hard:number}>>;company:string;setCompany:(s:string)=>void;companies:string[];exportData:()=>void;importData:(e:React.ChangeEvent<HTMLInputElement>)=>void;resetAll:()=>void}){
 return <div className="max-w-3xl mx-auto p-5 md:p-8"><div className="text-[10px] tracking-[.2em] text-violet-300">CONTROL ROOM</div><h1 className="text-3xl md:text-4xl font-black mt-2">Settings</h1><p className="text-sm text-[#748398] mt-2 mb-7">Tune the practice system. Everything currently lives in your browser.</p>
  <div className="panel rounded-2xl p-5"><h2 className="font-semibold">Daily target</h2><div className="text-xs text-[#718096] mt-1">Default: 1 Easy + 2 Medium + 2 Hard.</div><div className="mt-5 space-y-3">{difficulties.map(d=><div key={d} className="flex items-center justify-between border-b border-[#1e2835] py-3 last:border-0"><span className={`text-sm ${d==="Easy"?"text-green-300":d==="Medium"?"text-amber-300":"text-rose-300"}`}>{d}</span><input type="number" min={0} max={5} value={target[d]} onChange={e=>setTarget(x=>({...x,[d]:Math.max(0,Math.min(5,Number(e.target.value)||0))}))} className="w-20 bg-[#0a1017] border border-[#273447] rounded-lg px-3 py-2 text-center"/></div>)}</div></div>
  <div className="panel rounded-2xl p-5 mt-4"><h2 className="font-semibold">Company focus</h2><p className="text-xs text-[#718096] mt-1">The adaptive engine can bias future sets toward one company.</p><select value={company} onChange={e=>setCompany(e.target.value)} className="mt-4 bg-[#0a1017] border border-[#273447] rounded-xl px-3 py-2.5 text-sm">{companies.map(c=><option key={c}>{c}</option>)}</select></div>
  <div className="panel rounded-2xl p-5 mt-4"><h2 className="font-semibold">Your data</h2><p className="text-xs text-[#718096] mt-1">Back up your local progress before changing browsers or devices.</p><div className="flex flex-wrap gap-2 mt-4"><button onClick={exportData} className="px-4 py-2.5 rounded-xl border border-[#273447] text-sm flex items-center gap-2"><Icon name="download" size={15}/> Export backup</button><label className="px-4 py-2.5 rounded-xl border border-[#273447] text-sm flex items-center gap-2 cursor-pointer"><Icon name="upload" size={15}/> Import backup<input type="file" accept="application/json" onChange={importData} className="hidden"/></label></div></div>
  <button onClick={resetAll} className="mt-4 text-xs text-rose-300 border border-rose-400/20 rounded-xl px-4 py-2.5 hover:bg-rose-400/5">Reset local progress</button>
 </div>
}

function TimerModal({active,seconds,running,hints,onToggle,onReset,onHint,onClose,onSolved}:{active:Problem;seconds:number;running:boolean;hints:number;onToggle:()=>void;onReset:()=>void;onHint:()=>void;onClose:()=>void;onSolved:()=>void}){
 return <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
  <div className="w-full max-w-xl panel rounded-3xl overflow-hidden shadow-2xl float-in">
   <div className="p-5 border-b border-[#202a38] flex items-start gap-4"><div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-300/15 to-violet-400/15 border border-cyan-300/15 flex items-center justify-center"><Icon name="timer" size={20}/></div><div><div className={`text-[10px] tracking-[.16em] ${active.difficulty==="Hard"?"text-rose-300":active.difficulty==="Medium"?"text-amber-300":"text-green-300"}`}>{active.difficulty} · {active.companies.slice(0,2).join(" · ")}</div><h2 className="text-xl font-bold mt-1">{active.title}</h2><div className="text-xs text-[#718096] mt-1">{active.topics.join(" · ")}</div></div><button onClick={onClose} className="ml-auto p-2 rounded-lg hover:bg-white/5"><Icon name="x" size={17}/></button></div>
   <div className="p-8 md:p-10 text-center"><div className="text-[10px] tracking-[.2em] text-[#627188]">FOCUS TIMER</div><div className="font-mono text-6xl md:text-7xl font-semibold tracking-tight mt-2">{fmt(seconds)}</div><div className="text-xs text-[#69788d] mt-2">Expected ~{active.estimate} min · {hints} hint{hints===1?"":"s"} used</div><div className="flex justify-center gap-2 mt-7"><button onClick={onToggle} className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm flex items-center gap-2"><Icon name={running?"clock":"play"} size={15}/>{running?"Pause":"Start"}</button><button onClick={onReset} className="px-5 py-3 rounded-xl border border-[#273447] text-sm">Reset</button><button onClick={onHint} className="px-5 py-3 rounded-xl border border-[#273447] text-sm">+ Hint</button></div></div>
   <div className="p-4 border-t border-[#202a38] flex gap-2"><a href={active.url} target="_blank" rel="noreferrer" className="flex-1 px-3 py-3 rounded-xl bg-gradient-to-r from-cyan-200 to-violet-300 text-black text-center text-sm font-bold">Open on LeetCode <ArrowUpRight size={14} className="inline"/></a><button onClick={onSolved} className="px-4 py-3 rounded-xl border border-green-400/20 text-green-300 text-sm flex items-center gap-2"><Check size={15}/> Solved</button></div>
  </div>
 </div>
}

function SectionTitle({title,icon,action,onClick}:{title:string;icon:string;action?:string;onClick?:()=>void}){
 return <div className="flex items-center gap-2"><Icon name={icon} size={15}/><h2 className="text-sm font-semibold">{title}</h2>{action&&<button onClick={onClick} className="ml-auto text-[11px] text-[#8190a5] hover:text-white flex items-center gap-1">{action}<ChevronRight size={13}/></button>}</div>
}
function MiniMetric({label,value,sub}:{label:string;value:string;sub:string}){return <div className="panel rounded-xl p-4"><div className="text-[10px] tracking-[.14em] text-[#64748a]">{label.toUpperCase()}</div><div className="text-2xl font-black mt-2">{value}</div><div className="text-[10px] text-[#68778c] mt-1">{sub}</div></div>}
function Stat({label,value,icon}:{label:string;value:string;icon:string}){return <div className="panel rounded-2xl p-4"><div className="flex items-center justify-between"><span className="text-xs text-[#77869a]">{label}</span><Icon name={icon} size={15}/></div><div className="text-2xl font-black mt-2">{value}</div></div>}
function FeatureCard({icon,title,text}:{icon:string;title:string;text:string}){return <div className="panel rounded-2xl p-5"><div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"><Icon name={icon}/></div><div className="font-semibold text-sm mt-4">{title}</div><div className="text-xs text-[#718096] leading-5 mt-1">{text}</div></div>}
