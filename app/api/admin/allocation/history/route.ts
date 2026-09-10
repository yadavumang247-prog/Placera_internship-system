import { NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/auth/session';
import { dataService } from '../../../../../lib/db/dataService';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const runs = await dataService.getAllocationRuns();
    const logs = await dataService.getAuditLogs();

    return NextResponse.json({
      success: true,
      runs,
      logs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
