// Limit the existing handler to Locket; preserve traffic on unsupported inputs.
(function () {
var result = {};
try {
var headers = $request.headers || {};
var userAgent = headers["User-Agent"] || headers["user-agent"] || "";
if (/^Locket(?:\/|\s|$)/.test(userAgent)) {
const version = "V1.0.2";

function setHeaderValue(e, a, d) {
  var r = a.toLowerCase();
  r in e ? (e[r] = d) : (e[a] = d);
}
var modifiedHeaders = $request.headers;
setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");
result = { headers: modifiedHeaders };
}
} catch (error) {
  // Preserve the original request or response on malformed input.
}
$done(result);
})();
