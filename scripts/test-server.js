import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'API server is running' }));
});

const port = 3456;
server.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});