"use client";

import { useMemo, useState } from "react";
import bank from "../../data/interview-bank.json";
import curriculum from "../../data/learning-curriculum.json";

type BankItem={id:string;category:string;subCategory:string;title:string;source:string;type?:string;level?:string};
type Lesson={id:string;subject:string;order:number;topic:string;level:string;title:string;learn:string;example:string;keyPoints:string[];interview:{q:string;a:string}[];mcq:{q:string;options:string[];answer:number;why:string}};
const items=bank as BankItem[];
const lessons=curriculum as Lesson[];
const subjects=["DBMS","OS","CN","OOP","SQL","DSA Fundamentals"];
const allSubjects=["All",...subjects,"OA & Coding Patterns","Machine Coding","LLD","System Design","Behavioral"];
const levelOf=(x:BankItem)=>x.level||(["DBMS","OS","CN","OOP","SQL","DSA Fundamentals"].includes(x.category)&&x.subCategory==="Fundamentals"?"Beginner":"Interview");

export default function KnowledgeHub(){
 const initial=typeof window!=="undefined"?new URLSearchParams(window.location.search).get("subject")||"All":"All";
 const [subject,setSubject]=useState(initial);
 const [lessonIndex,setLessonIndex]=useState(0);
 const [done,setDone]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem("dace-lessons")||"[]")}catch{return[]}});
 const [search,setSearch]=useState("");
 const [topic,setTopic]=useState("All");
 const [level,setLevel]=useState("All");
 const [sort,setSort]=useState("sequence");
 const [selected,setSelected]=useState<BankItem|null>(null);
 const subjectLessons=useMemo(()=>lessons.filter(x=>x.subject===subject).sort((a,b)=>a.order-b.order),[subject]);
 const current=subjectLessons[Math.min(lessonIndex,Math.max(0,subjectLessons.length-1))];
 const topics=useMemo(()=>["All",...Array.from(new Set(items.filter(x=>subject==="All"||x.category===subject).map(x=>x.subCategory))).sort()],[subject]);
 const practice=useMemo(()=>{
  const q=search.trim().toLowerCase();
  const a=items.filter(x=>(subject==="All"||x.category===subject)&&(topic==="All"||x.subCategory===topic)&&(level==="All"||levelOf(x)===level)&&(!q||[x.title,x.category,x.subCategory].join(" ").toLowerCase().includes(q)));
  return a.sort((a,b)=>sort==="title"?a.title.localeCompare(b.title):sort==="topic"?a.subCategory.localeCompare(b.subCategory):a.category.localeCompare(b.category)||a.subCategory.localeCompare(b.subCategory)||a.title.localeCompare(b.title));
 },[subject,topic,level,search,sort]);
 function chooseSubject(s:string){setSubject(s);setLessonIndex(0);setTopic("All");setSearch("");}
 function markDone(id:string){setDone(x=>{const n=x.includes(id)?x:[...x,id];localStorage.setItem("dace-lessons",JSON.stringify(n));return n})}
 function next(){if(current){markDone(current.id);setLessonIndex(i=>Math.min(i+1,subjectLessons.length-1));window.scrollTo({top:0,behavior:"smooth"})}}
 return <main className="min-h-screen bg-[#080b11] text-white p-5 md:p-8">
  <div className="max-w-7xl mx-auto">
   <div className="rounded-3xl border border-[#202a38] bg-[#0d121a] p-6 md:p-8">
    <div className="text-[10px] tracking-[.24em] text-cyan-200">DACE / STUDY CENTRE</div>
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
     <div><h1 className="text-4xl md:text-5xl font-black mt-3">Learn. Understand. Practice. Revise.</h1><p className="text-sm text-[#8998ac] mt-3 max-w-3xl">No more empty subject pages and no more prompts telling you to invent the answer yourself. Each core subject has a fixed learning sequence with explanations, examples, interview answers, MCQs, and a large practice bank.</p></div>
     <div className="text-right"><div className="text-3xl font-black">{items.length+lessons.length}</div><div className="text-[10px] uppercase tracking-widest text-[#657387]">study + practice items</div></div>
    </div>
   </div>

   <div className="mt-5 flex flex-wrap gap-2">
    {allSubjects.map(s=><button key={s} onClick={()=>chooseSubject(s)} className={"px-3 py-2 rounded-lg border text-xs "+(subject===s?"border-cyan-300/30 bg-cyan-300/10 text-cyan-100":"border-[#253246] text-[#8290a3] hover:text-white")}>{s}</button>)}
   </div>

   {subjects.includes(subject)&&current&&<section className="mt-5 grid lg:grid-cols-[1.55fr_.75fr] gap-5">
    <div className="rounded-3xl border border-cyan-300/10 bg-[#0d121a] overflow-hidden">
     <div className="p-5 md:p-7 border-b border-[#202a38]">
      <div className="flex items-center gap-2 text-[10px] tracking-[.2em] text-cyan-200">LESSON {current.order} / {subjectLessons.length} · {current.topic.toUpperCase()}</div>
      <h2 className="text-2xl md:text-3xl font-black mt-3">{current.title}</h2>
      <div className="text-xs text-[#718096] mt-2">{current.level} · prerequisite-aware sequence</div>
     </div>
     <div className="p-5 md:p-7 space-y-5">
      <div><div className="text-[10px] tracking-widest text-[#617188]">LEARN</div><p className="text-[15px] leading-7 text-[#c2cbd6] mt-2">{current.learn}</p></div>
      <div className="rounded-2xl border border-[#253246] bg-[#0a1017] p-5"><div className="text-[10px] tracking-widest text-cyan-200">WORKED EXAMPLE</div><p className="text-sm leading-6 text-[#aeb9c8] mt-2">{current.example}</p></div>
      <div><div className="text-[10px] tracking-widest text-[#617188]">REMEMBER</div><ul className="mt-2 space-y-2">{current.keyPoints.map((k,i)=><li key={i} className="text-sm text-[#aeb9c8] leading-6 flex gap-2"><span className="text-cyan-300">•</span>{k}</li>)}</ul></div>
      <div className="rounded-2xl border border-violet-300/10 bg-violet-300/[.03] p-5"><div className="text-[10px] tracking-widest text-violet-200">INTERVIEW ANSWER</div>{current.interview.map((q,i)=><div key={i} className="mt-3"><div className="text-sm font-semibold">{q.q}</div><div className="text-sm text-[#aeb9c8] leading-6 mt-1">{q.a}</div></div>)}</div>
      <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[.03] p-5"><div className="text-[10px] tracking-widest text-amber-200">CHECK YOURSELF</div><div className="font-semibold text-sm mt-2">{current.mcq.q}</div><div className="grid md:grid-cols-2 gap-2 mt-3">{current.mcq.options.map((o,i)=><div key={i} className={"p-3 rounded-xl border text-sm "+(i===current.mcq.answer?"border-green-300/20 bg-green-300/[.05] text-green-100":"border-white/5 text-[#aeb9c8]")}>{String.fromCharCode(65+i)}. {o}{i===current.mcq.answer&&<span className="text-[10px] ml-2 text-green-300">ANSWER</span>}</div>)}</div><p className="text-xs text-[#8998ac] mt-3"><b className="text-white">Why:</b> {current.mcq.why}</p></div>
      <div className="flex flex-wrap gap-2"><button onClick={()=>markDone(current.id)} className="px-4 py-2.5 rounded-xl border border-green-300/20 text-green-200 text-sm">{done.includes(current.id)?"✓ Completed":"Mark lesson complete"}</button><button onClick={next} className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold">{lessonIndex===subjectLessons.length-1?"Finish subject":"Next lesson →"}</button></div>
     </div>
    </div>
    <aside className="rounded-3xl border border-[#202a38] bg-[#0d121a] p-5 h-fit sticky top-24">
     <div className="text-[10px] tracking-widest text-[#617188]">LEARNING PATH</div>
     <div className="text-sm font-semibold mt-2">{subject}</div>
     <div className="mt-4 space-y-1">{subjectLessons.map((l,i)=><button key={l.id} onClick={()=>setLessonIndex(i)} className={"w-full text-left p-3 rounded-xl text-xs "+(i===lessonIndex?"bg-cyan-300/10 border border-cyan-300/20":"hover:bg-white/[.03]") }><div className="flex gap-2"><span className="text-[#5f7088]">{String(l.order).padStart(2,"0")}</span><span className="flex-1">{l.title}</span>{done.includes(l.id)&&<span className="text-green-300">✓</span>}</div></button>)}</div>
     <div className="mt-5 p-4 rounded-2xl bg-[#0a1017] border border-white/5"><div className="text-[10px] text-[#617188]">SUBJECT PROGRESS</div><div className="text-2xl font-black mt-1">{subjectLessons.filter(l=>done.includes(l.id)).length}/{subjectLessons.length}</div><div className="h-2 rounded-full bg-[#18212d] mt-3"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{width:(subjectLessons.filter(l=>done.includes(l.id)).length/Math.max(1,subjectLessons.length)*100)+"%"}}/></div></div>
    </aside>
   </section>}

   <section className="mt-8 rounded-3xl border border-[#202a38] bg-[#0d121a] p-5 md:p-6">
    <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between"><div><div className="text-[10px] tracking-widest text-violet-200">PRACTICE BANK</div><h2 className="text-2xl font-black mt-2">{subject==="All"?"All interview questions":subject+" questions"}</h2><p className="text-xs text-[#718096] mt-1">The lessons teach the concept first. This bank gives you the repetition and interview practice.</p></div><div className="text-xs text-[#718096]">{practice.length} questions</div></div>
    <div className="mt-4 grid lg:grid-cols-[1fr_180px_160px_150px] gap-2">
     <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find normalization, paging, joins, DP..." className="bg-[#0a1017] border border-[#253246] rounded-xl px-4 py-3 text-sm outline-none"/>
     <select value={topic} onChange={e=>setTopic(e.target.value)} className="bg-[#0a1017] border border-[#253246] rounded-xl px-3 py-3 text-sm">{topics.map(t=><option key={t}>{t}</option>)}</select>
     <select value={level} onChange={e=>setLevel(e.target.value)} className="bg-[#0a1017] border border-[#253246] rounded-xl px-3 py-3 text-sm"><option>All</option><option>Beginner</option><option>Interview</option></select>
     <select value={sort} onChange={e=>setSort(e.target.value)} className="bg-[#0a1017] border border-[#253246] rounded-xl px-3 py-3 text-sm"><option value="sequence">Subject</option><option value="topic">Topic</option><option value="title">A-Z</option></select>
    </div>
    <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-2">{practice.map(x=><button key={x.id} onClick={()=>setSelected(x)} className="text-left p-4 rounded-2xl border border-white/5 hover:border-cyan-300/20 hover:bg-white/[.025]"><div className="flex items-center gap-2"><span className="text-[10px] text-cyan-200">{x.category}</span><span className="text-[9px] text-[#68778c]">· {x.subCategory}</span></div><div className="text-sm leading-5 mt-2">{x.title}</div><div className="text-[10px] text-[#657387] mt-2">{levelOf(x)}</div></button>)}</div>
   </section>
  </div>

  {selected&&<div className="fixed inset-0 z-50 flex items-center justify-center p-5"><div className="absolute inset-0 bg-black/75" onClick={()=>setSelected(null)}/><div className="relative max-w-3xl w-full max-h-[90vh] overflow-auto rounded-3xl border border-[#2a374b] bg-[#0d121a] p-6 shadow-2xl">
   <div className="text-[10px] tracking-[.2em] text-cyan-200">{selected.category} · {selected.subCategory} · {levelOf(selected)}</div><h2 className="text-2xl font-black mt-3">{selected.title}</h2>
   <div className="mt-5 rounded-2xl bg-black/20 border border-white/5 p-5"><div className="text-[10px] tracking-widest text-violet-200">HOW TO STUDY THIS</div><p className="text-sm text-[#aeb9c8] leading-6 mt-2">Use the matching lesson above first when available. Then explain the concept, give an example, state the trade-off/complexity, and compare it with the closest alternative.</p></div>
   <button onClick={()=>setSelected(null)} className="mt-5 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold">Close</button>
  </div></div>}
 </main>
}
