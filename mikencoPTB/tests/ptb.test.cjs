const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { summarizeHar } = require('../tools/summarize-image-har.cjs');
const { startServer } = require('../tools/serve-ptb.cjs');
const base = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(base, file), 'utf8');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const rcUrl = 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch';
const imageUrl = 'https://api.locketcamera.com/generateFilteredImage';
const id = 'mkc_ptb_noel_4';

function run(file, request, response, argument) {
  const results = [], logs = [];
  const context = { $request: request, $argument: argument, $done: value => results.push(value), console: { log: line => logs.push(line) } };
  if (response !== undefined) context.$response = response;
  vm.runInNewContext(read(file), context, { timeout: 1000 });
  assert.equal(results.length, 1, '$done must be called exactly once');
  return { result: JSON.parse(JSON.stringify(results[0])), logs };
}
function remote(entries, argument = 'ptb-register', request = { url: rcUrl, headers: { 'User-Agent': 'Locket/TEST' } }) {
  return run('scripts/forceLocketGold.js', request, { body: JSON.stringify({ entries }) }, argument);
}
function configOf(result) { return JSON.parse(JSON.parse(result.body).entries.camera_filter_config); }
function upstream() {
  return { show_filter_button: false, picker_filters: ['server_only', 'okay_wig'], sheet_filters: [
    { title: { en: 'Server only', vi: 'Server' }, filter_ids: ['server_only'], metadata: { untouched: true } },
    { title: { en: 'Goofy (Filters and AI coming soon)' }, filter_ids: ['new_goofy'] }
  ], remote_filters: [{ id: 'server_only', name: 'Existing', custom: { keep: true } }], future_field: { keep: true } };
}

test('all non-filter output remains identical to the pre-change baseline', () => {
  const output = JSON.parse(remote({}, 'debug').result.body);
  delete output.entries.camera_filter_config;
  // Captured locally before edits using an empty entries response and synthetic UA.
  assert.equal(hash(JSON.stringify(output)), '393100575521a7408139f615c91aecd3601f68a1914d89bc74515c0350b2ad8f');
  assert.equal(hash(fs.readFileSync(path.join(base, 'scripts/revenuecat.js'))), '88fce7d32a2ceeeecdac1bcd633a7006a184de28bae66f252c1ecf5d71a8f707');
  assert.equal(hash(fs.readFileSync(path.join(base, 'scripts/deleteHeader.js'))), 'f2352ff9dc0b22037463c38ef316658165584119ccd1c6d9d2baa0d7036fba97');
});

test('registration preserves upstream definitions, groups, unknown fields and original filters', () => {
  const original = upstream();
  const { result, logs } = remote({ camera_filter_config: JSON.stringify(original), unrelated: 'keep' });
  const config = configOf(result);
  assert.deepEqual(config.remote_filters, original.remote_filters);
  assert.deepEqual(config.future_field, original.future_field);
  assert.deepEqual(config.sheet_filters[0], original.sheet_filters[0]);
  assert.equal(config.sheet_filters[1].filter_ids[0], 'new_goofy');
  assert(config.sheet_filters[1].filter_ids.includes('okay_wig'));
  assert(config.picker_filters.includes('server_only'));
  const defaults = configOf(remote({}, 'debug').result);
  for (const oldId of defaults.picker_filters) assert(config.picker_filters.includes(oldId));
  assert.equal(config.picker_filters.filter(value => value === id).length, 1);
  assert.deepEqual(config.sheet_filters.find(group => group.title.en === 'Photobooth MKC 📸'), { title: { en: 'Photobooth MKC 📸' }, filter_ids: [id] });
  assert.equal(config.filters, undefined, 'no invented filter definition');
  assert.equal(JSON.parse(result.body).entries.unrelated, 'keep');
  assert(logs[0].includes('candidate_listed_client_support_unverified'));
});

test('registration is idempotent and observe mode never adds the candidate', () => {
  const once = remote({ camera_filter_config: JSON.stringify(upstream()) });
  const twice = remote(JSON.parse(once.result.body).entries);
  assert.deepEqual(configOf(twice.result), configOf(once.result));
  assert(!configOf(remote({ camera_filter_config: JSON.stringify(upstream()) }, 'ptb-observe').result).picker_filters.includes(id));
});

test('register in the existing app-observed MKC list schema when live config is absent', () => {
  for (const entries of [{}, { camera_filter_config: '{}' }]) {
    const { result, logs } = remote(entries);
    assert(configOf(result).picker_filters.includes(id));
    const report = JSON.parse(logs[0].slice('[MKC-PTB-RC] '.length));
    assert.equal(report.registration_schema, 'existing_mkc_lists');
    assert.equal(report.candidate_in_picker_output, true);
    assert.equal(report.candidate_in_sheet_output, true);
    assert.equal(configOf(result).filters, undefined);
  }
  assert(!configOf(remote({}, 'ptb-observe').result).picker_filters.includes(id));
});

test('incompatible live values are preserved and never used for guessed registration', () => {
  for (const value of ['broken', '[]', 'null', JSON.stringify({ picker_filters: { keep: true }, sheet_filters: ['live'] })]) {
    const { result } = remote({ camera_filter_config: value });
    const returned = JSON.parse(result.body).entries.camera_filter_config;
    if (value.startsWith('{')) {
      const original = JSON.parse(value), actual = JSON.parse(returned);
      for (const key of Object.keys(original)) assert.deepEqual(actual[key], original[key]);
    } else assert.equal(returned, value);
    assert(!returned.includes(id));
  }
});

test('UI control uses an unchanged existing filter and is idempotent', () => {
  const { result, logs } = remote({}, 'ptb-register-control');
  const configured = configOf(result);
  const control = configured.sheet_filters.find(group => group.title.en === 'MKC — Kiểm tra UI');
  assert.deepEqual(control, { title: { en: 'MKC — Kiểm tra UI' }, filter_ids: ['okay_wig'] });
  const candidate = configured.sheet_filters.find(group => group.title.en === 'Photobooth MKC 📸');
  assert.deepEqual(candidate.filter_ids, [id]);
  assert.equal(configured.filters, undefined);
  assert(!configured.sheet_filters[0].filter_ids.includes(id));
  const report = JSON.parse(logs[0].slice('[MKC-PTB-RC] '.length));
  assert.equal(report.control_group_in_sheet_output, true);
  assert.equal(report.control_enabled, true);
  const again = remote(JSON.parse(result.body).entries, 'ptb-register-control');
  assert.deepEqual(configOf(again.result), configured);
  assert(!configOf(remote({}).result).sheet_filters.some(group => group.title.en === control.title.en));
});

test('missing or legacy debug argument cannot silently disable feature registration', () => {
  for (const argument of [undefined, null, {}, '', '  ', 'debug', ' debug ']) {
    const { result, logs } = run('scripts/forceLocketGold.js', { url: rcUrl, headers: { 'User-Agent': 'Locket/LOCAL_TEST' } }, { status: 200, body: '{"entries":{}}' }, argument);
    const config = configOf(result);
    assert(config.picker_filters.includes(id));
    assert.equal(config.sheet_filters[0].title.en, 'MKC — Kiểm tra UI');
    assert.deepEqual(config.sheet_filters[0].filter_ids, ['okay_wig']);
    const report = JSON.parse(logs.find(line => line.startsWith('[MKC-PTB-RC] ')).slice('[MKC-PTB-RC] '.length));
    assert.equal(report.argument_source, typeof argument === 'string' && argument.trim() === 'debug' ? 'legacy_debug' : 'default');
    assert.equal(report.control_group_in_sheet_output, true);
    assert.equal(report.candidate_in_sheet_output, true);
  }
});

test('feature defaults retain endpoint and identity guards and respect observe mode', () => {
  for (const request of [
    { url: rcUrl + '/extra', headers: { 'User-Agent': 'Locket/LOCAL_TEST' } },
    { url: rcUrl.replace('locket-4252a', 'other-project'), headers: { 'User-Agent': 'Locket/LOCAL_TEST' } },
    { url: rcUrl, headers: { 'User-Agent': 'Other/LOCAL_TEST' } },
    { url: rcUrl, headers: {} }
  ]) {
    assert.deepEqual(run('scripts/forceLocketGold.js', request, { body: '{"entries":{}}' }, undefined).result, {});
  }
  const observe = configOf(remote({}, 'ptb-observe').result);
  assert(!observe.picker_filters.includes(id));
  assert(!observe.sheet_filters.some(group => group.title.en === 'MKC — Kiểm tra UI'));
});

test('visible controls lead the sheet while every other live group keeps its fields and relative order', () => {
  const original = upstream();
  original.sheet_filters.push({ title: { en: 'Another live group' }, filter_ids: ['live_more'], keep: { marker: true } });
  const configured = configOf(remote({ camera_filter_config: JSON.stringify(original) }, 'ptb-register-control').result);
  assert.equal(configured.sheet_filters[0].title.en, 'MKC — Kiểm tra UI');
  assert.equal(configured.sheet_filters[1].title.en, 'Photobooth MKC 📸');
  assert.deepEqual(configured.sheet_filters.slice(2, 5).map(group => group.title), original.sheet_filters.map(group => group.title));
  assert.deepEqual(configured.sheet_filters[2], original.sheet_filters[0]);
  assert.deepEqual(configured.sheet_filters[4], original.sheet_filters[2]);
});

test('registration preserves unknown upstream fields without inventing catalog aliases', () => {
  const original = { pickerFilters: ['live'], sheetFilters: [], customCatalog: { keep: true } };
  const configured = configOf(remote({ camera_filter_config: JSON.stringify(original) }).result);
  for (const key of Object.keys(original)) assert.deepEqual(configured[key], original[key]);
  assert(configured.picker_filters.includes(id));
  assert.equal(configured.remoteFilters, undefined);
  assert.equal(configured.filters, undefined);
});

test('empty/malformed RC and wrong identity or endpoint pass through', () => {
  for (const body of ['', '{', 'null', '[]', '{"entries":[]}']) {
    assert.deepEqual(run('scripts/forceLocketGold.js', { url: rcUrl, headers: { 'User-Agent': 'Locket/TEST' } }, { body }, 'ptb-register').result, {});
  }
  for (const request of [{ url: rcUrl, headers: {} }, { url: rcUrl, headers: { 'User-Agent': 'Other/1' } }, { url: rcUrl + '/extra', headers: { 'User-Agent': 'Locket/TEST' } }]) {
    assert.deepEqual(remote({}, 'ptb-register', request).result, {});
  }
});

test('Remote Config diagnostics mask catalog values and dynamic keys', () => {
  const original = upstream();
  original['SECRET_DYNAMIC_KEY'] = 'PRIVATE_CONFIG';
  original.remote_filters[0].SECRET_DYNAMIC_KEY = 'PRIVATE_CATALOG';
  const { logs } = remote({ camera_filter_config: JSON.stringify(original) });
  const text = logs.join('\n');
  for (const secret of ['SECRET_DYNAMIC_KEY', 'PRIVATE_CONFIG', 'PRIVATE_CATALOG', 'server_only', 'Existing']) assert(!text.includes(secret));
  assert(text.includes('catalog_item_fields'));
});

test('RC diagnostics explain early exits without logging request or invalid JSON values', () => {
  const cases = [
    [{ url: rcUrl, headers: { 'User-Agent': 'Locket/SECRET_UA' } }, '{SECRET_JSON', 'failed:json_parse'],
    [{ url: rcUrl, headers: { 'User-Agent': 'Locket/SECRET_UA' } }, '', 'failed:json_parse'],
    [{ url: rcUrl, headers: { 'User-Agent': 'Locket/SECRET_UA' } }, '{"entries":[]}', 'skipped:unsupported_schema'],
    [{ url: rcUrl, headers: {} }, '{"entries":{}}', 'skipped:user_agent_missing'],
    [{ url: rcUrl, headers: { 'User-Agent': 'Other/SECRET_UA' } }, '{"entries":{}}', 'skipped:non_locket'],
    [{ url: rcUrl + '/extra?key=SECRET_QUERY', headers: { 'User-Agent': 'Locket/SECRET_UA' } }, '{"entries":{}}', 'skipped:endpoint_scope']
  ];
  for (const [request, body, state] of cases) {
    const { result, logs } = run('scripts/forceLocketGold.js', request, { body, status: 'HTTP/1.1 200 OK' }, 'ptb-register');
    assert.deepEqual(result, {});
    assert.equal(logs.length, 1);
    assert(!logs[0].includes('SECRET'));
    const report = JSON.parse(logs[0].slice('[MKC-PTB-RC] '.length));
    assert.equal(report.handler_state, state);
    assert.equal(report.http_status, 200);
    assert.equal(report.output_changed, false);
    assert.equal(report.candidate_in_picker_output, false);
    assert.equal(report.candidate_in_sheet_output, false);
  }
});

test('RC reports emitted candidate separately from schema rejection and handles header casing', () => {
  for (const key of ['User-Agent', 'user-agent', 'USER-AGENT', 'uSeR-aGeNt']) {
    const { result, logs } = remote({ camera_filter_config: JSON.stringify(upstream()) }, 'ptb-register', { url: rcUrl, headers: { [key]: 'Locket/SECRET_UA' } });
    const report = JSON.parse(logs[0].slice('[MKC-PTB-RC] '.length));
    assert(configOf(result).picker_filters.includes(id));
    assert.equal(report.handler_state, 'processed');
    assert.equal(report.output_changed, true);
    assert.equal(report.candidate_in_picker_output, true);
    assert.equal(report.candidate_in_sheet_output, true);
    assert.equal(report.picker_id_list_valid, true);
    assert.equal(report.sheet_group_list_valid, true);
    assert.equal(report.build, '20261123_m0_m1_05');
  }
  const { logs } = remote({ camera_filter_config: JSON.stringify({ picker_filters: ['live'], sheet_filters: [{ title: { vi: 'SECRET_TITLE' }, filter_ids: ['live'] }] }) });
  const report = JSON.parse(logs[0].slice('[MKC-PTB-RC] '.length));
  assert.equal(report.state, 'unsupported_upstream');
  assert.equal(report.candidate_in_picker_output, false);
  assert.equal(report.picker_id_list_valid, true);
  assert.equal(report.sheet_group_list_valid, false);
  assert.deepEqual(report.first_title_locales, ['vi']);
  assert(!logs[0].includes('SECRET_TITLE'));
});

test('RC request probe observes fetch attempts without modifying headers or logging their values', () => {
  const request = { url: rcUrl + '?key=SECRET_QUERY', method: 'POST', headers: {
    'USER-AGENT': 'Locket/SECRET_UA', Authorization: 'SECRET_AUTH', Cookie: 'SECRET_COOKIE', 'If-None-Match': 'SECRET_ETAG'
  }, body: 'SECRET_BODY' };
  const original = JSON.stringify(request);
  const { result, logs } = run('scripts/ptb_rc_fetch_metadata.js', request, undefined, 'metadata');
  assert.deepEqual(result, {});
  assert.equal(JSON.stringify(request), original);
  assert.equal(logs.length, 1);
  assert(!logs[0].includes('SECRET'));
  const report = JSON.parse(logs[0].slice('[MKC-PTB-RC-FETCH] '.length));
  assert.equal(report.user_agent_state, 'locket');
  assert.equal(report.conditional_headers_present, true);
  assert.equal(report.method, 'POST');
  for (const url of [rcUrl + '/extra', rcUrl.replace('locket-4252a', 'other-project'), rcUrl.replace('https:', 'http:')]) {
    assert.deepEqual(run('scripts/ptb_rc_fetch_metadata.js', { ...request, url }, undefined, 'metadata').logs, []);
  }
  assert.deepEqual(run('scripts/ptb_rc_fetch_metadata.js', request, undefined, '').logs, []);
});

test('RC refresh removes only conditional headers on the scoped Locket POST', () => {
  const request = { url: rcUrl + '?key=SECRET_KEY', method: 'POST', body: 'SECRET_BODY', headers: {
    'USER-AGENT': 'Locket/TEST', Authorization: 'SECRET_AUTH', Cookie: 'SECRET_COOKIE',
    'X-Goog-Firebase-Installations-Auth': 'SECRET_INSTALLATION', 'Content-Type': 'application/json',
    'If-None-Match': 'SECRET_ETAG', 'IF-MODIFIED-SINCE': 'SECRET_DATE', 'x-goog-if-none-match': 'SECRET_ETAG_2'
  } };
  const before = JSON.stringify(request);
  const { result, logs } = run('scripts/ptb_rc_fetch_metadata.js', request, undefined, 'refresh');
  assert.equal(JSON.stringify(request), before);
  assert.equal(result.body, undefined);
  for (const key of ['USER-AGENT', 'Authorization', 'Cookie', 'X-Goog-Firebase-Installations-Auth', 'Content-Type']) assert.equal(result.headers[key], request.headers[key]);
  assert.equal(Object.keys(result.headers).length, 5);
  const report = JSON.parse(logs[0].slice('[MKC-PTB-RC-FETCH] '.length));
  assert.equal(report.conditional_headers_removed_count, 3);
  assert.equal(report.mode, 'refresh');
  assert(!logs.join('').includes('SECRET'));
});

test('RC refresh preserves unsupported identities, methods, endpoints and unconditional requests', () => {
  const original = { url: rcUrl, method: 'POST', headers: { 'User-Agent': 'Locket/TEST', 'If-None-Match': 'SECRET_ETAG' } };
  for (const request of [
    { ...original, method: 'GET' },
    { ...original, headers: { 'User-Agent': 'Other/TEST', 'If-None-Match': 'SECRET_ETAG' } },
    { ...original, headers: { 'If-None-Match': 'SECRET_ETAG' } },
    { ...original, url: rcUrl + '/extra' },
    { ...original, headers: { 'User-Agent': 'Locket/TEST' } }
  ]) assert.deepEqual(run('scripts/ptb_rc_fetch_metadata.js', request, undefined, 'refresh').result, {});
});

test('RC original-response summary precedes writes and never emits config values or dynamic entry names', () => {
  const request = { url: rcUrl, headers: { 'User-Agent': 'Locket/TEST' } };
  for (const state of ['NO_CHANGE', 'UPDATE', 'EMPTY_CONFIG', 'NO_TEMPLATE', 'SECRET_STATE']) {
    const { result, logs } = run('scripts/forceLocketGold.js', request, { status: 200, body: JSON.stringify({ state }) }, 'ptb-register-control');
    const report = JSON.parse(logs[0].slice('[MKC-PTB-RC] '.length));
    assert.equal(report.upstream_response.state, state === 'SECRET_STATE' ? 'other' : state);
    assert.equal(report.upstream_response.entries_present, false);
    assert.equal(report.upstream_response.entries_type, 'undefined');
    assert.equal(report.upstream_response.entry_count, null);
    assert.deepEqual(report.upstream_response.filter_entry_names, []);
    assert.equal(JSON.parse(result.body).state, state, 'do not invent an UPDATE response state');
    assert(!logs.join('').includes('SECRET'));
  }
  const { logs } = remote({ camera_filter_config: JSON.stringify(upstream()), SECRET_DYNAMIC_ENTRY: 'SECRET_VALUE', camera_filter_catalog: 'SECRET_CATALOG' });
  const report = JSON.parse(logs[0].slice('[MKC-PTB-RC] '.length));
  assert.equal(report.upstream_response.entry_count, 3);
  assert.deepEqual(report.upstream_response.filter_entry_names, ['camera_filter_config', 'camera_filter_catalog']);
  assert(!logs.join('').includes('SECRET'));
});

function probe(body, type = 'application/json', requestExtra = {}, response) {
  const request = { url: imageUrl + '?token=SECRET_QUERY', method: 'POST', headers: { 'Content-Type': type, Authorization: 'SECRET_AUTH', Cookie: 'SECRET_COOKIE' }, body, ...requestExtra };
  return run('scripts/ptb_image_metadata.js', request, response, 'metadata');
}
function summary(logs) { return JSON.parse(logs[0].slice('[MKC-PTB-M1] '.length)); }

test('image probe emits names/types but no credentials, IDs, image or URL values', () => {
  const input = JSON.stringify({ data: { filter_id: id, image: 'SECRET_BASE64', image_url: 'https://private/?signed=SECRET_SIGNED', sessionId: 'SECRET_SESSION', token: 'SECRET_TOKEN', authorization: { SECRET_NESTED: 'SECRET_NESTED_VALUE' }, SECRET_DYNAMIC_KEY: 'SECRET_VALUE', metadata: { width: 1254 } } });
  const { result, logs } = probe(input);
  assert.deepEqual(result, {});
  const text = logs.join('\n');
  for (const secret of ['SECRET', id, 'https://private/']) assert(!text.includes(secret));
  const value = summary(logs);
  assert.equal(value.path, '/generateFilteredImage');
  assert.equal(value.body_bytes, Buffer.byteLength(input));
  assert(value.fields.some(field => field.name === 'data.filter_id' && field.type === 'string'));
  assert(value.fields.some(field => field.name === 'data.sessionId'));
  assert(value.fields.some(field => field.name === 'data.<other>'));
});

test('probe handles invalid JSON, empty, binary, unavailable and oversized bodies', () => {
  for (const [body, type, expected] of [
    ['{SECRET_INVALID', 'application/json', 'invalid_json'],
    ['', 'application/json', 'empty'],
    [undefined, 'application/json', 'unavailable'],
    [new Uint8Array([255, 0, 1]), 'application/protobuf', 'not_inspected'],
    ['SECRET_MULTIPART', 'multipart/form-data; boundary=SECRET_BOUNDARY', 'not_inspected'],
    ['x'.repeat(2097153), 'application/json', 'over_limit_or_unknown']
  ]) {
    const { result, logs } = probe(body, type);
    assert.deepEqual(result, {});
    assert.equal(summary(logs).body_state, expected);
    assert(!logs.join('').includes('SECRET'));
  }
  assert.equal(summary(probe(JSON.stringify({ message: 'Tiếng Việt 📸' })).logs).body_bytes, Buffer.byteLength(JSON.stringify({ message: 'Tiếng Việt 📸' })));
});

test('response metadata keeps HTTP status and schema; never mutates input', () => {
  const response = { status: 'HTTP/1.1 200 OK', headers: { 'Content-Type': 'application/json', 'Content-Length': '59' }, body: JSON.stringify({ result: { outputUrl: 'SECRET_OUTPUT', requestId: 'SECRET_ID' } }) };
  const copy = JSON.stringify(response);
  const { result, logs } = probe(undefined, undefined, {}, response);
  assert.deepEqual(result, {});
  assert.equal(JSON.stringify(response), copy);
  assert.equal(summary(logs).http_status, 200);
  assert.equal(summary(logs).phase, 'response');
  assert(!logs.join('').includes('SECRET'));
});

test('probe bounds schema walking and suppresses invalid header values', () => {
  const fields = Object.fromEntries(Array.from({ length: 120 }, (_, i) => ['private_' + i, 'SECRET']));
  const { logs } = probe(JSON.stringify(fields), 'SECRET_TYPE', { headers: { 'Content-Type': 'application/json; secret=SECRET', 'Content-Length': 'SECRET_LENGTH' }, method: 'SECRET_METHOD' });
  const value = summary(logs);
  assert(value.fields_truncated);
  assert(value.fields.length <= 96);
  assert.equal(value.declared_bytes, null);
  assert.equal(value.method, 'unknown');
  assert(!logs.join('').includes('SECRET'));
  assert.equal(summary(probe('SECRET', 'application/json; boundary=SECRET').logs).body_state, 'invalid_json');
});

test('debug is opt-in and out-of-scope URLs are silent', () => {
  assert.deepEqual(run('scripts/ptb_image_metadata.js', { url: imageUrl }, undefined, '').logs, []);
  for (const url of ['http://api.locketcamera.com/generateFilteredImage', imageUrl + '/extra', imageUrl + '#secret', 'https://api.locketcamera.com.evil/generateFilteredImage', 'https://api.locketcamera.com/getUser', 'https://api.locketcamera.com/x/generateFilteredImage']) {
    const { result, logs } = probe('{}', undefined, { url });
    assert.deepEqual(result, {});
    assert.deepEqual(logs, []);
  }
});

test('module regexes match only intended hosts/paths; attributes and local scripts are valid', () => {
  const names = new Set();
  for (const file of ['modules/mkc.sgmodule', 'modules/ptb_image_debug.module']) {
    const text = read(file);
    assert(text.startsWith('#!name='));
    assert(text.includes('\n#!desc='));
    assert(!text.includes('%APPEND%,'));
    assert.equal((text.match(/^\[Script\]$/gm) || []).length, 1);
    for (const line of text.split(/\r?\n/).filter(line => /^\w[^#]* = type=/.test(line))) {
      const name = line.split(' = ')[0];
      assert(!names.has(name)); names.add(name);
      assert.equal((line.match(/type=http-/g) || []).length, 1);
      const pattern = /(?:^|,)pattern=([^,]+)/.exec(line)[1];
      const regex = new RegExp(pattern);
      const scriptUrl = /script-path=([^,]+)/.exec(line)[1];
      const relative = scriptUrl.split('/mikencoPTB/')[1].split('?')[0];
      assert(fs.existsSync(path.join(base, relative)));
      assert(!regex.test('https://api.locketcamera.com.evil/generateFilteredImage'));
      if (name.startsWith('mkc_ptb_image')) {
        for (const host of ['api.locketcamera.com', 'us-central1-locket-4252a.cloudfunctions.net']) for (const endpoint of ['generateFilteredImage', 'applyFilter']) {
          const url = `https://${host}/${endpoint}`;
          assert(regex.test(url)); assert(regex.test(url + '?x=1'));
          for (const wrong of [url + '/extra', url + '#x', url + 'Fake', url.replace('https:', 'http:')]) assert(!regex.test(wrong));
        }
        assert(line.includes('max-size=2097152'));
      }
      if (name === 'locket_rc' || name === 'mkc_ptb_rc_fetch') {
        assert(regex.test(rcUrl)); assert(regex.test(rcUrl + '?x=1'));
        assert(!regex.test(rcUrl.replace('locket-4252a', 'other-project')));
        assert(!regex.test(rcUrl + '/extra'));
      }
    }
  }
});

test('offline HAR sanitizer drops unrelated entries, base64 bodies and sensitive values', () => {
  const har = { log: { entries: [
    { request: { url: 'https://api.locketcamera.com/getUser', headers: [], postData: { text: 'SECRET_UNRELATED' } } },
    { request: { url: imageUrl + '?token=SECRET', method: 'POST', headers: [{ name: 'Authorization', value: 'SECRET_AUTH' }], postData: { mimeType: 'application/json', text: JSON.stringify({ data: { filterId: id, sessionId: 'SECRET_SESSION' } }) } }, response: { status: 200, headers: [], content: { mimeType: 'application/json', text: JSON.stringify({ result: { imageUrl: 'SECRET_OUTPUT' } }) } } },
    { request: { url: imageUrl, method: 'POST', headers: [] }, response: { status: 200, content: { mimeType: 'image/png', text: 'SECRET_BASE64', encoding: 'base64' } } }
  ] } };
  const results = summarizeHar(har);
  assert.equal(results.length, 4);
  assert(!JSON.stringify(results).includes('SECRET'));
  assert(!JSON.stringify(results).includes(id));
  assert.equal(results[3].body_state, 'unavailable');
});

test('template has four non-overlapping in-canvas slots and a valid PNG thumbnail', () => {
  const template = JSON.parse(read('assets/mkc_ptb_noel_4.template.json'));
  assert.equal(template.template_id, id);
  assert.equal(template.display_name, 'Photobooth Noel (4 ô)');
  assert.equal(template.layout.slots.length, 4);
  assert.equal(template.production_overlay, null);
  const png = fs.readFileSync(path.join(base, 'assets', template.thumbnail.file));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), template.layout.canvas.width);
  assert.equal(png.readUInt32BE(20), template.layout.canvas.height);
  for (const slot of template.layout.slots) {
    assert(slot.x >= 0 && slot.y >= 0 && slot.width > 0 && slot.height > 0);
    assert(slot.x + slot.width <= template.layout.canvas.width);
    assert(slot.y + slot.height <= template.layout.canvas.height);
    for (const other of template.layout.slots) if (slot.index !== other.index) assert(slot.x + slot.width <= other.x || other.x + other.width <= slot.x || slot.y + slot.height <= other.y || other.y + other.height <= slot.y);
  }
});

test('LAN installation server rewrites script URLs and exposes only allowlisted assets', async () => {
  const port = 18765;
  const server = startServer('127.0.0.1', port);
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  try {
    const origin = `http://127.0.0.1:${port}`;
    const response = await fetch(origin + '/mikencoPTB/modules/mkc.sgmodule');
    assert.equal(response.status, 200);
    const text = await response.text();
    assert(!text.includes('script-path=https://raw.'));
    for (const match of text.matchAll(/script-path=([^\s,]+)/g)) assert.equal((await fetch(match[1])).status, 200);
    for (const suffix of ['tests/ptb.test.cjs', '.git/config', 'captures/private.har', 'scripts/no.js', '../AGENTS.md']) assert.equal((await fetch(origin + '/mikencoPTB/' + suffix)).status, 404);
    assert.equal((await fetch(origin + '/mikencoPTB/modules/mkc.sgmodule', { method: 'POST' })).status, 404);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
