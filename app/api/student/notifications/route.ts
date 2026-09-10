import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth/session';
import { dataService } from '../../../../lib/db/dataService';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const notifications = await dataService.getNotifications();
    return NextResponse.json({ success: true, notifications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
