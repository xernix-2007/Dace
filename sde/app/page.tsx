"use client";

import problemsData from "../data/problems.json";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowUpRight, BarChart3, BookOpen, BriefcaseBusiness, CalendarDays,
  Check, CheckCircle2, ChevronRight, CircleHelp, Clock3, Code2, Download,
  Flame, Gauge, GitBranch, GraduationCap, LayoutDashboard, ListChecks, Menu,
  Play, RotateCcw, Search, Settings, ShieldCheck, Sparkles, Target, Timer,
  Trophy, Upload, UserRound, X, Zap
} from "lucide-react";

type Difficulty="Easy"|"Medium"|"Hard";
type Status="unsolved"|"solved"|"revision"|"failed";
type View="overview"|"today"|"problems"|"companies"|"analytics"|"interview"|"prep"|"knowledge"|"dbms"|"os"|"cn"|"oop"|"sql"|"dsa"|"settings";
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
 if(t.some(x=>x.includes("backtracking")))return "Backtracking";
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
