// Limit the existing handler to Locket; preserve traffic on unsupported inputs.
(function () {
var result = {};
var diagnosticState = "failed:request_context";
try {
var headers = $request.headers || {};
var userAgent = headers["User-Agent"] || headers["user-agent"] || "";
diagnosticState = userAgent ? "skipped:non_locket" : "skipped:user_agent_missing";
if (userAgent.includes("Locket")) {
// ========= ID ========= //
const mapping = {
  "%E8%BD%A6%E7%A5%A8%E7%A5%A8": ["vip+watch_vip"],
  Locket: ["Gold"],
};
// ================== //
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
diagnosticState = "failed:json_parse";
var obj = JSON.parse($response.body);
diagnosticState = "failed:subscriber_schema";

var mute = {
    auto_resume_date: null,
    display_name: "locket_1600_1y",
    is_sandbox: true,
    ownership_type: "PURCHASED",
    billing_issues_detected_at: null,
    management_url: "https://apps.apple.com/account/subscriptions",
    period_type: "normal",
    price: {
      amount: 359000,
      currency: "VND",
    },
    expires_date: "9999-05-05T07:11:00Z",
    grace_period_expires_date: null,
    refunded_at: null,
    unsubscribe_detected_at: null,
    original_purchase_date: "2026-11-03T07:11:00Z",
    purchase_date: "2026-11-03T07:11:00Z",
    store: "app_store",
    store_transaction_id: "2000001108724193",
  },
  locketGold = {
    grace_period_expires_date: null,
    purchase_date: "2026-11-03T07:11:00Z",
    product_identifier: "locket_1600_1y",
    expires_date: "9999-11-03T07:11:00Z",
  };
const match = Object.keys(mapping).find((e) => ua.includes(e));
if (match) {
  let [e, s] = mapping[match];
  (s
    ? ((locketGold.product_identifier = s),
      (obj.subscriber.subscriptions[s] = mute))
    : (obj.subscriber.subscriptions["locket_1600_1y"] = mute),
    (obj.subscriber.entitlements[e] = locketGold));
} else
  ((obj.subscriber.subscriptions["locket_1600_1y"] = mute),
    (obj.subscriber.entitlements.pro = locketGold));
result = { body: JSON.stringify(obj) };
diagnosticState = "processed";
}
} catch (error) {
  // Preserve the original request or response on malformed input.
}
if (typeof $argument === "string" && $argument === "debug") {
  try {
    var statusValue = typeof $response !== "undefined" ? ($response.status || $response.statusCode || "") : "";
    var statusMatch = String(statusValue).match(/\b[1-5][0-9]{2}\b/);
    console.log("[MKC][revenuecat] " + diagnosticState + " status=" + (statusMatch ? statusMatch[0] : "unknown"));
  } catch (error) {}
}
$done(result);
})();
