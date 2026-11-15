"use strict";

// Compare downloaded and decoded scripts with synthetic data and in-memory HTTP stubs.
// No app request, authorization value or account from a real device is used.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");

const sourceDirectory = process.env.LOCKET_SOURCE_DIR || path.resolve(__dirname, "..");
const decodedDirectory = process.env.LOCKET_DECODED_DIR || __dirname;
const filenames = ["deleteHeader.js", "Locket_minhhiep08.js", "Locket_Unlocked.js", "locket_filter_unlock.js"];
const expectedSourceHashes = {
  "deleteHeader.js": "9edde420ea1fe7992fc8b37a7b0db878092b891b29c90c0c9c18a52e69ae4b6c",
  "Locket_minhhiep08.js": "70efd0dc7395126e269056455c1c91dbf3f9667f2c19495da19416adf43f2a87",
  "Locket_Unlocked.js": "4ca4fe4de9a68bc6439a8780528b6ee1382c34c35700c0c3e6b303ac9c8683a5",
  "locket_filter_unlock.js": "dca5532f483858f8cb7148c8bcc8a29a6b68fd941fe8b6d9f053c1e357bd6211"
};
const hash = value => crypto.createHash("sha256").update(value).digest("hex");

const bootstrap = new vm.Script(`
  const fixture = JSON.parse(__fixtureJson);
  delete globalThis.__fixtureJson;
  const trace = { done: [], network: [], storage: Object.assign({}, fixture.storage || {}) };
  globalThis.__trace = trace;
  if (Object.hasOwn(fixture, 'request')) globalThis.$request = fixture.request;
  if (Object.hasOwn(fixture, 'response')) globalThis.$response = fixture.response;
  if (Object.hasOwn(fixture, 'argument')) globalThis.$argument = fixture.argument;
  const NativeDate = Date;
  globalThis.Date = class extends NativeDate {
    constructor(...args) { super(...(args.length ? args : [1794729600000])); }
    static now() { return 1794729600000; }
  };
  globalThis.$done = function(value) {
    trace.done.push(value === undefined ? null : JSON.parse(JSON.stringify(value)));
  };
  if (!fixture.disableStorage) globalThis.$persistentStore = {
    read(key) { return Object.hasOwn(trace.storage, key) ? trace.storage[key] : null; },
    write(value, key) { trace.storage[key] = String(value); return true; }
  };
  function httpStub(method, input, callback) {
    trace.network.push({ method, request: JSON.parse(JSON.stringify(input)) });
    const responseBody = fixture.httpResponseBody === undefined
      ? JSON.stringify({ identifiers: ['mock-vip-user'] }) : fixture.httpResponseBody;
    if (typeof callback === 'function') callback(null, { status: 200 }, responseBody);
  }
  if (!fixture.disableHttp) globalThis.$httpClient = {
    get(input, callback) { httpStub('GET', input, callback); },
    post(input, callback) { httpStub('POST', input, callback); }
  };
  globalThis.console = { log() {}, warn() {}, error() {} };
  if (typeof require !== 'undefined' || typeof process !== 'undefined' || typeof fetch !== 'undefined') {
    throw new Error('Unexpected host API in the mock context');
  }
`, { filename: "mock-runtime.cjs" });

const scripts = new Map();
for (const filename of filenames) {
  scripts.set(filename, {
    original: new vm.Script("(function () {\n" + fs.readFileSync(path.join(sourceDirectory, filename), "utf8") + "\n})();", { filename: "original/" + filename }),
    decoded: new vm.Script("(function () {\n" + fs.readFileSync(path.join(decodedDirectory, filename), "utf8") + "\n})();", { filename: "decoded/" + filename })
  });
}

function run(script, fixture) {
  const context = vm.createContext(Object.assign(Object.create(null), {
    __fixtureJson: JSON.stringify(fixture)
  }), { codeGeneration: { strings: false, wasm: false } });
  bootstrap.runInContext(context, { timeout: 1000 });
  script.runInContext(context, { timeout: 15000 });
  return JSON.parse(vm.runInContext("JSON.stringify(__trace)", context, { timeout: 1000 }));
}

test("original downloads retain their SHA-256 hashes", () => {
  for (const filename of filenames) {
    assert.equal(hash(fs.readFileSync(path.join(sourceDirectory, filename))), expectedSourceHashes[filename], filename);
  }
});

function equivalent(filename, name, fixture, expectedHttpCalls) {
  test(filename + ": " + name, () => {
    const pair = scripts.get(filename);
    const original = run(pair.original, fixture);
    const decoded = run(pair.decoded, fixture);
    // Compare complete outputs without printing bodies or authorization values.
    assert.equal(hash(JSON.stringify(decoded)), hash(JSON.stringify(original)), "Output, mock HTTP calls or stored values differ");
    assert.equal(original.done.length, 1, "Original must call $done once for this fixture");
    assert.equal(decoded.done.length, 1, "Decoded must call $done once for this fixture");
    if (expectedHttpCalls !== undefined) assert.equal(decoded.network.length, expectedHttpCalls);
  });
}

equivalent("deleteHeader.js", "mixed header case and unrelated fields", {
  request: { headers: {
    "X-RevenueCat-ETag": "mock-etag", "IF-NONE-MATCH": "mock-etag", "If-Modified-Since": "mock-date",
    "X-Goog-If-None-Match": "mock-etag", "Content-Type": "application/json", Authorization: "Bearer mock-only"
  } }
}, 0);
equivalent("deleteHeader.js", "empty headers", { request: { headers: {} } }, 0);
equivalent("deleteHeader.js", "missing headers", { request: {} }, 0);
equivalent("deleteHeader.js", "missing request", {}, 0);

for (const [name, body] of [
  ["valid response preserves unrelated fields", JSON.stringify({ marker: "keep", subscriber: { marker: "keep", subscriptions: {}, entitlements: {} } })],
  ["empty object", "{}"], ["malformed JSON", "{invalid"], ["empty body", ""],
  ["null JSON", "null"], ["primitive JSON", "7"], ["array JSON", "[]"]
]) equivalent("Locket_minhhiep08.js", name, {
  request: { url: "https://api.revenuecat.com/v1/subscribers/mock-user", headers: { "User-Agent": "Locket/Mock" } },
  response: { status: 200, headers: { "X-Mock": "keep" }, body }
}, 0);

for (const [name, body] of [
  ["existing entries and unrelated metadata", JSON.stringify({ marker: "keep", entries: { unrelated_mock: "keep" } })],
  ["empty entries", JSON.stringify({ entries: {} })], ["empty object", "{}"], ["malformed JSON", "{invalid"],
  ["empty body", ""], ["null JSON", "null"], ["primitive JSON", "7"], ["array JSON", "[]"]
]) equivalent("Locket_Unlocked.js", name, {
  request: { url: "https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch", headers: {} },
  response: { status: 200, headers: {}, body }
}, 0);

const apiRequest = endpoint => ({ url: "https://api.locketcamera.com/" + endpoint, headers: {} });
const responseFixture = (body, endpoint = "getSettings", extra = {}) => Object.assign({
  request: apiRequest(endpoint), response: { status: 200, headers: {
    "Content-Encoding": "gzip", "content-length": "123", "Transfer-Encoding": "chunked", "X-Mock": "keep"
  }, body }
}, extra);
const fakeJwt = "mock-header." + Buffer.from(JSON.stringify({ sub: "mock-self" })).toString("base64url") + ".mock-signature";

equivalent("locket_filter_unlock.js", "profile request branch", { request: apiRequest("changeProfileInfo") }, 0);
equivalent("locket_filter_unlock.js", "other request branch", {
  request: { url: "https://api.locketcamera.com/getSettings", headers: { "If-None-Match": "mock", "X-Mock": "keep" } }
}, 0);
equivalent("locket_filter_unlock.js", "image response passthrough", responseFixture("{invalid", "generateFilteredImage"), 0);
equivalent("locket_filter_unlock.js", "nested JSON", responseFixture(JSON.stringify({ marker: "keep", data: { filters: [{ locked: true, can_view: false }] } })));
equivalent("locket_filter_unlock.js", "self profile with mock JWT and HTTP stubs", responseFixture(JSON.stringify({ data: {
  uid: "mock-self", username: "mock-name", email: "demo@example.invalid"
} }), "getProfile", { request: { url: "https://api.locketcamera.com/getProfile", headers: { Authorization: "Bearer " + fakeJwt } } }));
equivalent("locket_filter_unlock.js", "friends response with mock identity", responseFixture(JSON.stringify({ data: [
  { uid: "mock-self", username: "mock-name" }, { uid: "mock-other", username: "mock-other-name" }
] }), "getFriends", { storage: { LOCKET_SELF_UID: "mock-self" } }));
equivalent("locket_filter_unlock.js", "cached mock VIP identifiers", responseFixture(JSON.stringify({ data: [{ uid: "mock-vip-user" }] }), "getFriends", {
  storage: { LOCKET_VIP_COMMUNITY: JSON.stringify(["mock-vip-user"]) }
}));
equivalent("locket_filter_unlock.js", "invalid stored JSON", responseFixture("{}", "getSettings", { storage: { LOCKET_VIP_COMMUNITY: "{invalid" } }));
equivalent("locket_filter_unlock.js", "invalid mock HTTP response", responseFixture("{}", "getSettings", { httpResponseBody: "{invalid" }));
equivalent("locket_filter_unlock.js", "missing optional HTTP and storage APIs", responseFixture("{}", "getSettings", { disableHttp: true, disableStorage: true }), 0);
equivalent("locket_filter_unlock.js", "non-success status", Object.assign(responseFixture("{\"error\":{\"message\":\"mock\"}}"), {
  response: { status: 403, headers: {}, body: "{\"error\":{\"message\":\"mock\"}}" }
}));
for (const [name, body] of [["empty body", ""], ["malformed JSON", "{invalid"], ["null JSON", "null"], ["array JSON", "[]"]]) {
  equivalent("locket_filter_unlock.js", name, responseFixture(body));
}
