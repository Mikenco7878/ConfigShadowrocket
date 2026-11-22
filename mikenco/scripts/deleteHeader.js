// Limit the existing handler to Locket; preserve traffic on unsupported inputs.
(function () {
var result = {};
var diagnosticState = "failed:request_context";
try {
var headers = $request.headers || {};
var userAgent = headers["User-Agent"] || headers["user-agent"] || "";
diagnosticState = userAgent ? "skipped:non_locket" : "skipped:user_agent_missing";
if (userAgent.includes("Locket")) {
diagnosticState = "failed:header_transform";
const version = "V1.0.2";

function setHeaderValue(e, a, d) {
  var r = a.toLowerCase();
  r in e ? (e[r] = d) : (e[a] = d);
}
var modifiedHeaders = $request.headers;
setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");
result = { headers: modifiedHeaders };
diagnosticState = "processed";
}
} catch (error) {
  // Preserve the original request or response on malformed input.
}
if (typeof $argument === "string" && $argument === "debug") {
  try { console.log("[MKC][deleteHeader] " + diagnosticState); } catch (error) {}
}
$done(result);
})();
