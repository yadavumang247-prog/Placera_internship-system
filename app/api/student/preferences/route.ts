import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth/session';
import { dataService } from '../../../../lib/db/dataService';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized. Student login required.' }, { status: 403 });
    }

    const studentId = session.studentId || 'stud_1';
    const preferences = await dataService.getPreferencesByStudent(studentId);

    return NextResponse.json({ success: true, preferences });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized. Student login required.' }, { status: 403 });
    }

    const studentId = session.studentId || 'stud_1';
    const body = await request.json();
    const { internshipIds } = body;

    if (!Array.isArray(internshipIds)) {
      return NextResponse.json(
        { error: 'internshipIds must be an array of internship IDs' },
        { status: 400 }
      );
    }

    const updatedPreferences = await dataService.saveStudentPreferences(studentId, internshipIds);

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: updatedPreferences,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
