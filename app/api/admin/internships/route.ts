import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth/session';
import { dataService } from '../../../../lib/db/dataService';

export async function GET() {
  try {
    const internships = await dataService.getInternships();
    return NextResponse.json({ success: true, internships });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'COMPANY')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      companyId,
      title,
      description,
      location,
      mode,
      stipend,
      duration,
      minimumCGPA,
      requiredSkills,
      totalSeats,
      applicationDeadline,
    } = body;

    const targetCompanyId = session.role === 'COMPANY' && session.companyId ? session.companyId : companyId;

    if (!targetCompanyId || !title || !description || totalSeats === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields (companyId, title, description, totalSeats)' },
        { status: 400 }
      );
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : typeof requiredSkills === 'string'
      ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newIntern = await dataService.createInternship({
      companyId: targetCompanyId,
      title,
      description,
      location: location || 'Remote',
      mode: mode || 'REMOTE',
      stipend: Number(stipend) || 0,
      duration: duration || '3 Months',
      minimumCGPA: parseFloat(minimumCGPA) || 6.0,
      requiredSkills: skillsArray,
      totalSeats: Number(totalSeats) || 1,
      applicationDeadline: applicationDeadline || '2026-12-31',
    });

    return NextResponse.json({ success: true, internship: newIntern }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'COMPANY')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Internship id is required' }, { status: 400 });
    }

    if (data.requiredSkills && typeof data.requiredSkills === 'string') {
      data.requiredSkills = data.requiredSkills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (data.minimumCGPA !== undefined) {
      data.minimumCGPA = parseFloat(data.minimumCGPA);
    }
    if (data.stipend !== undefined) {
      data.stipend = Number(data.stipend);
    }
    if (data.totalSeats !== undefined) {
      data.totalSeats = Number(data.totalSeats);
    }

    const updated = await dataService.updateInternship(id, data);
    return NextResponse.json({ success: true, internship: updated });
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
      return NextResponse.json({ error: 'Internship id is required' }, { status: 400 });
    }

    await dataService.deleteInternship(id);
    return NextResponse.json({ success: true, message: 'Internship deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
