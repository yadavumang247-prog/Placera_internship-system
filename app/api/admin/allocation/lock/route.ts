import { NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/auth/session';
import { dataService } from '../../../../../lib/db/dataService';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const locked = typeof body.locked === 'boolean' ? body.locked : true;

    await dataService.setPreferenceLock(locked, session.name || 'Placement Admin');

    return NextResponse.json({
      success: true,
      locked,
      message: locked ? 'Preferences locked.' : 'Preferences unlocked.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const locked = dataService.isPreferencesLocked();
    return NextResponse.json({ locked });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
