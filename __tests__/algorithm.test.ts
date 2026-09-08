import { describe, it, expect } from 'vitest';
import {
  runInternshipAllocation,
  computePreferenceScore,
  computeCgpaScore,
  computeSkillMatch,
  computeOverallScore,
  DEFAULT_WEIGHTS,
} from '../lib/algorithm/internshipAllocation';
import { StudentData, InternshipData, PreferenceData } from '../lib/types';

describe('Smart Internship Allocation Algorithm (AOA)', () => {
  // Mock Data Fixtures
  const mockInternships: InternshipData[] = [
    {
      id: 'int_google',
      companyId: 'comp_google',
      companyName: 'Google',
      title: 'Cloud Software Engineer',
      description: 'Distributed systems & cloud infrastructure',
      location: 'Bangalore / Hybrid',
      mode: 'HYBRID',
      stipend: 75000,
      duration: '6 Months',
      minimumCGPA: 8.0,
      requiredSkills: ['Go', 'Kubernetes', 'Docker', 'Python'],
      totalSeats: 2,
      availableSeats: 2,
      applicationDeadline: '2026-12-31',
    },
    {
      id: 'int_msft',
      companyId: 'comp_msft',
      companyName: 'Microsoft',
      title: 'Full Stack Engineer',
      description: 'Azure web applications and TypeScript APIs',
      location: 'Hyderabad / Remote',
      mode: 'REMOTE',
      stipend: 65000,
      duration: '3 Months',
      minimumCGPA: 7.0,
      requiredSkills: ['TypeScript', 'React', 'Node.js', 'SQL'],
      totalSeats: 1, // Notice: only 1 seat
      availableSeats: 1,
      applicationDeadline: '2026-12-31',
    },
    {
      id: 'int_startup',
      companyId: 'comp_startup',
      companyName: 'Nexus Labs',
      title: 'Frontend Intern',
      description: 'Next.js and Tailwind UI development',
      location: 'Remote',
      mode: 'REMOTE',
      stipend: 35000,
      duration: '3 Months',
      minimumCGPA: 6.0,
      requiredSkills: ['React', 'CSS', 'JavaScript'],
      totalSeats: 5,
      availableSeats: 5,
      applicationDeadline: '2026-12-31',
    },
  ];

  // 1. Eligible student gets allocation
  it('1. Eligible student gets allocation when seats and conditions are satisfied', () => {
    const students: StudentData[] = [
      {
        id: 'stud_1',
        userId: 'user_1',
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        rollNumber: 'CS2024001',
        branch: 'Computer Science',
        year: 3,
        cgpa: 9.2,
        skills: ['Go', 'Kubernetes', 'Docker', 'Python'],
      },
    ];

    const preferences: PreferenceData[] = [
      { id: 'p1', studentId: 'stud_1', internshipId: 'int_google', rank: 1 },
    ];

    const result = runInternshipAllocation(students, mockInternships, preferences);

    expect(result.allocations).toHaveLength(1);
    expect(result.allocations[0].studentId).toBe('stud_1');
    expect(result.allocations[0].internshipId).toBe('int_google');
    expect(result.allocations[0].status).toBe('ALLOCATED');
    expect(result.unallocatedStudents).toHaveLength(0);
  });

  // 2. Ineligible student is rejected
  it('2. Ineligible student (CGPA below minimum requirement) is rejected', () => {
    const students: StudentData[] = [
      {
        id: 'stud_low_cgpa',
        userId: 'user_2',
        name: 'Rohan Verma',
        email: 'rohan@example.com',
        rollNumber: 'CS2024002',
        branch: 'Information Technology',
        year: 3,
        cgpa: 7.2, // Below Google requirement of 8.0
        skills: ['Go', 'Kubernetes', 'Docker', 'Python'],
      },
    ];

    const preferences: PreferenceData[] = [
      { id: 'p1', studentId: 'stud_low_cgpa', internshipId: 'int_google', rank: 1 },
    ];

    const result = runInternshipAllocation(students, mockInternships, preferences);

    expect(result.allocations).toHaveLength(0);
    expect(result.unallocatedStudents).toHaveLength(1);
    expect(result.unallocatedStudents[0].id).toBe('stud_low_cgpa');
    expect(result.unallocatedStudents[0].reason).toContain('Ineligible');
  });

  // 3. Internship capacity is respected
  it('3. Internship capacity is strictly respected when applicants exceed available seats', () => {
    // int_msft has totalSeats = 1
    const students: StudentData[] = [
      {
        id: 'stud_high',
        userId: 'u1',
        name: 'Ananya Gupta',
        email: 'ananya@example.com',
        rollNumber: 'CS2024010',
        branch: 'Computer Science',
        year: 3,
        cgpa: 9.5,
        skills: ['TypeScript', 'React', 'Node.js', 'SQL'],
      },
      {
        id: 'stud_medium',
        userId: 'u2',
        name: 'Kabir Mehta',
        email: 'kabir@example.com',
        rollNumber: 'CS2024011',
        branch: 'Computer Science',
        year: 3,
        cgpa: 8.5,
        skills: ['TypeScript', 'React', 'Node.js', 'SQL'],
      },
    ];

    const preferences: PreferenceData[] = [
      { id: 'p1', studentId: 'stud_high', internshipId: 'int_msft', rank: 1 },
      { id: 'p2', studentId: 'stud_medium', internshipId: 'int_msft', rank: 1 },
    ];

    const result = runInternshipAllocation(students, mockInternships, preferences);

    // Only 1 student can get the seat
    const msftAllocations = result.allocations.filter((a) => a.internshipId === 'int_msft');
    expect(msftAllocations).toHaveLength(1);
    expect(msftAllocations[0].studentId).toBe('stud_high'); // Higher score won
    expect(result.unallocatedStudents).toHaveLength(1);
    expect(result.unallocatedStudents[0].id).toBe('stud_medium');
  });

  // 4. Student receives maximum one internship
  it('4. Student receives maximum one internship even if eligible for multiple preferred positions', () => {
    const students: StudentData[] = [
      {
        id: 'stud_multi',
        userId: 'u3',
        name: 'Devansh Roy',
        email: 'devansh@example.com',
        rollNumber: 'CS2024020',
        branch: 'Computer Science',
        year: 3,
        cgpa: 9.4,
        skills: ['Go', 'Kubernetes', 'Docker', 'Python', 'TypeScript', 'React', 'Node.js'],
      },
    ];

    // Student ranks Google 1st, Microsoft 2nd, Startup 3rd
    const preferences: PreferenceData[] = [
      { id: 'p1', studentId: 'stud_multi', internshipId: 'int_google', rank: 1 },
      { id: 'p2', studentId: 'stud_multi', internshipId: 'int_msft', rank: 2 },
      { id: 'p3', studentId: 'stud_multi', internshipId: 'int_startup', rank: 3 },
    ];

    const result = runInternshipAllocation(students, mockInternships, preferences);

    // Exactly one allocation for the student
    expect(result.allocations).toHaveLength(1);
    expect(result.allocations[0].studentId).toBe('stud_multi');
    expect(result.allocations[0].internshipId).toBe('int_google'); // 1st preference allocated
  });

  // 5. Higher score gets priority
  it('5. Higher composite score gets priority over lower score for the same internship seat', () => {
    const students: StudentData[] = [
      {
        id: 'stud_lower',
        userId: 'u4',
        name: 'Student Lower',
        email: 'lower@example.com',
        rollNumber: 'CS2024030',
        branch: 'IT',
        year: 3,
        cgpa: 7.5,
        skills: ['TypeScript'], // 1 out of 4 skills matched
      },
      {
        id: 'stud_higher',
        userId: 'u5',
        name: 'Student Higher',
        email: 'higher@example.com',
        rollNumber: 'CS2024031',
        branch: 'Computer Science',
        year: 3,
        cgpa: 9.0,
        skills: ['TypeScript', 'React', 'Node.js', 'SQL'], // 4 out of 4 matched
      },
    ];

    const preferences: PreferenceData[] = [
      { id: 'p1', studentId: 'stud_lower', internshipId: 'int_msft', rank: 1 },
      { id: 'p2', studentId: 'stud_higher', internshipId: 'int_msft', rank: 1 },
    ];

    const result = runInternshipAllocation(students, mockInternships, preferences);

    expect(result.allocations).toHaveLength(1);
    expect(result.allocations[0].studentId).toBe('stud_higher');
  });

  // 6. Preference rank affects score
  it('6. Preference rank affects the computed score according to mathematical model', () => {
    const rank1Score = computePreferenceScore(1);
    const rank2Score = computePreferenceScore(2);
    const rank3Score = computePreferenceScore(3);
    const rank5Score = computePreferenceScore(5);

    expect(rank1Score).toBe(100);
    expect(rank2Score).toBe(90);
    expect(rank3Score).toBe(80);
    expect(rank5Score).toBe(60);
    expect(rank1Score).toBeGreaterThan(rank2Score);
    expect(rank2Score).toBeGreaterThan(rank3Score);
  });

  // 7. Skill matching affects score
  it('7. Skill match percentage affects composite score directly', () => {
    const required = ['TypeScript', 'React', 'Node.js', 'SQL'];
    const fullMatch = computeSkillMatch(['TypeScript', 'React', 'Node.js', 'SQL'], required);
    const halfMatch = computeSkillMatch(['TypeScript', 'React'], required);
    const zeroMatch = computeSkillMatch(['Python', 'Ruby'], required);

    expect(fullMatch.matchScore).toBe(100);
    expect(halfMatch.matchScore).toBe(50);
    expect(zeroMatch.matchScore).toBe(0);

    const overallFull = computeOverallScore(100, 90, fullMatch.matchScore, DEFAULT_WEIGHTS);
    const overallHalf = computeOverallScore(100, 90, halfMatch.matchScore, DEFAULT_WEIGHTS);

    expect(overallFull).toBeGreaterThan(overallHalf);
  });

  // 8. Tie-breaking works deterministically
  it('8. Tie-breaking works deterministically using CGPA then Roll Number', () => {
    // Two students with identical skills, preferences, and scores, but differing CGPAs or Roll Numbers
    const studentA: StudentData = {
      id: 'stud_A',
      userId: 'ua',
      name: 'Alpha Student',
      email: 'a@example.com',
      rollNumber: 'CS2024001', // Earlier roll number
      branch: 'CS',
      year: 3,
      cgpa: 9.0,
      skills: ['TypeScript', 'React', 'Node.js', 'SQL'],
    };

    const studentB: StudentData = {
      id: 'stud_B',
      userId: 'ub',
      name: 'Beta Student',
      email: 'b@example.com',
      rollNumber: 'CS2024002', // Later roll number
      branch: 'CS',
      year: 3,
      cgpa: 9.0, // Same CGPA
      skills: ['TypeScript', 'React', 'Node.js', 'SQL'],
    };

    const preferences: PreferenceData[] = [
      { id: 'pa', studentId: 'stud_A', internshipId: 'int_msft', rank: 1 },
      { id: 'pb', studentId: 'stud_B', internshipId: 'int_msft', rank: 1 },
    ];

    // int_msft has 1 seat. Roll number CS2024001 should break the tie over CS2024002
    const result = runInternshipAllocation([studentB, studentA], mockInternships, preferences);

    expect(result.allocations).toHaveLength(1);
    expect(result.allocations[0].studentId).toBe('stud_A');
    expect(result.allocations[0].studentRollNumber).toBe('CS2024001');
  });

  // 9. Unallocated students are returned correctly
  it('9. Unallocated students are tracked and returned with descriptive reasons', () => {
    const students: StudentData[] = [
      {
        id: 'stud_no_pref',
        userId: 'u_no_pref',
        name: 'Inactive Student',
        email: 'inactive@example.com',
        rollNumber: 'CS2024099',
        branch: 'Mechanical',
        year: 3,
        cgpa: 7.0,
        skills: ['AutoCAD'],
      },
    ];

    const result = runInternshipAllocation(students, mockInternships, []);

    expect(result.allocations).toHaveLength(0);
    expect(result.unallocatedStudents).toHaveLength(1);
    expect(result.unallocatedStudents[0].id).toBe('stud_no_pref');
    expect(result.unallocatedStudents[0].reason).toContain('No preferences submitted');
  });
});
