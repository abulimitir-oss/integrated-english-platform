import fetch from 'node-fetch';

async function testIntegratedAPI() {
    const baseUrl = 'http://localhost:3000/api';
    
    console.log('Testing Integrated English Learning API...\n');

    // Test Conversation API
    try {
        console.log('1. Testing Conversation API...');
        const conversationResponse = await fetch(`${baseUrl}/conversation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                scenario: 'coffee_shop',
                message: 'I would like to order a coffee',
                history: []
            })
        });
        
        const conversationData = await conversationResponse.json();
        console.log('Conversation Response:', JSON.stringify(conversationData, null, 2), '\n');
    } catch (error) {
        console.error('Conversation API Error:', error, '\n');
    }

    // Test Grammar API
    try {
        console.log('2. Testing Grammar API...');
        const grammarResponse = await fetch(`${baseUrl}/grammar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'I have went to the store yesterday.'
            })
        });
        
        const grammarData = await grammarResponse.json();
        console.log('Grammar Response:', JSON.stringify(grammarData, null, 2), '\n');
    } catch (error) {
        console.error('Grammar API Error:', error, '\n');
    }

    // Test TTS API
    try {
        console.log('3. Testing TTS API...');
        const ttsResponse = await fetch(`${baseUrl}/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Welcome to our English learning platform.',
                voice: 'en-US-JennyNeural'
            })
        });
        
        const ttsData = await ttsResponse.json();
        console.log('TTS Response:', JSON.stringify(ttsData, null, 2), '\n');
    } catch (error) {
        console.error('TTS API Error:', error, '\n');
    }
}

testIntegratedAPI();