import * as cheerio from 'cheerio';
import { CastMember } from '@/types/movie';

/**
 * fetchFullCast — Scrapes IMDb for actors, roles and images.
 * Hardened version with detailed logging to server console.
 */
export async function fetchFullCast(imdbId: string): Promise<CastMember[]> {
    const url = `https://www.imdb.com/title/${imdbId}/fullcredits`;

    // Standard secure headers to avoid bot detection
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Referer': `https://www.imdb.com/title/${imdbId}/`,
    };

    const cast: CastMember[] = [];

    try {
        console.log(`[fetchFullCast] Fetching ${imdbId}...`);
        const response = await fetch(url, { headers, cache: 'no-store' });

        if (!response.ok) {
            console.error(`[fetchFullCast] ❌ HTTP Error ${response.status} for ${imdbId}`);
            return [];
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        console.log(`[fetchFullCast] HTML loaded: ${html.length} chars`);

        // --- STRATEGY 1: __NEXT_DATA__ JSON (Modern IMDb) ---
        const nextDataScript = $('script#__NEXT_DATA__').html();
        if (nextDataScript) {
            try {
                const json = JSON.parse(nextDataScript);
                console.log('[fetchFullCast] JSON blob detected. Parsing...');

                // Helper to explore paths
                const findCastInGroupings = (groupings: any[]) => {
                    if (!Array.isArray(groupings)) return null;
                    return groupings.find(g =>
                        g.node?.grouping?.text === 'Cast' ||
                        g.node?.label === 'Cast' ||
                        g.node?.section?.title === 'Cast'
                    );
                };

                const contentData = json?.props?.pageProps?.contentData;
                const groupings = contentData?.data?.title?.creditGroupings?.edges ||
                    contentData?.categories || [];

                const castGrouping = findCastInGroupings(groupings);

                if (castGrouping) {
                    console.log('[fetchFullCast] Found Cast grouping in JSON (Strategy 1A)');
                    const edges = castGrouping.node?.credits?.edges || castGrouping.section?.items || [];

                    for (const edge of edges) {
                        if (cast.length >= 32) break;
                        const src = edge.node || edge; // Support different structures
                        const name = src.name?.nameText?.text || src.title?.node?.nameText?.text;
                        const role = src.creditedRoles?.edges?.[0]?.node?.characters?.edges?.[0]?.node?.name ||
                            src.characters?.[0]?.name || 'Actor';
                        let image = src.name?.primaryImage?.url || src.title?.node?.primaryImage?.url;

                        if (name && !cast.find(c => c.name === name)) {
                            if (image?.includes('._V1_')) {
                                image = image.split('._V1_')[0] + '._V1_UX214_CR0,0,214,317_AL_.jpg';
                            }
                            cast.push({ name, role, image });
                        }
                    }
                }

                // If todavía no hay cast, try castV2 fallback
                if (cast.length === 0) {
                    const castV2 = contentData?.entityMetadata?.castV2?.edges ||
                        json?.props?.pageProps?.mainColumnData?.cast?.edges || [];

                    if (castV2.length > 0) {
                        console.log('[fetchFullCast] Found castV2 in JSON (Strategy 1B)');
                        for (const edge of castV2) {
                            if (cast.length >= 32) break;
                            const node = edge.node;
                            const name = node?.name?.nameText?.text;
                            const role = edge.characters?.[0]?.name || 'Actor';
                            let image = node?.name?.primaryImage?.url;

                            if (name && !cast.find(c => c.name === name)) {
                                if (image?.includes('._V1_')) {
                                    image = image.split('._V1_')[0] + '._V1_UX214_CR0,0,214,317_AL_.jpg';
                                }
                                cast.push({ name, role, image });
                            }
                        }
                    }
                }
            } catch (jsonErr) {
                console.warn('[fetchFullCast] JSON strategy failed internally:', jsonErr);
            }
        }

        // --- STRATEGY 2: CSS Selectors (Newer React Layout) ---
        if (cast.length === 0) {
            console.log('[fetchFullCast] Strategy 1 failed. Trying Strategy 2 (CSS Scraper)...');
            $('[data-testid="title-cast-item"], .ipc-metadata-list-summary-item').each((_, el) => {
                if (cast.length >= 32) return;
                const name = $(el).find('[data-testid="title-cast-item__actor"], .ipc-metadata-list-summary-item__t').text().trim();
                const role = $(el).find('[data-testid="cast-item-characters-with-as"], .ipc-metadata-list-summary-item__s').text().trim();
                const img = $(el).find('img');
                let image = img.attr('src') || img.attr('data-src') || img.attr('loadlate');

                if (image?.includes('nopicture')) image = undefined;
                if (image?.includes('._V1_')) {
                    image = image.split('._V1_')[0] + '._V1_UX214_CR0,0,214,317_AL_.jpg';
                }

                if (name && !cast.find(c => c.name === name)) {
                    cast.push({ name, role: role.replace(/^as\s+/i, '') || 'Actor', image });
                }
            });
        }

        // --- STRATEGY 3: Table Scraper (Old Layout) ---
        if (cast.length === 0) {
            console.log('[fetchFullCast] Strategy 2 failed. Trying Strategy 3 (Table Scraper)...');
            $('table.cast_list tr').each((_, row) => {
                if (cast.length >= 32) return;
                const nameLink = $(row).find('td:not(.primary_photo) a').first();
                const name = nameLink.text().trim();
                const role = $(row).find('.character').text().trim().replace(/\s+/g, ' ');
                const img = $(row).find('td.primary_photo img');
                let image = img.attr('loadlate') || img.attr('src');

                if (image?.includes('nopicture')) image = undefined;
                if (image?.includes('._V1_')) {
                    image = image.split('._V1_')[0] + '._V1_UX214_CR0,0,214,317_AL_.jpg';
                }

                if (name && !cast.find(c => c.name === name)) {
                    cast.push({ name, role: role || 'Actor', image });
                }
            });
        }

        // --- STRATEGY 4: Brute Force Links (Last Resort) ---
        if (cast.length === 0) {
            console.log('[fetchFullCast] All strategies failed. Brute-forcing actor links...');
            $('a[href*="/name/nm/"]').each((_, el) => {
                if (cast.length >= 10) return;
                const name = $(el).text().trim();
                if (name.length > 3 && !name.includes('...') && !cast.find(c => c.name === name)) {
                    cast.push({ name, role: 'Actor' });
                }
            });
        }

        console.log(`[fetchFullCast] ✅ Finished. Extracted ${cast.length} members for ${imdbId}`);
        return cast;

    } catch (error) {
        console.error(`[fetchFullCast] ❌ Critical Error for ${imdbId}:`, error);
        return [];
    }
}
