import { candidateComparator } from './ranking.js';

/**
 * Min-Heap where the root is the "lowest-ranked" (least competitive) among the top candidates.
 * Since candidateComparator(a, b) returns negative if a is better than b:
 * - isWorse(a, b) is true if candidateComparator(a, b) > 0.
 */
class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0] || null;
  }

  // Returns true if candidate 'a' is strictly inferior (lower score / lower tie-break) to 'b'
  isInferior(a, b) {
    return candidateComparator(a, b) > 0;
  }

  push(candidate) {
    this.heap.push(candidate);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return root;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      // In MinHeap, parent should be inferior to child. If child is inferior to parent, swap.
      if (this.isInferior(this.heap[index], this.heap[parentIndex])) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.isInferior(this.heap[left], this.heap[smallest])) {
        smallest = left;
      }
      if (right < length && this.isInferior(this.heap[right], this.heap[smallest])) {
        smallest = right;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

// Maintain top N using min-heap
export function selectTopN(candidates, N) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return { topShortlist: [], extendedPool: [] };
  }

  const shortlistSize = Math.max(1, Math.min(N || 5, candidates.length));
  const minHeap = new MinHeap();
  const nonShortlisted = [];

  for (const candidate of candidates) {
    if (minHeap.size() < shortlistSize) {
      minHeap.push(candidate);
    } else {
      const currentWeakest = minHeap.peek();
      // If current candidate is strictly superior to the weakest candidate in the heap
      if (candidateComparator(candidate, currentWeakest) < 0) {
        const evicted = minHeap.pop();
        nonShortlisted.push(evicted);
        minHeap.push(candidate);
      } else {
        nonShortlisted.push(candidate);
      }
    }
  }

  // Extract heap elements and sort them from best to worst
  const topShortlist = [];
  while (minHeap.size() > 0) {
    topShortlist.push(minHeap.pop());
  }
  // Reverse since min-heap pops in ascending order of quality
  topShortlist.sort(candidateComparator);

  // Mark ranking attributes
  topShortlist.forEach((c, idx) => {
    c.rank = idx + 1;
    c.isTopNShortlisted = true;
  });

  // Sort extended pool as well
  nonShortlisted.sort(candidateComparator);
  nonShortlisted.forEach((c, idx) => {
    c.rank = topShortlist.length + idx + 1;
    c.isTopNShortlisted = false;
  });

  return {
    topShortlist,
    extendedPool: nonShortlisted,
    totalEligible: candidates.length,
    shortlistCapacity: shortlistSize,
  };
}
