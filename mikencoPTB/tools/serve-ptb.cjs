// Explicit asset allowlist: never expose the repository, HAR files or credentials.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const base = path.resolve(__dirname, '..');
const files = new Map([
  ['modules/mkc.sgmodule', 'text/plain; charset=utf-8'],
  ['modules/ptb_image_debug.module', 'text/plain; charset=utf-8'],
  ['scripts/forceLocketGold.js', 'application/javascript; charset=utf-8'],
  ['scripts/revenuecat.js', 'application/javascript; charset=utf-8'],
  ['scripts/deleteHeader.js', 'application/javascript; charset=utf-8'],
  ['scripts/ptb_image_metadata.js', 'application/javascript; charset=utf-8'],
  ['scripts/ptb_rc_fetch_metadata.js', 'application/javascript; charset=utf-8'],
  ['assets/mkc_ptb_noel_4.template.json', 'application/json; charset=utf-8'],
  ['assets/mkc_ptb_noel_4.thumbnail.png', 'image/png']
]);

function startServer(address, port) {
  if (!/^(?:127\.0\.0\.1|10(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}|192\.168(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){2})$/.test(address)) throw new Error('Use localhost or a private LAN IPv4 address');
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Port must be 1024..65535');
  const origin = `http://${address}:${port}`;
  const server = http.createServer((request, response) => {
    const relative = (request.url || '').split('?')[0].replace(/^\/mikencoPTB\//, '');
    if (!['GET', 'HEAD'].includes(request.method) || !files.has(relative)) {
      response.writeHead(404).end();
      return;
    }
    try {
      let body = fs.readFileSync(path.join(base, relative));
      if (relative.startsWith('modules/')) {
        body = Buffer.from(body.toString('utf8').replace(/https:\/\/raw\.githubusercontent\.com\/Mikenco7878\/ConfigShadowrocket\/(?:refs\/heads\/)?(?:main|feat\/mikenco-ptb-mvp)\/mikencoPTB\//g, `${origin}/mikencoPTB/`));
      }
      response.writeHead(200, { 'Content-Type': files.get(relative), 'Content-Length': body.length, 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) { response.writeHead(500).end(); }
  });
  server.listen(port, address === '127.0.0.1' ? address : '0.0.0.0');
  return server;
}

module.exports = { startServer };
if (require.main === module) {
  try {
    const address = process.argv[2] || '127.0.0.1';
    const port = Number(process.argv[3] || 8765);
    const server = startServer(address, port);
    server.on('listening', () => {
      console.log(`PTB base: http://${address}:${port}/mikencoPTB/`);
      console.log('Import modules/mkc.sgmodule and modules/ptb_image_debug.module. Stop with Ctrl+C.');
    });
    server.on('error', () => { console.error('Cannot start PTB asset server. Check local address and port.'); process.exitCode = 1; });
  } catch (error) { console.error('Usage: node tools/serve-ptb.cjs <private-LAN-IPv4> [port=8765]'); process.exitCode = 1; }
}
