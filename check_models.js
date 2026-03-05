async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is missing');
        return;
    }

    try {
        console.log('Fetching ALL available models...');
        for (const ver of ['v1', 'v1beta']) {
            const url = `https://generativelanguage.googleapis.com/${ver}/models?key=${apiKey}`;
            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok) continue;

            console.log(`[${ver}] Models List:`);
            data.models?.forEach(m => {
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`  - ${m.name}`);
                }
            });
        }
    } catch (e) {
        console.error('Check failed:', e);
    }
}

checkModels();
