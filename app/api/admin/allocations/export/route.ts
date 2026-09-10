import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = '/api/reports/download';
  url.searchParams.set('format', 'csv');
  return NextResponse.redirect(url);
}
