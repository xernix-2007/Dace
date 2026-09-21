# DACE problem data

DACE currently ships **1,923 unique LeetCode problems mapped across 469 companies**. The company list is derived from the company-wise interview dataset below, with duplicate LeetCode problems merged across companies.

## Primary source

- https://github.com/liquidslr/leetcode-company-wise-problems
- The source repository describes its lists as company-wise LeetCode questions and states its dataset was updated as of June 20, 2025.
- The source currently contains **470 company directories**; one of them, **Coforge**, has an empty `5. All.csv`, so it contributes no problems. That is why DACE has 469 companies with problem data.
- DACE does **not** scrape LeetCode at runtime.

## Snapshot fields

Each normalized problem stores difficulty, title, LeetCode URL, topic metadata, company tags, estimated practice time, and the LeetCode problem number where available.

## Product additions

DACE adds normalized company tags and estimated practice time, plus local-first progress tracking, adaptive daily selection, revision status, solving-time tracking, interview mode, analytics, and export/import.

## Coverage notes

The source is a historical interview-tag dataset rather than a guarantee of what a company currently asks. Company tags should be treated as preparation signals, not hiring-process guarantees. The app now exposes the **full company list** rather than truncating it to the top 150, and the topic filter includes additional interview patterns such as prefix sum, monotonic stack, topological sort, shortest path, MST, segment tree, Fenwick tree, recursion, math, and sorting.

## Refresh policy

When expanding this dataset, keep the source attribution and verify the source repository's current terms before redistributing a larger snapshot.
