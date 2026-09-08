import { NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/auth/session';
import { dataService } from '../../../../../lib/db/dataService';
import { AlgorithmWeights } from '../../../../../lib/types';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const weights: Partial<AlgorithmWeights> = {};

    if (typeof body.preferenceWeight === 'number') {
      weights.preferenceWeight = body.preferenceWeight;
    }
    if (typeof body.cgpaWeight === 'number') {
      weights.cgpaWeight = body.cgpaWeight;
    }
    if (typeof body.skillWeight === 'number') {
      weights.skillWeight = body.skillWeight;
    }
    if (typeof body.minSkillMatchRatio === 'number') {
      weights.minSkillMatchRatio = body.minSkillMatchRatio;
    }

    const result = await dataService.runAllocation(weights);

    return NextResponse.json({
      success: true,
      message: 'Algorithm execution completed successfully',
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Algorithm execution failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const result = await dataService.getLatestAlgorithmResult();
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
