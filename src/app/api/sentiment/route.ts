import { analyzeSentiment } from '@/lib/analyzeSentiment';
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
        const { reviews, title, imdbId } = await request.json();

        if (!reviews || !Array.isArray(reviews)) {
            return NextResponse.json({ error: 'Array of reviews is required' }, { status: 400 });
        }

        if (reviews.length === 0) {
            return NextResponse.json({
                summary: "No reviews available to analyze.",
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
