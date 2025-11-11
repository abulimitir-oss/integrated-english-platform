import fetch from 'node-fetch';

const test = async () => {
  try {
    console.log('Testing API connection...');
    const ports = [3000, 3001, 3002, 3003];
    
    for (const port of ports) {
      try {
        const response = await fetch(`http://localhost:${port}/api/conversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenario: 'cafe',
            message: 'Hi, can I order a coffee?',
            history: []
          })
        });
        
        console.log(`\nPort ${port}:`);
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
          console.log('\nAPI test successful!');
          return;
        }
      } catch (err) {
        console.log(`Port ${port} not responding:`, err.message);
      }
    }
    
    console.log('\nNo responding ports found');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

test();