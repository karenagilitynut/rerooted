#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const OUT_DIR = path.join(__dirname, 'out');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(OUT_DIR, req.url === '/' ? 'index.html' : req.url);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(OUT_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log('\n🌱 ReRooted Preview Server');
  console.log('==========================');
  console.log(`\n✅ Server running at: http://localhost:${PORT}`);
  console.log('\n📱 Test on mobile:');
  console.log('   1. Find your computer\'s IP address');
  console.log('   2. On your phone, visit: http://YOUR_IP:8080');
  console.log('   3. Test home screen installation!');
  console.log('\n🚀 Ready to deploy? See DEPLOY_NOW.md');
  console.log('\nPress Ctrl+C to stop\n');
});
