import { fetchMovie } from '@/lib/fetchMovie';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get('imdbId');

    if (!imdbId) {
        return NextResponse.json({ error: 'imdbId query parameter is required' }, { status: 400 });
    }

    try {
        const movieData = await fetchMovie(imdbId);

        if (!movieData) {
            return NextResponse.json({ error: 'Movie not found. Please check the IMDb ID.' }, { status: 404 });
        }

        const combinedResponse = {
            movie: movieData
        };

        return NextResponse.json(combinedResponse);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
