# Candidate Evaluation & Ranking Algorithm

## 1. Multi-Factor Weighted Scoring Model

The candidate evaluation engine computes a normalized composite fit score $S \in [0, 100]$:

$$S = w_{skill} \cdot S_{skill} + w_{acad} \cdot S_{acad} + w_{proj} \cdot S_{proj} + w_{exp} \cdot S_{exp} + w_{pref} \cdot S_{pref}$$

### Default Canonical Weights
- $w_{skill} = 0.40$ (40% - Technical & domain skill match)
- $w_{acad} = 0.20$ (20% - Academic performance & backlog penalty)
- $w_{proj} = 0.15$ (15% - Projects portfolio depth & live demos)
- $w_{exp} = 0.15$ (15% - Prior work experience & internships)
- $w_{pref} = 0.10$ (10% - Role & location alignment)

$$\sum w_i = 1.0$$

---

## 2. Factor Formulations

### 2.1 Skill Score ($S_{skill}$)
For opportunity required skills $R = \{(s_j, p_j, w_j)\}$ and candidate skills $C$:
$$S_{skill} = \frac{\sum_{j \in R} w_j \cdot M(s_j, C)}{\sum_{j \in R} w_j} \times 100$$
Where $M(s_j, C)$ evaluates proficiency depth:
$$M(s_j, C) = \begin{cases}
1.00 & \text{if candidate proficiency } \ge \text{required proficiency} \\
0.75 & \text{if candidate proficiency is 1 tier below} \\
0.40 & \text{if candidate has beginner skill} \\
0.00 & \text{if skill is missing}
\end{cases}$$

### 2.2 Academic Score ($S_{acad}$)
$$S_{acad} = \max\left(0, \left(\frac{CGPA}{10.0} \times 100\right) - (5 \times Backlogs_{active}) - (2 \times Backlogs_{history})\right)$$

### 2.3 Project Score ($S_{proj}$)
Evaluates project count, verified source repositories (GitHub), and live deployment URLs:
$$S_{proj} = \min\left(100, \sum_{p \in Projects} \left(20 + 10 \cdot \mathbb{I}_{github} + 10 \cdot \mathbb{I}_{live}\right)\right)$$

### 2.4 Experience Score ($S_{exp}$)
$$S_{exp} = \min\left(100, \text{TotalMonthsOfInternships} \times 15 + \text{RoleRelevanceBonus}\right)$$

### 2.5 Preference Score ($S_{pref}$)
Checks Jaccard / exact overlap between student preferred locations/roles and opportunity attributes:
$$S_{pref} = 50 \cdot \mathbb{I}_{location\_match} + 50 \cdot \mathbb{I}_{role\_match}$$

---

## 3. Deterministic 5-Tier Tie-Breaking

When candidates achieve identical composite scores ($|S_A - S_B| < 10^{-5}$), ties are deterministically resolved without randomness:

```
Tier 1: Higher Skill Score (S_skill)
   │ (if tied)
   ▼
Tier 2: Higher CGPA
   │ (if tied)
   ▼
Tier 3: Fewer Active + Historical Backlogs
   │ (if tied)
   ▼
Tier 4: Earlier Application Submission Timestamp (FIFO)
   │ (if tied)
   ▼
Tier 5: Lexicographical Roll Number Order
```
