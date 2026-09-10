import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth/session';
import { dataService } from '../../../../lib/db/dataService';

export async function POST() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const studentId = session.studentId || 'stud_1';
    await dataService.updateStudentProfile(studentId, {
      preferencesLocked: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Your internship preferences have been locked. Modifications are now disabled.',
      preferencesLocked: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
