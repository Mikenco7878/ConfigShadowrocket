// Offline only. Writes allowlisted metadata to stdout; never exports HAR bodies.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function summarizeHar(har) {
  if (!har || !har.log || !Array.isArray(har.log.entries)) throw new Error('HAR log.entries is required');
  const base = path.resolve(__dirname, '..');
  const source = fs.readFileSync(path.join(base, 'scripts/ptb_image_metadata.js'), 'utf8');
  const summaries = [];
  const imagePattern = /^https:\/\/(?:api\.locketcamera\.com|us-central1-locket-4252a\.cloudfunctions\.net)\/(?:generateFilteredImage|applyFilter)(?:\?[^#]*)?$/;
  function headers(items) {
    const result = Object.create(null);
    for (const item of items || []) {
      // Do not even copy authentication headers into the VM.
      if (item && typeof item.name === 'string' && /^(?:content-type|content-length)$/i.test(item.name)) result[item.name] = item.value;
    }
    return result;
  }
  for (const entry of har.log.entries) {
    if (!entry || !entry.request || !imagePattern.test(entry.request.url || '')) continue;
    const input = entry.request;
    const post = input.postData || {};
    const request = { url: input.url, method: input.method, headers: headers(input.headers) };
    if (!request.headers['Content-Type'] && !request.headers['content-type'] && post.mimeType) request.headers['Content-Type'] = post.mimeType;
    if (typeof post.text === 'string' && !post.encoding) request.body = post.text;
    const content = entry.response && entry.response.content || {};
    const response = { statusCode: entry.response && entry.response.status, headers: headers(entry.response && entry.response.headers) };
    if (!response.headers['Content-Type'] && !response.headers['content-type'] && content.mimeType) response.headers['Content-Type'] = content.mimeType;
    // Base64 HAR data is deliberately not decoded. Its absence is reported honestly.
    if (typeof content.text === 'string' && !content.encoding) response.body = content.text;
    for (const phase of ['request', 'response']) {
      if (phase === 'response' && !entry.response) continue;
      const context = {
        $argument: 'metadata', $request: request,
        $done() {},
        console: { log(line) {
          const prefix = '[MKC-PTB-M1] ';
          if (line.startsWith(prefix)) summaries.push(JSON.parse(line.slice(prefix.length)));
        } }
      };
      if (phase === 'response') context.$response = response;
      vm.runInNewContext(source, context, { timeout: 1000 });
    }
  }
  return summaries;
}

module.exports = { summarizeHar };
if (require.main === module) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: node tools/summarize-image-har.cjs <private-local.har>');
    const input = process.argv[2];
    if (fs.statSync(input).size > 64 * 1024 * 1024) throw new Error('HAR exceeds the 64 MiB offline limit; export a shorter session');
    const summaries = summarizeHar(JSON.parse(fs.readFileSync(input, 'utf8')));
    for (const summary of summaries) process.stdout.write(JSON.stringify(summary) + '\n');
    if (!summaries.length) process.stderr.write('No matching image endpoint in this HAR; no API conclusion can be made.\n');
  } catch (error) {
    // JSON errors can contain body fragments. Never print the exception or filename.
    process.stderr.write('Cannot summarize HAR. Check arguments, JSON format, size and log.entries locally.\n');
    process.exitCode = 1;
  }
}
