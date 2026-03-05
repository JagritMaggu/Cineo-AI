import { Movie } from '@/types/movie';

export async function fetchMovie(imdbId: string): Promise<Movie | null> {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        console.error('OMDB_API_KEY is not set');
        return null;
    }

    const response = await fetch(`http://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === 'False') {
        return null;
    }

    return {
        title: data.Title,
        year: data.Year,
        rating: data.imdbRating,
        poster: data.Poster,
        genre: data.Genre,
        runtime: data.Runtime,
        cast: data.Actors, // OMDb 3-actor summary (used as subtitle)
        fullCast: [],      // Populated by fetchFullCast in the API route
        plot: data.Plot,
    };
}
