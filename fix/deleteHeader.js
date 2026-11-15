// Locket Request Cache Headers
// Hook: http-request; use only with the intended API rules.
// Refactored from remote/decoded/deleteHeader.js; original attribution retained:
// 🛡️ MinhHiep08 Security Shield - All Rights Reserved
// Unauthorized copying or decompilation is strictly prohibited.

var headersToRemove = ["x-revenuecat-etag", "if-none-match", "if-modified-since", "x-goog-if-none-match"];
var requestHeaders = typeof $request !== "undefined" && $request && $request.headers ? $request.headers : {};
var modifiedHeaders = Object.assign({}, requestHeaders);

Object.keys(modifiedHeaders).forEach(function (headerName) {
  if (headersToRemove.includes(headerName.toLowerCase())) delete modifiedHeaders[headerName];
});

$done({ headers: modifiedHeaders });
