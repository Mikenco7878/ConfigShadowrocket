// Request-side evidence only. Never changes cache headers or logs their values.
(function () {
  try {
    var request = typeof $request === "object" && $request ? $request : {};
    if (typeof $argument !== "string" || $argument !== "metadata" ||
        !/^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/namespaces\/firebase:fetch(?:\?[^#]*)?$/.test(request.url || "")) {
      throw new Error("Outside scope");
    }
    var headers = request.headers || {};
    var userAgentState = "missing";
    var conditionalHeadersPresent = false;
    Object.keys(headers).forEach(function (key) {
      var name = key.toLowerCase();
      if (name === "user-agent" && typeof headers[key] === "string") {
        userAgentState = headers[key].indexOf("Locket") !== -1 ? "locket" : headers[key] ? "other" : "missing";
      }
      if (["if-none-match", "if-modified-since", "x-goog-if-none-match"].indexOf(name) !== -1) conditionalHeadersPresent = true;
    });
    console.log("[MKC-PTB-RC-FETCH] " + JSON.stringify({
      build: "20261123_m0_m1_02",
      method: /^(?:GET|POST|HEAD|OPTIONS)$/.test(request.method || "") ? request.method : "unknown",
      user_agent_state: userAgentState,
      conditional_headers_present: conditionalHeadersPresent
    }));
  } catch (error) {
    // Log neither exception text nor request/response data.
  }
  $done({});
})();
