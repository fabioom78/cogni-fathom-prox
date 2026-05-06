const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;
const TARGET = 'https://api.anthropic.com';

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const options = {
    hostname: 'api.anthropic.com',
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: 'api.anthropic.com'
    }
  };

  const proxy = https.request(options, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });

  proxy.on('error', (e) => {
    res.writeHead(500);
    res.end(e.message);
  });

  req.pipe(proxy);
}).listen(PORT, () => console.log('Proxy rodando na porta ' + PORT));
