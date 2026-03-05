import { fetchMovie } from '@/lib/fetchMovie';
import { fetchFullCast } from '@/lib/fetchFullCast';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get('imdbId');

    if (!imdbId) {
        return NextResponse.json({ error: 'imdbId query parameter is required' }, { status: 400 });
    }

    try {
        // Fetch core data and scrape IMDb cast SIMULTANEOUSLY on the backend server
        const [movieData, fullCast] = await Promise.all([
            fetchMovie(imdbId),
            fetchFullCast(imdbId)
        ]);

        if (!movieData) {
            return NextResponse.json({ error: 'Movie not found. Please check the IMDb ID.' }, { status: 404 });
        }

        const combinedResponse = {
            movie: {
                ...movieData,
                fullCast: fullCast || []
            }
        };

        return NextResponse.json(combinedResponse);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
