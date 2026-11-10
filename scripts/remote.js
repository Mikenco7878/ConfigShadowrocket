// Updated: 02:31 11/11/2026 (UTC+7)
// Locket test hooks. No entitlement changes, image redirects or body inspection.
// The server remains responsible for filter availability and AI generation.
(function () {
  var result = {};
  function diagnostic(message) {
    try {
      if (typeof console !== "undefined" && typeof console.log === "function") {
        console.log("[locketest] build=20261111_0231 " + message);
      }
    } catch (error) {}
  }
  diagnostic("metadata-hook");
  try {
    var request = typeof $request === "object" && $request ? $request : {};
    var url = typeof request.url === "string" ? request.url : "";
    var firebase = /^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/(locket-4252a|[0-9]+)\/namespaces\/firebase:fetch(?:\?[^#]*)?$/.exec(url);
    var image = /^https:\/\/(?:api\.locketcamera\.com|us-central1-locket-4252a\.cloudfunctions\.net)\/generateFilteredImage(?:\?[^#]*)?$/.test(url);
    var profile = /^https:\/\/api\.locketcamera\.com\/changeProfileInfo(?:\?[^#]*)?$/.test(url);
    var headers = request.headers || {};
    var isLocket = Object.keys(headers).some(function (key) {
      return key.toLowerCase() === "user-agent" &&
        typeof headers[key] === "string" && /\bLocket(?:\/|\b)/i.test(headers[key]);
    });
    // Trust the known project; numeric projects need a Locket User-Agent.
    if ((firebase && (firebase[1] === "locket-4252a" || isLocket)) || image || profile) {
      var response = typeof $response === "object" && $response ? $response : null;
      var stage = firebase ? "remote-config" : image ? "generate-image" : "profile";
      if (!response && firebase) {
        var cleaned = {};
        var conditionalHeaders = ["if-none-match", "if-modified-since", "x-goog-if-none-match"];
        Object.keys(headers).forEach(function (key) {
          if (conditionalHeaders.indexOf(key.toLowerCase()) === -1) cleaned[key] = headers[key];
        });
        result.headers = cleaned;
      }
      // Only fixed labels and a sanitized HTTP status; never log URL, headers or body.
      var status = response ? String(response.statusCode || response.status || "") : "";
      var match = /^(?:HTTP\/\d(?:\.\d)?\s+)?([1-5]\d{2})(?:\s|$)/.exec(status);
      diagnostic(stage + " " + (response ? "response status=" + (match ? match[1] : "unknown") : "request"));
    } else {
      diagnostic("skipped=identity-or-endpoint");
    }
  } catch (error) {
    // Preserve the original traffic if metadata or logging is unavailable.
    result = {};
    diagnostic("skipped=metadata-error");
  }
  $done(result);
})();
