const imdbId = process.argv[2] || 'tt0468569';
const url = `https://www.imdb.com/title/${imdbId}/fullcredits`;

async function testFetch() {
    console.log(`Testing fetch for ${imdbId}...`);
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html',
                'Referer': `https://www.imdb.com/title/${imdbId}/`,
            }
        });
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`HTML Length: ${text.length}`);
        console.log(`HTML Preview: ${text.substring(0, 500)}`);

        const hasNextData = text.includes('id="__NEXT_DATA__"');
        console.log(`Has __NEXT_DATA__: ${hasNextData}`);

        const hasCastTable = text.includes('class="cast_list"');
        console.log(`Has cast_list table: ${hasCastTable}`);

        const hasModernItem = text.includes('ipc-metadata-list-summary-item');
        console.log(`Has modern list items: ${hasModernItem}`);

        if (text.includes('Access Denied') || text.includes('Cloudflare')) {
            console.error('FETCH BLOCKED BY PROVIDER');
        }
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

testFetch();
