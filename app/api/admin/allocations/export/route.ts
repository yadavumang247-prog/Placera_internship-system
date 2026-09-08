import { NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/auth/session';
import { dataService } from '../../../../../lib/db/dataService';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const allocations = await dataService.getAllocations();

    // Generate CSV Header
    const headers = [
      'Student Name',
      'Roll Number',
      'Branch',
      'CGPA',
      'Company',
      'Internship Title',
      'Preference Rank',
      'Skill Match Score (%)',
      'CGPA Score',
      'Final Overall Score',
      'Status',
      'Allocated Date',
    ];

    const rows = allocations.map((alloc) => [
      `"${alloc.studentName || ''}"`,
      `"${alloc.studentRollNumber || ''}"`,
      `"${alloc.studentBranch || ''}"`,
      alloc.studentCgpa !== undefined ? alloc.studentCgpa : '',
      `"${alloc.companyName || ''}"`,
      `"${alloc.internshipTitle || ''}"`,
      alloc.preferenceRank,
      alloc.skillMatchScore,
      alloc.cgpaScore,
      alloc.score,
      alloc.status,
      `"${new Date(alloc.allocatedAt).toISOString().split('T')[0]}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="internship_allocations_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
