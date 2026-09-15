import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { Organization } from '../models/Organization.js';
import { Opportunity } from '../models/Opportunity.js';
import { RecruitmentRound } from '../models/RecruitmentRound.js';
import { Question } from '../models/Question.js';
import { Assessment } from '../models/Assessment.js';
import { AssessmentAttempt } from '../models/AssessmentAttempt.js';
import { ApplicationSnapshot } from '../models/ApplicationSnapshot.js';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { PlacementDrive } from '../models/PlacementDrive.js';
import { AlgorithmConfig } from '../models/AlgorithmConfig.js';
import { Notification } from '../models/Notification.js';
import { calculateCandidateScore } from '../algorithms/scoring.js';
import { rankCandidates } from '../algorithms/ranking.js';
import { selectTopN } from '../algorithms/topN.js';

export async function runSeed() {
  console.log('🌱 Starting comprehensive database seeding...');
  await connectDB();

  // Clear existing collections
  console.log('🧹 Clearing legacy records...');
  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    RecruiterProfile.deleteMany({}),
    Organization.deleteMany({}),
    Opportunity.deleteMany({}),
    RecruitmentRound.deleteMany({}),
    Question.deleteMany({}),
    Assessment.deleteMany({}),
    AssessmentAttempt.deleteMany({}),
    ApplicationSnapshot.deleteMany({}),
    Application.deleteMany({}),
    Interview.deleteMany({}),
    PlacementDrive.deleteMany({}),
    AlgorithmConfig.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // Seed default Algorithm Configuration
  console.log('⚙️ Seeding Algorithm Configuration...');
  const algorithmConfig = await AlgorithmConfig.create({
    skillWeight: 0.4,
    academicWeight: 0.2,
    projectWeight: 0.15,
    experienceWeight: 0.15,
    preferenceWeight: 0.1,
    isActive: true,
  });

  const defaultPassword = 'password123';

  // 1. Seed Core Demo Accounts
  console.log('👤 Seeding Demo Accounts...');
  const adminUser = await User.create({
    email: 'admin@example.com',
    password: defaultPassword,
    role: 'ADMIN',
    status: 'VERIFIED',
    isEmailVerified: true,
  });

  // 2. Seed 12 Organizations
  console.log('🏢 Seeding Organizations...');
  const orgData = [
    { name: 'Apex Technologies', industry: 'Enterprise Cloud & SaaS', size: '5000+ employees', location: 'Bangalore, India', tier: 'DREAM' },
    { name: 'Quantum Leap Labs', industry: 'AI & Machine Learning', size: '200-500 employees', location: 'Hyderabad, India', tier: 'TIER_1' },
    { name: 'FinEdge Global', industry: 'FinTech & High-Frequency Trading', size: '1000-5000 employees', location: 'Mumbai, India', tier: 'DREAM' },
    { name: 'Nexura Cyber Solutions', industry: 'Cybersecurity & Defense', size: '500-1000 employees', location: 'Pune, India', tier: 'TIER_1' },
    { name: 'Strata Systems', industry: 'Autonomous Systems & Robotics', size: '1000-5000 employees', location: 'Gurgaon, India', tier: 'REGULAR' },
    { name: 'Cognitive DataWorks', industry: 'Data Engineering & Analytics', size: '500-1000 employees', location: 'Bangalore, India', tier: 'TIER_1' },
    { name: 'Veritas HealthTech', industry: 'Digital Health & Biotech', size: '200-500 employees', location: 'Chennai, India', tier: 'REGULAR' },
    { name: 'Aether Cloud Networks', industry: 'Distributed Systems & Networking', size: '10000+ employees', location: 'Bangalore, India', tier: 'DREAM' },
    { name: 'PixelCraft Games', industry: 'Gaming & 3D Interactive', size: '100-300 employees', location: 'Hyderabad, India', tier: 'STARTUP' },
    { name: 'Vanguard Microelectronics', industry: 'VLSI & Embedded Systems', size: '5000+ employees', location: 'Noida, India', tier: 'TIER_1' },
    { name: 'EcoGrid Energy', industry: 'Smart Grid & IoT CleanTech', size: '300-800 employees', location: 'Ahmedabad, India', tier: 'REGULAR' },
    { name: 'OmniFlow Logistics', industry: 'Supply Chain AI', size: '1000-5000 employees', location: 'Delhi NCR, India', tier: 'REGULAR' },
  ];

  const organizations = await Organization.insertMany(orgData);

  // Recruiter Demo Account
  const recruiterUser = await User.create({
    email: 'recruiter@example.com',
    password: defaultPassword,
    role: 'RECRUITER',
    status: 'VERIFIED',
    isEmailVerified: true,
  });

  const recruiterProfile = await RecruiterProfile.create({
    user: recruiterUser._id,
    name: 'Sarah Jenkins',
    phone: '+91 9876543210',
    designation: 'University Talent Partner',
    organization: organizations[0]._id,
    verificationStatus: 'VERIFIED',
  });

  // Additional recruiters for other organizations
  const otherRecruiters = [];
  for (let i = 1; i < organizations.length; i++) {
    const recUser = await User.create({
      email: `recruiter${i}@example.com`,
      password: defaultPassword,
      role: 'RECRUITER',
      status: 'VERIFIED',
      isEmailVerified: true,
    });
    const recProfile = await RecruiterProfile.create({
      user: recUser._id,
      name: `Recruiter Partner ${i}`,
      organization: organizations[i]._id,
      designation: 'Campus Hiring Lead',
      verificationStatus: 'VERIFIED',
    });
    otherRecruiters.push({ user: recUser, profile: recProfile, org: organizations[i] });
  }

  // 3. Seed 55 Realistic Student Accounts
  console.log('🎓 Seeding 55 Student Profiles...');
  const firstNames = [
    'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sneha', 'Vikram', 'Divya', 'Karan', 'Meera',
    'Arjun', 'Isha', 'Dev', 'Pooja', 'Rahul', 'Riya', 'Kabir', 'Tanvi', 'Siddharth', 'Neha',
    'Varun', 'Kriti', 'Manish', 'Shreya', 'Gaurav', 'Anjali', 'Nikhil', 'Simran', 'Abhishek', 'Swati',
    'Akash', 'Bhavna', 'Harsh', 'Deepika', 'Kunal', 'Jyoti', 'Tarun', 'Priyanka', 'Sanjay', 'Vandana',
    'Yash', 'Shruti', 'Mayank', 'Alka', 'Pranav', 'Payal', 'Suraj', 'Sakshi', 'Vivek', 'Bhavika',
    'Naveen', 'Garima', 'Aman', 'Kavita', 'Rajat'
  ];
  const lastNames = [
    'Sharma', 'Verma', 'Patel', 'Reddy', 'Mehta', 'Nair', 'Kapoor', 'Singh', 'Chopra', 'Iyer',
    'Gupta', 'Bhatia', 'Joshi', 'Saxena', 'Deshmukh', 'Choudhury', 'Mukherjee', 'Banerjee', 'Rao', 'Kulkarni'
  ];
  const branches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Data Science & Artificial Intelligence',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering'
  ];
  const skillPool = [
    'React', 'JavaScript', 'Node.js', 'Python', 'TypeScript', 'Java', 'C++', 'SQL', 'MongoDB',
    'Docker', 'AWS', 'Data Structures', 'Algorithms', 'Express.js', 'Machine Learning', 'Git',
    'GraphQL', 'PostgreSQL', 'Tailwind CSS', 'Next.js', 'Linux', 'REST APIs', 'Spring Boot'
  ];

  const students = [];

  // Primary Demo Student: student@example.com
  const primaryStudentUser = await User.create({
    email: 'student@example.com',
    password: defaultPassword,
    role: 'STUDENT',
    status: 'VERIFIED',
    isEmailVerified: true,
  });

  const primaryStudentProfile = await StudentProfile.create({
    user: primaryStudentUser._id,
    fullName: 'Aditya Sharma',
    phone: '+91 9988776655',
    headline: 'Pre-final Year CSE Undergrad | Full Stack & Systems Enthusiast',
    location: 'Bangalore, India',
    college: 'National Institute of Technology',
    university: 'State Technical University',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.85,
    percentage: 84.5,
    tenthPercentage: 94.0,
    twelfthPercentage: 92.5,
    activeBacklogs: 0,
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Data Structures', 'Algorithms', 'SQL', 'MongoDB', 'Docker', 'Git'],
    softSkills: ['Problem Solving', 'Team Leadership', 'Clear Communication'],
    projects: [
      {
        title: 'Distributed File Allocation System',
        description: 'Built a fault-tolerant consistent hashing based file chunk storage engine in Node.js with replication.',
        technologies: ['Node.js', 'TypeScript', 'Docker', 'Redis'],
        role: 'Lead Developer',
        githubUrl: 'https://github.com/example/distributed-storage',
        duration: 'Jan 2026 - Mar 2026',
      },
      {
        title: 'Algorithmic Portfolio Rebalancer',
        description: 'Web dashboard analyzing portfolio risk metrics using Modern Portfolio Theory in Python & React.',
        technologies: ['React', 'Python', 'FastAPI', 'Pandas'],
        role: 'Full Stack Engineer',
        githubUrl: 'https://github.com/example/portfolio-rebalancer',
        duration: 'Oct 2025 - Dec 2025',
      },
    ],
    experience: [
      {
        company: 'CloudScale Technologies',
        role: 'Backend Engineering Intern',
        duration: 'May 2025 - Jul 2025',
        description: 'Engineered rate-limiting middleware reducing service spikes by 40%. Implemented Redis cache tier.',
        months: 3,
      },
    ],
    certifications: [
      { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: 'Nov 2025' },
    ],
    achievements: [
      { title: 'Finalist - Smart India Hackathon 2025', description: 'Top 5 national finish among 1200+ teams', year: '2025' },
    ],
    profiles: {
      github: 'https://github.com/student-demo',
      linkedin: 'https://linkedin.com/in/student-demo',
      portfolio: 'https://student-demo.dev',
      codingPlatform: 'https://leetcode.com/student_demo',
    },
    preferences: {
      preferredRoles: ['Software Engineer', 'Full Stack Developer', 'Backend Intern'],
      preferredDomains: ['Cloud Infrastructure', 'FinTech', 'AI Systems'],
      preferredLocations: ['Bangalore', 'Hyderabad', 'Remote'],
      workMode: 'HYBRID',
      opportunityType: 'BOTH',
    },
    resumeUrl: '/uploads/sample-resume.pdf',
    resumeName: 'Aditya_Sharma_Resume.pdf',
    verificationStatus: 'VERIFIED',
  });

  students.push({ user: primaryStudentUser, profile: primaryStudentProfile });

  // Generate 54 additional realistic student profiles
  for (let i = 1; i < 55; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const email = `student${i}@example.com`;
    const branch = branches[i % branches.length];
    const cgpa = Number((6.2 + ((i * 17) % 36) / 10).toFixed(2)); // Ranges between 6.2 and 9.8
    const backlogs = (i % 9 === 0) ? 1 : 0;

    // Pick 4-8 skills
    const numSkills = 4 + (i % 5);
    const studentSkills = [];
    for (let k = 0; k < numSkills; k++) {
      const skill = skillPool[(i * 3 + k * 5) % skillPool.length];
      if (!studentSkills.includes(skill)) studentSkills.push(skill);
    }

    const hasExperience = i % 3 === 0;

    const u = await User.create({
      email,
      password: defaultPassword,
      role: 'STUDENT',
      status: 'VERIFIED',
      isEmailVerified: true,
    });

    const sp = await StudentProfile.create({
      user: u._id,
      fullName: `${fn} ${ln}`,
      phone: `+91 98${10000000 + i}`,
      headline: `B.Tech student in ${branch} | Passionate about engineering`,
      location: i % 2 === 0 ? 'Bangalore, India' : 'Pune, India',
      college: 'National Institute of Technology',
      university: 'State Technical University',
      degree: 'B.Tech',
      branch,
      graduationYear: 2026,
      cgpa,
      percentage: Number((cgpa * 9.5).toFixed(1)),
      tenthPercentage: 85 + (i % 12),
      twelfthPercentage: 82 + (i % 14),
      activeBacklogs: backlogs,
      skills: studentSkills,
      softSkills: ['Collaboration', 'Critical Thinking'],
      projects: [
        {
          title: `${studentSkills[0] || 'Web'} Application System`,
          description: `Designed and built a modular application leveraging ${studentSkills.slice(0, 3).join(', ')}.`,
          technologies: studentSkills.slice(0, 3),
          role: 'Developer',
          duration: '3 months',
        },
      ],
      experience: hasExperience
        ? [
            {
              company: 'TechCorp Solutions',
              role: 'Junior Developer Intern',
              duration: '3 months',
              description: 'Assisted senior team in developing REST endpoints and unit test coverage.',
              months: 3,
            },
          ]
        : [],
      certifications: i % 2 === 0 ? [{ name: 'Full Stack Web Bootcamp', issuer: 'Coursera', issueDate: '2025' }] : [],
      preferences: {
        preferredRoles: ['Software Engineer', 'Frontend Developer', 'Data Analyst'],
        workMode: 'ANY',
        opportunityType: 'BOTH',
      },
      resumeUrl: '/uploads/sample-resume.pdf',
      resumeName: `${fn}_Resume.pdf`,
      verificationStatus: 'VERIFIED',
    });

    students.push({ user: u, profile: sp });
  }

  // 4. Seed 100+ Question Bank across Categories
  console.log('📝 Seeding 100+ Assessment Questions...');
  const questionsToInsert = [];

  // Aptitude / Logical Reasoning MCQs (40 questions)
  const aptitudeTopics = [
    {
      q: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
      opts: ['65 sec', '89 sec', '100 sec', '150 sec'],
      ans: 1, // 89 sec
      cat: 'APTITUDE',
      exp: 'Speed = 240/24 = 10 m/s. Total distance = 240 + 650 = 890 m. Time = 890 / 10 = 89 seconds.',
    },
    {
      q: 'If 12 men can complete a project in 20 days, how many men will be needed to complete the same work in 15 days?',
      opts: ['14', '16', '18', '20'],
      ans: 1, // 16
      cat: 'APTITUDE',
      exp: 'Total work = 12 * 20 = 240 man-days. Men needed = 240 / 15 = 16 men.',
    },
    {
      q: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
      opts: ['125', '127', '128', '131'],
      ans: 1, // 127
      cat: 'LOGICAL',
      exp: 'Each term is 2n + 1: 63 * 2 + 1 = 127.',
    },
    {
      q: 'A sum of money doubles itself at simple interest in 8 years. In how many years will it become 4 times itself?',
      opts: ['16 years', '20 years', '24 years', '32 years'],
      ans: 2, // 24 years
      cat: 'APTITUDE',
      exp: 'Interest in 8 years = P. To become 4P, interest needed is 3P. Time = 3 * 8 = 24 years.',
    },
    {
      q: 'In a code language, SYSTEM is written as SYSMET and NEARER is written as AENRER. How is FRACTION written?',
      opts: ['CARFTION', 'ARFCITNO', 'CRAFITNO', 'FRACNOIT'],
      ans: 1, // ARFCITNO
      cat: 'LOGICAL',
      exp: 'First half letters reversed, second half letters reversed.',
    },
  ];

  // Generate 40 total Aptitude/Logical questions
  for (let i = 0; i < 40; i++) {
    const base = aptitudeTopics[i % aptitudeTopics.length];
    questionsToInsert.push({
      type: 'MCQ',
      title: `Aptitude & Logic Problem #${i + 1}: ${base.q.slice(0, 40)}...`,
      description: base.q,
      category: base.cat,
      difficulty: i % 3 === 0 ? 'EASY' : i % 3 === 1 ? 'MEDIUM' : 'HARD',
      marks: 2,
      options: base.opts.map((t) => ({ text: t })),
      correctOptionIndex: base.ans,
      explanation: base.exp,
    });
  }

  // Technical MCQs: Data Structures, Algorithms, OS, DBMS (40 questions)
  const techTopics = [
    {
      q: 'What is the worst-case time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black Tree)?',
      opts: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      ans: 1,
      cat: 'DSA',
      exp: 'Balanced BSTs guarantee maximum height of O(log N).',
    },
    {
      q: 'Which database isolation level prevents dirty reads, non-repeatable reads, and phantom reads completely?',
      opts: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
      ans: 3,
      cat: 'CORE_CS',
      exp: 'Serializable is the strictest ANSI SQL isolation level preventing all anomalies.',
    },
    {
      q: 'In JavaScript, what is the output of `typeof NaN`?',
      opts: ['"undefined"', '"nan"', '"number"', '"object"'],
      ans: 2,
      cat: 'TECHNICAL',
      exp: 'In JavaScript specification, NaN is technically a numeric data type value.',
    },
    {
      q: 'Which scheduling algorithm is non-preemptive and assigns the CPU to the process with smallest burst time?',
      opts: ['Round Robin', 'Shortest Job First (Non-preemptive)', 'Shortest Remaining Time First', 'Priority Preemptive'],
      ans: 1,
      cat: 'CORE_CS',
      exp: 'SJF non-preemptive schedules process with minimum CPU burst.',
    },
    {
      q: 'Which data structure is primarily utilized in Breadth-First Search (BFS) graph traversal?',
      opts: ['Stack', 'Queue', 'Priority Queue', 'Disjoint Set'],
      ans: 1,
      cat: 'DSA',
      exp: 'BFS visits vertices in FIFO order using a standard Queue.',
    },
  ];

  for (let i = 0; i < 40; i++) {
    const base = techTopics[i % techTopics.length];
    questionsToInsert.push({
      type: 'MCQ',
      title: `Technical Question #${i + 1}: ${base.q.slice(0, 40)}...`,
      description: base.q,
      category: base.cat,
      difficulty: i % 2 === 0 ? 'MEDIUM' : 'HARD',
      marks: 3,
      options: base.opts.map((t) => ({ text: t })),
      correctOptionIndex: base.ans,
      explanation: base.exp,
    });
  }

  // Coding Problems (20 questions)
  const codingProblems = [
    {
      title: 'Two Sum Problem',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Assume exactly one solution exists.',
      category: 'DSA',
      difficulty: 'EASY',
      marks: 10,
      testCases: [
        { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]', isHidden: false },
        { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]', isHidden: false },
        { input: 'nums = [3,3], target = 6', expectedOutput: '[0, 1]', isHidden: true },
      ],
    },
    {
      title: 'Longest Substring Without Repeating Characters',
      description: 'Given a string `s`, find the length of the longest substring without duplicate characters.',
      category: 'DSA',
      difficulty: 'MEDIUM',
      marks: 20,
      testCases: [
        { input: 's = "abcabcbb"', expectedOutput: '3', isHidden: false },
        { input: 's = "bbbbb"', expectedOutput: '1', isHidden: false },
        { input: 's = "pwwkew"', expectedOutput: '3', isHidden: true },
      ],
    },
    {
      title: 'Merge K Sorted Lists',
      description: 'You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
      category: 'DSA',
      difficulty: 'HARD',
      marks: 30,
      testCases: [
        { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]', isHidden: false },
        { input: 'lists = []', expectedOutput: '[]', isHidden: false },
      ],
    },
    {
      title: 'Trapping Rain Water',
      description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
      category: 'DSA',
      difficulty: 'HARD',
      marks: 30,
      testCases: [
        { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isHidden: false },
        { input: 'height = [4,2,0,3,2,5]', expectedOutput: '9', isHidden: false },
      ],
    },
    {
      title: 'Valid Parentheses String',
      description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
      category: 'DSA',
      difficulty: 'EASY',
      marks: 10,
      testCases: [
        { input: 's = "()"', expectedOutput: 'true', isHidden: false },
        { input: 's = "()[]{}"', expectedOutput: 'true', isHidden: false },
        { input: 's = "(]"', expectedOutput: 'false', isHidden: true },
      ],
    },
  ];

  for (let i = 0; i < 20; i++) {
    const base = codingProblems[i % codingProblems.length];
    questionsToInsert.push({
      type: 'CODING',
      title: `${base.title} (Variant ${i + 1})`,
      description: base.description,
      category: base.category,
      difficulty: base.difficulty,
      marks: base.marks,
      codingDetails: {
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        starterCode: {
          javascript: `function solve(input) {\n  // Implementation here\n  return true;\n}`,
          python: `def solve(input):\n    # Implementation here\n    return True\n`,
          java: `public class Solution {\n    public static void main(String[] args) {\n        // Solution\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}`,
        },
        testCases: base.testCases,
        timeLimitMs: 2000,
        memoryLimitMb: 256,
      },
    });
  }

  const createdQuestions = await Question.insertMany(questionsToInsert);
  console.log(`✅ ${createdQuestions.length} questions created successfully.`);

  // 5. Seed 22 Opportunities across Organizations
  console.log('💼 Seeding 22 Opportunities with Recruitment Rounds...');
  const opportunities = [];

  const oppTemplates = [
    {
      title: 'Software Development Engineer - Intern',
      role: 'Software Engineer',
      type: 'INTERNSHIP',
      department: 'Core Infrastructure',
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Data Science & Artificial Intelligence'],
      minCgpa: 7.5,
      requiredSkills: ['Data Structures', 'Algorithms', 'JavaScript', 'Node.js'],
      preferredSkills: ['TypeScript', 'Docker', 'AWS'],
      stipendOrSalary: '₹55,000 / month',
      vacancies: 5,
      isExpired: true, // EXPIRED: Demonstrates post-deadline ranking & Top-N shortlist!
    },
    {
      title: 'Frontend Engineering Intern',
      role: 'Frontend Developer',
      type: 'INTERNSHIP',
      department: 'Product Experience',
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
      minCgpa: 7.0,
      requiredSkills: ['React', 'JavaScript', 'HTML', 'Tailwind CSS'],
      preferredSkills: ['TypeScript', 'Next.js'],
      stipendOrSalary: '₹45,000 / month',
      vacancies: 4,
      isExpired: false, // ACTIVE: Demonstrates deadline privacy lock!
    },
    {
      title: 'Full Stack Graduate Engineer Trainee',
      role: 'Full Stack Developer',
      type: 'FULL_TIME',
      department: 'Enterprise Platforms',
      allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
      minCgpa: 8.0,
      requiredSkills: ['React', 'Node.js', 'SQL', 'Git'],
      preferredSkills: ['MongoDB', 'Docker', 'Python'],
      stipendOrSalary: '₹14,50,000 / annum (CTC)',
      vacancies: 6,
      isExpired: true,
    },
    {
      title: 'Data Science & Machine Learning Intern',
      role: 'Data Scientist',
      type: 'INTERNSHIP_PPO',
      department: 'AI Research',
      allowedBranches: ['Computer Science & Engineering', 'Data Science & Artificial Intelligence'],
      minCgpa: 8.2,
      requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Algorithms'],
      preferredSkills: ['PyTorch', 'TensorFlow', 'Docker'],
      stipendOrSalary: '₹60,000 / month',
      vacancies: 3,
      isExpired: false,
    },
    {
      title: 'Cloud Systems & DevOps Engineer',
      role: 'DevOps Engineer',
      type: 'FULL_TIME',
      department: 'Cloud Infrastructure',
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
      minCgpa: 7.2,
      requiredSkills: ['Linux', 'Docker', 'AWS', 'Python'],
      preferredSkills: ['Kubernetes', 'Terraform'],
      stipendOrSalary: '₹12,00,000 / annum (CTC)',
      vacancies: 4,
      isExpired: true,
    },
    {
      title: 'Backend Systems Engineer - Campus Hire',
      role: 'Backend Developer',
      type: 'FULL_TIME',
      department: 'High-Throughput Engines',
      allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
      minCgpa: 7.8,
      requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Data Structures'],
      preferredSkills: ['Kafka', 'Redis', 'Docker'],
      stipendOrSalary: '₹16,00,000 / annum (CTC)',
      vacancies: 5,
      isExpired: true,
    },
  ];

  for (let i = 0; i < 22; i++) {
    const tpl = oppTemplates[i % oppTemplates.length];
    const org = organizations[i % organizations.length];
    const rec = (i === 0) ? recruiterUser : otherRecruiters[(i - 1) % otherRecruiters.length].user;

    // Set deadlines: some past (expired) to test post-deadline features, some in future to test pre-deadline locking
    let deadline;
    if (tpl.isExpired) {
      // Expired 5 days ago
      deadline = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    } else {
      // Open for another 12 days
      deadline = new Date(Date.now() + 12 * 24 * 60 * 60 * 1000);
    }

    const opp = await Opportunity.create({
      organization: org._id,
      recruiter: rec._id,
      title: (i < oppTemplates.length) ? tpl.title : `${tpl.title} (Cohort ${Math.floor(i / oppTemplates.length) + 1})`,
      role: tpl.role,
      type: tpl.type,
      description: `Comprehensive recruitment drive at ${org.name} for high-caliber undergraduate talent. Candidate will collaborate on mission-critical architecture.`,
      department: tpl.department,
      allowedDegrees: ['B.Tech', 'M.Tech'],
      allowedBranches: tpl.allowedBranches,
      minCgpa: tpl.minCgpa,
      requiredSkills: tpl.requiredSkills,
      preferredSkills: tpl.preferredSkills,
      requiredExperienceMonths: 0,
      graduationYears: [2026],
      maxBacklogs: 0,
      location: org.location,
      workMode: (i % 3 === 0) ? 'REMOTE' : (i % 3 === 1) ? 'HYBRID' : 'ON_SITE',
      stipendOrSalary: tpl.stipendOrSalary,
      vacancies: tpl.vacancies,
      applicationOpeningDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      applicationDeadline: deadline,
      status: tpl.isExpired ? 'DEADLINE_CLOSED' : 'ACTIVE',
    });

    // Create 4 recruitment rounds for each opportunity
    const r1 = await RecruitmentRound.create({
      opportunity: opp._id,
      roundOrder: 1,
      name: 'Round 1: Cognitive Aptitude Test',
      type: 'APTITUDE',
      passingScore: 60,
      timeLimitMinutes: 45,
      totalQuestions: 15,
      instructions: 'Complete 15 timed multiple-choice questions covering quantitative and logical aptitude.',
    });

    const r2 = await RecruitmentRound.create({
      opportunity: opp._id,
      roundOrder: 2,
      name: 'Round 2: DSA & Technical Coding',
      type: 'CODING',
      passingScore: 70,
      timeLimitMinutes: 60,
      totalQuestions: 2,
      instructions: 'Solve two data structure programming challenges. Solutions are tested against hidden test cases.',
    });

    const r3 = await RecruitmentRound.create({
      opportunity: opp._id,
      roundOrder: 3,
      name: 'Round 3: Deep Technical Interview',
      type: 'TECHNICAL_INTERVIEW',
      passingScore: 75,
      timeLimitMinutes: 45,
      instructions: '1-on-1 technical interview reviewing systems design, architecture, and live problem solving.',
    });

    const r4 = await RecruitmentRound.create({
      opportunity: opp._id,
      roundOrder: 4,
      name: 'Round 4: Leadership & HR Interview',
      type: 'HR_INTERVIEW',
      passingScore: 65,
      timeLimitMinutes: 30,
      instructions: 'Discussion on behavioral alignment, cultural fit, and compensation offering.',
    });

    // Create an attached Assessment for Round 1
    const mcqQuestions = createdQuestions.filter((q) => q.type === 'MCQ').slice(0, 15);
    await Assessment.create({
      opportunity: opp._id,
      round: r1._id,
      title: `${opp.title} - Preliminary Aptitude Test`,
      type: 'MCQ',
      timeLimitMinutes: 45,
      passingPercentage: 60,
      questions: mcqQuestions.map((q) => q._id),
      status: 'PUBLISHED',
    });

    opportunities.push({ opp, rounds: [r1, r2, r3, r4] });
  }

  // 6. Seed 130+ Applications across Opportunities with Snapshots
  console.log('📄 Seeding 130+ Applications with Immutable Snapshots & Algorithmic Evaluations...');
  
  // Let's populate the first expired opportunity with 30 applications to showcase Min-Heap Top-N (N=5) ranking!
  const targetExpiredOpp = opportunities[0].opp;
  const targetRounds = opportunities[0].rounds;

  const evaluatedPool = [];

  for (let i = 0; i < 30; i++) {
    const studentObj = students[i];
    const sp = studentObj.profile;

    const snapshot = await ApplicationSnapshot.create({
      student: studentObj.user._id,
      opportunity: targetExpiredOpp._id,
      fullName: sp.fullName,
      email: studentObj.user.email,
      phone: sp.phone,
      college: sp.college,
      degree: sp.degree,
      branch: sp.branch,
      graduationYear: sp.graduationYear,
      cgpa: sp.cgpa,
      percentage: sp.percentage,
      activeBacklogs: sp.activeBacklogs,
      skills: sp.skills,
      projects: sp.projects,
      experience: sp.experience,
      certifications: sp.certifications,
      achievements: sp.achievements,
      profiles: sp.profiles,
      preferences: sp.preferences,
      resumeUrl: sp.resumeUrl,
      resumeName: sp.resumeName,
      snapshotTimestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + i * 3600000),
    });

    const scoring = calculateCandidateScore(sp, targetExpiredOpp, algorithmConfig);

    evaluatedPool.push({
      student: studentObj.user._id,
      profile: sp,
      snapshot,
      scoring,
      appliedAt: snapshot.snapshotTimestamp,
    });
  }

  // Execute Min-Heap Top-N Selection (N = vacancies = 5)
  const candidateObjectsForHeap = evaluatedPool.map((e) => ({
    studentId: e.student,
    score: e.scoring.overallScore,
    skillCoverageRatio: e.scoring.skillCoverageRatio,
    totalExperienceMonths: e.scoring.totalExperienceMonths,
    cgpa: e.profile.cgpa,
    projectCount: e.profile.projects.length,
    appliedAt: e.appliedAt,
    snapshot: e.snapshot,
    scoring: e.scoring,
  }));

  const { topShortlist, extendedPool } = selectTopN(candidateObjectsForHeap, targetExpiredOpp.vacancies);

  // Save top shortlist applications
  for (const item of topShortlist) {
    const app = await Application.create({
      student: item.studentId,
      opportunity: targetExpiredOpp._id,
      snapshot: item.snapshot._id,
      status: 'SHORTLISTED',
      isEligible: true,
      matchScore: item.score,
      scoreBreakdown: item.scoring.scoreBreakdown,
      rank: item.rank,
      isTopNShortlisted: true,
      currentRoundIndex: 1, // Progressed to Round 2 (Coding)
      currentRound: targetRounds[1]._id,
      roundHistory: [
        {
          roundOrder: 1,
          roundName: 'Round 1: Cognitive Aptitude Test',
          roundType: 'APTITUDE',
          status: 'PASSED',
          score: 88,
          comments: 'Exceeded cutoff threshold (88/100).',
          evaluatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // Schedule an interview for rank 1 and rank 2 to demonstrate interview module
    if (item.rank <= 2) {
      await Interview.create({
        application: app._id,
        student: item.studentId,
        opportunity: targetExpiredOpp._id,
        round: targetRounds[2]._id,
        roundName: 'Round 3: Deep Technical Interview',
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + item.rank * 3600000),
        mode: 'ONLINE',
        meetingLink: 'https://meet.google.com/abc-demo-xyz',
        interviewers: ['Lead Software Architect', 'Senior Engineering Manager'],
        status: 'SCHEDULED',
        rubrics: { technicalKnowledge: 8, problemSolving: 9, communication: 8, roleFit: 9, overallScore: 8.5 },
      });
    }
  }

  // Save extended pool applications
  for (const item of extendedPool) {
    await Application.create({
      student: item.studentId,
      opportunity: targetExpiredOpp._id,
      snapshot: item.snapshot._id,
      status: 'APPLIED',
      isEligible: true,
      matchScore: item.score,
      scoreBreakdown: item.scoring.scoreBreakdown,
      rank: item.rank,
      isTopNShortlisted: false,
      currentRoundIndex: 0,
      currentRound: targetRounds[0]._id,
    });
  }

  // Also seed applications across other opportunities (including active ones where privacy lock is enforced)
  let appCounter = 0;
  for (let oppIdx = 1; oppIdx < opportunities.length; oppIdx++) {
    const opp = opportunities[oppIdx].opp;
    const rds = opportunities[oppIdx].rounds;
    const countToApply = 5 + (oppIdx % 4);

    for (let sIdx = 0; sIdx < countToApply; sIdx++) {
      const studentIndex = (oppIdx * 3 + sIdx) % students.length;
      const studentObj = students[studentIndex];
      const sp = studentObj.profile;

      const snapshot = await ApplicationSnapshot.create({
        student: studentObj.user._id,
        opportunity: opp._id,
        fullName: sp.fullName,
        email: studentObj.user.email,
        phone: sp.phone,
        branch: sp.branch,
        graduationYear: sp.graduationYear,
        cgpa: sp.cgpa,
        skills: sp.skills,
        projects: sp.projects,
        experience: sp.experience,
        resumeUrl: sp.resumeUrl,
        snapshotTimestamp: new Date(),
      });

      const scoring = calculateCandidateScore(sp, opp, algorithmConfig);

      await Application.create({
        student: studentObj.user._id,
        opportunity: opp._id,
        snapshot: snapshot._id,
        status: 'APPLIED',
        isEligible: true,
        matchScore: scoring.overallScore,
        scoreBreakdown: scoring.scoreBreakdown,
        currentRoundIndex: 0,
        currentRound: rds[0]._id,
      });

      appCounter++;
    }
  }

  // 7. Seed Placement Drive
  console.log('🏛️ Seeding Campus Placement Drive...');
  await PlacementDrive.create({
    name: '2025-2026 Campus Placement & Internship Season',
    academicYear: '2025-2026',
    startDate: new Date('2025-08-01'),
    endDate: new Date('2026-06-30'),
    eligibleBatches: [2025, 2026],
    eligibleDepartments: branches,
    participatingOrganizations: organizations.map((o) => o._id),
    status: 'ACTIVE',
    description: 'Centralized algorithm-driven placement drive for pre-final and final year undergraduates.',
  });

  console.log('========================================================');
  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Statistics:`);
  console.log(`   - Students: ${students.length}`);
  console.log(`   - Organizations: ${organizations.length}`);
  console.log(`   - Opportunities: ${opportunities.length}`);
  console.log(`   - Questions: ${createdQuestions.length}`);
  console.log(`   - Total Applications: ${30 + appCounter}`);
  console.log(`🔑 Demo Login Credentials (password: password123):`);
  console.log(`   - Student:   student@example.com`);
  console.log(`   - Recruiter: recruiter@example.com`);
  console.log(`   - Admin:     admin@example.com`);
  console.log('========================================================');
}

// Standalone execution if run directly via node
if (process.argv[1].endsWith('seed.js')) {
  runSeed()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed with error:', err);
      process.exit(1);
    });
}
