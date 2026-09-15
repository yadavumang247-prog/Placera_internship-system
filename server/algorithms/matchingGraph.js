// Weighted bipartite matching graph
import { calculateStudentOpportunityScore } from './recommendation.js';

export class BipartiteMatchingGraph {
  constructor() {
    this.students = [];
    this.opportunities = [];
    this.edges = new Map(); // key: "studentId:opportunityId" -> weight
  }

  addStudent(student) {
    this.students.push(student);
  }

  addOpportunity(opportunity) {
    this.opportunities.push(opportunity);
  }

  buildEdges(customWeights = {}) {
    for (const student of this.students) {
      for (const opp of this.opportunities) {
        const match = calculateStudentOpportunityScore(student, opp, customWeights);
        if (match.isEligible && match.score > 0) {
          const key = `${student._id || student.id}:${opp._id || opp.id}`;
          this.edges.set(key, match.score);
        }
      }
    }
  }

  // Generate cost matrix for bipartite matching
  getWeightMatrix() {
    const n = Math.max(this.students.length, this.opportunities.length);
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < this.students.length; i++) {
      const sId = this.students[i]._id || this.students[i].id;
      for (let j = 0; j < this.opportunities.length; j++) {
        const oId = this.opportunities[j]._id || this.opportunities[j].id;
        const weight = this.edges.get(`${sId}:${oId}`) || 0;
        matrix[i][j] = weight;
      }
    }

    return { matrix, size: n };
  }

  // Execute greedy bipartite assignment
  solveGreedyAssignment() {
    const sortedEdges = [];
    for (const [key, weight] of this.edges.entries()) {
      const [studentId, opportunityId] = key.split(':');
      sortedEdges.push({ studentId, opportunityId, weight });
    }

    // Sort edges by descending weight
    sortedEdges.sort((a, b) => b.weight - a.weight);

    const assignedStudents = new Set();
    const assignedOpportunities = new Set();
    const matches = [];

    for (const edge of sortedEdges) {
      if (!assignedStudents.has(edge.studentId) && !assignedOpportunities.has(edge.opportunityId)) {
        assignedStudents.add(edge.studentId);
        assignedOpportunities.add(edge.opportunityId);
        matches.push(edge);
      }
    }

    return {
      assignments: matches,
      totalWeight: matches.reduce((sum, e) => sum + e.weight, 0),
      unassignedStudentsCount: this.students.length - assignedStudents.size,
      unassignedOpportunitiesCount: this.opportunities.length - assignedOpportunities.size,
    };
  }
}
