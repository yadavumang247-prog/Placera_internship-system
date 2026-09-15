# Bipartite Matching & Allocation Graph

## 1. Mathematical Formulation

The campus allocation problem is modeled as a **Maximum Weight Bipartite Matching Graph**:

$$G = (S \cup O, E, w)$$

Where:
- $S = \{s_1, s_2, \dots, s_k\}$ represents the disjoint vertex set of verified students.
- $O = \{o_1, o_2, \dots, o_m\}$ represents the disjoint vertex set of available opportunities, each with quota / capacity $q(o_j)$.
- $E \subseteq S \times O$ represents candidate-opportunity eligibility edges.
- Edge weight $w(s_i, o_j) \in [0, 100]$ represents the mutual compatibility score computed by the 5-factor scoring engine.

---

## 2. Institutional Constraints

1. **One-Student One-Job Policy**:
   $$\sum_{o_j \in O} x_{ij} \le 1 \quad \forall s_i \in S$$
   Where $x_{ij} \in \{0, 1\}$ indicates whether student $s_i$ is allocated to opportunity $o_j$.

2. **Opportunity Quota Constraint**:
   $$\sum_{s_i \in S} x_{ij} \le q(o_j) \quad \forall o_j \in O$$

3. **Deterministic Maximum Social Welfare Objective**:
   $$\max \sum_{s_i \in S} \sum_{o_j \in O} w(s_i, o_j) \cdot x_{ij}$$

---

## 3. Implementation in the Platform

The matching pipeline generates recommendations and optimal candidate-role pairings through:
- Profile vectorization ($V_s$) and Opportunity requirement vectorization ($V_o$).
- Weighted adjacency list representation.
- Greedy priority matching with deterministic tie-breaking for immediate batch runs.
- Hungarian Algorithm / Min-Cost Max-Flow compatibility for university-wide global allocation sessions.
