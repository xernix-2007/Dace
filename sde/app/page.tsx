"use client";

import { useEffect, useMemo, useState } from "react";

type Difficulty = "Easy" | "Medium" | "Hard";
type Status = "unsolved" | "solved" | "revision" | "failed";
type Problem = {
  id: number;
  title: string;
  difficulty: Difficulty;
  topic: string;
  company: string;
  url: string;
  estimate: number;
};

const problems: Problem[] = [
  {id:1,title:"Two Sum",difficulty:"Easy",topic:"Hashing",company:"Amazon",url:"https://leetcode.com/problems/two-sum/",estimate:15},
  {id:20,title:"Valid Parentheses",difficulty:"Easy",topic:"Stack",company:"Amazon",url:"https://leetcode.com/problems/valid-parentheses/",estimate:15},
  {id:121,title:"Best Time to Buy and Sell Stock",difficulty:"Easy",topic:"Arrays",company:"Amazon",url:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",estimate:15},
  {id:206,title:"Reverse Linked List",difficulty:"Easy",topic:"Linked List",company:"Amazon",url:"https://leetcode.com/problems/reverse-linked-list/",estimate:15},
  {id:704,title:"Binary Search",difficulty:"Easy",topic:"Binary Search",company:"Microsoft",url:"https://leetcode.com/problems/binary-search/",estimate:15},
  {id:226,title:"Invert Binary Tree",difficulty:"Easy",topic:"Trees",company:"Google",url:"https://leetcode.com/problems/invert-binary-tree/",estimate:20},
  {id:141,title:"Linked List Cycle",difficulty:"Easy",topic:"Linked List",company:"Amazon",url:"https://leetcode.com/problems/linked-list-cycle/",estimate:20},
  {id:543,title:"Diameter of Binary Tree",difficulty:"Easy",topic:"Trees",company:"Amazon",url:"https://leetcode.com/problems/diameter-of-binary-tree/",estimate:25},
  {id:733,title:"Flood Fill",difficulty:"Easy",topic:"Graphs / BFS",company:"Google",url:"https://leetcode.com/problems/flood-fill/",estimate:20},
  {id:217,title:"Contains Duplicate",difficulty:"Easy",topic:"Hashing",company:"Amazon",url:"https://leetcode.com/problems/contains-duplicate/",estimate:15},
  {id:53,title:"Maximum Subarray",difficulty:"Medium",topic:"Greedy / DP",company:"Amazon",url:"https://leetcode.com/problems/maximum-subarray/",estimate:25},
  {id:15,title:"3Sum",difficulty:"Medium",topic:"Two Pointers",company:"Amazon",url:"https://leetcode.com/problems/3sum/",estimate:35},
  {id:49,title:"Group Anagrams",difficulty:"Medium",topic:"Hashing",company:"Google",url:"https://leetcode.com/problems/group-anagrams/",estimate:25},
  {id:200,title:"Number of Islands",difficulty:"Medium",topic:"Graphs / BFS",company:"Google",url:"https://leetcode.com/problems/number-of-islands/",estimate:40},
  {id:322,title:"Coin Change",difficulty:"Medium",topic:"Dynamic Programming",company:"Google",url:"https://leetcode.com/problems/coin-change/",estimate:40},
  {id:98,title:"Validate Binary Search Tree",difficulty:"Medium",topic:"Trees",company:"Microsoft",url:"https://leetcode.com/problems/validate-binary-search-tree/",estimate:30},
  {id:39,title:"Combination Sum",difficulty:"Medium",topic:"Backtracking",company:"Adobe",url:"https://leetcode.com/problems/combination-sum/",estimate:35},
  {id:994,title:"Rotting Oranges",difficulty:"Medium",topic:"Graphs / BFS",company:"Amazon",url:"https://leetcode.com/problems/rotting-oranges/",estimate:30},
  {id:56,title:"Merge Intervals",difficulty:"Medium",topic:"Intervals",company:"Google",url:"https://leetcode.com/problems/merge-intervals/",estimate:30},
  {id:347,title:"Top K Frequent Elements",difficulty:"Medium",topic:"Heap / Hashing",company:"Amazon",url:"https://leetcode.com/problems/top-k-frequent-elements/",estimate:30},
  {id:102,title:"Binary Tree Level Order Traversal",difficulty:"Medium",topic:"Trees / BFS",company:"Microsoft",url:"https://leetcode.com/problems/binary-tree-level-order-traversal/",estimate:25},
  {id:79,title:"Word Search",difficulty:"Medium",topic:"Backtracking",company:"Microsoft",url:"https://leetcode.com/problems/word-search/",estimate:35},
  {id:1143,title:"Longest Common Subsequence",difficulty:"Medium",topic:"Dynamic Programming",company:"Google",url:"https://leetcode.com/problems/longest-common-subsequence/",estimate:40},
  {id:438,title:"Find All Anagrams in a String",difficulty:"Medium",topic:"Sliding Window",company:"Microsoft",url:"https://leetcode.com/problems/find-all-anagrams-in-a-string/",estimate:30},
  {id:19,title:"Remove Nth Node From End of List",difficulty:"Medium",topic:"Linked List",company:"Amazon",url:"https://leetcode.com/problems/remove-nth-node-from-end-of-list/",estimate:25},
  {id:152,title:"Maximum Product Subarray",difficulty:"Medium",topic:"Dynamic Programming",company:"Amazon",url:"https://leetcode.com/problems/maximum-product-subarray/",estimate:35},
  {id:74,title:"Search a 2D Matrix",difficulty:"Medium",topic:"Binary Search",company:"Microsoft",url:"https://leetcode.com/problems/search-a-2d-matrix/",estimate:25},
  {id:208,title:"Implement Trie",difficulty:"Medium",topic:"Trie",company:"Amazon",url:"https://leetcode.com/problems/implement-trie-prefix-tree/",estimate:35},
  {id:743,title:"Network Delay Time",difficulty:"Medium",topic:"Graphs / Dijkstra",company:"Amazon",url:"https://leetcode.com/problems/network-delay-time/",estimate:45},
  {id:127,title:"Word Ladder",difficulty:"Hard",topic:"Graphs / BFS",company:"Meta",url:"https://leetcode.com/problems/word-ladder/",estimate:55},
  {id:42,title:"Trapping Rain Water",difficulty:"Hard",topic:"Two Pointers",company:"Amazon",url:"https://leetcode.com/problems/trapping-rain-water/",estimate:55},
  {id:23,title:"Merge k Sorted Lists",difficulty:"Hard",topic:"Heap / Linked List",company:"Microsoft",url:"https://leetcode.com/problems/merge-k-sorted-lists/",estimate:60},
  {id:124,title:"Binary Tree Maximum Path Sum",difficulty:"Hard",topic:"Trees / DP",company:"Meta",url:"https://leetcode.com/problems/binary-tree-maximum-path-sum/",estimate:55},
  {id:76,title:"Minimum Window Substring",difficulty:"Hard",topic:"Sliding Window",company:"Google",url:"https://leetcode.com/problems/minimum-window-substring/",estimate:50},
  {id:4,title:"Median of Two Sorted Arrays",difficulty:"Hard",topic:"Binary Search",company:"Google",url:"https://leetcode.com/problems/median-of-two-sorted-arrays/",estimate:60},
  {id:10,title:"Regular Expression Matching",difficulty:"Hard",topic:"Dynamic Programming",company:"Google",url:"https://leetcode.com/problems/regular-expression-matching/",estimate:60},
  {id:51,title:"N-Queens",difficulty:"Hard",topic:"Backtracking",company:"Amazon",url:"https://leetcode.com/problems/n-queens/",estimate:50},
  {id:295,title:"Find Median from Data Stream",difficulty:"Hard",topic:"Heap",company:"Google",url:"https://leetcode.com/problems/find-median-from-data-stream/",estimate:50},
  {id:239,title:"Sliding Window Maximum",difficulty:"Hard",topic:"Sliding Window / Deque",company:"Amazon",url:"https://leetcode.com/problems/sliding-window-maximum/",estimate:50},
  {id:25,title:"Reverse Nodes in k-Group",difficulty:"Hard",topic:"Linked List",company:"Amazon",url:"https://leetcode.com/problems/reverse-nodes-in-k-group/",estimate:55},
  {id:84,title:"Largest Rectangle in Histogram",difficulty:"Hard",topic:"Stack",company:"Google",url:"https://leetcode.com/problems/largest-rectangle-in-histogram/",estimate:50},
  {id:72,title:"Edit Distance",difficulty:"Hard",topic:"Dynamic Programming",company:"Google",url:"https://leetcode.com/problems/edit-distance/",estimate:55},
  {id:312,title:"Burst Balloons",difficulty:"Hard",topic:"Dynamic Programming",company:"Google",url:"https://leetcode.com/problems/burst-balloons/",estimate:60},
  {id:37,title:"Sudoku Solver",difficulty:"Hard",topic:"Backtracking",company:"Amazon",url:"https://leetcode.com/problems/sudoku-solver/",estimate:60},
  {id:2951,title:"Minimum Cost to Hire K Workers",difficulty:"Hard",topic:"Heap / Greedy",company:"Google",url:"https://leetcode.com/problems/minimum-cost-to-hire-k-workers/",estimate:55},
  {id:146,title:"LRU Cache",difficulty:"Medium",topic:"Hashing / Linked List",company:"Amazon",url:"https://leetcode.com/problems/lru-cache/",estimate:40},
  {id:105,title:"Construct Binary Tree from Preorder and Inorder Traversal",difficulty:"Medium",topic:"Trees",company:"Amazon",url:"https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",estimate:40},
  {id:416,title:"Partition Equal Subset Sum",difficulty:"Medium",topic:"Dynamic Programming",company:"Microsoft",url:"https://leetcode.com/problems/partition-equal-subset-sum/",estimate:35},
  {id:875,title:"Koko Eating Bananas",difficulty:"Medium",topic:"Binary Search",company:"Google",url:"https://leetcode.com/problems/koko-eating-bananas/",estimate:30},
  {id:155,min:0,title:"Min Stack",difficulty:"Medium",topic:"Stack",company:"Amazon",url:"https://leetcode.com/problems/min-stack/",estimate:25} as Problem
];

const companies = ["All", ...Array.from(new Set(problems.map(p=>p.company)))];
const difficulties: Difficulty[] = ["Easy","Medium","Hard"];

function dateKey(d=new Date()){return d.toLocaleDateString("en-CA");}
function hashSeed(s:string){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function seededShuffle<T>(items:T[], seed:string){const a=[...items];let x=hashSeed(seed);for(let i=a.length-1;i>0;i--){x=(Math.imul(x,1664525)+1013904223)>>>0;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function diffClass(d:Difficulty){return d==="Easy"?"easy":d==="Medium"?"medium":"hard"}
function formatTime(n:number){return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0")}

export default function Home(){
 const [view,setView]=useState<"today"|"problems"|"companies"|"progress"|"settings">("today");
 const [company,setCompany]=useState("All");
 const [solved,setSolved]=useState<number[]>([]);
 const [status,setStatus]=useState<Record<number,Status>>({});
 const [daily,setDaily]=useState<Record<string,number[]>>({});
 const [timeSpent,setTimeSpent]=useState<Record<number,number>>({});
 const [active,setActive]=useState<Problem|null>(null);
 const [seconds,setSeconds]=useState(0);
 const [running,setRunning]=useState(false);
 const [filter,setFilter]=useState("All");
 const [search,setSearch]=useState("");
 const [target,setTarget]=useState({Easy:1,Medium:2,Hard:2});

 const todayKey=dateKey();

 useEffect(()=>{
   try{
    const s=localStorage.getItem("dayflow-solved"); if(s)setSolved(JSON.parse(s));
    const st=localStorage.getItem("dayflow-status"); if(st)setStatus(JSON.parse(st));
    const dl=localStorage.getItem("dayflow-daily"); if(dl)setDaily(JSON.parse(dl));
    const ts=localStorage.getItem("dayflow-time"); if(ts)setTimeSpent(JSON.parse(ts));
    const tg=localStorage.getItem("dayflow-target"); if(tg)setTarget(JSON.parse(tg));
   }catch{}
 },[]);
 useEffect(()=>localStorage.setItem("dayflow-solved",JSON.stringify(solved)),[solved]);
 useEffect(()=>localStorage.setItem("dayflow-status",JSON.stringify(status)),[status]);
 useEffect(()=>localStorage.setItem("dayflow-daily",JSON.stringify(daily)),[daily]);
 useEffect(()=>localStorage.setItem("dayflow-time",JSON.stringify(timeSpent)),[timeSpent]);
 useEffect(()=>localStorage.setItem("dayflow-target",JSON.stringify(target)),[target]);
 useEffect(()=>{if(!running)return;const t=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(t)},[running]);

 const todayIds=useMemo(()=>{
   if(daily[todayKey])return daily[todayKey];
   const available=problems.filter(p=>!solved.includes(p.id));
   const picked:number[]=[];
   for(const d of difficulties){
     const count=target[d];
     const pool=seededShuffle(available.filter(p=>p.difficulty===d && (company==="All"||p.company===company)),todayKey+d+company);
     for(const p of pool){if(picked.length>=5)break;if(!picked.includes(p.id)){picked.push(p.id);if(picked.filter(id=>problems.find(x=>x.id===id)?.difficulty===d).length===count)break}}
   }
   if(picked.length<5){
     const fallback=seededShuffle(available.filter(p=>!picked.includes(p.id) && (company==="All"||p.company===company)),todayKey+"fallback");
     for(const p of fallback){if(picked.length>=5)break;picked.push(p.id)}
   }
   setDaily(x=>({...x,[todayKey]:picked}));
   return picked;
 },[daily,todayKey,solved,company,target]);

 const today=useMemo(()=>todayIds.map(id=>problems.find(p=>p.id===id)).filter(Boolean) as Problem[],[todayIds]);
 const filtered=useMemo(()=>problems.filter(p=>(filter==="All"||p.difficulty===filter)&&(company==="All"||p.company===company)&&p.title.toLowerCase().includes(search.toLowerCase())),[filter,company,search]);
 const solvedToday=today.filter(p=>solved.includes(p.id)).length;
 const totalSolved=solved.length;
 const streak=useMemo(()=>{
   let n=0;const d=new Date();
   while(true){const k=dateKey(d);const ids=daily[k]||[];if(!ids.length||!ids.every(id=>solved.includes(id)))break;n++;d.setDate(d.getDate()-1)}
   return n;
 },[daily,solved]);
 const totalTime=Object.values(timeSpent).reduce((a,b)=>a+b,0);
 const saveAndClose=()=>{
   if(!active)return;
   setTimeSpent(x=>({...x,[active.id]:(x[active.id]||0)+seconds}));
   setRunning(false);setActive(null);setSeconds(0);
 };
 const mark=(p:Problem,s:Status)=>{setStatus(x=>({...x,[p.id]:s}));if(s==="solved")setSolved(x=>x.includes(p.id)?x:[...x,p.id]);else setSolved(x=>x.filter(id=>id!==p.id));};

 return <main className="min-h-screen bg-[#0d0f12] text-[#e8eaed]">
  <header className="h-14 border-b border-[#2a2d32] flex items-center px-5 gap-5 sticky top-0 bg-[#0d0f12]/95 backdrop-blur z-20">
   <button onClick={()=>setView("today")} className="font-bold text-lg tracking-tight"><span className="text-[#ffa116]">D</span>ayFlow</button>
   <div className="text-xs text-[#8b949e] hidden sm:block">SDE DAILY TRACKER</div>
   <div className="ml-auto flex items-center gap-4 text-xs text-[#9da4ad]"><span>🔥 {streak} day streak</span><span>{solvedToday}/5 today</span></div>
  </header>
  <div className="flex min-h-[calc(100vh-56px)]">
   <aside className="w-56 border-r border-[#2a2d32] p-3 hidden md:block">
    <div className="text-[11px] uppercase tracking-wider text-[#6e7681] px-3 py-2">Workspace</div>
    {([["today","Today"],["problems","Problems"],["companies","Companies"],["progress","Progress"],["settings","Settings"]] as const).map(([k,l])=><button key={k} onClick={()=>setView(k)} className={`w-full text-left px-3 py-2.5 rounded-md text-sm mb-1 ${view===k?"bg-[#262a30] text-white":"text-[#9da4ad] hover:bg-[#181b20]"}`}>{l}</button>)}
    <div className="mt-8 px-3 text-[11px] uppercase tracking-wider text-[#6e7681]">Daily target</div>
    <div className="px-3 mt-2 text-xs text-[#9da4ad]">{target.Easy} Easy · {target.Medium} Medium · {target.Hard} Hard</div>
   </aside>

   <section className="flex-1 min-w-0">
    {view==="today"&&<div className="max-w-5xl mx-auto p-5 md:p-8">
      <div className="flex flex-wrap items-end gap-4 mb-7">
       <div><div className="text-xs text-[#8b949e] mb-1">SDE PREP · {todayKey}</div><h1 className="text-3xl font-semibold">Today's Problems</h1><p className="text-sm text-[#8b949e] mt-1">Fresh set generated for today. Topics are intentionally mixed.</p></div>
       <select value={company} onChange={e=>{setCompany(e.target.value);setDaily(x=>{const y={...x};delete y[todayKey];return y})}} className="ml-auto bg-[#16191d] border border-[#343941] rounded-md px-3 py-2 text-sm">{companies.map(c=><option key={c}>{c}</option>)}</select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7"><Stat label="Problems" value={today.length+"/5"}/><Stat label="Estimated" value={today.reduce((a,p)=>a+p.estimate,0)+"m"}/><Stat label="Solved today" value={solvedToday+"/5"}/><Stat label="Lifetime solved" value={String(totalSolved)}/></div>
      <div className="space-y-2">{today.map((p,i)=><ProblemCard key={p.id} p={p} index={i} status={status[p.id]||"unsolved"} onStart={()=>{setActive(p);setSeconds(0);setRunning(false)}} onMark={s=>mark(p,s)}/>)}</div>
      {today.length<5&&<div className="mt-5 border border-yellow-900/50 bg-yellow-950/20 rounded-lg p-4 text-sm text-yellow-300">The current demo dataset does not contain enough unused problems for every filter. Add/import more problems and DayFlow will keep generating the daily 1/2/2 set.</div>}
    </div>}

    {view==="problems"&&<div className="max-w-6xl mx-auto p-5 md:p-8">
      <h1 className="text-3xl font-semibold">Problems</h1><p className="text-sm text-[#8b949e] mt-1 mb-6">Your complete local problem bank and status history.</p>
      <div className="flex flex-wrap gap-2 mb-5"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search problems..." className="bg-[#16191d] border border-[#343941] rounded-md px-3 py-2 text-sm flex-1 min-w-48"/>{["All",...difficulties].map(x=><button key={x} onClick={()=>setFilter(x)} className={`px-3 py-2 rounded-md text-xs border ${filter===x?"bg-[#262a30] border-[#555] text-white":"border-[#343941] text-[#9da4ad]"}`}>{x}</button>)}</div>
      <div className="space-y-2">{filtered.map((p,i)=><ProblemCard key={p.id} p={p} index={i} status={status[p.id]||"unsolved"} onStart={()=>{setActive(p);setSeconds(0);setRunning(false)}} onMark={s=>mark(p,s)}/>)}</div>
    </div>}

    {view==="companies"&&<div className="max-w-5xl mx-auto p-5 md:p-8"><h1 className="text-3xl font-semibold">Companies</h1><p className="text-sm text-[#8b949e] mt-1 mb-7">Filter your daily engine or browse company coverage.</p><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{companies.slice(1).map(c=><button key={c} onClick={()=>{setCompany(c);setDaily(x=>{const y={...x};delete y[todayKey];return y});setView("today")}} className="border border-[#2a2d32] rounded-lg p-5 text-left hover:border-[#454b54] bg-[#121519]"><div className="font-medium">{c}</div><div className="text-xs text-[#8b949e] mt-1">{problems.filter(p=>p.company===c).length} local problems</div></button>)}</div></div>}

    {view==="progress"&&<div className="max-w-5xl mx-auto p-5 md:p-8"><h1 className="text-3xl font-semibold mb-7">Progress</h1><div className="grid md:grid-cols-4 gap-3"><Stat label="Solved" value={String(totalSolved)}/><Stat label="Today" value={solvedToday+"/5"}/><Stat label="Streak" value={streak+" days"}/><Stat label="Time tracked" value={Math.floor(totalTime/60)+"m"}/></div><div className="grid md:grid-cols-3 gap-3 mt-5">{difficulties.map(d=><Stat key={d} label={d+" solved"} value={String(problems.filter(p=>p.difficulty===d&&solved.includes(p.id)).length)}/>)}</div><div className="mt-6 border border-[#2a2d32] rounded-lg p-5 bg-[#121519]"><div className="text-sm mb-3">Lifetime completion</div><div className="h-2 bg-[#292d33] rounded-full overflow-hidden"><div className="h-full bg-[#2f81f7]" style={{width:Math.min(100,totalSolved/problems.length*100)+"%"}}/></div><div className="text-xs text-[#8b949e] mt-3">{totalSolved} of {problems.length} loaded problems solved.</div></div></div>}

    {view==="settings"&&<div className="max-w-3xl mx-auto p-5 md:p-8"><h1 className="text-3xl font-semibold">Settings</h1><p className="text-sm text-[#8b949e] mt-1 mb-7">Daily generation settings are stored in your browser.</p><div className="border border-[#2a2d32] rounded-lg bg-[#121519] p-5"><h2 className="font-medium mb-4">Daily target</h2>{difficulties.map(d=><div key={d} className="flex items-center justify-between border-b border-[#25282d] py-4 last:border-0"><span>{d}</span><input type="number" min={0} max={5} value={target[d]} onChange={e=>setTarget(x=>({...x,[d]:Math.max(0,Math.min(5,Number(e.target.value)||0))}))} className="w-20 bg-[#0d0f12] border border-[#343941] rounded px-3 py-2 text-center"/></div>)}<div className="text-xs text-[#8b949e] mt-4">The default target is 1 Easy + 2 Medium + 2 Hard. Keep the total at 5 for the standard daily session.</div></div><button onClick={()=>{localStorage.clear();location.reload()}} className="mt-5 text-sm text-red-400 border border-red-900 rounded-md px-4 py-2">Reset local progress</button></div>}
   </section>
  </div>

  {active&&<div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-4"><div className="w-full max-w-xl bg-[#15181c] border border-[#343941] rounded-xl shadow-2xl">
    <div className="p-5 border-b border-[#2a2d32] flex items-center"><div><div className="text-xs text-[#8b949e]">{active.difficulty} · {active.topic} · {active.company}</div><h2 className="text-xl font-semibold mt-1">{active.title}</h2></div><button onClick={saveAndClose} className="ml-auto text-[#8b949e] hover:text-white">✕</button></div>
    <div className="p-8 text-center"><div className="font-mono text-6xl tracking-tight">{formatTime(seconds)}</div><div className="text-xs text-[#6e7681] mt-2">Expected ~{active.estimate} minutes</div><div className="flex justify-center gap-2 mt-7"><button onClick={()=>setRunning(!running)} className="px-6 py-2.5 rounded-md bg-[#2f81f7] text-white">{running?"Pause":"Start"}</button><button onClick={()=>setSeconds(0)} className="px-5 py-2.5 rounded-md border border-[#343941]">Reset</button></div></div>
    <div className="p-4 border-t border-[#2a2d32] flex gap-2"><a href={active.url} target="_blank" rel="noreferrer" className="flex-1 text-center px-3 py-2 rounded-md bg-[#ffa116] text-black font-semibold text-sm">Open on LeetCode ↗</a><button onClick={()=>{mark(active,"solved");saveAndClose()}} className="px-4 py-2 rounded-md border border-green-700 text-green-400 text-sm">✓ Solved</button></div>
  </div></div>}
 </main>
}

function ProblemCard({p,index,status,onStart,onMark}:{p:Problem;index:number;status:Status;onStart:()=>void;onMark:(s:Status)=>void}){
 return <article className="border border-[#2a2d32] bg-[#121519] rounded-lg hover:border-[#454b54] transition"><div className="flex items-center gap-4 p-4"><div className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold diff-${diffClass(p.difficulty)}`}>{index+1}</div><div className="min-w-0 flex-1"><div className="font-medium truncate">{p.title}</div><div className="text-xs text-[#8b949e] mt-1">{p.topic} · {p.company} · ~{p.estimate}m</div></div><span className={`text-xs px-2 py-1 rounded diff-${diffClass(p.difficulty)}`}>{p.difficulty}</span><button onClick={onStart} className="px-3 py-2 text-sm rounded-md bg-[#2f81f7] hover:bg-[#388bfd] text-white">Timer</button></div><div className="px-4 pb-3 flex flex-wrap gap-2 justify-end"><select value={status} onChange={e=>onMark(e.target.value as Status)} className="text-xs bg-[#0d0f12] border border-[#343941] rounded px-2 py-1.5"><option value="unsolved">Unsolved</option><option value="solved">Solved</option><option value="revision">Need revision</option><option value="failed">Couldn't solve</option></select><a href={p.url} target="_blank" rel="noreferrer" className="text-xs px-2.5 py-1.5 rounded border border-[#343941] text-[#9da4ad] hover:text-white">LeetCode ↗</a></div></article>
}

function Stat({label,value}:{label:string;value:string}){return <div className="border border-[#2a2d32] rounded-lg bg-[#121519] p-4"><div className="text-xs text-[#8b949e]">{label}</div><div className="text-xl font-semibold mt-1">{value}</div></div>}
