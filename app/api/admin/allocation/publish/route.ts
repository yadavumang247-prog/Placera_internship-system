import { NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/auth/session';
import { dataService } from '../../../../../lib/db/dataService';

export async function POST() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const result = await dataService.publishAllocation(session.name || 'Placement Admin');

    return NextResponse.json({
      success: true,
      message: 'Official allocation results successfully published to all students and employers!',
      result,
      publicationStatus: 'PUBLISHED',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to publish allocation results' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      publicationStatus: dataService.getPublicationStatus(),
      isPublished: dataService.getPublicationStatus() === 'PUBLISHED',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
