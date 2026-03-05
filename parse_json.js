const fs = require('fs');
const json = JSON.parse(fs.readFileSync('imdb_full.json', 'utf8'));

const groupings = json?.props?.pageProps?.contentData?.data?.title?.creditGroupings?.edges || [];
const g = groupings[2].node;
console.log(`Grouping data: ${JSON.stringify(g.grouping, null, 2)}`);
