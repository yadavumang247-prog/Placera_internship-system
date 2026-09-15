# Top-N Candidate Selection Algorithm

## 1. Algorithmic Formulation

Given $M$ eligible applicant profiles and a recruiter shortlisting capacity $N$, naive sorting requires $O(M \log M)$ time and $O(M)$ auxiliary memory.

When $M \gg N$ (e.g., 2,500 campus applicants for 25 interview slots), the **Binary Min-Heap (Priority Queue)** approach optimizes selection to:

$$\mathcal{O}(M \log N) \text{ time complexity}$$
$$\mathcal{O}(N) \text{ auxiliary space complexity}$$

---

## 2. Min-Heap Operational Mechanics

1. Initialize a Binary Min-Heap of capacity $N$.
2. For each candidate $c_i \in \{c_1, c_2, \dots, c_M\}$:
   - If Heap size $< N$, insert $c_i$ directly into the Heap ($O(\log N)$).
   - If Heap size $= N$:
     - Compare $c_i$ against the heap root (the current lowest-ranked candidate among the top $N$).
     - If $c_i > \text{root}$ (according to our deterministic 5-tier comparator):
       - Extract root (evict weakest candidate).
       - Insert $c_i$.
       - Heapify down ($O(\log N)$).
     - Otherwise, discard $c_i$ ($O(1)$).
3. Once all $M$ applicants are evaluated, extract all elements from the Min-Heap in descending order to yield the finalized Top-$N$ shortlist.

---

## 3. Comparative Complexity Benchmarks

| Metric | Full QuickSort / TimSort | Binary Min-Heap Top-N |
| :--- | :--- | :--- |
| **Time Complexity** | $O(M \log M)$ | $O(M \log N)$ |
| **Space Complexity** | $O(M)$ | $O(N)$ |
| **$M = 10,000, N = 20$** | $\approx 133,000$ operations | $\approx 43,000$ operations (3x faster) |
| **Memory footprint** | Stores all $10,000$ candidate snapshots | Stores exactly $20$ candidate pointers |
