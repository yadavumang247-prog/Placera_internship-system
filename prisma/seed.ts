import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  INITIAL_COMPANIES,
  INITIAL_INTERNSHIPS,
  INITIAL_STUDENTS,
  INITIAL_PREFERENCES,
} from '../lib/db/seedData';
import { runInternshipAllocation, DEFAULT_WEIGHTS } from '../lib/algorithm/internshipAllocation';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Smart Internship Allocation System...');

  // Clear existing records in reverse dependency order
  await prisma.allocation.deleteMany();
  await prisma.algorithmRun.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.company.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 1. Create Users
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const studentPasswordHash = await bcrypt.hash('Student@123', 10);
  const companyPasswordHash = await bcrypt.hash('Company@123', 10);

  // Admin
  await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  // Company Lead
  const companyUser = await prisma.user.create({
    data: {
      name: 'Google Recruiter',
      email: 'company@example.com',
      passwordHash: companyPasswordHash,
      role: 'COMPANY',
    },
  });

  // 2. Create Companies
  const companyMap = new Map<string, string>();
  for (let i = 0; i < INITIAL_COMPANIES.length; i++) {
    const comp = INITIAL_COMPANIES[i];
    const created = await prisma.company.create({
      data: {
        id: comp.id,
        name: comp.name,
        description: comp.description,
        logoUrl: comp.logoUrl,
        website: comp.website,
        userId: i === 0 ? companyUser.id : undefined,
      },
    });
    companyMap.set(comp.id, created.id);
  }
  console.log(`✅ Seeded ${INITIAL_COMPANIES.length} companies.`);

  // 3. Create Internships
  for (const intern of INITIAL_INTERNSHIPS) {
    await prisma.internship.create({
      data: {
        id: intern.id,
        companyId: intern.companyId,
        title: intern.title,
        description: intern.description,
        location: intern.location,
        mode: intern.mode,
        stipend: intern.stipend,
        duration: intern.duration,
        minimumCGPA: intern.minimumCGPA,
        requiredSkills: intern.requiredSkills.join(', '),
        totalSeats: intern.totalSeats,
        availableSeats: intern.availableSeats,
        applicationDeadline: new Date(intern.applicationDeadline),
      },
    });
  }
  console.log(`✅ Seeded ${INITIAL_INTERNSHIPS.length} internships.`);

  // 4. Create Students & Student Users
  for (let i = 0; i < INITIAL_STUDENTS.length; i++) {
    const stud = INITIAL_STUDENTS[i];
    const user = await prisma.user.create({
      data: {
        id: stud.userId,
        name: stud.name,
        email: stud.email,
        passwordHash: studentPasswordHash,
        role: 'STUDENT',
      },
    });

    await prisma.student.create({
      data: {
        id: stud.id,
        userId: user.id,
        rollNumber: stud.rollNumber,
        branch: stud.branch,
        year: stud.year,
        cgpa: stud.cgpa,
        skills: stud.skills.join(', '),
        resumeUrl: stud.resumeUrl,
      },
    });
  }
  console.log(`✅ Seeded ${INITIAL_STUDENTS.length} students.`);

  // 5. Create Preferences
  for (const pref of INITIAL_PREFERENCES) {
    await prisma.preference.create({
      data: {
        id: pref.id,
        studentId: pref.studentId,
        internshipId: pref.internshipId,
        rank: pref.rank,
      },
    });
  }
  console.log(`✅ Seeded ${INITIAL_PREFERENCES.length} student preference rankings.`);

  // 6. Run Initial Allocation and Persist
  console.log('⚙️ Executing baseline AOA algorithm run...');
  const result = runInternshipAllocation(
    INITIAL_STUDENTS,
    INITIAL_INTERNSHIPS,
    INITIAL_PREFERENCES,
    DEFAULT_WEIGHTS
  );

  await prisma.algorithmRun.create({
    data: {
      totalStudents: result.stats.totalStudents,
      totalInternships: result.stats.totalInternships,
      totalEligiblePairs: result.stats.totalEligiblePairs,
      totalAllocated: result.stats.totalAllocated,
      totalUnallocated: result.stats.totalUnallocated,
      executionTime: result.stats.executionTimeMs,
      algorithmName: 'Multi-Criteria Constrained Greedy Optimization',
    },
  });

  for (const alloc of result.allocations) {
    await prisma.allocation.create({
      data: {
        id: alloc.id,
        studentId: alloc.studentId,
        internshipId: alloc.internshipId,
        score: alloc.score,
        preferenceRank: alloc.preferenceRank,
        skillMatchScore: alloc.skillMatchScore,
        cgpaScore: alloc.cgpaScore,
        status: alloc.status,
        allocatedAt: new Date(alloc.allocatedAt),
      },
    });
  }

  console.log(`🎉 Database seeding completed successfully! Allocated ${result.allocations.length} students.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
