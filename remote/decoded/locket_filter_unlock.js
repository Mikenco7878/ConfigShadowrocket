// Decoded locally for inspection. Original variable names are not recoverable.
// Personal token remains redacted. This file is not connected to any module.
// 🛡️ MinhHiep08 Security Shield - All Rights Reserved
// Unauthorized copying or decompilation is strictly prohibited.
const WORKER_HOST = "https://locket-vip.mhiep20077.workers.dev";
const VIP_STORE_KEY = "LOCKET_VIP_COMMUNITY";
const SELF_UID_KEY = "LOCKET_SELF_UID";
const SELF_USERNAME_KEY = "LOCKET_SELF_USERNAME";
const BASE_VIP_USERS = ["mhhiep", "2c7dlquxuqulknrwgpcqsqlw0sk2", "th_quang08", "th_quang", "nln9pozfecsccxhuqpiwvkhfwsi2", "mhhuyz", "7tulqjjxb0srwqbbp3euildiqfe3", "nguyentuankietne", "blgpf4fdvbbnlmfllziy4hnbjjn1"];
function applyGoldBadge(badgeNode) {
  if (!badgeNode || typeof badgeNode !== "object") return;
  badgeNode.badge = "locket_gold";
  badgeNode.badge_tier = "gold";
  badgeNode.show_badge = true;
  badgeNode.is_gold = true;
  badgeNode.has_gold = true;
  badgeNode.gold = true;
  badgeNode.gold_subscription = true;
  badgeNode.has_gold_subscription = true;
  badgeNode.tier = "gold";
  badgeNode.subscription_status = "active";
  if (badgeNode.user && typeof badgeNode.user === "object" && badgeNode.user !== badgeNode) {
    applyGoldBadge(badgeNode.user);
  }
  if (badgeNode.friend && typeof badgeNode.friend === "object" && badgeNode.friend !== badgeNode) {
    applyGoldBadge(badgeNode.friend);
  }
  if (badgeNode.profile && typeof badgeNode.profile === "object" && badgeNode.profile !== badgeNode) {
    applyGoldBadge(badgeNode.profile);
  }
}
function isNodeVip(candidateNode, vipIdentifiers) {
  if (!candidateNode || typeof candidateNode !== "object") return false;
  const candidateUid = String(candidateNode.uid || candidateNode.user_id || candidateNode.id || candidateNode.friend_uid || candidateNode.friend_id || candidateNode.friendId || candidateNode.userId || '').toLowerCase().trim();
  if (candidateUid && vipIdentifiers.has(candidateUid)) return true;
  const candidateUsername = String(candidateNode.username || candidateNode.friend_username || '').toLowerCase().trim();
  if (candidateUsername && vipIdentifiers.has(candidateUsername)) return true;
  if (candidateNode.user && typeof candidateNode.user === "object") {
    const nestedUserUid = String(candidateNode.user.uid || candidateNode.user.id || candidateNode.user.user_id || '').toLowerCase().trim();
    if (nestedUserUid && vipIdentifiers.has(nestedUserUid)) return true;
    const nestedUserUsername = String(candidateNode.user.username || candidateNode.user.friend_username || '').toLowerCase().trim();
    if (nestedUserUsername && vipIdentifiers.has(nestedUserUsername)) return true;
  }
  if (candidateNode.friend && typeof candidateNode.friend === "object") {
    const friendUid = String(candidateNode.friend.uid || candidateNode.friend.id || '').toLowerCase().trim();
    if (friendUid && vipIdentifiers.has(friendUid)) return true;
    const friendUsername = String(candidateNode.friend.username || '').toLowerCase().trim();
    if (friendUsername && vipIdentifiers.has(friendUsername)) return true;
  }
  const displayName = String(candidateNode.display_name || candidateNode.first_name || candidateNode.name || candidateNode.user && (candidateNode.user.display_name || candidateNode.user.first_name) || '').toLowerCase().trim();
  if (displayName && vipIdentifiers.has(displayName)) return true;
  return false;
}
if (typeof $response === "undefined") {
  const reqUrl = typeof $request !== "undefined" && $request.url ? $request.url : '';
  if (reqUrl.includes("changeProfileInfo")) {
    const responseHeaders = {};
    responseHeaders["Content-Type"] = "application/json; charset=utf-8";
    responseHeaders["Access-Control-Allow-Origin"] = '*';
    const profileData = {};
    profileData.badge = "locket_gold";
    profileData.badge_tier = "gold";
    profileData.is_gold = true;
    profileData.success = true;
    const profileResult = {};
    profileResult.badge = "locket_gold";
    profileResult.badge_tier = "gold";
    profileResult.is_gold = true;
    profileResult.success = true;
    const profileResponse = {};
    profileResponse.data = profileData;
    profileResponse.result = profileResult;
    $done({
      'response': {
        'status': 200,
        'headers': responseHeaders,
        'body': JSON.stringify(profileResponse)
      }
    });
    return;
  }
  let headers = Object.assign({}, $request && $request.headers || {});
  for (let k of Object.keys(headers)) {
    if (["if-none-match", "if-modified-since", "x-revenuecat-etag"].includes(k.toLowerCase())) {
      delete headers[k];
    }
  }
  const requestResult = {};
  requestResult.headers = headers;
  $done(requestResult);
} else {
  const reqUrl = typeof $request !== "undefined" && $request.url ? $request.url : '';
  if (reqUrl.includes("generateFilteredImage")) {
    $done({});
    return;
  }
  let body = $response.body;
  let status = $response.status || $response.statusCode || 200;
  const customArg = typeof $argument === "string" && $argument.trim() ? $argument.trim().toLowerCase() : '';
  const unlockAllFriends = customArg.includes("all_friends=true") || customArg.includes("gold_all=true");
  let vipSet = new Set(BASE_VIP_USERS.map(identifier => String(identifier).toLowerCase().trim()));
  function extractSelfUidFromHeaders(requestHeaders) {
    if (!requestHeaders || typeof requestHeaders !== "object") return null;
    const authorization = requestHeaders.authorization || requestHeaders.Authorization || requestHeaders.AUTHORIZATION || '';
    if (!authorization || typeof authorization !== "string") return null;
    const bearerToken = authorization.replace(/^Bearer\s+/i, '').trim();
    const tokenParts = bearerToken.split('.');
    if (tokenParts.length >= 2) try {
      let encodedPayload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (encodedPayload.length % 4) encodedPayload += '=';
      let decodedPayload = '';
      let base64Payload = String(encodedPayload).replace(/=+$/, '');
      const base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      for (let decodeIndex = 0, bitBuffer, characterIndex, characterOffset = 0; characterIndex = base64Payload.charAt(characterOffset++); ~characterIndex && (bitBuffer = decodeIndex % 4 ? bitBuffer * 64 + characterIndex : characterIndex, decodeIndex++ % 4) ? decodedPayload += String.fromCharCode(255 & bitBuffer >> (-2 * decodeIndex & 6)) : 0) {
        characterIndex = base64Alphabet.indexOf(characterIndex);
      }
      if (decodedPayload) {
        const jwtClaims = JSON.parse(decodedPayload);
        return jwtClaims.user_id || jwtClaims.sub || jwtClaims.uid || null;
      }
    } catch (error1) {}
    return null;
  }
  const reqHeaders = typeof $request !== "undefined" && $request && $request.headers ? $request.headers : {};
  const jwtSelfUid = extractSelfUidFromHeaders(reqHeaders);
  let myUid = typeof $persistentStore !== "undefined" ? $persistentStore.read(SELF_UID_KEY) : null;
  if (jwtSelfUid) {
    myUid = jwtSelfUid;
    if (typeof $persistentStore !== "undefined") {
      $persistentStore.write(myUid, SELF_UID_KEY);
    }
  }
  if (myUid) vipSet.add(String(myUid).toLowerCase().trim());
  const myUname = typeof $persistentStore !== "undefined" ? $persistentStore.read(SELF_USERNAME_KEY) : null;
  if (myUname) vipSet.add(String(myUname).toLowerCase().trim());
  if (typeof $persistentStore !== "undefined") try {
    const rawVip = $persistentStore.read(VIP_STORE_KEY);
    if (rawVip) {
      const list = JSON.parse(rawVip);
      if (Array.isArray(list)) for (let id of list) {
        if (id) vipSet.add(String(id).toLowerCase().trim());
      }
    }
  } catch (error2) {}
  if (body && typeof body === "string") try {
    let obj = JSON.parse(body);
    const isFriendsOrFeed = /getFriends|getUsers|fetchFriends|getRecipients|recipients|moments|fetchMoments|getMoments|contacts/i.test(reqUrl);
    if (!isFriendsOrFeed && (status === 402 || status === 403 || status === 400)) {
      status = 200;
      if (obj && obj.error && reqUrl.includes("generateFilteredImage")) {
        obj = {
          'result': {
            'status': 200,
            'is_gold': true,
            'is_locked': false,
            'requires_gold': false,
            'unlocked': true,
            'data': obj.error.details || {}
          }
        };
      }
    }
    function unlockSelfUser(selfNode) {
      if (!selfNode || typeof selfNode !== "object") return;
      applyGoldBadge(selfNode);
      selfNode.can_use_filters = true;
      selfNode.can_use_gold_features = true;
      selfNode.can_generate_filtered_image = true;
      selfNode.can_create_filtered_image = true;
      selfNode.has_ai_access = true;
      selfNode.filter_access = true;
      const selfUser = selfNode.user && typeof selfNode.user === "object" ? selfNode.user : selfNode;
      const selfUid = String(selfUser.uid || selfUser.user_id || selfUser.id || selfNode.uid || selfNode.user_id || selfNode.id || myUid || '').toLowerCase().trim();
      const selfUsername = String(selfUser.username || selfNode.username || '').toLowerCase().trim();
      if (typeof $persistentStore !== "undefined") {
        if (selfUid) $persistentStore.write(selfUid, SELF_UID_KEY);
        if (selfUsername) $persistentStore.write(selfUsername, SELF_USERNAME_KEY);
      }
      if (selfUid) vipSet.add(selfUid);
      if (selfUsername) vipSet.add(selfUsername);
      if ((selfUid || selfUsername) && typeof $httpClient !== "undefined") try {
        $httpClient.get(WORKER_HOST + "/api/register-vip?uid=" + encodeURIComponent(selfUid) + "&username=" + encodeURIComponent(selfUsername), function () {});
      } catch (error3) {}
      const authorizationHeader = reqHeaders.authorization || reqHeaders.Authorization;
      if (authorizationHeader && typeof $httpClient !== "undefined") {
        const lastBadgeSync = typeof $persistentStore !== "undefined" ? $persistentStore.read("LOCKET_PROFILE_BADGE_SYNCED") : null;
        const currentTime = Date.now();
        if (!lastBadgeSync || currentTime - Number(lastBadgeSync) > 3600000) {
          if (typeof $persistentStore !== "undefined") {
            $persistentStore.write(String(currentTime), "LOCKET_PROFILE_BADGE_SYNCED");
          }
          try {
            const syncHeaders = {};
            syncHeaders.Authorization = authorizationHeader;
            syncHeaders["Content-Type"] = "application/json";
            const badgeData = {};
            badgeData.badge = "locket_gold";
            const syncPayload = {};
            syncPayload.data = badgeData;
            $httpClient.post({
              'url': "https://api.locketcamera.com/changeProfileInfo",
              'headers': syncHeaders,
              'body': JSON.stringify(syncPayload)
            }, function () {});
          } catch (error4) {}
        }
      }
    }
    const isSingleUserProfile = Boolean(!isFriendsOrFeed && (obj && obj.data && typeof obj.data === "object" && !Array.isArray(obj.data) && (obj.data.email || myUid && obj.data.uid === myUid) || obj && obj.result && typeof obj.result === "object" && !Array.isArray(obj.result) && (obj.result.email || myUid && obj.result.uid === myUid) || obj && obj.user && typeof obj.user === "object" && !Array.isArray(obj.user) && (obj.user.email || myUid && obj.user.uid === myUid)));
    if (isSingleUserProfile) {
      applyGoldBadge(obj);
      unlockSelfUser(obj.data || obj.result || obj.user || obj);
    }
    function transformNode(node) {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) {
        for (let index = 0; index < node.length; index++) {
          transformNode(node[index]);
        }
        return;
      }
      const nestedUser = node.user && typeof node.user === "object" ? node.user : node;
      const nodeUid = String(nestedUser.uid || nestedUser.user_id || nestedUser.id || node.uid || node.user_id || node.id || '').toLowerCase().trim();
      const isSelf = Boolean(myUid && nodeUid && nodeUid === myUid.toLowerCase() || "email" in node && node.email && typeof node.email === "string" && node.email.includes('@') || "push_token" in node && node.push_token || "fcm_token" in node && node.fcm_token);
      if (isSelf) unlockSelfUser(node);else {
        const isVip = unlockAllFriends || isNodeVip(node, vipSet);
        if (isVip) {
          applyGoldBadge(node);
          if (node.user && typeof node.user === "object") {
            applyGoldBadge(node.user);
          }
          if (node.friend && typeof node.friend === "object") {
            applyGoldBadge(node.friend);
          }
        }
      }
      const lockedFlags = ["is_locked", "locked", "requires_gold", "require_gold", "gold_only", "is_gold_only", "paywall", "show_paywall", "show_upsell", "upsell", "blurred", "is_blurred", "needs_gold"];
      for (let lockedFlag of lockedFlags) {
        if (lockedFlag in node) node[lockedFlag] = false;
      }
      const allowedFlags = ["can_view", "unlocked", "is_unlocked", "is_free", "free", "can_use_filter", "allowed", "can_use_filters"];
      for (let allowedFlag of allowedFlags) {
        if (allowedFlag in node) node[allowedFlag] = true;
      }
      const imageUrl = node.unblurred_url || node.unlocked_url || node.result_url || node.image_url || node.transformed_image_url || node.url;
      if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("http")) {
        if ("blurred_url" in node) node.blurred_url = imageUrl;
        if ("blurred_image_url" in node) node.blurred_image_url = imageUrl;
        if ("preview_url" in node && node.is_blurred) node.preview_url = imageUrl;
      }
      for (let key of Object.keys(node)) {
        if (key !== "badge" && key !== "is_gold" && key !== "has_gold" && key !== "tier" && key !== "gold") {
          if (vipSet.has(key.toLowerCase().trim()) && node[key] && typeof node[key] === "object") {
            applyGoldBadge(node[key]);
          }
          transformNode(node[key]);
        }
      }
    }
    transformNode(obj);
    body = JSON.stringify(obj);
  } catch (error5) {}
  if (typeof $httpClient !== "undefined") try {
    $httpClient.get(WORKER_HOST + "/api/vip-users", function (error, response, responseBody) {
      if (!error && responseBody) try {
        const vipResponse = JSON.parse(responseBody);
        if (vipResponse && Array.isArray(vipResponse.identifiers) && typeof $persistentStore !== "undefined") {
          $persistentStore.write(JSON.stringify(vipResponse.identifiers), VIP_STORE_KEY);
        }
      } catch (error6) {}
    });
  } catch (error7) {}
  let respHeaders = Object.assign({}, $response && $response.headers || {});
  delete respHeaders["Content-Encoding"];
  delete respHeaders["content-encoding"];
  delete respHeaders["Content-Length"];
  delete respHeaders["content-length"];
  delete respHeaders["Transfer-Encoding"];
  delete respHeaders["transfer-encoding"];
  respHeaders["content-type"] = "application/json; charset=utf-8";
  const responseResult = {};
  responseResult.status = status;
  responseResult.headers = respHeaders;
  responseResult.body = body;
  $done(responseResult);
}
