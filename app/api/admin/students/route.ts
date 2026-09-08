import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth/session';
import { dataService } from '../../../../lib/db/dataService';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const students = await dataService.getStudents();
    return NextResponse.json({ success: true, students });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, rollNumber, branch, year, cgpa, skills, resumeUrl } = body;

    if (!name || !email || !rollNumber || !branch || cgpa === undefined) {
      return NextResponse.json(
        { error: 'Missing required student fields (name, email, rollNumber, branch, cgpa)' },
        { status: 400 }
      );
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newStudent = await dataService.createStudent({
      name,
      email,
      rollNumber,
      branch,
      year: Number(year) || 3,
      cgpa: parseFloat(cgpa),
      skills: skillsArray,
      resumeUrl,
    });

    return NextResponse.json({ success: true, student: newStudent }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Student id is required' }, { status: 400 });
    }

    if (data.skills && typeof data.skills === 'string') {
      data.skills = data.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (data.cgpa !== undefined) {
      data.cgpa = parseFloat(data.cgpa);
    }

    const updated = await dataService.updateStudent(id, data);
    return NextResponse.json({ success: true, student: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Student id is required' }, { status: 400 });
    }

    await dataService.deleteStudent(id);
    return NextResponse.json({ success: true, message: 'Student deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
