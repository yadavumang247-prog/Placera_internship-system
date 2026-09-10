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
    const weights: AlgorithmWeights = {
      skillWeight: typeof body.skillWeight === 'number' ? body.skillWeight : 0.40,
      cgpaWeight: typeof body.cgpaWeight === 'number' ? body.cgpaWeight : 0.30,
      experienceWeight: typeof body.experienceWeight === 'number' ? body.experienceWeight : 0.20,
      branchWeight: typeof body.branchWeight === 'number' ? body.branchWeight : 0.10,
      minSkillMatchRatio: typeof body.minSkillMatchRatio === 'number' ? body.minSkillMatchRatio : 0.0,
      preferenceWeight: typeof body.preferenceWeight === 'number' ? body.preferenceWeight : 0.40,
    };

    const algorithmType = body.algorithmType === 'GREEDY' ? 'GREEDY' : 'GALE_SHAPLEY';

    const result = await dataService.previewAllocation(weights, algorithmType);

    return NextResponse.json({
      success: true,
      message: 'Allocation preview generated successfully. Results are NOT yet published.',
      result,
      publicationStatus: dataService.getPublicationStatus(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to generate allocation preview' },
      { status: 500 }
    );
  }
}
