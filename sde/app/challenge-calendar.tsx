"use client";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, ChevronLeft, ChevronRight, ExternalLink, PlayCircle } from "lucide-react";

type Task={title:string;topic?:string;kind?:"problem"|"system"|"review"};
type Day={day:number;title:string;phase:"DSA"|"System Design";tasks:Task[]};
const raw: [string,string[]][] = [
["Arrays",["Two Sum","Best Time to Buy and Sell Stock","Contains Duplicate","Product of Array Except Self"]],
["Arrays",["Maximum Subarray","Merge Intervals","Rotate Array","Move Zeroes"]],
["Arrays",["3Sum","Container With Most Water","Next Permutation","Majority Element"]],
["Strings",["Valid Anagram","Longest Substring Without Repeating Characters","Group Anagrams","Valid Palindrome"]],
["Strings",["Longest Palindromic Substring","String to Integer (atoi)","Longest Common Prefix","Minimum Window Substring"]],
["Hashing",["Subarray Sum Equals K","Longest Consecutive Sequence","Top K Frequent Elements","LRU Cache"]],
["Two Pointers / Window",["Trapping Rain Water","Sort Colors","Permutation in String","Max Consecutive Ones III"]],
["Binary Search",["Binary Search","Search in Rotated Sorted Array","Find Minimum in Rotated Sorted Array","Koko Eating Bananas"]],
["Binary Search",["Median of Two Sorted Arrays","Search a 2D Matrix","Capacity To Ship Packages Within D Days","Find Peak Element"]],
["Linked List",["Reverse Linked List","Merge Two Sorted Lists","Linked List Cycle","Remove Nth Node From End of List"]],
["Linked List",["Reorder List","Add Two Numbers","Copy List with Random Pointer","Merge k Sorted Lists"]],
["Stack",["Valid Parentheses","Min Stack","Daily Temperatures","Largest Rectangle in Histogram"]],
["Stack / Queue",["Next Greater Element I","Evaluate Reverse Polish Notation","Implement Queue using Stacks","Sliding Window Maximum"]],
["Backtracking",["Subsets","Permutations","Combination Sum","Letter Combinations of a Phone Number"]],
["Backtracking",["Word Search","N-Queens","Palindrome Partitioning","Generate Parentheses"]],
["Trees",["Maximum Depth of Binary Tree","Invert Binary Tree","Same Tree","Diameter of Binary Tree"]],
["Trees (BFS)",["Binary Tree Level Order Traversal","Binary Tree Zigzag Level Order Traversal","Binary Tree Right Side View","Lowest Common Ancestor of a Binary Tree"]],
["BST",["Validate Binary Search Tree","Kth Smallest Element in a BST","Lowest Common Ancestor of a Binary Search Tree","Convert Sorted Array to Binary Search Tree"]],
["Trees (Hard)",["Construct Binary Tree from Preorder and Inorder Traversal","Serialize and Deserialize Binary Tree","Binary Tree Maximum Path Sum","Subtree of Another Tree"]],
["Heaps",["Kth Largest Element in an Array","Top K Frequent Words","Find Median from Data Stream","Task Scheduler"]],
["Heaps",["Last Stone Weight","K Closest Points to Origin","Reorganize String","Meeting Rooms II"]],
["Graphs (DFS/BFS)",["Number of Islands","Clone Graph","Max Area of Island","Rotting Oranges"]],
["Graphs (Grid)",["Pacific Atlantic Water Flow","Surrounded Regions","Walls and Gates","Word Ladder"]],
["Graphs (Topological Sort)",["Course Schedule","Course Schedule II","Alien Dictionary","Graph Valid Tree"]],
["Union Find",["Number of Connected Components in an Undirected Graph","Redundant Connection","Accounts Merge","Is Graph Bipartite?"]],
["Shortest Paths",["Network Delay Time","Cheapest Flights Within K Stops","Path With Minimum Effort","Min Cost to Connect All Points"]],
["Tries",["Implement Trie (Prefix Tree)","Design Add and Search Words Data Structure","Word Search II","Replace Words"]],
["Dynamic Programming (1D)",["Climbing Stairs","House Robber","House Robber II","Min Cost Climbing Stairs"]],
["Dynamic Programming (1D)",["Coin Change","Longest Increasing Subsequence","Word Break","Decode Ways"]],
["Dynamic Programming (Subset)",["Maximum Product Subarray","Partition Equal Subset Sum","Combination Sum IV","Perfect Squares"]],
["Dynamic Programming (Grid)",["Unique Paths","Minimum Path Sum","Maximal Square","Triangle"]],
["Dynamic Programming (Strings)",["Longest Common Subsequence","Edit Distance","Palindromic Substrings","Distinct Subsequences"]],
["Dynamic Programming (Hard)",["Best Time to Buy and Sell Stock with Cooldown","Target Sum","Regular Expression Matching","Burst Balloons"]],
["Greedy",["Jump Game","Jump Game II","Gas Station","Hand of Straights"]],
["Intervals",["Non-overlapping Intervals","Insert Interval","Meeting Rooms","Partition Labels"]],
["Bit Manipulation",["Single Number","Number of 1 Bits","Counting Bits","Missing Number"]],
["Bits / Math",["Reverse Bits","Sum of Two Integers","Pow(x, n)","Happy Number"]],
["Matrix",["Rotate Image","Spiral Matrix","Set Matrix Zeroes","Game of Life"]],
["Design Data Structures",["Design HashMap","Design Twitter","Time Based Key-Value Store","Insert Delete GetRandom O(1)"]],
["Revision: Arrays",["First Missing Positive","Find the Duplicate Number","Longest Repeating Character Replacement","Minimum Size Subarray Sum"]],
["Revision: Trees / Graphs",["Flatten Binary Tree to Linked List","Populating Next Right Pointers in Each Node","Count Good Nodes in Binary Tree","Reconstruct Itinerary"]],
["Revision: DP",["Longest Palindromic Subsequence","House Robber III","Interleaving String","Coin Change II"]],
["Mock Round 1",["Medium problem #1 — 30 minutes timed","Medium problem #2 — 30 minutes timed","Hard problem — 45 minutes timed","Review mistakes and note patterns"]],
["Mock Round 2",["Medium problem #1 — 30 minutes timed","Medium problem #2 — 30 minutes timed","Hard problem — 45 minutes timed","Explain solutions out loud"]],
["Final DSA Revision",["Re-solve your 4 toughest problems","Revise pattern notes: window, DP, graphs","Review complexity cheat sheet","Dry-run 2 problems on paper"]],
["System Design: Fundamentals",["Scalability: vertical vs horizontal","Latency vs throughput","CAP theorem and consistency models","Load balancing: L4 vs L7"]],
["System Design: Caching",["Cache strategies: write-through, write-back, cache-aside","Eviction policies: LRU and LFU","CDN basics","Redis internals and use cases"]],
["System Design: Databases",["SQL vs NoSQL: when to use which","Indexing and B-trees","Replication: leader-follower","Sharding and partitioning"]],
["APIs and Networks",["REST vs gRPC vs GraphQL","HTTP/HTTPS, DNS and TCP basics","WebSockets, SSE and long polling","Rate limiting algorithms"]],
["Messaging",["Message queues vs streams","Kafka fundamentals","Pub/Sub and event-driven design","Idempotency, retries and dead-letter queues"]],
["System Design Building Blocks",["Consistent hashing","Bloom filters","Unique ID generation (Snowflake)","Back-of-envelope estimation"]],
["Classic Designs",["URL Shortener (TinyURL)","Pastebin","Rate Limiter","Unique ID Generator"]],
["Infrastructure Designs",["Key-Value Store","Notification System","Web Crawler","Typeahead / Autocomplete"]],
["Social Applications",["WhatsApp chat system","Twitter News Feed","Instagram","Dropbox / Google Drive"]],
["Large-Scale Designs",["YouTube / Netflix","Uber / Ride Sharing","Google Docs collaboration","BookMyShow / Ticketmaster"]],
["Low-Level Design",["SOLID principles","Design patterns: Singleton, Factory, Observer","Parking Lot (LLD)","Splitwise / Elevator (LLD)"]],
["Reliability",["Monolith vs microservices","API gateway and service discovery","Circuit breaker, bulkhead and retries","Monitoring, logging and tracing"]],
["Mock Design 1",["Pick a random design problem — 45 minute timer","Clarify requirements, estimates and API design","Draw high-level diagram and deep dive","Self-review gaps and trade-offs"]],
["Mock Design 2",["Pick a new design problem — 45 minute timer","Explain trade-offs out loud","Handle 10x scale and failure follow-ups","Record yourself and review"]],
["Launch Day",["Revise system design cheat sheet","Prepare 5 STAR behavioural stories","Update resume and LinkedIn","Ask for 10 referrals and apply"]]
];
const days:Day[]=raw.map(([title,names],i)=>({day:i+1,title,phase:i<45?"DSA":"System Design",tasks:names.map((title,j)=>({title,kind:i<37?"problem":i<45?"review":"system"}))}));
const slug=(s:string)=>s.toLowerCase().replace(/[’']/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const lcSlug:Record<string,string>={
"two sum":"two-sum","best time to buy and sell stock":"best-time-to-buy-and-sell-stock","contains duplicate":"contains-duplicate","product of array except self":"product-of-array-except-self","maximum subarray":"maximum-subarray","merge intervals":"merge-intervals","rotate array":"rotate-array","move zeroes":"move-zeroes","3sum":"3sum","container with most water":"container-with-most-water","next permutation":"next-permutation","majority element":"majority-element","valid anagram":"valid-anagram","longest substring without repeating characters":"longest-substring-without-repeating-characters","group anagrams":"group-anagrams","valid palindrome":"valid-palindrome","longest palindromic substring":"longest-palindromic-substring","string to integer (atoi)":"string-to-integer-atoi","longest common prefix":"longest-common-prefix","minimum window substring":"minimum-window-substring","subarray sum equals k":"subarray-sum-equals-k","longest consecutive sequence":"longest-consecutive-sequence","top k frequent elements":"top-k-frequent-elements","lru cache":"lru-cache","trapping rain water":"trapping-rain-water","sort colors":"sort-colors","permutation in string":"permutation-in-string","max consecutive ones iii":"max-consecutive-ones-iii","binary search":"binary-search","search in rotated sorted array":"search-in-rotated-sorted-array","find minimum in rotated sorted array":"find-minimum-in-rotated-sorted-array","koko eating bananas":"koko-eating-bananas","median of two sorted arrays":"median-of-two-sorted-arrays","search a 2d matrix":"search-a-2d-matrix","find peak element":"find-peak-element","reverse linked list":"reverse-linked-list","merge two sorted lists":"merge-two-sorted-lists","linked list cycle":"linked-list-cycle","remove nth node from end of list":"remove-nth-node-from-end-of-list","reorder list":"reorder-list","add two numbers":"add-two-numbers","copy list with random pointer":"copy-list-with-random-pointer","merge k sorted lists":"merge-k-sorted-lists","valid parentheses":"valid-parentheses","min stack":"min-stack","daily temperatures":"daily-temperatures","largest rectangle in histogram":"largest-rectangle-in-histogram","subsets":"subsets","permutations":"permutations","combination sum":"combination-sum","word search":"word-search","n-queens":"n-queens","generate parentheses":"generate-parentheses","maximum depth of binary tree":"maximum-depth-of-binary-tree","invert binary tree":"invert-binary-tree","same tree":"same-tree","diameter of binary tree":"diameter-of-binary-tree","binary tree level order traversal":"binary-tree-level-order-traversal","binary tree right side view":"binary-tree-right-side-view","lowest common ancestor of a binary tree":"lowest-common-ancestor-of-a-binary-tree","validate binary search tree":"validate-binary-search-tree","kth smallest element in a bst":"kth-smallest-element-in-a-bst","lowest common ancestor of a binary search tree":"lowest-common-ancestor-of-a-binary-search-tree","convert sorted array to binary search tree":"convert-sorted-array-to-binary-search-tree","binary tree maximum path sum":"binary-tree-maximum-path-sum","subtree of another tree":"subtree-of-another-tree","kth largest element in an array":"kth-largest-element-in-an-array","top k frequent words":"top-k-frequent-words","find median from data stream":"find-median-from-data-stream","task scheduler":"task-scheduler","last stone weight":"last-stone-weight","k closest points to origin":"k-closest-points-to-origin","reorganize string":"reorganize-string","number of islands":"number-of-islands","clone graph":"clone-graph","max area of island":"max-area-of-island","rotting oranges":"rotting-oranges","pacific atlantic water flow":"pacific-atlantic-water-flow","surrounded regions":"surrounded-regions","word ladder":"word-ladder","course schedule":"course-schedule","course schedule ii":"course-schedule-ii","redundant connection":"redundant-connection","accounts merge":"accounts-merge","is graph bipartite?":"is-graph-bipartite","network delay time":"network-delay-time","cheapest flights within k stops":"cheapest-flights-within-k-stops","path with minimum effort":"path-with-minimum-effort","implement trie (prefix tree)":"implement-trie-prefix-tree","word search ii":"word-search-ii","replace words":"replace-words","climbing stairs":"climbing-stairs","house robber":"house-robber","house robber ii":"house-robber-ii","min cost climbing stairs":"min-cost-climbing-stairs","coin change":"coin-change","longest increasing subsequence":"longest-increasing-subsequence","word break":"word-break","decode ways":"decode-ways","maximum product subarray":"maximum-product-subarray","partition equal subset sum":"partition-equal-subset-sum","combination sum iv":"combination-sum-iv","perfect squares":"perfect-squares","unique paths":"unique-paths","minimum path sum":"minimum-path-sum","maximal square":"maximal-square","triangle":"triangle","longest common subsequence":"longest-common-subsequence","edit distance":"edit-distance","palindromic substrings":"palindromic-substrings","distinct subsequences":"distinct-subsequences","target sum":"target-sum","jump game":"jump-game","jump game ii":"jump-game-ii","gas station":"gas-station","non-overlapping intervals":"non-overlapping-intervals","insert interval":"insert-interval","single number":"single-number","number of 1 bits":"number-of-1-bits","counting bits":"counting-bits","missing number":"missing-number","reverse bits":"reverse-bits","sum of two integers":"sum-of-two-integers","pow(x, n)":"powx-n","happy number":"happy-number","rotate image":"rotate-image","spiral matrix":"spiral-matrix","set matrix zeroes":"set-matrix-zeroes","game of life":"game-of-life","first missing positive":"first-missing-positive","longest palindromic subsequence":"longest-palindromic-subsequence","house robber iii":"house-robber-iii","interleaving string":"interleaving-string","coin change ii":"coin-change-2"
};
const lcUrl=(title:string)=>"https://leetcode.com/problems/"+(lcSlug[title.toLowerCase()]||slug(title))+"/";
const searchUrl=(title:string)=>"https://www.youtube.com/results?search_query="+encodeURIComponent("Indian teacher "+title+" LeetCode solution Hindi");
export default function ChallengeCalendar({problems=[]}:{problems?:{title:string;leetcodeNumber?:number|null;url?:string}[]}) {
 const [day,setDay]=useState(1),[search,setSearch]=useState(""),[done,setDone]=useState<Record<string,boolean>>({});
 useEffect(()=>{try{const v=localStorage.getItem("dace-challenge-60-v1");if(v)setDone(JSON.parse(v))}catch{}},[]);
 const toggle=(key:string)=>setDone(old=>{const next={...old,[key]:!old[key]};try{localStorage.setItem("dace-challenge-60-v1",JSON.stringify(next))}catch{}return next});
 const query=search.trim().toLowerCase();
 const shown=useMemo(()=>query?days.filter(d=>(d.title+" "+d.tasks.map(t=>t.title).join(" ")).toLowerCase().includes(query)):days.filter(d=>d.day===day),[query,day]);
 const total=days.reduce((n,d)=>n+d.tasks.length,0),complete=Object.values(done).filter(Boolean).length;
 const progress=Math.round(complete/total*100);
 const matched=(title:string)=>problems.find(p=>p.title.toLowerCase()===title.toLowerCase());
 return <div className="max-w-7xl mx-auto p-5 md:p-8">
  <section className="panel glow-cyan rounded-3xl p-6 md:p-8">
   <div className="text-[10px] tracking-[.22em] text-violet-200">DACE / FIXED 60-DAY CHALLENGE</div>
   <h1 className="text-3xl md:text-5xl font-black mt-3">60 days. One clear path.</h1>
   <p className="text-sm text-[#9aa8ba] leading-7 mt-3 max-w-3xl">Your calendar stays in its original order: 45 days of DSA followed by 15 days of System Design. It is separate from the main problem bank and daily target. Tick boxes here without changing your normal DACE progress.</p>
   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">{[["Days","60"],["Tasks",String(total)],["Completed",String(complete)],["Progress",progress+"%"]].map(([k,v])=><div key={k} className="rounded-2xl border border-white/[.08] bg-[#080d14]/70 p-4"><div className="text-[10px] tracking-widest text-[#7f8da1]">{k.toUpperCase()}</div><div className="text-2xl font-black mt-1">{v}</div></div>)}</div>
   <div className="h-2 rounded-full bg-white/10 mt-4 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" style={{width:progress+"%"}}/></div>
  </section>
  <section className="panel rounded-2xl p-4 mt-5">
   <label className="block"><span className="text-[10px] tracking-widest text-[#7f8da1]">FIND A DAY OR TASK</span><div className="flex items-center gap-2 bg-[#0b1119] border border-[#243145] rounded-xl px-3 mt-2"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search: trees, caching, URL shortener..." className="bg-transparent outline-none py-3 text-sm w-full"/></div></label>
   {!query&&<><div className="grid grid-cols-6 md:grid-cols-10 gap-2 mt-4">{days.map(d=><button key={d.day} onClick={()=>setDay(d.day)} className={"rounded-lg py-2 text-xs border "+(day===d.day?"border-cyan-300/50 bg-cyan-300/10 text-cyan-100":d.phase==="DSA"?"border-violet-300/15 text-violet-200":"border-teal-300/15 text-teal-200")}>{d.day}</button>)}</div><div className="flex items-center justify-between mt-4"><button disabled={day===1} onClick={()=>setDay(d=>Math.max(1,d-1))} className="rounded-xl border border-[#293548] px-3 py-2 text-xs disabled:opacity-30"><ChevronLeft size={14} className="inline"/> Previous day</button><span className="text-xs text-[#8d9bb0]">Day {day} of 60</span><button disabled={day===60} onClick={()=>setDay(d=>Math.min(60,d+1))} className="rounded-xl border border-[#293548] px-3 py-2 text-xs disabled:opacity-30">Next day <ChevronRight size={14} className="inline"/></button></div></>}
  </section>
  <div className="space-y-4 mt-4">{shown.map(d=><section key={d.day} className="panel rounded-2xl p-4 md:p-5">
   <div className="flex flex-wrap items-center justify-between gap-2"><div><div className={"text-[10px] tracking-widest "+(d.phase==="DSA"?"text-violet-200":"text-teal-200")}>{d.phase} · DAY {String(d.day).padStart(2,"0")}</div><h2 className="text-xl font-bold mt-1">{d.title}</h2></div><div className="text-xs text-[#8d9bb0]">{d.tasks.filter((t,i)=>done[d.day+"-"+i]).length}/4 complete</div></div>
   <div className="space-y-3 mt-4">{d.tasks.map((t,i)=>{const key=d.day+"-"+i,isDone=!!done[key],p=matched(t.title),isProblem=d.day<=45&&d.day<=36;return <article key={key} className={"rounded-xl border p-3 md:p-4 "+(isDone?"border-emerald-300/25 bg-emerald-300/[.04]":"border-[#293548] bg-[#080d14]/60")}>
    <div className="flex items-start gap-3"><input type="checkbox" checked={isDone} onChange={()=>toggle(key)} className="mt-1 w-4 h-4 accent-emerald-400"/><div className="flex-1 min-w-0"><div className={"text-sm font-medium "+(isDone?"text-emerald-100":"text-[#d4dce7]")}>{t.title}</div>{p&&<div className="text-[10px] text-[#74849a] mt-1">Found in your existing problem bank · #{p.leetcodeNumber??"number not set"}</div>}<div className="flex flex-wrap gap-2 mt-3">{d.day<=36&&<a href={p?.url||lcUrl(t.title)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/20 bg-cyan-300/[.05] text-cyan-100 px-3 py-2 text-[11px]"><ExternalLink size={12}/> LeetCode</a>}{d.day<=36&&<a href={"https://takeuforward.org/plus/dsa/a2z-dsa-course/"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-red-300/20 bg-red-300/[.05] text-red-200 px-3 py-2 text-[11px]"><PlayCircle size={12}/> Striver learning</a>}<a href={searchUrl(t.title)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 bg-red-400/[.05] text-red-200 px-3 py-2 text-[11px]"><PlayCircle size={12}/> Indian tutor video</a></div></div></div>
   </article>})}</div>
   <p className="text-[11px] text-[#718096] mt-4">Challenge progress is saved separately in this browser. It never marks a problem solved in the main bank or changes today's adaptive set.</p>
  </section>)}</div>
 </div>;
}
