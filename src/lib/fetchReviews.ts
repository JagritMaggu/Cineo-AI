import * as cheerio from 'cheerio';

export async function fetchReviews(imdbId: string): Promise<string[]> {
    const url = `https://www.imdb.com/title/${imdbId}/reviews/?ref_=tt_urv`;
    console.log(`[fetchReviews] Fetching: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
            },
            cache: 'no-store',
        });

        console.log(`[fetchReviews] Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            console.error(`[fetchReviews] FAILED with status ${response.status}`);
            return [];
        }

        const html = await response.text();
        console.log(`[fetchReviews] HTML length: ${html.length} chars`);
        console.log(`[fetchReviews] HTML preview (first 500 chars):\n${html.substring(0, 500)}`);

        const $ = cheerio.load(html);
        const reviews: string[] = [];

        const selectors = [
            '.text.show-more__control',
            '[data-testid="review-summary"]',
            '.ipc-html-content-inner-div',
            '.content .text',
        ];

        for (const selector of selectors) {
            const found = $(selector).length;
            console.log(`[fetchReviews] Selector "${selector}" found ${found} elements`);

            $(selector).each((i, el) => {
                if (reviews.length < 10) {
                    const text = $(el).text().trim();
                    if (text && text.length > 50) {
                        reviews.push(text);
                    }
                }
            });

            if (reviews.length > 0) {
                console.log(`[fetchReviews] ✅ Got ${reviews.length} reviews using selector: ${selector}`);
                break;
            }
        }

        if (reviews.length === 0) {
            console.warn(`[fetchReviews] ⚠️ No reviews found. IMDb may be blocking. HTML snippet:\n${html.substring(0, 1000)}`);
        }

        return reviews;

    } catch (error) {
        console.error('[fetchReviews] ❌ Exception:', error);
        return [];
    }
}
