const fs = require('fs');

async function debugPaths() {
    const imdbId = 'tt0068646';
    const url = `https://www.imdb.com/title/${imdbId}/fullcredits`;

    console.log(`Checking ${imdbId} JSON categories deeper...`);
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html',
        }
    });
    const text = await res.text();
    const match = text.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

    if (match) {
        const json = JSON.parse(match[1]);
        const categories = json?.props?.pageProps?.contentData?.categories || [];

        categories.forEach((cat, i) => {
            const section = cat.section;
            if (section && section.total > 0 && section.items && section.items.length > 0) {
                const firstItem = section.items[0];
                console.log(`Category [${i}]: Item[0] Title: ${firstItem.title?.node?.nameText?.text}`);
                console.log(`Character: ${firstItem.characters?.[0]?.name}`);
            }
        });
    }
}

debugPaths();
