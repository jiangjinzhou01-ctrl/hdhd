import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
const compress = promisify(gzip);

// Exact subpath mount, no SPA fallback: missing assets and wrong Pages paths really fail.
export async function preview(directory, base, port = 0) {
  const root = await realpath(directory);
  const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript',
    '.woff2':'font/woff2', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml', '.json':'application/json' };
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://local').pathname);
      if (!pathname.startsWith(base)) throw Error('outside mount');
      let file = resolve(root, pathname.slice(base.length) || 'index.html');
      if (!file.startsWith(root + sep)) throw Error('path');
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      if (!(await realpath(file)).startsWith(root + sep)) throw Error('symlink');
      res.setHeader('Content-Type', mime[extname(file)] || 'text/plain');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Vary', 'Accept-Encoding');
      const bytes = await readFile(file);
      if (/\bgzip\b/.test(req.headers['accept-encoding'] || '') && /\.(html|css|js|svg|txt)$/.test(file)) {
        res.setHeader('Content-Encoding', 'gzip');
        res.end(await compress(bytes));
      } else res.end(bytes);
    } catch { res.statusCode = 404; res.end('Not found'); }
  });
  await new Promise((done) => server.listen(port, '127.0.0.1', done));
  return { server, url: `http://127.0.0.1:${server.address().port}${base}`,
    close: () => new Promise((done) => server.close(done)) };
}
