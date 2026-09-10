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

    return NextResponse.json({ success: true, student });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const student = await dataService.getStudentById(session.studentId || session.id || session.email);
    if (!student) {
      return NextResponse.json({ error: 'Student record not found.' }, { status: 404 });
    }

    const updated = await dataService.updateStudentProfile(student.id, {
      branch: body.branch ?? student.branch,
      year: typeof body.year === 'number' ? body.year : student.year,
      cgpa: typeof body.cgpa === 'number' ? body.cgpa : student.cgpa,
      skills: Array.isArray(body.skills) ? body.skills : student.skills,
      experienceMonths: typeof body.experienceMonths === 'number' ? body.experienceMonths : student.experienceMonths,
      experienceSummary: body.experienceSummary ?? student.experienceSummary,
      resumeUrl: body.resumeUrl ?? student.resumeUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Profile successfully updated.',
      student: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
