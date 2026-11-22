// Shadowrocket M1 probe. No network, persistence, payload values or traffic changes.
(function () {
  var MAX_BYTES = 2097152;
  // Unknown/dynamic keys are masked too: a JSON key can itself contain a secret.
  var FIELD_NAMES = ("data result error status code message details filter filter_id filterId filterID filters " +
    "image image_url imageUrl imageURL original_image originalImage original_image_url originalImageUrl " +
    "input input_image inputImage input_url inputUrl source source_url sourceUrl photo photo_url photoUrl " +
    "output output_url outputUrl output_image outputImage output_image_url outputImageUrl url uri downloadURL " +
    "storage_path storagePath bucket path filename content_type contentType mime_type mimeType width height " +
    "session session_id sessionId request_id requestId job_id jobId task_id taskId id uid user_id userId " +
    "client_id clientId installation_id installationId device_id deviceId token access_token refresh_token " +
    "authorization cookie headers auth metadata options parameters prompt seed version format images " +
    "thumbnail thumbnail_url thumbnailUrl created_at createdAt expires_at expiresAt success operation").split(" ");
  var OPAQUE = /^(?:image|original_image|originalImage|input_image|inputImage|photo|output_image|outputImage|images|token|access_token|refresh_token|authorization|cookie|headers|auth|prompt)$/;

  function header(headers, name) {
    var keys = Object.keys(headers || {});
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === name && typeof headers[keys[i]] === "string") return headers[keys[i]];
    }
    return "";
  }

  function byteLength(text) {
    var count = 0;
    for (var i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);
      if (code < 128) count++;
      else if (code < 2048) count += 2;
      else if (code >= 55296 && code <= 56319 && i + 1 < text.length && text.charCodeAt(i + 1) >= 56320 && text.charCodeAt(i + 1) <= 57343) { count += 4; i++; }
      else count += 3;
      if (count > MAX_BYTES) return null;
    }
    return count;
  }

  function fieldsOf(value) {
    var fields = [];
    var truncated = false;
    function visit(item, prefix, depth) {
      if (!item || typeof item !== "object") return;
      if (depth > 4 || fields.length >= 96) { truncated = true; return; }
      if (Array.isArray(item)) {
        if (item.length) visit(item[0], prefix + "[]", depth + 1);
        return;
      }
      var keys = Object.keys(item);
      if (keys.length > 48) truncated = true;
      keys.slice(0, 48).forEach(function (key) {
        if (fields.length >= 96) { truncated = true; return; }
        var allowed = FIELD_NAMES.indexOf(key) !== -1;
        var path = prefix ? prefix + "." : "";
        path += allowed ? key : "<other>";
        var child = item[key];
        fields.push({ name: path, type: child === null ? "null" : Array.isArray(child) ? "array" : typeof child });
        if (allowed && !OPAQUE.test(key)) visit(child, path, depth + 1);
      });
    }
    visit(value, "", 0);
    return { fields: fields, fields_truncated: truncated };
  }

  try {
    if (typeof $argument !== "string" || $argument !== "metadata") throw new Error("Disabled");
    var request = typeof $request === "object" && $request ? $request : {};
    var match = /^https:\/\/(?:api\.locketcamera\.com|us-central1-locket-4252a\.cloudfunctions\.net)\/(generateFilteredImage|applyFilter)(?:\?[^#]*)?$/.exec(request.url || "");
    if (!match) throw new Error("Outside scope");
    var response = typeof $response === "object" && $response ? $response : null;
    var current = response || request;
    var rawType = header(current.headers, "content-type").split(";")[0].trim().toLowerCase();
    var types = ["application/json", "application/octet-stream", "application/protobuf", "application/x-protobuf", "multipart/form-data", "application/x-www-form-urlencoded", "image/jpeg", "image/png", "image/webp", "text/plain"];
    var contentType = types.indexOf(rawType) !== -1 ? rawType : rawType ? "other" : "unknown";
    var declared = header(current.headers, "content-length");
    var body = current.body;
    var bytes = typeof body === "string" ? (body.length <= MAX_BYTES ? byteLength(body) : null) :
      body && typeof body.byteLength === "number" && body.byteLength <= MAX_BYTES ? body.byteLength : null;
    var status = response ? /^(?:HTTP\/\d(?:\.\d)?\s+)?([1-5][0-9]{2})(?:\s|$)/.exec(String(response.statusCode || response.status || "")) : null;
    var summary = {
      phase: response ? "response" : "request",
      path: "/" + match[1],
      method: /^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/.test(request.method || "") ? request.method : "unknown",
      content_type: contentType,
      declared_bytes: /^[0-9]{1,9}$/.test(declared) ? Number(declared) : null,
      body_bytes: bytes,
      body_state: body === undefined || body === null ? "unavailable" : bytes === null ? "over_limit_or_unknown" : "not_inspected",
      fields: []
    };
    if (response) summary.http_status = status ? Number(status[1]) : null;
    if (typeof body === "string" && bytes !== null && contentType === "application/json") {
      if (!body.length) summary.body_state = "empty";
      else {
        try {
          var shape = fieldsOf(JSON.parse(body));
          summary.fields = shape.fields;
          summary.fields_truncated = shape.fields_truncated;
          summary.body_state = "json_shape_only";
        } catch (error) { summary.body_state = "invalid_json"; }
      }
    }
    console.log("[MKC-PTB-M1] " + JSON.stringify(summary));
  } catch (error) {
    // No raw exception messages: parsers can embed fragments of the input.
  }
  $done({});
})();
