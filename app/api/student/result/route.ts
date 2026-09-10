import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth/session';
import { dataService } from '../../../../lib/db/dataService';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized. Student login required.' }, { status: 401 });
    }

    const student = await dataService.getStudentById(session.studentId || session.id || session.email);
    if (!student) {
      return NextResponse.json({ error: 'Student record not found.' }, { status: 404 });
    }

    const { published, allocation, unallocatedInfo } = await dataService.getStudentAllocation(student.id);
    const latestResult = await dataService.getLatestResult();

    return NextResponse.json({
      success: true,
      published,
      student,
      allocation,
      unallocatedInfo,
      algorithmName: latestResult?.algorithmName || 'Many-to-One Gale-Shapley Stable Matching',
      algorithmVersion: latestResult?.algorithmVersion || '2.4-stable',
      weights: latestResult?.weights,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
