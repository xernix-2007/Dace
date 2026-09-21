"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Github, Chrome, ArrowRight, Loader2, UserRound } from "lucide-react";

function getSupabase(){ return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

export default function LoginPage(){
  const [mode,setMode]=useState<"login"|"signup">("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [username,setUsername]=useState("");
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    getSupabase().auth.getUser().then(({data})=>{ if(data.user) window.location.href="/"; });
  },[]);

  async function submit(e:FormEvent){
    e.preventDefault(); setLoading(true); setMessage("");
    if(mode==="signup"){
      const {data,error}=await getSupabase().auth.signUp({
        email,password,
        options:{data:{full_name:name.trim(),username:username.trim()}}
      });
      if(error) setMessage(error.message);
      else if(data.session) window.location.href="/";
      else setMessage("Account created. Check your email to confirm your account.");
    }else{
      const {error}=await getSupabase().auth.signInWithPassword({email,password});
      if(error) setMessage(error.message);
      else window.location.href="/";
    }
    setLoading(false);
  }

  async function oauth(provider:"github"|"google"){
    setLoading(true); setMessage("");
    const {error}=await getSupabase().auth.signInWithOAuth({
      provider,
      options:{redirectTo:window.location.origin+"/auth/callback"}
    });
    if(error){setMessage(error.message);setLoading(false);}
  }

  return <main className="min-h-screen dace-grid flex items-center justify-center px-4 py-10">
    <section className="w-full max-w-md panel rounded-3xl p-7 shadow-2xl">
      <div className="mb-7">
        <div className="text-xs uppercase tracking-[.25em] text-cyan-300">DACE</div>
        <h1 className="mt-2 text-3xl font-bold">Your coding workspace</h1>
        <p className="mt-2 text-sm text-slate-400">Create an account to keep your progress, streaks and prep plans across devices.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-1 mb-5">
        <button onClick={()=>{setMode("login");setMessage("")}} className={`rounded-lg px-3 py-2 text-sm ${mode==="login"?"bg-slate-800 text-white":"text-slate-400"}`}>Login</button>
        <button onClick={()=>{setMode("signup");setMessage("")}} className={`rounded-lg px-3 py-2 text-sm ${mode==="signup"?"bg-slate-800 text-white":"text-slate-400"}`}>Create account</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={()=>oauth("github")} disabled={loading} className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm hover:bg-slate-800"><Github size={17}/> GitHub</button>
        <button onClick={()=>oauth("google")} disabled={loading} className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm hover:bg-slate-800"><Chrome size={17}/> Google</button>
      </div>
      <div className="my-5 flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-slate-800"/>OR<span className="h-px flex-1 bg-slate-800"/></div>
      <form onSubmit={submit} className="space-y-3">
        {mode==="signup" && <>
          <label className="block text-xs text-slate-400">Name<input required value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400" placeholder="Your name"/></label>
          <label className="block text-xs text-slate-400">Username<input required minLength={3} value={username} onChange={e=>setUsername(e.target.value.replace(/\s/g,"").toLowerCase())} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400" placeholder="ashwin_07"/></label>
        </>}
        <label className="block text-xs text-slate-400">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400" placeholder="you@example.com"/></label>
        <label className="block text-xs text-slate-400">Password<input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400" placeholder="At least 6 characters"/></label>
        {message && <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-3 py-3 text-sm text-slate-300">{message}</div>}
        <button disabled={loading} className="w-full rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-60">{loading?<Loader2 className="mx-auto animate-spin" size={18}/>:<span className="flex items-center justify-center gap-2">{mode==="login"?"Login":"Create account"}<ArrowRight size={17}/></span>}</button>
      </form>
      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><UserRound size={14}/> Your name and username are stored with your DACE account.</div>
    </section>
  </main>;
}
