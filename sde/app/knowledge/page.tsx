"use client";

import { useMemo, useState } from "react";
import bank from "../../data/interview-bank.json";

type Item={id:string;category:string;subCategory:string;title:string;source:string;type?:string;level?:string};
const items=bank as Item[];
const subjects=["All","DBMS","OS","CN","OOP","SQL","DSA Fundamentals","OA & Coding Patterns","Machine Coding","LLD","System Design","Behavioral"];

const levelOf=(x:Item)=>x.level||(["DBMS","OS","CN","OOP","SQL","DSA Fundamentals"].includes(x.category)&&x.subCategory==="Fundamentals"?"Beginner":"Interview");

export default function KnowledgeHub(){
 const [subject,setSubject]=useState("All");
 const [topic,setTopic]=useState("All");
 const [level,setLevel]=useState("All");
 const [search,setSearch]=useState("");
 const [sort,setSort]=useState("subject");
 const [selected,setSelected]=useState<Item|null>(null);
 const [showFilters,setShowFilters]=useState(false);
 const topics=useMemo(()=>["All",...Array.from(new Set(items.filter(x=>subject==="All"||x.category===subject).map(x=>x.subCategory))).sort()],[subject]);
 const filtered=useMemo(()=>{
  const q=search.trim().toLowerCase();
  const a=items.filter(x=>(subject==="All"||x.category===subject)&&(topic==="All"||x.subCategory===topic)&&(level==="All"||levelOf(x)===level)&&(!q||[x.title,x.category,x.subCategory].join(" ").toLowerCase().includes(q)));
  return a.sort((a,b)=>sort==="title"?a.title.localeCompare(b.title):sort==="topic"?a.subCategory.localeCompare(b.subCategory):a.category.localeCompare(b.category)||a.subCategory.localeCompare(b.subCategory));
 },[subject,topic,level,search,sort]);
 const counts=useMemo(()=>{const m:Record<string,number>={};for(const x of items)m[x.category]=(m[x.category]||0)+1;return m},[]);
 const grouped=useMemo(()=>{const m:Record<string,Item[]>={};for(const x of filtered)(m[x.subCategory]??=[]).push(x);return m},[filtered]);
 function changeSubject(v:string){setSubject(v);setTopic("All");}
 return <main className="min-h-screen bg-[#080b11] text-white p-5 md:p-8">
  <div className="max-w-7xl mx-auto">
   <div className="rounded-3xl border border-[#202a38] bg-[#0d121a] p-6 md:p-8">
    <div className="text-[10px] tracking-[.24em] text-cyan-200">DACE / STUDY CENTRE</div>
    <div className="flex flex-col lg:flex-row lg:items-end gap-5 justify-between">
     <div><h1 className="text-4xl md:text-5xl font-black mt-3">Learn it. Then solve it.</h1><p className="text-sm text-[#8998ac] mt-3 max-w-3xl">A fundamentals-first interview curriculum. Search one concept, filter by subject and level, then open a focused drill.</p></div>
     <div className="text-right"><div className="text-3xl font-black">{items.length}</div><div className="text-[10px] uppercase tracking-widest text-[#657387]">learning items</div></div>
    </div>
   </div>

   <div className="mt-5 flex flex-col lg:flex-row gap-3">
    <div className="flex-1 relative"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search: normalization, paging, TCP, SQL joins, DP..." className="w-full bg-[#0d121a] border border-[#253246] rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-300/40"/></div>
    <button onClick={()=>setShowFilters(!showFilters)} className="px-4 py-3 rounded-xl border border-[#253246] text-sm">{showFilters?"Hide filters":"Filters"}</button>
    <select value={sort} onChange={e=>setSort(e.target.value)} className="bg-[#0d121a] border border-[#253246] rounded-xl px-4 py-3 text-sm"><option value="subject">Sort: Subject</option><option value="topic">Sort: Topic</option><option value="title">Sort: A-Z</option></select>
   </div>

   <div className="mt-3 flex flex-wrap gap-2">
    {subjects.map(s=><button key={s} onClick={()=>changeSubject(s)} className={"px-3 py-2 rounded-lg border text-xs "+(subject===s?"border-cyan-300/30 bg-cyan-300/10 text-cyan-100":"border-[#253246] text-[#8290a3] hover:text-white")}>{s}{s!=="All"&&<span className="ml-1 text-[10px] opacity-60">{counts[s]||0}</span>}</button>)}
   </div>

   {showFilters&&<div className="mt-3 panel rounded-2xl p-4 grid md:grid-cols-2 gap-3">
    <div><label className="text-[10px] text-[#69788d]">TOPIC</label><select value={topic} onChange={e=>setTopic(e.target.value)} className="mt-2 w-full bg-[#0b1119] border border-[#253245] rounded-xl px-3 py-3 text-sm">{topics.map(t=><option key={t}>{t}</option>)}</select></div>
    <div><label className="text-[10px] text-[#69788d]">LEVEL</label><select value={level} onChange={e=>setLevel(e.target.value)} className="mt-2 w-full bg-[#0b1119] border border-[#253245] rounded-xl px-3 py-3 text-sm"><option>All</option><option>Beginner</option><option>Interview</option></select></div>
   </div>}

   <div className="flex items-center justify-between mt-5 mb-3"><span className="text-xs text-[#68778c]">{filtered.length} results</span><span className="text-[10px] text-[#536174]">Click any item to open its drill</span></div>
   <div className="space-y-4">
    {Object.entries(grouped).map(([group,list])=><section key={group} className="rounded-2xl border border-[#202a38] bg-[#0d121a] p-4">
     <div className="flex justify-between items-center"><h2 className="font-bold">{group}</h2><span className="text-[10px] text-[#718096]">{list.length}</span></div>
     <div className="mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-2">{list.map(x=><button key={x.id} onClick={()=>setSelected(x)} className="text-left p-3 rounded-xl border border-white/5 hover:border-cyan-300/20 hover:bg-white/[.025] transition"><div className="flex items-center gap-2"><span className="text-[10px] text-cyan-200">{x.category}</span><span className="text-[9px] text-[#68778c]">· {levelOf(x)}</span></div><div className="text-sm mt-1 leading-5">{x.title}</div></button>)}</div>
    </section>)}
   </div>
   {!filtered.length&&<div className="text-center text-sm text-[#718096] py-16">Nothing matches those filters.</div>}
  </div>

  {selected&&<div className="fixed inset-0 z-50 flex items-center justify-center p-5"><div className="absolute inset-0 bg-black/70" onClick={()=>setSelected(null)}/><div className="relative max-w-2xl w-full rounded-3xl border border-[#2a374b] bg-[#0d121a] p-6 shadow-2xl">
   <div className="text-[10px] tracking-[.2em] text-cyan-200">{selected.category} · {selected.subCategory} · {levelOf(selected)}</div>
   <h2 className="text-2xl font-black mt-3">{selected.title}</h2>
   <div className="mt-6 rounded-2xl bg-black/20 border border-white/5 p-4 text-sm text-[#a4b0bf] leading-6"><strong className="text-white">Study drill:</strong> define it in your own words, explain one example, state the trade-off or complexity, and then answer a follow-up question without looking at notes.</div>
   <div className="mt-5 flex gap-2"><button onClick={()=>setSelected(null)} className="px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold">Close</button></div>
  </div></div>}
 </main>
}
