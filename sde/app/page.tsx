"use client";

import {useEffect,useMemo,useState} from "react";

type Difficulty="Easy"|"Medium"|"Hard";
type Problem={id:number;title:string;difficulty:Difficulty;topic:string;company:string;url:string;estimate:number};

const seed:Problem[]=[
{id:1,title:"Two Sum",difficulty:"Easy",topic:"Hashing",company:"Amazon",url:"https://leetcode.com/problems/two-sum/",estimate:15},
{id:15,title:"3Sum",difficulty:"Medium",topic:"Two Pointers",company:"Amazon",url:"https://leetcode.com/problems/3sum/",estimate:35},
{id:200,title:"Number of Islands",difficulty:"Medium",topic:"Graph / BFS",company:"Google",url:"https://leetcode.com/problems/number-of-islands/",estimate:40},
{id:42,title:"Trapping Rain Water",difficulty:"Hard",topic:"Two Pointers",company:"Amazon",url:"https://leetcode.com/problems/trapping-rain-water/",estimate:55},
{id:23,title:"Merge k Sorted Lists",difficulty:"Hard",topic:"Heap / Linked List",company:"Microsoft",url:"https://leetcode.com/problems/merge-k-sorted-lists/",estimate:60},
{id:49,title:"Group Anagrams",difficulty:"Medium",topic:"Hashing",company:"Google",url:"https://leetcode.com/problems/group-anagrams/",estimate:25},
{id:704,title:"Binary Search",difficulty:"Easy",topic:"Binary Search",company:"Microsoft",url:"https://leetcode.com/problems/binary-search/",estimate:15},
{id:39,title:"Combination Sum",difficulty:"Medium",topic:"Backtracking",company:"Adobe",url:"https://leetcode.com/problems/combination-sum/",estimate:35},
{id:127,title:"Word Ladder",difficulty:"Hard",topic:"Graph / BFS",company:"Meta",url:"https://leetcode.com/problems/word-ladder/",estimate:55},
{id:206,title:"Reverse Linked List",difficulty:"Easy",topic:"Linked List",company:"Amazon",url:"https://leetcode.com/problems/reverse-linked-list/",estimate:15},
{id:121,title:"Best Time to Buy and Sell Stock",difficulty:"Easy",topic:"Arrays",company:"Amazon",url:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",estimate:15},
{id:322,title:"Coin Change",difficulty:"Medium",topic:"Dynamic Programming",company:"Google",url:"https://leetcode.com/problems/coin-change/",estimate:40},
{id:98,title:"Validate Binary Search Tree",difficulty:"Medium",topic:"Trees",company:"Microsoft",url:"https://leetcode.com/problems/validate-binary-search-tree/",estimate:30},
{id:124,title:"Binary Tree Maximum Path Sum",difficulty:"Hard",topic:"Trees / DP",company:"Meta",url:"https://leetcode.com/problems/binary-tree-maximum-path-sum/",estimate:55},
{id:76,title:"Minimum Window Substring",difficulty:"Hard",topic:"Sliding Window",company:"Google",url:"https://leetcode.com/problems/minimum-window-substring/",estimate:50}
];

const difficultyClass=(d:Difficulty)=>d==="Easy"?"easy":d==="Medium"?"medium":"hard";

export default function Home(){
 const [day,setDay]=useState(1);
 const [active,setActive]=useState<Problem|null>(null);
 const [running,setRunning]=useState(false);
 const [seconds,setSeconds]=useState(0);
 const [solved,setSolved]=useState<number[]>([]);
 const [view,setView]=useState<"today"|"roadmap"|"companies"|"progress">("today");
 const [company,setCompany]=useState("All");
 const [daysDone,setDaysDone]=useState(0);

 useEffect(()=>{const s=localStorage.getItem("dayflow-solved");if(s)setSolved(JSON.parse(s));const d=localStorage.getItem("dayflow-days");if(d)setDaysDone(Number(d))},[]);
 useEffect(()=>{localStorage.setItem("dayflow-solved",JSON.stringify(solved))},[solved]);
 useEffect(()=>{localStorage.setItem("dayflow-days",String(daysDone))},[daysDone]);
 useEffect(()=>{if(!running)return;const t=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(t)},[running]);

 const today=useMemo(()=>{
   const offset=(day-1)*5;
   const shuffled=[...seed].sort((a,b)=>((a.id*31+offset)%97)-((b.id*31+offset)%97));
   const pick=(d:Difficulty)=>shuffled.find(p=>p.difficulty===d && (company==="All"||p.company===company));
   const used=new Set<number>(); const out:Problem[]=[];
   (["Easy","Medium","Medium","Hard","Hard"] as Difficulty[]).forEach(d=>{const p=shuffled.find(x=>x.difficulty===d&&!used.has(x.id)&&(company==="All"||x.company===company));if(p){out.push(p);used.add(p.id)}});
   return out;
 },[day,company]);

 const start=(p:Problem)=>{setActive(p);setSeconds(0);setRunning(true)};
 const toggleSolved=(id:number)=>setSolved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
 const fmt=(n:number)=>String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");
 const totalSolved=solved.length, total=55*5, pct=Math.round(totalSolved/total*100);

 return <main className="min-h-screen bg-[#0d0f12] text-[#e8eaed]">
   <header className="h-14 border-b border-[#2a2d32] flex items-center px-5 gap-5 sticky top-0 bg-[#0d0f12]/95 backdrop-blur z-20">
    <div className="font-bold text-lg tracking-tight"><span className="text-[#ffa116]">D</span>ayFlow</div>
    <div className="text-xs text-[#8b949e]">DSA / SDE TRACKER</div>
    <div className="ml-auto flex items-center gap-4 text-xs text-[#9da4ad]"><span>🔥 {daysDone} day streak</span><span>{pct}% complete</span></div>
   </header>
   <div className="flex min-h-[calc(100vh-56px)]">
    <aside className="w-56 border-r border-[#2a2d32] p-3 hidden md:block">
      <div className="text-[11px] uppercase tracking-wider text-[#6e7681] px-3 py-2">Workspace</div>
      {([["today","Today"],["roadmap","Roadmap"],["companies","Companies"],["progress","Progress"]] as const).map(([k,l])=><button key={k} onClick={()=>setView(k)} className={`w-full text-left px-3 py-2.5 rounded-md text-sm mb-1 ${view===k?"bg-[#262a30] text-white":"text-[#9da4ad] hover:bg-[#181b20]"}`}>{l}</button>)}
      <div className="mt-8 px-3 text-[11px] uppercase tracking-wider text-[#6e7681]">Daily target</div>
      <div className="px-3 mt-2 text-xs text-[#9da4ad]">1 Easy · 2 Medium · 2 Hard</div>
    </aside>

    <section className="flex-1 min-w-0">
      {view==="today"&&<div className="max-w-5xl mx-auto p-5 md:p-8">
        <div className="flex flex-wrap items-end gap-4 mb-7">
          <div><div className="text-xs text-[#8b949e] mb-1">SDE PREP · DAY {day}</div><h1 className="text-3xl font-semibold">Today's Problems</h1></div>
          <select value={company} onChange={e=>setCompany(e.target.value)} className="ml-auto bg-[#16191d] border border-[#343941] rounded-md px-3 py-2 text-sm"><option>All</option><option>Amazon</option><option>Google</option><option>Microsoft</option><option>Meta</option><option>Adobe</option></select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          <Stat label="Problems" value={today.length+"/5"}/><Stat label="Estimated" value={today.reduce((a,p)=>a+p.estimate,0)+"m"}/><Stat label="Solved" value={String(totalSolved)}/><Stat label="Roadmap" value="55 days"/>
        </div>
        <div className="space-y-2">
        {today.map((p,i)=><article key={p.id} className="border border-[#2a2d32] bg-[#121519] rounded-lg hover:border-[#454b54] transition">
          <div className="flex items-center gap-4 p-4">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold diff-${difficultyClass(p.difficulty)}`}>{i+1}</div>
            <div className="min-w-0 flex-1"><div className="font-medium truncate">{p.title}</div><div className="text-xs text-[#8b949e] mt-1">{p.topic} · {p.company} · ~{p.estimate}m</div></div>
            <span className={`text-xs px-2 py-1 rounded diff-${difficultyClass(p.difficulty)}`}>{p.difficulty}</span>
            <button onClick={()=>start(p)} className="px-3 py-2 text-sm rounded-md bg-[#2f81f7] hover:bg-[#388bfd] text-white">Start</button>
          </div>
          <div className="px-4 pb-3 flex gap-2 justify-end">
            <button onClick={()=>toggleSolved(p.id)} className={`text-xs px-2.5 py-1.5 rounded border ${solved.includes(p.id)?"border-green-700 text-green-400":"border-[#343941] text-[#9da4ad]"}`}>{solved.includes(p.id)?"✓ Solved":"Mark solved"}</button>
            <a href={p.url} target="_blank" rel="noreferrer" className="text-xs px-2.5 py-1.5 rounded border border-[#343941] text-[#9da4ad] hover:text-white">LeetCode ↗</a>
          </div>
        </article>)}
        </div>
        <div className="flex justify-between mt-7"><button disabled={day===1} onClick={()=>setDay(d=>d-1)} className="px-4 py-2 border border-[#343941] rounded-md text-sm disabled:opacity-30">← Previous</button><button onClick={()=>{setDay(d=>d+1);setDaysDone(Math.max(daysDone,d))}} className="px-4 py-2 bg-[#ffa116] text-black rounded-md text-sm font-semibold">Next day →</button></div>
      </div>}

      {view==="roadmap"&&<div className="max-w-4xl mx-auto p-5 md:p-8"><h1 className="text-3xl font-semibold mb-2">55-Day Roadmap</h1><p className="text-sm text-[#8b949e] mb-7">Five mixed-difficulty problems every day. Topics rotate to avoid tunnel vision.</p>{Array.from({length:55},(_,i)=><button key={i} onClick={()=>{setDay(i+1);setView("today")}} className={`w-full flex items-center gap-4 border-b border-[#25282d] p-4 text-left hover:bg-[#15181c] ${day===i+1?"bg-[#15181c]":""}`}><span className="w-10 text-xs text-[#6e7681]">DAY {i+1}</span><span className="flex-1 text-sm">1 Easy · 2 Medium · 2 Hard</span><span className="text-xs text-[#6e7681]">5 problems</span>{i<daysDone&&<span className="text-green-400 text-xs">✓</span>}</button>)}</div>}

      {view==="companies"&&<div className="max-w-5xl mx-auto p-5 md:p-8"><h1 className="text-3xl font-semibold mb-2">Companies</h1><p className="text-sm text-[#8b949e] mb-7">Company-wise practice will be populated from the GitHub dataset you provided.</p><div className="grid md:grid-cols-2 gap-3">{["Amazon","Google","Microsoft","Meta","Adobe"].map(c=><button key={c} onClick={()=>{setCompany(c);setView("today")}} className="border border-[#2a2d32] rounded-lg p-5 text-left hover:border-[#454b54] bg-[#121519]"><div className="font-medium">{c}</div><div className="text-xs text-[#8b949e] mt-1">Practice company-tagged problems →</div></button>)}</div></div>}

      {view==="progress"&&<div className="max-w-5xl mx-auto p-5 md:p-8"><h1 className="text-3xl font-semibold mb-7">Progress</h1><div className="grid md:grid-cols-3 gap-3"><Stat label="Solved" value={String(totalSolved)}/><Stat label="Target" value={String(total)}/><Stat label="Completion" value={pct+"%"}/></div><div className="mt-8 border border-[#2a2d32] rounded-lg p-5 bg-[#121519]"><div className="text-sm mb-3">Overall progress</div><div className="h-2 bg-[#292d33] rounded-full overflow-hidden"><div className="h-full bg-[#2f81f7]" style={{width:pct+"%"}}/></div><div className="text-xs text-[#8b949e] mt-3">{totalSolved} of {total} problems marked solved.</div></div></div>}
    </section>
   </div>

   {active&&<div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#15181c] border border-[#343941] rounded-xl shadow-2xl">
       <div className="p-5 border-b border-[#2a2d32] flex items-center"><div><div className="text-xs text-[#8b949e]">{active.difficulty} · {active.topic}</div><h2 className="text-xl font-semibold mt-1">{active.title}</h2></div><button onClick={()=>{setRunning(false);setActive(null)}} className="ml-auto text-[#8b949e] hover:text-white">✕</button></div>
       <div className="p-8 text-center"><div className="font-mono text-6xl tracking-tight">{fmt(seconds)}</div><div className="text-xs text-[#6e7681] mt-2">Expected ~{active.estimate} minutes</div><div className="flex justify-center gap-2 mt-7"><button onClick={()=>setRunning(!running)} className="px-6 py-2.5 rounded-md bg-[#2f81f7] text-white">{running?"Pause":"Start"}</button><button onClick={()=>setSeconds(0)} className="px-5 py-2.5 rounded-md border border-[#343941]">Reset</button></div></div>
       <div className="p-4 border-t border-[#2a2d32] flex gap-2"><a href={active.url} target="_blank" rel="noreferrer" className="flex-1 text-center px-3 py-2 rounded-md bg-[#ffa116] text-black font-semibold text-sm">Open on LeetCode ↗</a><button onClick={()=>{toggleSolved(active.id);setRunning(false);setActive(null)}} className="px-4 py-2 rounded-md border border-green-700 text-green-400 text-sm">✓ Solved</button></div>
      </div>
   </div>}
 </main>
}

function Stat({label,value}:{label:string;value:string}){return <div className="border border-[#2a2d32] rounded-lg bg-[#121519] p-4"><div className="text-xs text-[#8b949e]">{label}</div><div className="text-xl font-semibold mt-1">{value}</div></div>}
