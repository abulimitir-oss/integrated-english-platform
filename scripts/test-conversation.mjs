import fetch from 'node-fetch';

async function testConversationAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario: 'coffee shop',
        message: 'I would like to order a coffee',
        history: [],
      }),
    });

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testConversationAPI();