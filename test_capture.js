const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(3002, () => {
  const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tempDir = process.env.TEMP;

  try {
    const mouseFile = path.join(tempDir, 'shot_mouse.png');
    execSync(`"${chrome}" --headless=new --no-sandbox --disable-gpu --screenshot="${mouseFile}" --window-size=1280,800 "http://localhost:3002/?t=2500"`);
    fs.copyFileSync(mouseFile, path.join(__dirname, 'shot_mouse.png'));
    console.log('shot_mouse.png OK');
  } catch(e) {
    console.error('Mouse capture error:', e.message);
  }

  try {
    const loveFile = path.join(tempDir, 'shot_love.png');
    execSync(`"${chrome}" --headless=new --no-sandbox --disable-gpu --screenshot="${loveFile}" --window-size=1280,800 "http://localhost:3002/?t=6500"`);
    fs.copyFileSync(loveFile, path.join(__dirname, 'shot_love.png'));
    console.log('shot_love.png OK');
  } catch(e) {
    console.error('Love capture error:', e.message);
  }

  server.close();
});
