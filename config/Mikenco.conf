# crackByMikenco
#!name=All Crack + YouTube Premium
#!desc=By: Mikenco | Unlock App + Chặn Ads YouTube + PIP + Nền
#!author=Lam Dien
#!homepage=https://t.me/shadowrocketunlockproapps
#!icon=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/YouTube.png
# Cập nhật: 2025-07-14

[General]
bypass-system = true
skip-proxy = *.local, *.crashlytics.com
tun-excluded-routes = 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12

[MITM]
hostname = api.revenuecat.com, buy.itunes.apple.com, api.picsart.com, api.adapty.io, carrotweather.herokuapp.com, lcs-mobile-cops.adobe.io, order.creativeappnow.com, api.mwm-users.com, us-central1-muslim-pro-app.cloudfunctions.net, api.gptkeyboard.app, prod.studysmarter.de, api.qonversion.io, api.blinkist.com, subscription.grammarly.com, api.esound.app, api.purchasely.io, spclient.wg.spotify.com, api-sub.meitu.com, redirector*.googlevideo.com, *.googlevideo.com, www.youtube.com, s.youtube.com, youtubei.googleapis.com

[Rule]
AND,((DOMAIN-SUFFIX,googlevideo.com),(PROTOCOL,UDP)),REJECT
AND,((DOMAIN,youtubei.googleapis.com),(PROTOCOL,UDP)),REJECT

[URL Rewrite]
(^https?:\/\/[\w-]+\.googlevideo\.com\/(?!dclk_video_ads).+?)&ctier=L(&.+?),ctier,(.+) $1$2$3 302
^https?:\/\/[\w-]+\.googlevideo\.com\/(?!(dclk_video_ads|videoplayback\?)).+&oad _ reject-200
^https?:\/\/(www|s)\.youtube\.com\/api\/stats\/ads _ reject-200
^https?:\/\/(www|s)\.youtube\.com\/(pagead|ptracking) _ reject-200
^https?:\/\/s\.youtube\.com\/api\/stats\/qoe\?adcontext _ reject-200

[Script]
http-response ^https://api\.revenuecat\.com/.+/(receipts$|subscribers/[^/]+$) script-path=https://raw.githubusercontent.com/quocchienn/Make/refs/heads/crack/crack.js, requires-body=true, timeout=5, tag=Crack
http-request https://api.picsart.com/gw-v2/shop/subscription/apple/purchases script-path=https://raw.githubusercontent.com/quocchienn/Make/refs/heads/crack/PicsArt.js, requires-body=true, timeout=5, tag=PicsArt
http-response api.sandbox.love/accounts/current script-path=https://raw.githubusercontent.com/quocchienn/Make/refs/heads/crack/SandBox.js, requires-body=true, timeout=5, tag=Sandbox Pixel Art
spotify-json = type=http-request,type=http-request,pattern=^https:\/\/spclient\.wg\.spotify\.com\/(artistview\/v1\/artist|album-entity-view\/v2\/album)\/,requires-body=0,script-path=https://raw.githubusercontent.com/quocchienn/Make/refs/heads/crack/spotify-json.js
spotify-proto = type=http-response,pattern=^https:\/\/spclient\.wg\.spotify\.com\/(bootstrap\/v1\/bootstrap|user-customization-service\/v1\/customize)$,requires-body=1,binary-mode=1,max-size=0,script-path=https://raw.githubusercontent.com/quocchienn/Make/refs/heads/crack/spotify-proto.js,script-update-interval=0
WinkVipCrack=type=http-response,pattern=^https?:\/\/api-sub\.meitu\.com\/v2\/user\/vip_info_by_group\.json,requires-body=1,script-path=https://raw.githubusercontent.com/quocchienn/co_tien_khong/refs/heads/Module/WinkVipCrack.js

#! YouTube 去广告 + PIP + Nền
youtube.response=type=http-response,pattern=^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/(browse|next|player|search|reel\/reel_watch_sequence|guide|account\/get_setting|get_watch),requires-body=1,max-size=-1,binary-body-mode=1,script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.response.js,argument={"lyricLang":"vi","captionLang":"vi","blockUpload":false,"blockImmersive":false,"debug":false}
