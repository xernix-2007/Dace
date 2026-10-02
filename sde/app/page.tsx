"use client";

import problemsData from "../data/problems.json";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity, ArrowUpRight, BarChart3, BookOpen, BriefcaseBusiness, CalendarDays,
  Check, CheckCircle2, ChevronRight, CircleHelp, Clock3, Code2, Download,
  Flame, Gauge, GitBranch, GraduationCap, LayoutDashboard, ListChecks, Menu,
  Play, RotateCcw, Search, Settings, ShieldCheck, Sparkles, Target, Timer,
  Trophy, Upload, UserRound, X, Zap
} from "lucide-react";

type Difficulty="Easy"|"Medium"|"Hard";
type Status="unsolved"|"solved"|"revision"|"failed";
type View="overview"|"today"|"history"|"problems"|"companies"|"analytics"|"interview"|"prep"|"backend"|"knowledge"|"core"|"dbms"|"os"|"cn"|"oop"|"sql"|"dsa"|"settings";
type Problem={
 id:number; title:string; difficulty:Difficulty; topics:string[]; companies:string[];
 url:string; estimate:number; leetcodeNumber?:number|null; frequency?:number; companyFrequency?:Record<string,number>;
};

const problems:Problem[] = problemsData as Problem[];
const difficulties:Difficulty[]=["Easy","Medium","Hard"];
const companyCounts=Array.from(new Set(problems.flatMap(p=>p.companies))).map(name=>({name,count:problems.filter(p=>p.companies.includes(name)).length})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
const companies=["All",...companyCounts.map(x=>x.name)];
const topicFamilies=["All","Arrays","Strings","Hashing","Sorting","Binary Search","Two Pointers","Sliding Window","Prefix Sum","Linked List","Stack / Queue","Heap","Trees","Trie","Graphs","Backtracking","Dynamic Programming","Greedy","Intervals","Bit Manipulation","Union Find","Recursion","Math"];
const topicList=topicFamilies;
const DEV_DAILY=["Web request lifecycle","HTTP methods","Status codes and headers","JSON, URLs and parameters","Cookies, sessions and CORS","REST API design","Git basics","Commits and history","Branches","Merge and conflicts","Pull requests","Project hygiene","FastAPI setup and routes","Request bodies","Path/query parameters","Pydantic validation","Response models","CRUD endpoints","Routers","Dependencies","Configuration and .env","Errors and middleware","async/await","Relational database model","SELECT and WHERE","INSERT/UPDATE/DELETE","ORDER BY","GROUP BY/HAVING","INNER JOIN","LEFT JOIN","Subqueries","CTEs","Keys and constraints","Relationships","Normalization","Indexes","Transactions and ACID","SQLAlchemy ORM","Engine and sessions","Models","CRUD with SQLAlchemy","Relationships and queries","Transactions","Alembic migrations","Authentication vs authorization","Password hashing","JWT","Access tokens","Refresh tokens","Protected routes","Current user and roles","Pagination","Filtering","Search","Sorting and API versioning","pytest setup","Assertions and fixtures","Unit tests","API tests","Integration tests","Auth and edge cases","Redis basics","Keys and TTL","Cache-aside","FastAPI + Redis","Invalidation and rate limiting","Queues and workers","Celery setup","Redis broker","Retries and failures","Scheduled jobs","Linux CLI","Files and processes","Permissions and SSH","Docker concepts","Dockerfile","Images and containers","Volumes and networks","Docker Compose","CI/CD concepts","GitHub Actions","Secrets","Build/test pipeline","Deployment and health checks","Logs and rollback"];
type DailyCommitmentStatus="done"|"not-done";

function topicFamily(p:Problem){
 const t=p.topics.map(x=>x.toLowerCase());
 if(t.some(x=>x.includes("trie")))return "Trie";
 if(t.some(x=>x.includes("backtracking")))return "Backtracking";
 if(t.some(x=>x.includes("dynamic programming")||x==="memoization"||x.includes("knapsack")))return "Dynamic Programming";
 if(t.some(x=>x.includes("sliding window")))return "Sliding Window";
 if(t.some(x=>x.includes("two pointers")))return "Two Pointers";
 if(t.some(x=>x.includes("prefix sum")||x.includes("prefix")))return "Prefix Sum";
 if(t.some(x=>x.includes("binary search")))return "Binary Search";
 if(t.some(x=>x.includes("sorting")||x.includes("sort")))return "Sorting";
 if(t.some(x=>x.includes("greedy")))return "Greedy";
 if(t.some(x=>x.includes("heap")||x.includes("priority queue")))return "Heap";
 if(t.some(x=>x==="stack"||x.includes("monotonic stack")||x==="queue"||x.includes("monotonic queue")))return "Stack / Queue";
 if(t.some(x=>x.includes("linked list")))return "Linked List";
 if(t.some(x=>x.includes("tree")||x.includes("binary tree")||x.includes("lowest common ancestor")))return "Trees";
 if(t.some(x=>x.includes("graph")||x.includes("shortest path")||x.includes("topological")||x.includes("dijkstra")||x.includes("bipartite")||x.includes("minimum spanning")))return "Graphs";
 if(t.some(x=>x.includes("hash")))return "Hashing";
 if(t.some(x=>x.includes("array")||x.includes("matrix")))return "Arrays";
 if(t.some(x=>x.includes("string")))return "Strings";
 if(t.some(x=>x.includes("bit manipulation")||x.includes("bitwise")))return "Bit Manipulation";
 if(t.some(x=>x.includes("union-find")||x.includes("disjoint set")))return "Union Find";
 if(t.some(x=>x.includes("recursion")))return "Recursion";
 if(t.some(x=>x.includes("math")))return "Math";
 return "Arrays";
}
function matchesTopic(p:Problem,selected:string){
 return selected==="All"||p.topics.includes(selected)||topicFamily(p)===selected;
}

function dateKey(date=new Date()){return date.toLocaleDateString("en-CA");}
function hashSeed(s:string){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function shuffle<T>(items:T[],seed:string){const a=[...items];let x=hashSeed(seed);for(let i=a.length-1;i>0;i--){x=(Math.imul(x,1664525)+1013904223)>>>0;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function fmt(sec:number){return `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`}
function diffClass(d:Difficulty){return d==="Easy"?"diff-easy":d==="Medium"?"diff-medium":"diff-hard"}

function Icon({name,size=17}:{name:string;size?:number}){
 const common={size,strokeWidth:1.8};
 const icons:any={dashboard:LayoutDashboard,calendar:CalendarDays,list:ListChecks,company:BriefcaseBusiness,analytics:BarChart3,interview:Target,settings:Settings,search:Search,clock:Clock3,play:Play,check:Check,code:Code2,spark:Sparkles,flame:Flame,trophy:Trophy,book:BookOpen,github:GitBranch,upload:Upload,download:Download,menu:Menu,x:X,arrow:ArrowUpRight,reset:RotateCcw,gauge:Gauge,shield:ShieldCheck,user:UserRound,help:CircleHelp,zap:Zap,activity:Activity,timer:Timer};
 const C=icons[name]||Code2;return <C {...common}/>;
}

const QUESTION_SECTIONS = [
 {id:"oct",label:"October · Q1–300",start:1,end:300},
 {id:"nov",label:"November · Q301–600",start:301,end:600},
 {id:"dec",label:"December · Q601–900",start:601,end:900},
 {id:"jan",label:"January · Q901–1200",start:901,end:1200},
 {id:"feb",label:"February · Q1201–1500",start:1201,end:1500},
 {id:"mar",label:"March · Q1501–1800",start:1501,end:1800},
 {id:"apr",label:"April · Q1801–2100",start:1801,end:2100},
 {id:"may",label:"May · Q2101–2400",start:2101,end:2400},
 {id:"jun",label:"June · Q2401–2700",start:2401,end:2700},
 {id:"jul",label:"July · Q2701–2781",start:2701,end:2781}
] as const;

function inQuestionSection(p:Problem,sectionId:string){
 const section=QUESTION_SECTIONS.find(s=>s.id===sectionId);
 if(!section)return true;
 const n=p.leetcodeNumber??0;
 return n>=section.start&&n<=section.end;
}
const DSA_CURRICULUM = [
 "Arrays","Strings","Hashing","Sorting","Binary Search","Two Pointers","Sliding Window","Linked List","Stack / Queue","Trees","Heap","Recursion","Backtracking","Greedy","Graphs","Dynamic Programming","Trie","Bit Manipulation","Intervals","Union Find","Math"
];

function striverYoutubeUrl(p:Problem){
 return "https://www.youtube.com/results?search_query="+encodeURIComponent("Striver "+p.title+" solution");
}

function curriculumIndexForSolved(solvedCount:number){
 return Math.min(DSA_CURRICULUM.length-1,Math.floor(solvedCount/12));
}

function curriculumEligible(p:Problem,solvedCount:number){
 const family=topicFamily(p);
 const stage=curriculumIndexForSolved(solvedCount);
 const allowed=new Set(DSA_CURRICULUM.slice(0,Math.min(DSA_CURRICULUM.length,stage+2)));
 if(!allowed.has(family))return false;
 if(p.difficulty==="Hard")return false;
 if(!p.leetcodeNumber)return false;
 return true;
}

function familySolvedCount(family:string,solved:number[]){
 return solved.filter(id=>{
  const p=problems.find(x=>x.id===id);
  return p?topicFamily(p)===family:false;
 }).length;
}
export default function Home(){
 const [view,setView]=useState<View>("overview");
 const [mobileOpen,setMobileOpen]=useState(false);
 const [coreOpen,setCoreOpen]=useState(false);
 const [company,setCompany]=useState("All");
 const [target,setTarget]=useState({Easy:3,Medium:2,Hard:0});
 const [questionSection,setQuestionSection]=useState("oct");
 const [solved,setSolved]=useState<number[]>([]);
 const [solvedAt,setSolvedAt]=useState<Record<number,string>>({});
 const [status,setStatus]=useState<Record<number,Status>>({});
 const [daily,setDaily]=useState<Record<string,number[]>>({});
 const [timeSpent,setTimeSpent]=useState<Record<number,number>>({});
 const [attempts,setAttempts]=useState<Record<number,number>>({});
 const [hints,setHints]=useState<Record<number,number>>({});
 const [active,setActive]=useState<Problem|null>(null);
 const [seconds,setSeconds]=useState(0);
 const [running,setRunning]=useState(false);
 const timerStartedAt=useRef<number|null>(null);
 const timerBaseSeconds=useRef(0);
 const [search,setSearch]=useState("");
 const [difficulty,setDifficulty]=useState<"All"|Difficulty>("All");
 const [topic,setTopic]=useState("All");
 const [interviewTime,setInterviewTime]=useState(45);
 const [prepDays,setPrepDays]=useState(14);
 const [prepCompany,setPrepCompany]=useState("Amazon");
 const [hydrated,setHydrated]=useState(false);
 const [historyDate,setHistoryDate]=useState<string|null>(null);
 const [todayKey,setTodayKey]=useState("");
 const [dailyCommitment,setDailyCommitment]=useState<Record<string,DailyCommitmentStatus>>({});
 const [devDay,setDevDay]=useState(1);
 useEffect(()=>{
  const syncDay=()=>setTodayKey(dateKey());
  syncDay();
  const id=window.setInterval(syncDay,60000);
  return()=>window.clearInterval(id);
 },[]);
 function updateTarget(next:React.SetStateAction<{Easy:number;Medium:number;Hard:number}>){
  setTarget(next);
  if(hydrated){setDaily({});localStorage.removeItem("dace-daily");}
 }
 function updateCompany(next:string){
  setCompany(next);
  if(hydrated){setDaily({});localStorage.removeItem("dace-daily");}
 }

 useEffect(()=>{
  try{
   const load=(k:string)=>localStorage.getItem(k);
   if(load("dace-solved"))setSolved(JSON.parse(load("dace-solved")!));
   if(load("dace-solved-at"))setSolvedAt(JSON.parse(load("dace-solved-at")!));
   if(load("dace-status"))setStatus(JSON.parse(load("dace-status")!));
   if(load("dace-daily"))setDaily(JSON.parse(load("dace-daily")!));
   if(load("dace-time"))setTimeSpent(JSON.parse(load("dace-time")!));
   if(load("dace-attempts"))setAttempts(JSON.parse(load("dace-attempts")!));
   if(load("dace-hints"))setHints(JSON.parse(load("dace-hints")!));
   if(load("dace-target"))setTarget(JSON.parse(load("dace-target")!));
   if(load("dace-company"))setCompany(load("dace-company")!);
   if(load("dace-daily-commitment"))setDailyCommitment(JSON.parse(load("dace-daily-commitment")!));
   if(load("dace-dev-day"))setDevDay(Math.max(1,Math.min(DEV_DAILY.length,Number(load("dace-dev-day"))||1)));
  }catch{} finally { setHydrated(true); }
 },[]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-solved",JSON.stringify(solved))},[solved,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-solved-at",JSON.stringify(solvedAt))},[solvedAt,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-status",JSON.stringify(status))},[status,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-daily",JSON.stringify(daily))},[daily,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-time",JSON.stringify(timeSpent))},[timeSpent,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-attempts",JSON.stringify(attempts))},[attempts,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-hints",JSON.stringify(hints))},[hints,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-target",JSON.stringify(target))},[target,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-company",company)},[company,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-daily-commitment",JSON.stringify(dailyCommitment))},[dailyCommitment,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("dace-dev-day",String(devDay))},[devDay,hydrated]);
 useEffect(()=>{
  if(!running)return;
  const tick=()=>{
   const started=timerStartedAt.current;
   if(started===null)return;
   setSeconds(timerBaseSeconds.current+Math.floor((Date.now()-started)/1000));
  };
  tick();
  const t=setInterval(tick,250);
  return()=>clearInterval(t);
 },[running]);
 useEffect(()=>{if(view==="backend"){window.location.href="/backend";return;}const routes:Record<string,string>={dbms:"DBMS",os:"OS",cn:"CN",oop:"OOP",sql:"SQL",dsa:"DSA%20Fundamentals"};if(routes[view])window.location.href="/knowledge?subject="+routes[view]},[view]);

 const topicStats=useMemo(()=>{
  const all:Record<string,{solved:number;total:number}>= {};
  for(const p of problems)for(const t of p.topics){all[t]??={solved:0,total:0};all[t].total++;if(solved.includes(p.id))all[t].solved++}
  return all;
 },[solved]);

 const recentIds=useMemo(()=>{
  if(!todayKey)return new Set<number>();
  const ids:number[]=[];
  const base=new Date(todayKey+"T00:00:00");
  for(let i=1;i<=14;i++){const d=new Date(base);d.setDate(d.getDate()-i);ids.push(...(daily[dateKey(d)]||[]))}
  return new Set(ids);
 },[daily,todayKey]);

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
  if(!hydrated||!todayKey)return [];
  if(daily[todayKey])return daily[todayKey];

  const totalTarget=target.Easy+target.Medium+target.Hard;
  const stage=curriculumIndexForSolved(solved.length);
  const currentFamily=DSA_CURRICULUM[stage];
  const nextFamily=DSA_CURRICULUM[Math.min(stage+1,DSA_CURRICULUM.length-1)];

  const available=problems.filter(p=>
    !solved.includes(p.id) &&
    (company==="All"||p.companies.includes(company)) &&
    inQuestionSection(p,questionSection) &&
    curriculumEligible(p,solved.length)
  );
  if(!available.length)return [];

  const focusedFamilies=new Set([currentFamily,nextFamily]);
  let pool=available.filter(p=>focusedFamilies.has(topicFamily(p)));
  if(pool.length<totalTarget)pool=available.filter(p=>topicFamily(p)===currentFamily);
  if(pool.length<totalTarget)pool=available;

  const currentSolved=familySolvedCount(currentFamily,solved);
  const allowMedium=currentSolved>=5 || (stage===0 && solved.length>=10);

  const easy=pool.filter(p=>p.difficulty==="Easy");
  const medium=pool.filter(p=>p.difficulty==="Medium");

  const rank=(p:Problem,seed:string)=>{
    const family=topicFamily(p);
    const familyDistance=family===currentFamily?4:family===nextFamily?1:0;
    const difficultyFit=p.difficulty==="Easy"?(allowMedium?2:5):(allowMedium?3:-8);
    const weak=p.topics.reduce((best,t)=>Math.max(best,1-(topicStats[t]?.solved||0)/Math.max(1,topicStats[t]?.total||1)),.25);
    const revision=status[p.id]==="revision"?2:0;
    const failed=status[p.id]==="failed"?1.5:0;
    const fresh=recentIds.has(p.id)?-4:1;
    const jitter=(hashSeed(seed+p.id)*0.000001)%1;
    return familyDistance+difficultyFit+weak*3+revision+failed+fresh+jitter;
  };

  const choose=(candidates:Problem[],count:number,seed:string)=>{
    const remaining=[...candidates];
    const chosen:Problem[]=[];
    while(chosen.length<count&&remaining.length){
      remaining.sort((a,b)=>rank(b,seed+chosen.length)-rank(a,seed+chosen.length));
      const top=remaining.slice(0,Math.min(8,remaining.length));
      const pick=shuffle(top,todayKey+seed+chosen.length)[0];
      chosen.push(pick);
      remaining.splice(remaining.indexOf(pick),1);
    }
    return chosen;
  };

  const selected:Problem[]=[];
  const used=new Set<number>();

  for(const p of choose(easy,Math.min(target.Easy,easy.length),"foundation")){
    if(!used.has(p.id)){selected.push(p);used.add(p.id);}
  }

  if(allowMedium&&selected.length<totalTarget){
    for(const p of choose(medium,Math.min(target.Medium,totalTarget-selected.length),"core")){
      if(!used.has(p.id)){selected.push(p);used.add(p.id);}
    }
  }

  if(selected.length<totalTarget){
    for(const p of choose(easy.filter(x=>!used.has(x.id)),totalTarget-selected.length,"reinforce")){
      if(!used.has(p.id)){selected.push(p);used.add(p.id);}
    }
  }

  return selected.slice(0,totalTarget).map(p=>p.id);
 },[daily,todayKey,solved,company,target,questionSection,topicStats,recentIds,hydrated]);
 useEffect(()=>{
  if(!hydrated||!todayKey||daily[todayKey])return;
  const ids=todayIds;
  setDaily(x=>x[todayKey]?x:{...x,[todayKey]:ids});
 },[hydrated,todayKey,daily,todayIds]);

 const today=todayIds.map(id=>problems.find(p=>p.id===id)).filter(Boolean) as Problem[];
 const solvedToday=today.filter(p=>solved.includes(p.id)).length;
 const totalTime=Object.values(timeSpent).reduce((a,b)=>a+b,0);
 const totalSolved=solved.length;
 const completion=Math.round(totalSolved/problems.length*100);
 const solvedDateSet=useMemo(()=>new Set(Object.values(solvedAt)),[solvedAt]);
 const streak=useMemo(()=>{
  if(!todayKey)return 0;
  let n=0;
  const base=new Date(todayKey+"T00:00:00");
  for(let i=0;i<365;i++){const d=new Date(base);d.setDate(d.getDate()-i);if(!solvedDateSet.has(dateKey(d)))break;n++}
  return n;
 },[solvedDateSet,todayKey]);

 const filtered=useMemo(()=>problems.filter(p=>
  (difficulty==="All"||p.difficulty===difficulty)&&
  matchesTopic(p,topic)&&
  p.title.toLowerCase().includes(search.toLowerCase())
 ),[difficulty,topic,search]);

 const weeklySolved=useMemo(()=>{
  if(!todayKey)return 0;
  let n=0;
  const base=new Date(todayKey+"T00:00:00");
  for(let i=0;i<7;i++){const d=new Date(base);d.setDate(d.getDate()-i);const k=dateKey(d);n+=Object.values(solvedAt).filter(v=>v===k).length}
  return n;
 },[solvedAt,todayKey]);

 function setDevDone(s:DailyCommitmentStatus){if(!todayKey)return;const key=todayKey+"-dev";const wasDone=dailyCommitment[key]==="done";setDailyCommitment(x=>({...x,[key]:s}));if(s==="done"&&!wasDone)setDevDay(d=>Math.min(DEV_DAILY.length,d+1))}
 function regenerateToday(){
  if(!todayKey)return;
  setDaily(x=>{const y={...x};delete y[todayKey];return y});
 }
 function mark(p:Problem,s:Status){
  setStatus(x=>({...x,[p.id]:s}));
  if(s==="solved"){
   setSolved(x=>x.includes(p.id)?x:[...x,p.id]);
   setSolvedAt(x=>({...x,[p.id]:dateKey()}));
  }else{
   setSolved(x=>x.filter(id=>id!==p.id));
   setSolvedAt(x=>{const y={...x};delete y[p.id];return y});
  }
 }
 function openTimer(p:Problem){
  timerStartedAt.current=null;
  timerBaseSeconds.current=0;
  setActive(p);setSeconds(0);setRunning(false);
  setAttempts(x=>({...x,[p.id]:(x[p.id]||0)+1}));
 }
 function toggleTimer(){
  if(running){
   const started=timerStartedAt.current;
   if(started!==null)setSeconds(timerBaseSeconds.current+Math.floor((Date.now()-started)/1000));
   timerStartedAt.current=null;
   setRunning(false);
  }else{
   timerBaseSeconds.current=seconds;
   timerStartedAt.current=Date.now();
   setRunning(true);
  }
 }
 function resetTimer(){
  timerStartedAt.current=null;
  timerBaseSeconds.current=0;
  setRunning(false);
  setSeconds(0);
 }
 function getTimerSeconds(){
  const started=timerStartedAt.current;
  return started===null?seconds:timerBaseSeconds.current+Math.floor((Date.now()-started)/1000);
 }
 function closeTimer(save=true){
  if(!active)return;
  const elapsed=getTimerSeconds();
  if(save&&elapsed>0)setTimeSpent(x=>({...x,[active.id]:(x[active.id]||0)+elapsed}));
  timerStartedAt.current=null;
  timerBaseSeconds.current=0;
  setRunning(false);setActive(null);setSeconds(0);
 }
 function exportData(){
  const blob=new Blob([JSON.stringify({version:2,solved,solvedAt,status,daily,timeSpent,attempts,hints,target,company,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="dace-progress.json";a.click();URL.revokeObjectURL(url);
 }
 function importData(e:React.ChangeEvent<HTMLInputElement>){
  const input=e.currentTarget;
  const file=input.files?.[0];if(!file)return;
  const r=new FileReader();
  r.onload=()=>{
   try{
    const d=JSON.parse(String(r.result));
    if(Array.isArray(d.solved))setSolved(d.solved);
    if(d.solvedAt&&typeof d.solvedAt==="object")setSolvedAt(d.solvedAt);
    if(d.status&&typeof d.status==="object")setStatus(d.status);
    if(d.daily&&typeof d.daily==="object")setDaily(d.daily);
    if(d.timeSpent&&typeof d.timeSpent==="object")setTimeSpent(d.timeSpent);
    if(d.attempts&&typeof d.attempts==="object")setAttempts(d.attempts);
    if(d.hints&&typeof d.hints==="object")setHints(d.hints);
    if(d.target&&typeof d.target==="object")setTarget(d.target);
    if(typeof d.questionSection==="string")setQuestionSection(d.questionSection);
    if(typeof d.company==="string")setCompany(d.company);
   }catch{alert("Invalid DACE backup file.");}
   finally{input.value="";}
  };
  r.readAsText(file);
 }
 function resetAll(){
  if(!confirm("Reset all DACE local progress? This cannot be undone unless you have exported a backup."))return;
  ["dace-solved","dace-solved-at","dace-status","dace-daily","dace-time","dace-attempts","dace-hints","dace-target","dace-company","dace-lessons"].forEach(k=>localStorage.removeItem(k));
  location.reload();
 }

 const nav=[
  ["overview","Overview","dashboard"],["today","Today","calendar"],["history","Question History","calendar"],["problems","Problems","list"],
  ["companies","Companies","company"],["analytics","Analytics","analytics"],["interview","Interview","interview"],["prep","Prep Plan","target"],["backend","Backend / SDE","code"],["knowledge","Study Centre","book"],["core","Core CS","book"],["dsa","DSA Fundamentals","zap"],["settings","Settings","settings"]
 ] as [View,string,string][];
 const coreSubjects:[View,string,string,string][]=[
  ["dbms","DBMS","database","DBMS"],["os","Operating Systems","settings","OS"],["cn","Computer Networks","github","CN"],["oop","OOP","code","OOP"],["sql","SQL","list","SQL"]
 ];

 return <main className="min-h-screen dace-grid">
  <div className="cosmic-bg cosmic-nebula" aria-hidden="true"/><div className="cosmic-bg cosmic-planet planet-a" aria-hidden="true"/><div className="cosmic-bg cosmic-planet planet-b" aria-hidden="true"/><div className="cosmic-bg cosmic-planet planet-c" aria-hidden="true"/><div className="cosmic-bg cosmic-galaxy galaxy-one" aria-hidden="true"/><div className="cosmic-bg cosmic-galaxy galaxy-two" aria-hidden="true"/><div className="cosmic-bg cosmic-wormhole" aria-hidden="true"/><div className="cosmic-bg cosmic-constellation" aria-hidden="true"/><div className="cosmic-bg cosmic-orbit orbit-one" aria-hidden="true"/><div className="cosmic-bg cosmic-orbit orbit-two" aria-hidden="true"/><div className="cosmic-bg cosmic-spark" aria-hidden="true"/><div className="cosmic-bg cosmic-spark two" aria-hidden="true"/>
  <header className="h-16 border-b border-[#202a38] sticky top-0 z-40 glass flex items-center px-4 md:px-6 gap-3">
   <button className="md:hidden p-2 rounded-lg hover:bg-white/5" onClick={()=>setMobileOpen(!mobileOpen)}><Icon name="menu"/></button>
   <button onClick={()=>setView("overview")} className="flex items-center gap-2.5 group" title="DACE — Daily Adaptive Coding">
    <span className="dace-brand-mark w-9 h-9 rounded-xl overflow-hidden border border-violet-300/20 bg-[#080b14] shadow-[0_0_24px_rgba(124,58,237,.18)] group-hover:shadow-[0_0_30px_rgba(34,211,238,.25)] transition">
      <img src="/dace-logo.svg?v=2" alt="DACE orbital logo" className="w-full h-full object-cover"/>
    </span>
    <span className="font-black tracking-[-.04em] text-lg bg-gradient-to-r from-cyan-200 via-violet-200 to-fuchsia-200 text-transparent bg-clip-text">DACE</span>
   </button>
   <span className="hidden sm:block text-[10px] tracking-[.2em] text-[#637187]">DAILY ADAPTIVE CODING</span>
   <div className="ml-auto flex items-center gap-3">
    <div className="hidden sm:flex items-center gap-2 text-xs text-[#9aa8ba]"><span className="w-2 h-2 rounded-full bg-pink-400 pulse-dot"/>LOCAL MODE</div>
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#263346] bg-[#0b1017] text-xs"><Icon name="flame" size={14}/><span>{streak}</span></div>
    <div className="w-8 h-8 rounded-full border border-[#334155] bg-[#141c28] flex items-center justify-center"><Icon name="user" size={15}/></div>
   </div>
  </header>

  {mobileOpen&&<div className="fixed inset-0 z-50 md:hidden"><div className="absolute inset-0 bg-black/60" onClick={()=>setMobileOpen(false)}/><aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0a0f16] border-r border-[#202a38] p-4 float-in">{nav.map(([k,l,i])=>k==="core"?<div key={k}><NavButton active={coreSubjects.some(([s])=>view===s)} label={l} icon={i} onClick={()=>setCoreOpen(v=>!v)}/>{coreOpen&&<div className="ml-3 mt-1 mb-2 pl-3 border-l border-cyan-300/15">{coreSubjects.map(([s,label,icon,subject])=><NavButton key={s} active={view===s} label={label} icon={icon} onClick={()=>{window.location.href="/knowledge?subject="+subject;setMobileOpen(false)}}/> )}</div>}</div>:<NavButton key={k} active={view===k} label={l} icon={i} onClick={()=>{if(k==="knowledge"){window.location.href="/knowledge";return;}if(k==="backend"){window.location.href="/backend";return;}if(k==="dsa"){window.location.href="/knowledge?subject=DSA%20Fundamentals";return;}setView(k);setMobileOpen(false)}}/>)}</aside></div>}

  <div className="flex min-h-[calc(100vh-64px)]">
   <aside className="hidden sm:block w-60 border-r border-[#202a38] p-4 shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
    <div className="text-[10px] tracking-[.2em] text-[#59687c] px-3 py-3">WORKSPACE</div>
    {nav.map(([k,l,i])=>k==="core"?<div key={k}><NavButton active={coreSubjects.some(([s])=>view===s)} label={l} icon={i} onClick={()=>setCoreOpen(v=>!v)}/>{coreOpen&&<div className="ml-3 mt-1 mb-2 pl-3 border-l border-cyan-300/15">{coreSubjects.map(([s,label,icon,subject])=><NavButton key={s} active={view===s} label={label} icon={icon} onClick={()=>{window.location.href="/knowledge?subject="+subject}}/> )}</div>}</div>:<NavButton key={k} active={view===k} label={l} icon={i} onClick={()=>{if(k==="knowledge"){window.location.href="/knowledge";return;}if(k==="backend"){window.location.href="/backend";return;}if(k==="dsa"){window.location.href="/knowledge?subject=DSA%20Fundamentals";return;}setView(k)}}/>)}
    <div className="mt-7 panel rounded-xl p-4 glow-cyan">
     <div className="flex items-center gap-2 text-xs font-semibold"><Icon name="spark" size={14}/> Adaptive engine</div>
     <p className="text-[11px] leading-5 text-[#77869a] mt-2">Selection weighs weakness, revisions, freshness and company preference.</p>
    </div>
    <div className="mt-4 px-3 text-[10px] tracking-[.18em] text-[#59687c]">DAILY TARGET</div>
    <div className="px-3 mt-2 text-xs text-[#9aa8ba]">{target.Easy}E · {target.Medium}M · {target.Hard}H</div>
   </aside>

   <section className="flex-1 min-w-0">
    {view==="overview"&&<Overview today={today} solvedToday={solvedToday} streak={streak} weeklySolved={weeklySolved} completion={completion} totalTime={totalTime} solvedAt={solvedAt} setView={setView} setHistoryDate={setHistoryDate} openTimer={openTimer} devDay={devDay} devTitle={DEV_DAILY[devDay-1]} devState={dailyCommitment[todayKey+"-dev"]} setDevDone={setDevDone}/>}
    {view==="today"&&<TodayPage today={today} solved={solved} status={status} solvedToday={solvedToday} target={target} questionSection={questionSection} questionSections={QUESTION_SECTIONS} setQuestionSection={setQuestionSection} company={company} companies={companies} setCompany={updateCompany} openTimer={openTimer} mark={mark} regenerate={regenerateToday} todayKey={todayKey} devState={dailyCommitment[todayKey+"-dev"]} devDay={devDay} devTitle={DEV_DAILY[devDay-1]} setDevDone={setDevDone}/>}    {view==="history"&&<QuestionHistoryPage daily={daily} solved={solved} status={status} openTimer={openTimer} selectedDate={historyDate} today={today} target={target} company={company}/>}
    {view==="problems"&&<ProblemsPage problems={filtered} solved={solved} questionSection={questionSection} setQuestionSection={setQuestionSection} questionSections={QUESTION_SECTIONS} status={status} search={search} setSearch={setSearch} difficulty={difficulty} setDifficulty={setDifficulty} topic={topic} setTopic={setTopic} openTimer={openTimer} mark={mark}/>}
    {view==="companies"&&<CompaniesPage company={company} companies={companies} setCompany={updateCompany} problems={problems} solved={solved} status={status} openTimer={openTimer} mark={mark}/>}
    {view==="analytics"&&<AnalyticsPage problems={problems} solved={solved} status={status} timeSpent={timeSpent} topicStats={topicStats} streak={streak} totalTime={totalTime}/>}
    {view==="interview"&&<InterviewPage problems={problems} interviewTime={interviewTime} setInterviewTime={setInterviewTime} openTimer={openTimer} mark={mark} attempts={attempts} hints={hints} timeSpent={timeSpent}/>}
    {view==="prep"&&<PrepPage problems={problems} solved={solved} status={status} company={prepCompany} setCompany={setPrepCompany} days={prepDays} setDays={setPrepDays} topicStats={topicStats} openTimer={openTimer}/>}
    {view==="settings"&&<SettingsPage target={target} setTarget={updateTarget} company={company} setCompany={updateCompany} companies={companies} exportData={exportData} importData={importData} resetAll={resetAll}/>}
   </section>
  </div>

  {active&&<TimerModal active={active} seconds={seconds} running={running} hints={hints[active.id]||0} onToggle={toggleTimer} onReset={resetTimer} onHint={()=>setHints(x=>({...x,[active.id]:(x[active.id]||0)+1}))} onClose={()=>closeTimer(true)} onSolved={()=>{mark(active,"solved");closeTimer(true)}}/>}
 </main>;
}

function NavButton({active,label,icon,onClick}:{active:boolean;label:string;icon:string;onClick:()=>void}){
 return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1.5 transition ${active?"bg-gradient-to-r from-cyan-300/10 to-violet-400/10 border border-cyan-300/10 text-white":"text-[#8391a5] hover:text-white hover:bg-white/[.035]"}`}><Icon name={icon} size={17}/><span>{label}</span>{active&&<span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-300"/>}</button>
}

function Overview({today,solvedToday,streak,weeklySolved,completion,totalTime,solvedAt,setView,setHistoryDate,openTimer,devDay,devTitle,devState,setDevDone}:{today:Problem[];solvedToday:number;streak:number;weeklySolved:number;completion:number;totalTime:number;solvedAt:Record<number,string>;setView:(v:View)=>void;setHistoryDate:(d:string)=>void;openTimer:(p:Problem)=>void;devDay:number;devTitle:string;devState?:DailyCommitmentStatus;setDevDone:(s:DailyCommitmentStatus)=>void}){
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

  <div className="mt-5 panel rounded-2xl p-5 border border-cyan-300/10 fade-up-2">
   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex items-start gap-4">
     <div className="w-11 h-11 rounded-xl bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center text-cyan-200 font-black">DEV</div>
     <div><div className="text-[10px] tracking-[.2em] text-cyan-200">BACKEND / SDE · TODAY</div><div className="text-xl font-black mt-1">Day {devDay} · {devTitle}</div><div className="text-xs text-[#718096] mt-1">Learn → practice → build → checkpoint.</div></div>
    </div>
    <div className="flex flex-wrap gap-2">
      <button onClick={()=>setDevDone("done")} className={devState==="done"?"px-4 py-2.5 rounded-xl text-xs font-bold bg-green-300 text-black":"px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-black"}>✓ Done today</button>
      <button onClick={()=>setDevDone("not-done")} className={devState==="not-done"?"px-4 py-2.5 rounded-xl text-xs border border-amber-300/40 bg-amber-300/10 text-amber-200":"px-4 py-2.5 rounded-xl text-xs border border-[#2b384b] text-[#8b98aa]"}>Not done</button>
      <button onClick={()=>setView("backend")} className="px-4 py-2.5 rounded-xl border border-cyan-300/20 text-xs text-cyan-100">Open Dev →</button>
    </div>
   </div>
  </div>

  <CodingCalendar solvedAt={solvedAt} setView={setView} setHistoryDate={setHistoryDate}/>

<div className="mt-5 grid md:grid-cols-3 gap-4">
   <FeatureCard icon="timer" title="Solve with intent" text="Track actual time, expected time, attempts and hints." onClick={()=>setView("today")}/>
   <FeatureCard icon="shield" title="Own your data" text="Local-first progress with export/import backup." onClick={()=>setView("settings")}/>
   <FeatureCard icon="trophy" title="Prepare for interviews" text="Company filters, revision loops and interview mode." onClick={()=>setView("prep")}/>
  </div>
 </div>
}


function CodingCalendar({solvedAt,setView,setHistoryDate}:{solvedAt:Record<number,string>;setView:(v:View)=>void;setHistoryDate:(d:string)=>void}){
 const [year,setYear]=useState<number|null>(null);

 // Read the browser's real local year after hydration so SSR and client output cannot disagree at a year boundary.
 useEffect(()=>{setYear(new Date().getFullYear())},[]);

 if(year===null)return <div className="panel rounded-2xl p-5 mt-5"><div className="text-[10px] tracking-[.2em] text-pink-200">CODING HEATMAP</div><div className="h-7 w-48 rounded-lg bg-white/[.03] mt-2 animate-pulse"/></div>;

 const counts:Record<string,number>={};
 for(const d of Object.values(solvedAt)){
  const y=Number(d.slice(0,4));
  if(y===year)counts[d]=(counts[d]||0)+1;
 }

 const start=new Date(year,0,1);
 const raw:string[]=[];
 // Sunday-first calendar padding keeps the same GitHub-style 7-row week layout.
 for(let i=0;i<start.getDay();i++)raw.push("");
 for(let i=0;i<366;i++){
  const d:Date=new Date(year,0,1);
  d.setDate(i+1);
  if(d.getFullYear()!==year)break;
  raw.push(dateKey(d));
 }
 while(raw.length%7)raw.push("");

 const weeks:string[][]=[];
 for(let i=0;i<raw.length;i+=7)weeks.push(raw.slice(i,i+7));

 const monthLabels=weeks.map(week=>{
  const first=week.find(d=>d&&new Date(d+"T00:00:00").getDate()===1);
  return first?new Date(first+"T00:00:00").toLocaleDateString("en-US",{month:"short"}):"";
 });

 const level=(n:number)=>n===0?"bg-white/[.035] border-white/[.035]":n===1?"bg-fuchsia-500/25 border-fuchsia-400/20":n<=3?"bg-fuchsia-500/55 border-fuchsia-400/30":"bg-fuchsia-400 border-fuchsia-300/60";
 const totalSolved=Object.values(counts).reduce((a,b)=>a+b,0);
 const weekCount=weeks.length;

 return <div className="panel rounded-2xl p-5 mt-5">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
   <div>
    <div className="text-[10px] tracking-[.2em] text-pink-200">CODING HEATMAP</div>
    <h2 className="text-xl font-black mt-1">{year} consistency</h2>
    <div className="text-[10px] text-[#657387] mt-1">{weekCount} weeks · Jan–Dec</div>
   </div>

   <div className="flex items-center gap-1.5 rounded-xl border border-[#273447] bg-[#080d16]/80 p-1">
    <button type="button" onClick={()=>setYear(y=>(y??new Date().getFullYear())-1)} className="w-8 h-8 rounded-lg hover:bg-white/10 text-[#8d9ab2]" aria-label={`Previous year: ${year-1}`}>‹</button>
    <div className="flex items-center gap-0.5 px-1">
     {[year-1,year,year+1].map(y=><button key={y} type="button" onClick={()=>setYear(y)} className={`min-w-14 px-2 py-1.5 rounded-lg text-[11px] transition ${y===year?"bg-violet-500/20 text-violet-200 border border-violet-300/20":"text-[#657387] hover:text-white"}`}>{y}</button>)}
    </div>
    <button type="button" onClick={()=>setYear(y=>(y??new Date().getFullYear())+1)} className="w-8 h-8 rounded-lg hover:bg-white/10 text-[#8d9ab2]" aria-label={`Next year: ${year+1}`}>›</button>
   </div>

   <div className="text-right"><div className="text-2xl font-black">{totalSolved}</div><div className="text-[10px] uppercase tracking-wider text-[#657387]">solved in {year}</div></div>
  </div>

  <div className="mt-5 overflow-x-auto">
   <div className="min-w-[760px]">
    <div className="grid gap-[3px] items-end" style={{gridTemplateColumns:`30px repeat(${weekCount}, 12px)`}}>
     <span/>
     {monthLabels.map((m,i)=><span key={i} className="text-[9px] text-[#657387] h-4 text-center">{m}</span>)}
    </div>

    <div className="grid gap-[3px] mt-1" style={{gridTemplateColumns:`30px repeat(${weekCount}, 12px)`}}>
     <div className="grid grid-rows-7 gap-[3px] text-[9px] text-[#657387] leading-3">
      <span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span>
     </div>
     {weeks.map((week,wi)=><div key={wi} className="grid grid-rows-7 gap-[3px]">
      {week.map((d,di)=>{
       const n=d?(counts[d]||0):0;
       return d?<button key={di} type="button" onClick={()=>{setHistoryDate(d);setView("history")}} title={d+" · "+n+" solved · click to open questions"} aria-label={d+" "+n+" solved; click to open questions"} className={"w-3 h-3 rounded-[3px] border cursor-pointer hover:ring-2 hover:ring-pink-200/50 "+level(n)}/>:<span key={di} className="w-3 h-3 rounded-[3px] border-transparent bg-transparent"/>;
      })}
     </div>)}
    </div>
   </div>
  </div>

  <div className="mt-3 flex justify-between items-center gap-3 text-[10px] text-[#657387]">
   <span>Each column = 1 week · select a year above</span>
   <div className="flex gap-2 items-center"><span>Less</span>{[0,1,2,4].map(n=><span key={n} className={"h-3 w-3 rounded-[3px] border "+level(n)}/>)}<span>More</span></div>
  </div>
 </div>
}

function TodayPage({today,solved,status,solvedToday,target,questionSection,questionSections,setQuestionSection,company,companies,setCompany,openTimer,mark,regenerate,todayKey,devState,devDay,devTitle,setDevDone}:{today:Problem[];solved:number[];status:Record<number,Status>;solvedToday:number;target:{Easy:number;Medium:number;Hard:number};company:string;companies:string[];setCompany:(c:string)=>void;openTimer:(p:Problem)=>void;mark:(p:Problem,s:Status)=>void;regenerate:()=>void;todayKey:string;devState?:DailyCommitmentStatus;devDay:number;devTitle:string;setDevDone:(s:DailyCommitmentStatus)=>void}){
 const totalTarget=target.Easy+target.Medium+target.Hard;
 const completion=totalTarget?Math.round(solvedToday/totalTarget*100):0;
 return <div className="max-w-7xl mx-auto p-5 md:p-8">
  <div className="fade-up grid xl:grid-cols-[1fr_460px] gap-7 items-stretch mb-7">
   <div className="min-h-[330px] rounded-[30px] report-card relative overflow-hidden p-7 md:p-9 flex flex-col justify-between">
    <div className="report-orb w-64 h-48 -right-10 -top-10 opacity-90"/><div className="report-orb two w-52 h-32 -left-16 bottom-2 opacity-80"/>
    <div className="relative z-10 flex items-center justify-between"><div><div className="text-[10px] tracking-[.24em] text-pink-200">DACE / DAILY CHAPTER</div><div className="text-xs text-[#778398] mt-2">{dateKey()} · adaptive set</div></div><button onClick={regenerate} className="p-2.5 rounded-xl border border-white/10 bg-black/20 hover:bg-white/10" title="Regenerate"><Icon name="reset" size={15}/></button></div>
    <div className="relative z-10"><h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[.92]">Today's<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-fuchsia-300 to-violet-300">Problems.</span></h1><p className="text-sm text-[#9aa5b5] mt-5 max-w-xl">Your daily target follows the Easy / Medium / Hard mix you set in Settings.</p></div>
    <div className="relative z-10 grid grid-cols-3 gap-3 mt-7"><MiniMetric label="Complete" value={`${solvedToday}/${totalTarget}`} sub={`${completion}% today`}/><MiniMetric label="Target" value={`${target.Easy}E · ${target.Medium}M · ${target.Hard}H`} sub="daily mix"/><MiniMetric label="Focus" value={company==="All"?"All":company} sub="company bias"/></div><div className="relative z-10 mt-4"><label className="text-[10px] tracking-[.16em] text-[#68778c]">QUESTION BLOCK</label><select value={questionSection} onChange={e=>setQuestionSection(e.target.value)} className="mt-2 bg-[#0b1119]/80 border border-[#273447] rounded-xl px-3 py-2 text-xs">{questionSections.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
   </div>
   <div className="rounded-[30px] bg-[#0a0d12] border border-white/8 p-6 md:p-7 flex flex-col justify-between">
    <div><div className="text-[10px] tracking-[.24em] text-[#78869a]">CHAPTER INDEX</div><div className="text-2xl font-black mt-3">Today's set</div><p className="text-xs text-[#68778c] mt-2">{target.Easy} Easy · {target.Medium} Medium · {target.Hard} Hard</p></div>
    <div className="space-y-3 my-6">{today.map((p,i)=><div key={p.id} className="flex items-center gap-3"><span className="text-[10px] text-[#5e6b7d] w-5">0{i+1}</span><div className="h-px flex-1 bg-white/10"/><a href={p.url} target="_blank" rel="noreferrer" title="Open this question on LeetCode" className="text-xs truncate max-w-[190px] hover:text-cyan-200 hover:underline underline-offset-4 transition cursor-pointer">{p.leetcodeNumber ? `${p.leetcodeNumber}. ` : ""}{p.title}</a><span className={`text-[10px] ${p.difficulty==="Easy"?"text-emerald-300":p.difficulty==="Medium"?"text-amber-300":"text-pink-300"}`}>{p.difficulty}</span></div>)}</div>
    <select value={company} onChange={e=>{setCompany(e.target.value);regenerate()}} className="w-full bg-[#11151c] border border-white/10 rounded-xl px-3 py-3 text-xs"><option value="All">All companies</option>{companies.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select>
   </div>
  </div>
  <div className="flex items-center justify-between mb-3"><div><div className="text-[10px] tracking-[.22em] text-pink-200">CHAPTERS / 05</div><h2 className="text-xl font-black mt-1">Solve today's set</h2></div><div className="text-xs text-[#657387]">{solvedToday}/{totalTarget} complete</div></div>
  <div className="space-y-3">{today.map((p,i)=><DailyCard key={p.id} p={p} index={i} solved={solved.includes(p.id)} status={status[p.id]||"unsolved"} openTimer={openTimer} mark={mark}/>)}</div>
  {today.length<totalTarget&&<div className="mt-5 panel rounded-xl p-4 text-xs text-amber-300">Not enough problems matched the current company/difficulty filter. DACE is using the available pool.</div>}
 <div className="mt-10 mb-3"><div className="text-[10px] tracking-[.22em] text-cyan-200">CHAPTERS / DEV</div><h2 className="text-xl font-black mt-1">Backend / SDE</h2><p className="text-xs text-[#657387] mt-1">Only Dev uses the Done / Not done carry-forward system.</p></div>
 <div className="panel rounded-2xl p-5 md:p-6 border border-cyan-300/10"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><div className="text-[10px] tracking-widest text-cyan-200">DEV · DAY {devDay} / 84</div><div className="text-2xl font-black mt-2">{devTitle}</div><p className="text-xs text-[#718096] mt-2">Learn → practice → add it to the cumulative backend project.</p></div><a href="/backend" className="px-4 py-2.5 rounded-xl border border-cyan-300/20 text-xs text-cyan-100 whitespace-nowrap">Open Backend track →</a></div><div className="flex gap-2 mt-5"><button onClick={()=>setDevDone("done")} className={devState==="done"?"px-4 py-2.5 rounded-xl text-xs font-bold bg-green-300 text-black":"px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-black"}>✓ Done today</button><button onClick={()=>setDevDone("not-done")} className={devState==="not-done"?"px-4 py-2.5 rounded-xl text-xs border border-amber-300/40 bg-amber-300/10 text-amber-200":"px-4 py-2.5 rounded-xl text-xs border border-[#2b384b] text-[#8b98aa]"}>Not done today</button></div></div> </div>
}
function DailyCard({p,index,solved,status,openTimer,mark}:{p:Problem;index:number;solved:boolean;status:Status;openTimer:(p:Problem)=>void;mark:(p:Problem,s:Status)=>void}){
 return <article className={`report-card rounded-2xl p-4 md:p-5 transition hover:-translate-y-0.5 ${solved?"border-green-400/25":""}`}>
  <div className="flex gap-4 items-center">
   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/15 to-violet-500/15 border border-pink-300/10 flex items-center justify-center text-xs text-[#aab3c0]">{String(index+1).padStart(2,"0")}</div>
   <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><a href={p.url} target="_blank" rel="noreferrer" title="Open this question on LeetCode" className="font-semibold truncate hover:text-cyan-200 hover:underline decoration-cyan-300/40 underline-offset-4 transition">{p.leetcodeNumber ? `${p.leetcodeNumber}. ` : ""}{p.title}</a>{solved&&<CheckCircle2 size={15} className="text-green-400"/>}</div><div className="text-xs text-[#728198] mt-1">{p.topics.slice(0,3).join(" · ")} · {p.companies.slice(0,2).join(" · ")} · ~{p.estimate}m</div></div>
   <span className={`text-[10px] px-2.5 py-1.5 rounded-full border ${diffClass(p.difficulty)}`}>{p.difficulty}</span>
   <button onClick={()=>openTimer(p)} className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white text-xs font-semibold hover:brightness-110"><Icon name="clock" size={14}/> Timer</button>
  </div>
  <div className="mt-3 pt-3 border-t border-white/[.06] flex flex-wrap items-center gap-2">
   <select value={status} onChange={e=>mark(p,e.target.value as Status)} className="bg-[#0b0e13] border border-[#253245] rounded-lg px-2.5 py-2 text-[11px]"><option value="unsolved">Unsolved</option><option value="solved">Solved</option><option value="revision">Need revision</option><option value="failed">Couldn't solve</option></select>
   <a href={striverYoutubeUrl(p)} target="_blank" rel="noreferrer" title="Find Striver's solution on YouTube" className="text-[11px] px-3 py-2 rounded-lg border border-red-400/20 bg-red-400/[.05] text-red-200 hover:bg-red-400/10 hover:border-red-400/35 flex items-center gap-1.5 transition"><svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"/></svg> Striver</a>
   <a href={p.url} target="_blank" rel="noreferrer" className="ml-auto text-[11px] px-3 py-2 rounded-lg border border-cyan-300/20 bg-cyan-300/[.05] text-cyan-100 hover:bg-cyan-300/10 hover:border-cyan-300/35 flex items-center gap-1.5 transition"><Icon name="code" size={12}/> Open on LeetCode <Icon name="arrow" size={12}/></a>
   <button onClick={()=>openTimer(p)} className="sm:hidden text-[11px] px-3 py-2 rounded-lg bg-white text-black font-semibold">Timer</button>
  </div>
 </article>
}
function ProblemsPage({problems,solved,status,search,setSearch,difficulty,setDifficulty,topic,setTopic,questionSection,setQuestionSection,questionSections,openTimer,mark}:{problems:Problem[];solved:number[];status:Record<number,Status>;search:string;setSearch:(s:string)=>void;difficulty:"All"|Difficulty;setDifficulty:(d:"All"|Difficulty)=>void;topic:string;setTopic:(t:string)=>void;questionSection:string;setQuestionSection:(s:string)=>void;questionSections:readonly {id:string;label:string;start:number;end:number}[];openTimer:(p:Problem)=>void;mark:(p:Problem,s:Status)=>void}){
 const [problemCompany,setProblemCompany]=useState("All");
 const [problemStatus,setProblemStatus]=useState<"All"|Status>("All");
 const [problemSort,setProblemSort]=useState<"number"|"title"|"difficulty"|"frequency">("number");
 const statusFor=(p:Problem):Status=>status[p.id]||"unsolved";
 const filteredProblems=useMemo(()=>{
  const result=problems.filter(p=>
   (difficulty==="All"||p.difficulty===difficulty)&&
   matchesTopic(p,topic)&&
   (problemCompany==="All"||p.companies.includes(problemCompany))&&
   (problemStatus==="All"||statusFor(p)===problemStatus)&&
   inQuestionSection(p,questionSection)&&
   p.title.toLowerCase().includes(search.toLowerCase().trim())
  );
  return [...result].sort((a,b)=>{
   if(problemSort==="title")return a.title.localeCompare(b.title);
   if(problemSort==="difficulty"){
    const rank:Record<Difficulty,number>={Easy:1,Medium:2,Hard:3};
    return rank[a.difficulty]-rank[b.difficulty] || (a.leetcodeNumber??Infinity)-(b.leetcodeNumber??Infinity);
   }
   if(problemSort==="frequency")return (Number((b as any).frequency)||0)-(Number((a as any).frequency)||0) || (a.leetcodeNumber??Infinity)-(b.leetcodeNumber??Infinity);
   return (a.leetcodeNumber??Infinity)-(b.leetcodeNumber??Infinity) || a.title.localeCompare(b.title);
  });
 },[problems,difficulty,topic,problemCompany,problemStatus,search,problemSort,status]);
 const counts={all:problems.length,solved:problems.filter(p=>statusFor(p)==="solved").length,revision:problems.filter(p=>statusFor(p)==="revision").length,failed:problems.filter(p=>statusFor(p)==="failed").length};
 const reset=()=>{setSearch("");setDifficulty("All");setTopic("All");setProblemCompany("All");setProblemStatus("All");setProblemSort("number")};
 return <div className="max-w-7xl mx-auto p-5 md:p-8">
  <div className="fade-up flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
   <div><div className="text-[10px] tracking-[.2em] text-violet-300">PROBLEM BANK / LIBRARY</div><h1 className="text-3xl md:text-4xl font-black mt-2">Problems</h1><p className="text-sm text-[#748398] mt-2">The complete problem bank. Search, filter, sort, revise and launch the timer directly.</p></div>
   <div className="text-xs text-[#657387]">{filteredProblems.length.toLocaleString()} matching</div>
  </div>
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
   <Stat label="Matching" value={counts.all.toLocaleString()} icon="list"/><Stat label="Solved" value={String(counts.solved)} icon="check"/><Stat label="Revision" value={String(counts.revision)} icon="reset"/><Stat label="Couldn't solve" value={String(counts.failed)} icon="help"/>
  </div>
  <div className="panel rounded-2xl p-3 mt-5">
   <div className="grid lg:grid-cols-[1.5fr_repeat(3,1fr)] gap-2">
    <div className="flex items-center gap-2 bg-[#0b1119] border border-[#243145] rounded-xl px-3"><Icon name="search" size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search problems..." className="bg-transparent outline-none py-2.5 text-sm w-full"/></div>
    <select value={questionSection} onChange={e=>setQuestionSection(e.target.value)} className="bg-[#0b1119] border border-[#253245] rounded-xl px-3 py-2.5 text-xs">{questionSections.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select>
    <select value={topic==="All"?"All topics":topic} onChange={e=>setTopic(e.target.value==="All topics"?"All":e.target.value)} className="bg-[#0b1119] border border-[#253245] rounded-xl px-3 py-2.5 text-xs"><option>All topics</option>{topicList.filter(t=>t!=="All").map(t=><option key={t}>{t}</option>)}</select>
    <select value={problemCompany} onChange={e=>setProblemCompany(e.target.value)} className="bg-[#0b1119] border border-[#253245] rounded-xl px-3 py-2.5 text-xs"><option value="All">All companies</option>{companies.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select>
    <select value={problemStatus} onChange={e=>setProblemStatus(e.target.value as "All"|Status)} className="bg-[#0b1119] border border-[#253245] rounded-xl px-3 py-2.5 text-xs"><option value="All">All status</option><option value="unsolved">Unsolved</option><option value="solved">Solved</option><option value="revision">Need revision</option><option value="failed">Couldn't solve</option></select>
   </div>
   <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-white/[.05]">
    {["All",...difficulties].map(d=><button key={d} onClick={()=>setDifficulty(d as any)} className={`px-3 py-2 rounded-xl text-xs border ${difficulty===d?"border-cyan-300/30 bg-cyan-300/10 text-cyan-100":"border-[#253245] text-[#8391a5] hover:bg-white/5"}`}>{d}</button>)}
    <div className="ml-auto flex items-center gap-2"><span className="text-[10px] tracking-[.14em] text-[#5f6d80]">SORT</span><select value={problemSort} onChange={e=>setProblemSort(e.target.value as typeof problemSort)} className="bg-[#0b1119] border border-[#253245] rounded-xl px-3 py-2 text-xs"><option value="number">LeetCode #</option><option value="title">Title</option><option value="difficulty">Difficulty</option><option value="frequency">Frequency</option></select><button onClick={reset} className="px-3 py-2 rounded-xl border border-[#253245] text-xs text-[#8b98aa] hover:text-white flex items-center gap-2"><Icon name="reset" size={13}/> Reset</button></div>
   </div>
  </div>
  <div className="flex items-center justify-between text-xs text-[#68778c] mt-5 mb-3"><span>Showing all {filteredProblems.length.toLocaleString()} matching problems</span><span>Sorted by {problemSort==="number"?"LeetCode #":problemSort}</span></div>
  <div className="space-y-2">{filteredProblems.map((p,i)=><DailyCard key={p.id} p={p} index={i} solved={solved.includes(p.id)} status={statusFor(p)} openTimer={openTimer} mark={mark}/>)}</div>
  {!filteredProblems.length&&<div className="panel rounded-2xl p-10 text-center"><div className="text-lg font-semibold">No problems match these filters.</div><button onClick={reset} className="mt-4 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-semibold">Clear filters</button></div>}
 </div>
}

function CompaniesPage({company,companies,setCompany,problems,solved,status,openTimer,mark}:{company:string;companies:string[];setCompany:(c:string)=>void;problems:Problem[];solved:number[];status:Record<number,Status>;openTimer:(p:Problem)=>void;mark:(p:Problem,s:Status)=>void}){
 const [companySearch,setCompanySearch]=useState("");
 const [companyDifficulty,setCompanyDifficulty]=useState<"All"|Difficulty>("All");
 const selected=company!=="All";

 const sourceProblems=useMemo(()=>problems.filter(p=>p.companies.includes(company)),[problems,company]);
 const sourceIds=useMemo(()=>new Set(sourceProblems.map(p=>p.id)),[sourceProblems]);

 // Company pages use the same 500–1000 preparation-bank rule as Prep Plan:
 // real company-tagged questions first, then relevant broader DSA questions when the source pool is smaller.
 const companyBank=useMemo(()=>{
  if(!selected)return [];
  const target=Math.min(1000,Math.max(500,sourceProblems.length));
  if(sourceProblems.length>=target){
   return [...sourceProblems]
    .sort((a,b)=>(b.companyFrequency?.[company]??b.frequency??0)-(a.companyFrequency?.[company]??a.frequency??0)||a.title.localeCompare(b.title))
    .slice(0,target);
  }
  const sourceFamilies=new Set(sourceProblems.map(topicFamily));
  const extras=problems
   .filter(p=>!sourceIds.has(p.id))
   .map(p=>{
    const familyBoost=sourceFamilies.has(topicFamily(p))?35:0;
    const frequency=Math.min(30,(p.frequency??0)*0.5);
    const difficulty=p.difficulty==="Medium"?12:p.difficulty==="Easy"?8:6;
    return {p,score:familyBoost+frequency+difficulty};
   })
   .sort((a,b)=>b.score-a.score||a.p.title.localeCompare(b.p.title));
  return [...sourceProblems,...extras.slice(0,target-sourceProblems.length).map(x=>x.p)];
 },[selected,company,sourceProblems,sourceIds,problems]);

 const companyProblems=useMemo(()=>{
  const q=companySearch.toLowerCase().trim();
  return companyBank
   .filter(p=>(companyDifficulty==="All"||p.difficulty===companyDifficulty)&&(!q||p.title.toLowerCase().includes(q)||p.topics.some(t=>t.toLowerCase().includes(q))))
   .sort((a,b)=>(sourceIds.has(b.id)?1:0)-(sourceIds.has(a.id)?1:0)||(b.companyFrequency?.[company]??b.frequency??0)-(a.companyFrequency?.[company]??a.frequency??0)||a.title.localeCompare(b.title));
 },[companyBank,companyDifficulty,companySearch,sourceIds,company]);

 const visibleCompanies=companies.filter(c=>c!=="All"&&c.toLowerCase().includes(companySearch.toLowerCase().trim()));

 return <div className="max-w-7xl mx-auto p-5 md:p-8">
  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
   <div><div className="text-[10px] tracking-[.2em] text-cyan-200">COMPANY PREP / ALL COMPANIES</div><h1 className="text-3xl md:text-4xl font-black mt-2">Companies</h1><p className="text-sm text-[#748398] mt-2">Each company gets a 500–1000 item preparation bank: real company-tagged questions first, then relevant DSA practice when the source pool is smaller.</p></div>
   <div className="text-xs text-[#657387]">{companies.length-1} companies · {problems.length.toLocaleString()} practice items</div>
  </div>

  <div className="panel rounded-2xl p-3 mt-6"><div className="flex items-center gap-2 bg-[#0b1119] border border-[#243145] rounded-xl px-3"><Icon name="search" size={15}/><input value={companySearch} onChange={e=>setCompanySearch(e.target.value)} placeholder="Search companies or questions..." className="bg-transparent outline-none py-2.5 text-sm w-full"/></div></div>

  <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-4">
   {visibleCompanies.map(c=>{
    const sourceCount=problems.filter(p=>p.companies.includes(c)).length;
    const bankCount=Math.min(1000,Math.max(500,sourceCount));
    const done=problems.filter(p=>p.companies.includes(c)&&solved.includes(p.id)).length;
    return <button key={c} onClick={()=>{setCompany(c);setCompanySearch("");setTimeout(()=>document.getElementById("company-question-bank")?.scrollIntoView({behavior:"smooth",block:"start"}),0)}} className={"panel rounded-2xl p-4 text-left hover:-translate-y-0.5 transition "+(company===c?"border-cyan-300/30 glow-cyan":"")}>
     <div className="flex items-center justify-between"><div className="w-9 h-9 rounded-xl bg-[#151f2c] flex items-center justify-center"><Icon name="company" size={16}/></div><Icon name="arrow" size={14}/></div>
     <div className="mt-4 font-semibold text-sm">{c}</div>
     <div className="text-[11px] text-[#748398] mt-1"><span className="text-cyan-200">{bankCount} prep items</span> · {sourceCount} source · {done} solved</div>
    </button>
   })}
  </div>

  {selected&&<div id="company-question-bank" className="mt-8">
   <div className="panel rounded-3xl overflow-hidden">
    <div className="p-5 md:p-6 border-b border-[#202a38]">
     <div className="flex flex-col md:flex-row md:items-end gap-4">
      <div>
       <div className="text-[10px] tracking-[.2em] text-violet-300">COMPANY PREPARATION BANK</div>
       <h2 className="text-2xl md:text-3xl font-black mt-2">{company}</h2>
       <p className="text-xs text-[#718096] mt-1"><span className="text-cyan-200">{companyBank.length.toLocaleString()} prep items</span> · {sourceProblems.length.toLocaleString()} are source-tagged · solved {companyBank.filter(p=>solved.includes(p.id)).length}</p>
      </div>
      <div className="md:ml-auto flex flex-wrap gap-2">
       <button onClick={()=>setCompanyDifficulty("All")} className={"px-3 py-2 rounded-xl border text-xs "+(companyDifficulty==="All"?"border-cyan-300/30 bg-cyan-300/10":"border-[#273447]")}>All</button>
       {difficulties.map(d=><button key={d} onClick={()=>setCompanyDifficulty(d)} className={"px-3 py-2 rounded-xl border text-xs "+(companyDifficulty===d?"border-cyan-300/30 bg-cyan-300/10":"border-[#273447]")}>{d}</button>)}
       <button onClick={()=>setCompany("All")} className="px-3 py-2 rounded-xl border border-[#273447] text-xs">All companies</button>
      </div>
     </div>
    </div>
    <div className="px-5 pt-4 text-[11px] text-[#657387]">Source-tagged questions are kept first. Fill-in questions are broader DSA practice and are not claimed to be interview questions from {company}.</div>
    <div className="p-3 md:p-5 space-y-2">{companyProblems.map((p,i)=><DailyCard key={p.id} p={p} index={i} solved={solved.includes(p.id)} status={status[p.id]||"unsolved"} openTimer={openTimer} mark={mark}/>)}</div>
   </div>
  </div>}
 </div>
}
function AnalyticsPage({problems,solved,status,timeSpent,topicStats,streak,totalTime}:{problems:Problem[];solved:number[];status:Record<number,Status>;timeSpent:Record<number,number>;topicStats:Record<string,{solved:number;total:number}>;streak:number;totalTime:number}){
 const avgSolved=solved.length?Math.round(solved.reduce((sum,id)=>sum+(timeSpent[id]||0),0)/solved.length/60):0;
 const topics=Object.entries(topicStats).sort((a,b)=>(a[1].solved/Math.max(1,a[1].total))-(b[1].solved/Math.max(1,b[1].total)));
 return (
  <div className="max-w-7xl mx-auto p-5 md:p-8">
   <div className="text-[10px] tracking-[.2em] text-violet-300">PERFORMANCE LAB</div>
   <h1 className="text-3xl md:text-4xl font-black mt-2">Analytics</h1>
   <p className="text-sm text-[#748398] mt-2 mb-7">A factual view of your current practice data. DACE uses this signal for future selection.</p>
   <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <Stat label="Solved" value={String(solved.length)} icon="check"/>
    <Stat label="Streak" value={streak+"d"} icon="flame"/>
    <Stat label="Avg solve" value={avgSolved+"m"} icon="clock"/>
    <Stat label="Tracked" value={Math.floor(totalTime/60)+"m"} icon="activity"/>
   </div>
   <div className="grid lg:grid-cols-2 gap-5 mt-5">
    <div className="panel rounded-2xl p-5">
     <SectionTitle title="Topic weakness map" icon="analytics"/>
     <div className="mt-5 space-y-4">
      {topics.slice(0,10).map(([topic,value])=>{
       const pct=Math.round(value.solved/Math.max(1,value.total)*100);
       return (
        <div key={topic}>
         <div className="flex justify-between text-xs mb-2"><span>{topic}</span><span className="text-[#718096]">{value.solved}/{value.total} · {pct}%</span></div>
         <div className="h-2 rounded-full bg-[#18212d] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-400 to-cyan-300 rounded-full transition-all" style={{width:pct+"%"}}/>
         </div>
        </div>
       );
      })}
     </div>
    </div>
    <div className="panel rounded-2xl p-5">
     <SectionTitle title="Difficulty profile" icon="gauge"/>
     <div className="mt-5 space-y-5">
      {difficulties.map(d=>{
       const total=problems.filter(p=>p.difficulty===d).length;
       const done=problems.filter(p=>p.difficulty===d&&solved.includes(p.id)).length;
       const pct=Math.min(100,done/Math.max(1,total)*100);
       return (
        <div key={d}>
         <div className="flex justify-between text-xs mb-2"><span>{d}</span><span>{done}/{total}</span></div>
         <div className="h-3 rounded-full bg-[#18212d] overflow-hidden"><div className={`h-full rounded-full ${d==="Easy"?"bg-green-400":d==="Medium"?"bg-amber-400":"bg-rose-400"}`} style={{width:pct+"%"}}/></div>
        </div>
       );
      })}
     </div>
     <div className="mt-7 p-4 rounded-xl bg-[#0b1119] border border-[#202c3c] text-xs text-[#77869a]">Revision queue: <b className="text-white">{Object.values(status).filter(x=>x==="revision").length}</b> problems.</div>
    </div>
   </div>
  </div>
 );
}
function InterviewPage({problems,interviewTime,setInterviewTime,openTimer,mark,attempts,hints,timeSpent}:{problems:Problem[];interviewTime:number;setInterviewTime:(n:number)=>void;openTimer:(p:Problem)=>void;mark:(p:Problem,s:Status)=>void;attempts:Record<number,number>;hints:Record<number,number>;timeSpent:Record<number,number>}){
 const [started,setStarted]=useState(false);
 const [set,setSet]=useState<Problem[]>([]);
 const start=()=>{const pool=shuffle(problems.filter(p=>p.difficulty!=="Easy"),"interview"+Date.now());setSet(pool.slice(0,3));setStarted(true)};
 return <div className="max-w-5xl mx-auto p-5 md:p-8"><div className="text-[10px] tracking-[.2em] text-cyan-200">INTERVIEW MODE</div><h1 className="text-3xl md:text-4xl font-black mt-2">Simulate the pressure.</h1><p className="text-sm text-[#748398] mt-2 mb-7">A distraction-light session with a fixed time box and mixed interview-style problems.</p>
  {!started?<div className="panel rounded-3xl p-6 md:p-9 glow-cyan"><div className="w-14 h-14 rounded-2xl bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center"><Icon name="target" size={25}/></div><h2 className="text-2xl font-bold mt-5">Mock interview</h2><p className="text-sm text-[#77869a] max-w-lg mt-2">Pick a time box. DACE will create a fresh 3-problem set. Use the timer and open each original LeetCode problem.</p><div className="flex gap-2 mt-6">{[45,60,90].map(n=><button key={n} onClick={()=>setInterviewTime(n)} className={`px-4 py-2.5 rounded-xl border text-sm ${interviewTime===n?"border-cyan-300/30 bg-cyan-300/10":"border-[#273447]"}`}>{n} min</button>)}</div><button onClick={start} className="mt-5 px-5 py-3 rounded-xl bg-white text-black font-semibold text-sm">Start interview <ArrowUpRight size={15} className="inline ml-1"/></button></div>:<div><div className="panel rounded-2xl p-5 mb-4 flex items-center"><div><div className="text-xs text-[#718096]">TIME BOX</div><div className="text-3xl font-black">{interviewTime}:00</div></div><button onClick={()=>setStarted(false)} className="ml-auto text-xs text-[#7d8ca1]">End session</button></div><div className="space-y-3">{set.map((p,i)=><div key={p.id}><DailyCard p={p} index={i} solved={false} status="unsolved" openTimer={()=>openTimer(p)} mark={mark}/><div className="px-3 py-2 text-[10px] text-[#64748a] flex gap-4"><span>Attempts: {attempts[p.id]||0}</span><span>Hints: {hints[p.id]||0}</span><span>Tracked: {Math.floor((timeSpent[p.id]||0)/60)}m</span></div></div>)}</div></div>}
 </div>
}

function PrepPage({problems,solved,status,company,setCompany,days,setDays,topicStats,openTimer}:{problems:Problem[];solved:number[];status:Record<number,Status>;company:string;setCompany:(s:string)=>void;days:number;setDays:(n:number)=>void;topicStats:Record<string,{solved:number;total:number}>;openTimer:(p:Problem)=>void}){
 const [query,setQuery]=useState("");
 const [difficulty,setDifficulty]=useState("All");
 const [onlyUnsolved,setOnlyUnsolved]=useState(false);
 const sourcePool=useMemo(()=>problems.filter(p=>p.companies.includes(company)),[company]);
 const sourceIds=useMemo(()=>new Set(sourcePool.map(p=>p.id)),[sourcePool]);
 const pool=useMemo(()=>{
   if(company==="All") return problems.slice(0,1000);
   const target=Math.min(1000,Math.max(500,sourcePool.length));
   if(sourcePool.length>=target){
     return [...sourcePool].sort((a,b)=>(b.companyFrequency?.[company]??b.frequency??0)-(a.companyFrequency?.[company]??a.frequency??0)).slice(0,target);
   }
   const sourceFamilies=new Set(sourcePool.map(topicFamily));
   const extras=problems.filter(p=>!sourceIds.has(p.id)).map(p=>{
     const overlap=sourceFamilies.has(topicFamily(p))?30:0;
     const frequency=p.frequency??0;
     const difficulty=p.difficulty==="Medium"?10:p.difficulty==="Easy"?7:5;
     return {p,score:overlap+Math.min(25,frequency*0.35)+difficulty};
   }).sort((a,b)=>b.score-a.score||a.p.title.localeCompare(b.p.title));
   return [...sourcePool,...extras.slice(0,target-sourcePool.length).map(x=>x.p)];
 },[company,sourcePool,sourceIds]);
 const familyStats=useMemo(()=>{const m:Record<string,{total:number;solved:number;items:Problem[]}>={};for(const p of pool){const f=topicFamily(p);m[f]??={total:0,solved:0,items:[]};m[f].total++;m[f].items.push(p);if(solved.includes(p.id))m[f].solved++;}return Object.entries(m).sort((a,b)=>(a[1].solved/Math.max(1,a[1].total))-(b[1].solved/Math.max(1,b[1].total)));},[pool,solved]);

 // Source-derived 30-day style shortlist: coverage first, then repeated/strongly represented source problems,
 // while favoring Medium, then Easy, then Hard and avoiding duplicate-pattern overloading.
 const ranked=useMemo(()=>pool.map(p=>{
   const family=topicFamily(p);
   const solvedPenalty=solved.includes(p.id)?-1000:0;
   const sourceFrequency=p.companyFrequency?.[company]??p.frequency??0; const frequencyScore=Math.min(45,sourceFrequency*0.45);
   const difficultyScore=p.difficulty==="Medium"?18:p.difficulty==="Easy"?10:7;
   const familyNeed=(familyStats.find(([f])=>f===family)?.[1].solved===0?16:0);
   const statusBonus=status[p.id]==="revision"?8:0;
   const companyDepth=familyStats.find(([f])=>f===family)?.[1].total||0;
   const depthBonus=Math.min(12,Math.log2(companyDepth+1)*2);
   return {p,score:solvedPenalty+frequencyScore+difficultyScore+familyNeed+statusBonus+depthBonus};
 }).sort((a,b)=>b.score-a.score),[pool,solved,status,familyStats]);

 const target=useMemo(()=>Math.min(pool.length,Math.max(12,Math.min(90,Math.ceil(days*2.5)))),[pool.length,days]);
 const shortlist=useMemo(()=>{
   const chosen:Problem[]=[];const used=new Set<string>();
   // First pass guarantees broad pattern coverage.
   for(const [family] of familyStats){const x=ranked.find(r=>topicFamily(r.p)===family&&!used.has(String(r.p.id))&&!solved.includes(r.p.id));if(x){chosen.push(x.p);used.add(String(x.p.id));}}
   // Second pass fills remaining slots by ranking.
   for(const r of ranked){if(chosen.length>=target)break;if(used.has(String(r.p.id))||solved.includes(r.p.id))continue;chosen.push(r.p);used.add(String(r.p.id));}
   return chosen.slice(0,target);
 },[familyStats,ranked,target,solved]);

 const dayPlan=useMemo(()=>{const out:Problem[][]=Array.from({length:days},()=>[]);shortlist.forEach((p,i)=>out[i%days].push(p));return out;},[shortlist,days]);
 const companyQuestions=useMemo(()=>{const q=query.trim().toLowerCase();return pool.filter(p=>(difficulty==="All"||p.difficulty===difficulty)&&(!onlyUnsolved||!solved.includes(p.id))&&(!q||[p.title,...p.topics].join(" ").toLowerCase().includes(q)));},[pool,query,difficulty,onlyUnsolved,solved]);
 const easy=pool.filter(p=>p.difficulty==="Easy").length, medium=pool.filter(p=>p.difficulty==="Medium").length, hard=pool.filter(p=>p.difficulty==="Hard").length;
 const solvedCount=pool.filter(p=>solved.includes(p.id)).length;
 const shortEasy=shortlist.filter(p=>p.difficulty==="Easy").length,shortMed=shortlist.filter(p=>p.difficulty==="Medium").length,shortHard=shortlist.filter(p=>p.difficulty==="Hard").length;

 return <div className="max-w-7xl mx-auto p-5 md:p-8">
  <div className="text-[10px] tracking-[.2em] text-cyan-200">PREPARATION ENGINE</div>
  <h1 className="text-3xl md:text-4xl font-black mt-2">{company} — {days}-Day Focus Plan</h1>
  <p className="text-sm text-[#748398] mt-2">DACE selects a focused preparation set from this company's actual source-tagged questions. It is a preparation heuristic, not a prediction of future interview questions.</p>
  <div className="panel rounded-2xl p-5 mt-6">
   <div className="grid md:grid-cols-4 gap-3">
    <div><label className="text-[10px] text-[#69788d]">COMPANY</label><select value={company} onChange={e=>setCompany(e.target.value)} className="mt-2 w-full bg-[#0b1119] border border-[#253245] rounded-xl px-3 py-3 text-sm">{companies.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></div>
    <div><label className="text-[10px] text-[#69788d]">DAYS</label><input type="number" min={3} max={60} value={days} onChange={e=>setDays(Math.max(3,Math.min(60,Number(e.target.value)||14)))} className="mt-2 w-full bg-[#0b1119] border border-[#253245] rounded-xl px-3 py-3 text-sm"/></div>
    <div className="panel rounded-xl p-4"><div className="text-[10px] text-[#69788d]">SOURCE POOL</div><div className="text-2xl font-black mt-1">{pool.length}</div><div className="text-[10px] text-[#69788d]">actual company-tagged questions</div></div>
    <div className="panel rounded-xl p-4"><div className="text-[10px] text-[#69788d]">FOCUS SET</div><div className="text-2xl font-black mt-1">{shortlist.length}</div><div className="text-[10px] text-[#69788d]">selected for {days} days</div></div>
   </div>
   <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3">
    <div className="rounded-xl border border-green-300/10 p-3"><div className="text-[10px] text-green-300">EASY</div><div className="text-xl font-black">{shortEasy}</div></div>
    <div className="rounded-xl border border-amber-300/10 p-3"><div className="text-[10px] text-amber-300">MEDIUM</div><div className="text-xl font-black">{shortMed}</div></div>
    <div className="rounded-xl border border-rose-300/10 p-3"><div className="text-[10px] text-rose-300">HARD</div><div className="text-xl font-black">{shortHard}</div></div>
    <div className="rounded-xl border border-cyan-300/10 p-3"><div className="text-[10px] text-cyan-200">SOLVED</div><div className="text-xl font-black">{solvedCount}/{pool.length}</div></div>
    <div className="rounded-xl border border-violet-300/10 p-3"><div className="text-[10px] text-violet-200">REMAINING</div><div className="text-xl font-black">{Math.max(0,shortlist.filter(p=>!solved.includes(p.id)).length)}</div></div>
   </div>
  </div>

  <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-5 mt-5">
   <div className="panel rounded-2xl p-5">
    <h2 className="font-semibold">Why these questions?</h2>
    <p className="text-xs text-[#718096] mt-2 leading-5">The selector first covers the company's patterns, then fills the remaining slots from its source pool. It favors unsolved Medium questions, useful Easy foundations, revision items, and patterns you have not covered. The full company bank remains below.</p>
    <div className="mt-4 space-y-3">{familyStats.slice(0,12).map(([f,v])=>{const pct=Math.round(v.solved/Math.max(1,v.total)*100);const inSet=shortlist.filter(p=>topicFamily(p)===f).length;return <div key={f}><div className="flex justify-between text-xs"><span>{f}</span><span>{inSet} focus · {v.solved}/{v.total} solved</span></div><div className="h-2 bg-[#18212d] rounded-full mt-2"><div className="h-full bg-gradient-to-r from-cyan-300 to-violet-400 rounded-full" style={{width:pct+"%"}}/></div></div>})}</div>
   </div>
   <div className="panel rounded-2xl p-5">
    <div className="flex items-end justify-between gap-3"><div><div className="text-[10px] tracking-widest text-cyan-200">MUST PREPARE</div><h2 className="text-2xl font-black mt-2">{shortlist.length} questions for {days} days</h2><p className="text-xs text-[#718096] mt-1">Daily target: about {Math.ceil(shortlist.length/days)} focused questions.</p></div></div>
    <div className="mt-4 space-y-2">{shortlist.slice(0,18).map((p,i)=><div key={p.id} className="p-3 rounded-xl border border-[#202a38]"><div className="flex gap-2 items-center"><span className="text-[10px] text-[#627188]">#{i+1}</span><a href={p.url} target="_blank" rel="noreferrer" title="Open this question on LeetCode" className="text-sm flex-1 hover:text-cyan-200 hover:underline underline-offset-4 transition">{p.leetcodeNumber ? `${p.leetcodeNumber}. ` : ""}{p.title}</a><span className="text-[10px]">{p.difficulty}</span></div><div className="text-[10px] text-[#69788d] mt-1">{topicFamily(p)} · {p.topics.join(" · ")}</div><div className="flex gap-2 mt-2"><button onClick={()=>openTimer(p)} className="px-3 py-1.5 rounded-lg bg-white text-black text-[11px] font-semibold">Practice</button><a href={p.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg border border-[#273447] text-[11px]">Source ↗</a></div></div>)}</div>
   </div>
  </div>

  <div className="panel rounded-2xl p-5 mt-5">
   <div className="text-[10px] tracking-widest text-violet-200">DAY-BY-DAY PLAN</div>
   <h2 className="text-2xl font-black mt-2">Your {days} days</h2>
   <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">{dayPlan.map((day,i)=><div key={i} className="rounded-2xl border border-white/5 p-4"><div className="text-xs font-bold">DAY {i+1}</div>{day.length===0?<div className="text-xs text-[#657387] mt-2">Revision / mock / weak-topic day.</div>:day.map(p=><button key={p.id} onClick={()=>openTimer(p)} className="w-full text-left mt-2 p-2.5 rounded-xl bg-[#0a1017] border border-white/5 text-xs hover:border-cyan-300/20"><span className="text-cyan-200">{p.difficulty}</span> · {p.title}<span className="block text-[10px] text-[#657387] mt-1">{topicFamily(p)}</span></button>)}</div>)}</div>
  </div>

  <div className="panel rounded-2xl p-5 mt-5">
   <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3"><div><div className="text-[10px] tracking-widest text-violet-200">FULL COMPANY BANK</div><h2 className="text-2xl font-black mt-2">{company}: {companyQuestions.length} questions</h2><p className="text-xs text-[#718096] mt-1">The bank keeps all available company-tagged questions first, then adds relevant broader DSA questions until it reaches 500; large banks are capped at 1,000. Company-tagged questions are prioritized for prep.</p></div></div>
   <div className="grid md:grid-cols-[1fr_160px_auto] gap-2 mt-4"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search Two Sum, graph, DP, tree..." className="bg-[#0b1119] border border-[#253245] rounded-xl px-4 py-3 text-sm outline-none"/><select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="bg-[#0b1119] border border-[#253245] rounded-xl px-3 py-3 text-sm"><option>All</option><option>Easy</option><option>Medium</option><option>Hard</option></select><button onClick={()=>setOnlyUnsolved(x=>!x)} className={"px-4 py-3 rounded-xl border text-xs "+(onlyUnsolved?"border-cyan-300/30 bg-cyan-300/10 text-cyan-100":"border-[#253245] text-[#8290a3]")}>{onlyUnsolved?"Showing unsolved":"Show unsolved only"}</button></div>
   <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-2 max-h-[760px] overflow-auto pr-1">{companyQuestions.map((p,i)=><div key={p.id} className="p-4 rounded-2xl border border-white/5 hover:border-cyan-300/20"><div className="flex gap-2 items-center"><span className="text-[10px] text-[#627188]">#{i+1}</span><span className={"text-[10px] "+(p.difficulty==="Easy"?"text-green-300":p.difficulty==="Medium"?"text-amber-300":"text-rose-300")}>{p.difficulty}</span><span className="text-[9px] text-[#68778c]">· {topicFamily(p)}</span>{solved.includes(p.id)&&<span className="ml-auto text-[9px] text-green-300">✓ solved</span>}</div><a href={p.url} target="_blank" rel="noreferrer" title="Open this question on LeetCode" className="block text-sm leading-5 mt-2 hover:text-cyan-200 hover:underline underline-offset-4 transition">{p.leetcodeNumber ? `${p.leetcodeNumber}. ` : ""}{p.title}</a><div className="text-[10px] text-[#657387] mt-2">{p.topics.join(" · ")}</div><div className="flex gap-2 mt-3"><button onClick={()=>openTimer(p)} className="px-3 py-2 rounded-lg bg-white text-black text-[11px] font-semibold">Practice</button><a href={p.url} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-[#273447] text-[11px]">Open source ↗</a></div></div>)}</div>
  </div>
 </div>
}
function QuestionHistoryPage({daily,solved,status,openTimer,selectedDate,today,target,company}:{daily:Record<string,number[]>;solved:number[];status:Record<number,Status>;openTimer:(p:Problem)=>void;selectedDate:string|null;today:Problem[];target:{Easy:number;Medium:number;Hard:number};company:string}){
 const reconstruct=(key:string)=>{
  if(key===dateKey()&&!daily[key]?.length)return today.map(p=>p.id);
  if(daily[key]?.length)return daily[key];
  const picked:number[]=[];
  for(const d of difficulties){
   const pool=shuffle(problems.filter(p=>p.difficulty===d&&(company==="All"||p.companies.includes(company))),key+d);
   for(const p of pool){
    if(picked.filter(id=>problems.find(x=>x.id===id)?.difficulty===d).length>=target[d])break;
    if(!picked.includes(p.id))picked.push(p.id);
   }
  }
  return picked;
 };
 const days=useMemo(()=>{
  const keys=new Set(Object.keys(daily));
  keys.add(dateKey());
  if(selectedDate)keys.add(selectedDate);
  return [...keys].sort((a,b)=>b.localeCompare(a)).map(key=>{
   const d=new Date(key+"T00:00:00");
   return {key,label:d.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short",year:"numeric"}),ids:reconstruct(key)};
  });
 },[daily,today,target,company,selectedDate]);

 const totalQuestions=days.reduce((n,d)=>n+d.ids.length,0);
 const uniqueIds=new Set(days.flatMap(d=>d.ids));

 return <div className="max-w-7xl mx-auto p-5 md:p-8">
  <div className="text-[10px] tracking-[.2em] text-cyan-200">QUESTION HISTORY</div>
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mt-2">
   <div><h1 className="text-3xl md:text-4xl font-black">{selectedDate?"Questions · "+selectedDate:"All Question History"}</h1><p className="text-sm text-[#748398] mt-2">Nothing is removed after 7 days. Every saved daily set stays available in your local DACE data.</p></div>
   <div className="grid grid-cols-3 gap-2">
    <MiniMetric label="Days" value={String(days.length)} sub="saved days"/>
    <MiniMetric label="Questions" value={String(totalQuestions)} sub="saved history"/>
    <MiniMetric label="Unique" value={String(uniqueIds.size)} sub="different questions"/>
   </div>
  </div>

  <div className="panel rounded-2xl p-5 mt-6">
   <div className="flex items-center justify-between gap-3">
    <div><h2 className="font-semibold">Daily question log</h2><p className="text-xs text-[#718096] mt-1">Your daily sets are saved locally in this browser.</p></div>
    <span className="text-[10px] text-[#64748b]">SAVED HISTORY</span>
   </div>

   <div className="mt-5 space-y-5">
    {days.map(day=>{if(selectedDate&&day.key!==selectedDate)return null;
     const items=day.ids.map(id=>problems.find(p=>p.id===id)).filter(Boolean) as Problem[];
     const solvedCount=items.filter(p=>solved.includes(p.id)).length;
     return <div key={day.key} className="rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-4 py-3 bg-white/[.025] border-b border-white/5 flex flex-wrap items-center gap-3">
       <div className="font-semibold text-sm">{day.label}</div>
       <span className="text-[10px] text-[#68778c]">{day.key}</span>
       <span className="ml-auto text-[10px]">{items.length} question{items.length===1?"":"s"} · {solvedCount} solved</span>
      </div>
      {items.length===0
       ? <div className="px-4 py-5 text-xs text-[#657387]">No daily set was recorded for this date.</div>
       : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2 p-3">
        {items.map((p,i)=><div key={p.id} className="p-3 rounded-xl bg-[#0a1017] border border-white/5">
         <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#627188]">#{i+1}</span>
          <span className={"text-[10px] "+(p.difficulty==="Easy"?"text-green-300":p.difficulty==="Medium"?"text-amber-300":"text-rose-300")}>{p.difficulty}</span>
          {solved.includes(p.id)&&<span className="ml-auto text-[9px] text-green-300">✓ solved</span>}
          {!solved.includes(p.id)&&status[p.id]&&<span className="ml-auto text-[9px] text-[#a7b4c6]">{status[p.id]}</span>}
         </div>
         <div className="text-sm leading-5 mt-2">{p.title}</div>
         <div className="text-[10px] text-[#657387] mt-1">{topicFamily(p)} · {p.topics.slice(0,3).join(" · ")}</div>
         <div className="flex gap-2 mt-3">
          <button onClick={()=>openTimer(p)} className="px-3 py-1.5 rounded-lg bg-white text-black text-[11px] font-semibold">Practice</button>
          <a href={p.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg border border-[#273447] text-[11px]">Open source ↗</a>
         </div>
        </div>)}
       </div>}
     </div>
    })}
   </div>
  </div>

  <div className="mt-4 text-[11px] text-[#657387]">
   History shows sets that were actually saved by DACE. If DACE was not opened on an older day, that day's questions cannot be reconstructed as a historical record.
  </div>
 </div>;
}

function SettingsPage({target,setTarget,company,setCompany,companies,exportData,importData,resetAll}:{target:{Easy:number;Medium:number;Hard:number};setTarget:React.Dispatch<React.SetStateAction<{Easy:number;Medium:number;Hard:number}>>;company:string;setCompany:(s:string)=>void;companies:string[];exportData:()=>void;importData:(e:React.ChangeEvent<HTMLInputElement>)=>void;resetAll:()=>void}){
 return <div className="max-w-3xl mx-auto p-5 md:p-8"><div className="text-[10px] tracking-[.2em] text-violet-300">CONTROL ROOM</div><h1 className="text-3xl md:text-4xl font-black mt-2">Settings</h1><p className="text-sm text-[#748398] mt-2 mb-7">Tune the practice system. Everything currently lives in your browser.</p>
  <div className="panel rounded-2xl p-5"><h2 className="font-semibold">Daily target</h2><div className="text-xs text-[#718096] mt-1">Set how many Easy, Medium and Hard questions you want each day.</div><div className="mt-5 space-y-3">{difficulties.map(d=>{const color=d==="Easy"?"text-green-300":d==="Medium"?"text-amber-300":"text-rose-300";const value=target[d];const change=(delta:number)=>setTarget(x=>({...x,[d]:Math.max(0,Math.min(5,(x[d]??0)+delta))}));return <div key={d} className={"flex items-center justify-between border-b border-[#1e2835] py-3 last:border-0"}><span className={"text-sm "+color}>{d}</span><div className="flex items-center gap-2"><button type="button" onClick={()=>change(-1)} disabled={value<=0} aria-label={"Decrease "+d+" target"} className="w-9 h-9 rounded-lg border border-[#273447] text-lg leading-none hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed">−</button><input type="number" min={0} max={5} step={1} value={value} onChange={e=>{const next=e.target.value===""?0:Number(e.target.value);setTarget(x=>({...x,[d]:Number.isFinite(next)?Math.max(0,Math.min(5,next)):x[d]}));}} className="w-16 bg-[#0a1017] border border-[#273447] rounded-lg px-2 py-2 text-center"/><button type="button" onClick={()=>change(1)} disabled={value>=5} aria-label={"Increase "+d+" target"} className="w-9 h-9 rounded-lg border border-[#273447] text-lg leading-none hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed">+</button></div></div>})}</div><div className="text-[11px] text-[#69788d] mt-4">Today: {target.Easy + target.Medium + target.Hard} questions</div></div>
  <div className="panel rounded-2xl p-5 mt-4"><h2 className="font-semibold">Company focus</h2><p className="text-xs text-[#718096] mt-1">The adaptive engine can bias future sets toward one company.</p><select value={company} onChange={e=>setCompany(e.target.value)} className="mt-4 bg-[#0a1017] border border-[#273447] rounded-xl px-3 py-2.5 text-sm">{companies.map(c=><option key={c}>{c}</option>)}</select></div>
  <div className="panel rounded-2xl p-5 mt-4"><h2 className="font-semibold">Your data</h2><p className="text-xs text-[#718096] mt-1">Back up your local progress before changing browsers or devices.</p><div className="flex flex-wrap gap-2 mt-4"><button onClick={exportData} className="px-4 py-2.5 rounded-xl border border-[#273447] text-sm flex items-center gap-2"><Icon name="download" size={15}/> Export backup</button><label className="px-4 py-2.5 rounded-xl border border-[#273447] text-sm flex items-center gap-2 cursor-pointer"><Icon name="upload" size={15}/> Import backup<input type="file" accept="application/json" onChange={importData} className="hidden"/></label></div></div>
  <button onClick={resetAll} className="mt-4 text-xs text-rose-300 border border-rose-400/20 rounded-xl px-4 py-2.5 hover:bg-rose-400/5">Reset local progress</button>
 </div>
}
function TimerModal({active,seconds,running,hints,onToggle,onReset,onHint,onClose,onSolved}:{active:Problem;seconds:number;running:boolean;hints:number;onToggle:()=>void;onReset:()=>void;onHint:()=>void;onClose:()=>void;onSolved:()=>void}){
 const modal=<div className="dace-overlay fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`${active.title} focus timer`}>
  <div className="w-full max-w-xl panel rounded-3xl overflow-hidden shadow-2xl float-in">
   <div className="p-5 border-b border-[#202a38] flex items-start gap-4"><div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-300/15 to-violet-400/15 border border-cyan-300/15 flex items-center justify-center"><Icon name="timer" size={20}/></div><div><div className={`text-[10px] tracking-[.16em] ${active.difficulty==="Hard"?"text-rose-300":active.difficulty==="Medium"?"text-amber-300":"text-green-300"}`}>{active.difficulty} · {active.companies.slice(0,2).join(" · ")}</div><h2 className="text-xl font-bold mt-1">{active.title}</h2><div className="text-xs text-[#718096] mt-1">{active.topics.join(" · ")}</div></div><button onClick={onClose} className="ml-auto p-2 rounded-lg hover:bg-white/5" aria-label="Close timer"><Icon name="x" size={17}/></button></div>
   <div className="p-8 md:p-10 text-center"><div className="text-[10px] tracking-[.2em] text-[#627188]">FOCUS TIMER</div><div className="font-mono text-6xl md:text-7xl font-semibold tracking-tight mt-2">{fmt(seconds)}</div><div className="text-xs text-[#69788d] mt-2">Expected ~{active.estimate} min · {hints} hint{hints===1?"":"s"} used</div><div className="flex justify-center gap-2 mt-7"><button onClick={onToggle} className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm flex items-center gap-2"><Icon name={running?"clock":"play"} size={15}/>{running?"Pause":"Start"}</button><button onClick={onReset} className="px-5 py-3 rounded-xl border border-[#273447] text-sm">Reset</button><button onClick={onHint} className="px-5 py-3 rounded-xl border border-[#273447] text-sm">+ Hint</button></div></div>
   <div className="p-4 border-t border-[#202a38] flex gap-2"><a href={active.url} target="_blank" rel="noreferrer" className="flex-1 px-3 py-3 rounded-xl bg-gradient-to-r from-cyan-200 to-violet-300 text-black text-center text-sm font-bold">Open on LeetCode <ArrowUpRight size={14} className="inline"/></a><button onClick={onSolved} className="px-4 py-3 rounded-xl border border-green-400/20 text-green-300 text-sm flex items-center gap-2"><Check size={15}/> Solved</button></div>
  </div>
 </div>;
 return typeof document==="undefined"?null:createPortal(modal,document.body);
}
function SectionTitle({title,icon,action,onClick}:{title:string;icon:string;action?:string;onClick?:()=>void}){
 return <div className="flex items-center gap-2"><Icon name={icon} size={15}/><h2 className="text-sm font-semibold">{title}</h2>{action&&<button onClick={onClick} className="ml-auto text-[11px] text-[#8190a5] hover:text-white flex items-center gap-1">{action}<ChevronRight size={13}/></button>}</div>
}
function MiniMetric({label,value,sub}:{label:string;value:string;sub:string}){return <div className="panel rounded-xl p-4"><div className="text-[10px] tracking-[.14em] text-[#64748a]">{label.toUpperCase()}</div><div className="text-2xl font-black mt-2">{value}</div><div className="text-[10px] text-[#68778c] mt-1">{sub}</div></div>}
function Stat({label,value,icon}:{label:string;value:string;icon:string}){return <div className="panel rounded-2xl p-4"><div className="flex items-center justify-between"><span className="text-xs text-[#77869a]">{label}</span><Icon name={icon} size={15}/></div><div className="text-2xl font-black mt-2">{value}</div></div>}
function FeatureCard({icon,title,text,onClick}:{icon:string;title:string;text:string;onClick:()=>void}){return <button onClick={onClick} className="panel rounded-2xl p-5 text-left w-full hover:border-cyan-300/30 hover:bg-white/[.025] transition cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-300/40"><div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"><Icon name={icon}/></div><div className="font-semibold text-sm mt-4">{title}</div><div className="text-xs text-[#718096] leading-5 mt-1">{text}</div><div className="mt-4 text-[10px] uppercase tracking-[.16em] text-cyan-200 flex items-center gap-1">Open <ChevronRight size={12}/></div></button>}
