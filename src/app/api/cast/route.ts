import { fetchFullCast } from '@/lib/fetchFullCast';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get('imdbId');

    if (!imdbId) {
        return NextResponse.json({ error: 'imdbId query parameter is required' }, { status: 400 });
    }

    try {
        const fullCast = await fetchFullCast(imdbId);
        return NextResponse.json({ fullCast });
    } catch (error) {
        console.error('Cast API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
