"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

function getSupabase(){ return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

export default function AuthCallback(){
  useEffect(()=>{
    const code=new URLSearchParams(window.location.search).get("code");
    if(!code){window.location.href="/login";return;}
    getSupabase().auth.exchangeCodeForSession(code).then(({error})=>{
      window.location.href=error?"/login":"/";
    });
  },[]);
  return <main className="min-h-screen flex items-center justify-center bg-[#080b10] text-slate-300">Signing you in…</main>;
}
