import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth/session';
import { dataService } from '../../../../lib/db/dataService';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'COMPANY')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    const result = await dataService.getLatestResult();
    const allocations = result.allocations;

    if (format === 'csv') {
      const headers = [
        'Roll Number',
        'Student Name',
        'Branch',
        'CGPA',
        'Allocated Company',
        'Internship Title',
        'Preference Rank',
        'Composite Score',
        'Skill Match %',
        'CGPA Score',
        'Status',
        'Allocated Date',
      ];

      const rows = allocations.map((a) => [
        `"${a.studentRollNumber || ''}"`,
        `"${a.studentName || ''}"`,
        `"${a.studentBranch || ''}"`,
        (a.studentCgpa || 0).toFixed(2),
        `"${a.companyName || ''}"`,
        `"${a.internshipTitle || ''}"`,
        a.preferenceRank,
        (a.score || 0).toFixed(1),
        (a.skillMatchScore || 0).toFixed(1),
        (a.cgpaScore || 0).toFixed(1),
        `"${a.status}"`,
        `"${new Date(a.allocatedAt).toLocaleDateString()}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="smartintern_allocations_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      allocations,
      stats: result.stats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
