// Locket Filter Presentation
// Endpoint: api.locketcamera.com; request hook passes through unchanged.
// Refactored from remote/decoded/locket_filter_unlock.js; original attribution retained:
// 🛡️ MinhHiep08 Security Shield - All Rights Reserved
// Unauthorized copying or decompilation is strictly prohibited.
// Local display options do not grant server-side access or verify subscriptions.
// No account lookup, shared VIP list, persistent identity or background HTTP calls.

var result = (function () {
  try {
    if (typeof $response === "undefined" || !$response) return {};
    var requestUrl = typeof $request !== "undefined" && $request ? $request.url || "" : "";
    var apiUrlPattern = /^https:\/\/api\.locketcamera\.com\/([^/?#]+)(?:\?[^#]*)?$/;
    var endpointMatch = apiUrlPattern.exec(requestUrl);
    if (!endpointMatch) return {};

    // Image data and profile changes must retain the real server response.
    var endpointName = endpointMatch[1];
    if (endpointName === "generateFilteredImage" || endpointName === "changeProfileInfo") return {};

    var statusCode = String($response.statusCode || $response.status || 200).match(/\b\d{3}\b/);
    if (!statusCode || Number(statusCode[0]) < 200 || Number(statusCode[0]) >= 300) return {};

    var responseHeaders = $response.headers || {};
    var contentTypeHeader = Object.keys(responseHeaders).find(function (headerName) {
      return headerName.toLowerCase() === "content-type";
    });
    var contentType = contentTypeHeader ? String(responseHeaders[contentTypeHeader]) : "";
    if (contentType && !/(?:\/|\+)json(?:\s*;|$)/i.test(contentType)) return {};

    var responseBody = $response.body;
    if (typeof responseBody !== "string" || !responseBody.trim()) return {};
    var responseData = JSON.parse(responseBody);
    if (!responseData || typeof responseData !== "object") return {};

    // Only existing display fields inside named filter collections are changed.
    // Subscription fields, user profiles and permission checks remain untouched.
    var filterCollectionKeys = ["filters", "camera_filters", "cameraFilters", "photo_filters", "photoFilters", "remote_filters", "remoteFilters", "sheet_filters", "sheetFilters", "filter_groups", "filterGroups"];
    var hiddenDisplayKeys = ["is_locked", "locked", "show_paywall", "show_upsell", "blurred", "is_blurred"];
    var visibleDisplayKeys = ["unlocked", "is_unlocked", "show_filter_button", "showFilterButton", "sheet_enabled", "sheetEnabled"];
    var protectedObjectKeys = ["user", "friend", "profile", "owner", "author", "creator", "subscriber", "subscriptions", "entitlements", "permissions", "capabilities"];
    var pendingNodes = [{ value: responseData, isFilter: false }];
    var visitedNodes = 0;
    var hasChanges = false;

    while (pendingNodes.length) {
      if (++visitedNodes > 50000) return {}; // Fall back without returning a partial edit.
      var currentNode = pendingNodes.pop();
      var node = currentNode.value;
      if (!node || typeof node !== "object") continue;

      if (currentNode.isFilter && !Array.isArray(node)) {
        hiddenDisplayKeys.forEach(function (fieldName) {
          if (node[fieldName] === true) {
            node[fieldName] = false;
            hasChanges = true;
          }
        });
        visibleDisplayKeys.forEach(function (fieldName) {
          if (node[fieldName] === false) {
            node[fieldName] = true;
            hasChanges = true;
          }
        });
      }

      Object.keys(node).forEach(function (fieldName) {
        if (!protectedObjectKeys.includes(fieldName) && node[fieldName] && typeof node[fieldName] === "object") {
          pendingNodes.push({ value: node[fieldName], isFilter: currentNode.isFilter || filterCollectionKeys.includes(fieldName) });
        }
      });
    }

    if (!hasChanges) return {};
    var modifiedHeaders = Object.assign({}, responseHeaders);
    Object.keys(modifiedHeaders).forEach(function (headerName) {
      if (["content-length", "content-encoding", "transfer-encoding"].includes(headerName.toLowerCase())) delete modifiedHeaders[headerName];
    });
    return { headers: modifiedHeaders, body: JSON.stringify(responseData) };
  } catch (error) {
    return {}; // Keep malformed, empty or unsupported responses unchanged.
  }
})();

$done(result);
