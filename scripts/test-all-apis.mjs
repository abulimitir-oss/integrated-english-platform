import fetch from 'node-fetch';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'http://localhost:3000/api';
const AUDIO_FILE_PATH = join(__dirname, 'test-audio.webm');

async function testAPI(endpoint, method, data, isFormData = false) {
    try {
        console.log(`\n🧪 Testing ${endpoint.toUpperCase()} API...`);
        console.log('Request:', JSON.stringify(data, null, 2));

        const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
        const body = isFormData ? data : JSON.stringify(data);

        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method,
            headers,
            body
        });

        const result = await response.json();
        
        console.log(`Status: ${response.status}`);
        console.log('Response:', JSON.stringify(result, null, 2));
        
        return {
            success: response.ok,
            status: response.status,
            data: result
        };
    } catch (error) {
        console.error(`❌ Error testing ${endpoint}:`, error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

async function runTests() {
    console.log('🚀 Starting API Tests...\n');
    
    // 1. Test Conversation API
    await testAPI('conversation', 'POST', {
        scenario: 'coffee_shop',
        message: 'I would like to order a coffee please',
        history: []
    });

    // 2. Test Grammar API
    await testAPI('grammar', 'POST', {
        text: 'I have went to the store yesterday'
    });

    // 3. Test Speech API
    const formData = new FormData();
    formData.append('text', 'Hello, how are you?');
    try {
        // 创建测试音频文件（如果需要）
        const audioBlob = new Blob(['test audio content'], { type: 'audio/webm' });
        formData.append('audio', audioBlob, 'test-audio.webm');
        await testAPI('speech', 'POST', formData, true);
    } catch (error) {
        console.error('Error creating test audio:', error);
    }

    // 4. Test TTS API
    await testAPI('tts', 'POST', {
        text: 'Welcome to our English learning platform',
        voice: 'en-US-JennyNeural'
    });

    console.log('\n✅ API Tests Completed');
}

// 运行测试
runTests();