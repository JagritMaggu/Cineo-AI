const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY not found in .env.local');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // We can't easily list models with the helper, but we can try a few standard ones
        const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];

        for (const modelName of models) {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Say 'OK'");
                console.log(`  ✅ ${modelName} is WORKING: ${result.response.text().trim()}`);
                break;
            } catch (e) {
                console.log(`  ❌ ${modelName} FAILED: ${e.message}`);
            }
        }
    } catch (error) {
        console.error('List models failed:', error);
    }
}

listModels();
