// Decoded locally for inspection. Original variable names are not recoverable.
// Personal token remains redacted. This file is not connected to any module.
// 🛡️ MinhHiep08 Security Shield - All Rights Reserved
// Unauthorized copying or decompilation is strictly prohibited.
const version = "V2.0.0";
const headersToStrip = ["x-revenuecat-etag", "if-none-match", "if-modified-since", "x-goog-if-none-match"];
let modifiedHeaders = typeof $request !== "undefined" && $request && $request.headers ? Object.assign({}, $request.headers) : {};
for (let key of Object.keys(modifiedHeaders)) {
  if (headersToStrip.includes(key.toLowerCase())) {
    modifiedHeaders[key] = '';
    delete modifiedHeaders[key];
  }
}
const requestResult = {};
requestResult.headers = modifiedHeaders;
$done(requestResult);
