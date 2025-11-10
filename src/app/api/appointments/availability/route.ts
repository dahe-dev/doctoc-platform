import { NextRequest, NextResponse } from 'next/server';
import { getAvailability } from '@/app/actions/appointments';
import { DOCTOC_CONFIG } from '@/config/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await getAvailability({
      orgID: DOCTOC_CONFIG.orgID,
      ...body,
    });

    if (result.success) {
      return NextResponse.json(result.data);
    }

    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
