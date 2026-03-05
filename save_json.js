const fs = require('fs');

async function debugPaths() {
    const imdbId = 'tt0068646';
    const url = `https://www.imdb.com/title/${imdbId}/fullcredits`;

    console.log(`Fetching ${imdbId} JSON content...`);
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html',
        }
    });
    const text = await res.text();
    const match = text.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

    if (match) {
        fs.writeFileSync('imdb_full.json', match[1]);
        console.log('Saved to imdb_full.json. Checking size...');
        console.log(`Size: ${fs.statSync('imdb_full.json').size} bytes`);
    } else {
        console.error('No __NEXT_DATA__ script found');
    }
}

debugPaths();
