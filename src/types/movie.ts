export interface CastMember {
    name: string;
    role: string;
    image?: string;
}

export interface Movie {
    title: string;
    year: string;
    rating: string;
    poster: string;
    genre: string;
    runtime: string;
    released: string;
    cast: string;
    fullCast: CastMember[];
    plot: string;
}

export interface Review {
    author: string;
    content: string;
    rating?: number;
}

export interface SentimentResult {
    summary: string;
    classification: 'positive' | 'mixed' | 'negative';
    model?: string;
}

export interface MovieApiResponse {
    movie: Movie;
    reviews: string[];
}
