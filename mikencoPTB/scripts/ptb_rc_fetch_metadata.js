// Scoped RC diagnostics. Refresh mode removes conditional headers, never credentials.
(function () {
  var result = {};
  try {
    var request = typeof $request === "object" && $request ? $request : {};
    var mode = typeof $argument === "string" ? $argument : "";
    if ((mode !== "metadata" && mode !== "refresh") ||
        !/^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/namespaces\/firebase:fetch(?:\?[^#]*)?$/.test(request.url || "")) {
      throw new Error("Outside scope");
    }
    var headers = request.headers || {};
    var userAgentState = "missing";
    var conditionalHeadersPresent = false;
    var conditionalNames = ["if-none-match", "if-modified-since", "x-goog-if-none-match"];
    Object.keys(headers).forEach(function (key) {
      var name = key.toLowerCase();
      if (name === "user-agent" && typeof headers[key] === "string") {
        userAgentState = headers[key].indexOf("Locket") !== -1 ? "locket" : headers[key] ? "other" : "missing";
      }
      if (conditionalNames.indexOf(name) !== -1) conditionalHeadersPresent = true;
    });
    var removedCount = 0;
    if (mode === "refresh" && userAgentState === "locket" && request.method === "POST" && conditionalHeadersPresent) {
      var freshHeaders = {};
      Object.keys(headers).forEach(function (key) {
        if (conditionalNames.indexOf(key.toLowerCase()) !== -1) removedCount++;
        else freshHeaders[key] = headers[key];
      });
      result = { headers: freshHeaders };
    }
    console.log("[MKC-PTB-RC-FETCH] " + JSON.stringify({
      build: "20261123_m0_m1_05",
      mode: mode,
      method: /^(?:GET|POST|HEAD|OPTIONS)$/.test(request.method || "") ? request.method : "unknown",
      user_agent_state: userAgentState,
      conditional_headers_present: conditionalHeadersPresent,
      conditional_headers_removed_count: removedCount
    }));
  } catch (error) {
    // Log neither exception text nor request/response data.
  }
  $done(result);
})();
