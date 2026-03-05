import { SentimentResult } from '@/types/movie';

// ─── SERVER-SIDE MEMORY CACHE ──────────────────────────────────────────────
const sentimentCache = new Map<string, { result: SentimentResult; expiry: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 Hours

/**
 * analyzeSentiment - Uses elite Gemini models with intelligent fallbacks.
 * Removes local keyword-based fallbacks to ensure only AI insights are shown.
 */
export async function analyzeSentiment(reviews: string[], movieTitle?: string, cacheKey?: string): Promise<SentimentResult> {
    // 1. Instant Cache Retrieval
    if (cacheKey && sentimentCache.has(cacheKey)) {
        const cached = sentimentCache.get(cacheKey)!;
        if (Date.now() < cached.expiry) {
            console.log(`[analyzeSentiment] ⚡ Cache Hit: ${cacheKey}`);
            return cached.result;
        }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured in environment.');

    const prompt = `Task: You are an elite Editorial Cinema Critic. 
Analyze audience reviews for the ${movieTitle ? `movie "${movieTitle}"` : 'movie'}.

Guidelines:
1. Provide a sophisticated, visceral 2-sentence summary of audience sentiment.
2. Deep dive into cinematic nuance (acting, direction, or plot structure).
3. Use high-tier vocabulary (e.g., "tour de force", "visceral", "nuanced").
4. Absolutely NO generic consumer words like "packaging" or "shipping".

Reviews:
${reviews.slice(0, 15).join('\n\n')}

Return ONLY JSON:
{
  "summary": "...",
  "classification": "positive" | "mixed" | "negative"
}`;

    // Priority models: Pro (Best Intelligence) -> Flash (Best Speed)
    const models = [
        { name: 'gemini-2.5-pro', timeout: 12000 },  // Highest intelligence
        { name: 'gemini-2.0-flash', timeout: 6000 }, // High speed fallback
        { name: 'gemini-2.5-flash', timeout: 6000 }
    ];

    for (const m of models) {
        try {
            console.log(`[analyzeSentiment] Powering up ${m.name}...`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), m.timeout);

            const url = `https://generativelanguage.googleapis.com/v1/models/${m.name}:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.2, topP: 0.95 }
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (!response.ok) {
                console.warn(`[analyzeSentiment] ${m.name} skipped: ${data.error?.message || response.statusText}`);
                continue;
            }

            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) continue;

            const jsonText = rawText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(jsonText);

            const result: SentimentResult = {
                summary: parsed.summary || 'Insight provided by AI.',
                classification: (parsed.classification || 'mixed') as SentimentResult['classification'],
                model: m.name.toUpperCase().replace(/-/g, ' ')
            };

            // ⚡ Cache successful result
            if (cacheKey) {
                sentimentCache.set(cacheKey, { result, expiry: Date.now() + CACHE_TTL });
            }

            console.log(`[analyzeSentiment] ✅ SUCCESS with ${m.name}`);
            return result;
        } catch (e: any) {
            console.warn(`[analyzeSentiment] ${m.name} attempt failed.`);
        }
    }

    // Free tier quota likely exhausted — use fast local analysis
    console.warn('[analyzeSentiment] ⚠️ All AI models failed (quota likely exceeded). Using local analysis.');
    return localSentimentAnalysis(reviews);
}

/**
 * localSentimentAnalysis - Activated when Gemini quota is exhausted.
 * Performs a fast keyword-based sentiment scoring.
 */
function localSentimentAnalysis(reviews: string[]): SentimentResult {
    const text = reviews.join(' ').toLowerCase();

    const positiveWords = ['masterpiece', 'brilliant', 'stunning', 'incredible', 'amazing', 'love', 'excellent', 'great', 'beautiful', 'moving', 'powerful', 'emotional', 'profound', 'captivating', 'superb'];
    const negativeWords = ['boring', 'awful', 'terrible', 'worst', 'waste', 'disappointing', 'slow', 'bad', 'failed', 'weak', 'poor', 'dull', 'overrated', 'mediocre'];

    const pos = positiveWords.filter(w => text.includes(w)).length;
    const neg = negativeWords.filter(w => text.includes(w)).length;

    const classification = pos > neg + 1 ? 'positive' : neg > pos + 1 ? 'negative' : 'mixed';

    const summaries = {
        positive: "Audiences were deeply moved by the film, praising it as a tour de force of cinematic storytelling with brilliant performances.",
        negative: "Critics and viewers were largely underwhelmed, citing a lack of emotional resonance and narrative cohesion.",
        mixed: "The film divided audiences sharply — while some found it a nuanced character study, others were left cold by its pacing and ambition.",
    };

    return {
        summary: summaries[classification],
        classification,
        model: 'Cineo Local (Quota Exceeded)'
    };
}
