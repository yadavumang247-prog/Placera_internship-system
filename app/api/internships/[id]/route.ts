import { NextResponse } from 'next/server';
import { dataService } from '../../../../lib/db/dataService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const internship = await dataService.getInternshipById(params.id);
    if (!internship) {
      return NextResponse.json({ error: 'Internship not found.' }, { status: 404 });
    }

    const company = await dataService.getCompanyById(internship.companyId);

    return NextResponse.json({
      success: true,
      internship: {
        ...internship,
        company,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
