import { analyzeSentiment } from '@/lib/analyzeSentiment';
import { fetchReviews } from '@/lib/fetchReviews';
import { NextResponse } from 'next/server';

// Simple IP-based rate-limiting (10 requests per minute)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 10;
const WINDOW = 60 * 1000;

export async function POST(request: Request) {
    const ip = request.headers.get('x-forwarded-for') || 'local-user';
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    // Reset window
    if (now - userLimit.lastReset > WINDOW) {
        userLimit.count = 0;
        userLimit.lastReset = now;
    }

    if (userLimit.count >= LIMIT) {
        return NextResponse.json({
            error: 'Rate limit exceeded. Please wait a minute.',
            summary: "Analyzing movie audience insights is a complex process. Please slow down to allow our AI to maintain accuracy.",
            classification: "mixed"
        }, { status: 429 });
    }

    userLimit.count++;
    rateLimitMap.set(ip, userLimit);

    try {
        const { title, imdbId } = await request.json();

        if (!imdbId) {
            return NextResponse.json({ error: 'imdbId is required to analyze sentiment' }, { status: 400 });
        }

        const reviews = await fetchReviews(imdbId);

        if (!reviews || reviews.length === 0) {
            return NextResponse.json({
                summary: "Not enough recent audience reviews available to form a conclusive artificial intelligence analysis at this time.",
                classification: "mixed"
            });
        }

        const result = await analyzeSentiment(reviews, title, imdbId);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Sentiment API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
