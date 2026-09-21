"use client";

import { useMemo, useState } from "react";
import bank from "../../data/interview-bank.json";

type Item={id:string;category:string;subCategory:string;title:string;source:string;type:string};
const items=bank as Item[];
const categories=["All",...Array.from(new Set(items.map(x=>x.category)))];

export default function KnowledgeHub(){
 const [category,setCategory]=useState("All");
 const [search,setSearch]=useState("");
 const [selected,setSelected]=useState<Item|null>(null);
 const filtered=useMemo(()=>items.filter(x=>(category==="All"||x.category===category)&&x.title.toLowerCase().includes(search.toLowerCase())),[category,search]);
 const grouped=useMemo(()=>{const m:Record<string,Item[]>={};for(const x of filtered)(m[x.subCategory]??=[]).push(x);return m},[filtered]);
 return <main className="min-h-screen bg-[#080b11] text-white p-5 md:p-8">
  <div className="max-w-7xl mx-auto">
   <div className="rounded-3xl border border-[#202a38] bg-[#0d121a] p-6 md:p-8">
    <div className="text-[10px] tracking-[.24em] text-cyan-200">DACE / KNOWLEDGE HUB</div>
    <div className="flex flex-col lg:flex-row lg:items-end gap-5 justify-between">
     <div><h1 className="text-4xl md:text-5xl font-black mt-3">Beyond LeetCode.</h1><p className="text-sm text-[#8998ac] mt-3 max-w-2xl">Core CS, SQL, machine coding, LLD, system design, behavioral preparation and OA patterns now live beside the 1,923-problem DSA bank.</p></div>
     <div className="text-right"><div className="text-3xl font-black">{items.length}</div><div className="text-[10px] uppercase tracking-widest text-[#657387]">study prompts</div></div>
    </div>
   </div>
   <div className="mt-5 flex flex-col md:flex-row gap-3">
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search questions..." className="flex-1 bg-[#0d121a] border border-[#253246] rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-300/40"/>
    <select value={category} onChange={e=>setCategory(e.target.value)} className="bg-[#0d121a] border border-[#253246] rounded-xl px-4 py-3 text-sm">{categories.map(c=><option key={c}>{c}</option>)}</select>
   </div>
   <div className="mt-5 grid xl:grid-cols-3 gap-4">
    {Object.entries(grouped).map(([group,list])=><section key={group} className="rounded-2xl border border-[#202a38] bg-[#0d121a] p-4">
      <div className="flex justify-between items-center"><h2 className="font-bold">{group}</h2><span className="text-[10px] text-[#718096]">{list.length}</span></div>
      <div className="mt-3 space-y-2">{list.map(x=><button key={x.id} onClick={()=>setSelected(x)} className="w-full text-left p-3 rounded-xl border border-white/5 hover:border-cyan-300/20 hover:bg-white/[.025] transition"><div className="text-[10px] text-cyan-200">{x.category}</div><div className="text-sm mt-1 leading-5">{x.title}</div></button>)}</div>
    </section>)}
   </div>
   {!filtered.length&&<div className="text-center text-sm text-[#718096] py-16">No matching prompts.</div>}
  </div>
  {selected&&<div className="fixed inset-0 z-50 flex items-center justify-center p-5"><div className="absolute inset-0 bg-black/70" onClick={()=>setSelected(null)}/><div className="relative max-w-2xl w-full rounded-3xl border border-[#2a374b] bg-[#0d121a] p-6 shadow-2xl">
   <div className="text-[10px] tracking-[.2em] text-cyan-200">{selected.category} · {selected.subCategory}</div>
   <h2 className="text-2xl font-black mt-3">{selected.title}</h2>
   <div className="mt-6 rounded-2xl bg-black/20 border border-white/5 p-4 text-sm text-[#a4b0bf] leading-6">
    <strong className="text-white">Interview drill:</strong> explain your approach aloud, state assumptions, discuss trade-offs, then give a concrete example or implementation plan. For coding prompts, state complexity before coding.
   </div>
   <button onClick={()=>setSelected(null)} className="mt-5 px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold">Close</button>
  </div></div>}
 </main>
}
