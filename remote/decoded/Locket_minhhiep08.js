// Decoded locally for inspection. Original variable names are not recoverable.
// Personal token remains redacted. This file is not connected to any module.
// 🛡️ MinhHiep08 Security Shield - All Rights Reserved
// Unauthorized copying or decompilation is strictly prohibited.
var appMapping = {};
appMapping.Locket = ["Gold"];
const mapping = appMapping;
var ua = typeof $request !== "undefined" && $request && $request.headers ? $request.headers["User-Agent"] || $request.headers["user-agent"] || '' : '';
var obj = {};
try {
  obj = JSON.parse($response.body);
} catch (error1) {
  obj = {};
}
if (!obj || typeof obj !== "object") {
  obj = {};
}
obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";
var priceInfo = {};
priceInfo.amount = 399000;
priceInfo.currency = "VND";
var subscriptionInfo = {};
subscriptionInfo.auto_resume_date = null;
subscriptionInfo.display_name = "locket_1600_1y";
subscriptionInfo.is_sandbox = false;
subscriptionInfo.ownership_type = "PURCHASED";
subscriptionInfo.billing_issues_detected_at = null;
subscriptionInfo.management_url = "https://apps.apple.com/account/subscriptions";
subscriptionInfo.period_type = "normal";
subscriptionInfo.price = priceInfo;
subscriptionInfo.expires_date = "9999-01-09T10:10:14Z";
subscriptionInfo.grace_period_expires_date = null;
subscriptionInfo.refunded_at = null;
subscriptionInfo.unsubscribe_detected_at = null;
subscriptionInfo.original_purchase_date = "2005-01-09T10:10:15Z";
subscriptionInfo.purchase_date = "2005-01-09T10:10:14Z";
subscriptionInfo.store = "app_store";
subscriptionInfo.store_transaction_id = "2000001108724193";
var entitlementInfo = {};
entitlementInfo.grace_period_expires_date = null;
entitlementInfo.purchase_date = "2005-01-09T10:10:14Z";
entitlementInfo.original_purchase_date = "2005-01-09T10:10:15Z";
entitlementInfo.product_identifier = "locket_1600_1y";
entitlementInfo.product_plan_identifier = "locket_1600_1y";
entitlementInfo.ownership_type = "PURCHASED";
entitlementInfo.store = "app_store";
entitlementInfo.is_sandbox = false;
entitlementInfo.unsubscribe_detected_at = null;
entitlementInfo.billing_issues_detected_at = null;
entitlementInfo.expires_date = "9999-01-09T10:10:14Z";
var minhhiep08 = subscriptionInfo;
var locketGold = entitlementInfo;
obj.subscriber = obj.subscriber || {};
obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
obj.subscriber.entitlements = obj.subscriber.entitlements || {};
obj.subscriber.non_subscriptions = obj.subscriber.non_subscriptions || {};
obj.subscriber.other_purchases = obj.subscriber.other_purchases || {};
const subKeys = ["locket_1600_1y", "Gold", "gold", "pro", "locket_gold", "Locket Gold", "holiday_effects", "camera_filters", "camera_filter", "filters", "filter", "ai_filters", "ai_filter", "locket_gold_yearly", "gold_yearly"];
subKeys.forEach(function (subscriptionKey) {
  obj.subscriber.subscriptions[subscriptionKey] = minhhiep08;
});
const entKeys = ["Gold", "gold", "pro", "locket_gold", "Locket Gold", "holiday_effects", "camera_filters", "camera_filter", "holiday_filter", "holidays", "effects", "filters", "filter", "ai_filters", "ai_filter", "locket_gold_yearly", "gold_yearly"];
entKeys.forEach(function (entitlementKey) {
  obj.subscriber.entitlements[entitlementKey] = locketGold;
});
obj.request_date = obj.request_date || "2026-11-01T00:00:00Z";
obj.request_date_ms = obj.request_date_ms || Date.now();
var responseHeaders = {};
responseHeaders["content-type"] = "application/json";
$done({
  'status': 200,
  'headers': Object.assign({}, $response && $response.headers || {}, responseHeaders),
  'body': JSON.stringify(obj)
});
