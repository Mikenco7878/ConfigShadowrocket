
// ============================================================
// Locket Remote Config Rewrite
// Endpoint: firebaseremoteconfig.googleapis.com

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";
var obj = JSON.parse($response.body);

if (obj && obj.entries && typeof obj.entries === "object") {
  obj.Attention = "Hi! Please do not sell or share this with others!";
  obj.entries = obj.entries || {};

  // Preserve existing Remote Config feature gates before applying overrides.
 
var originalFeatureGates = {};
try {
    var rawGates = obj.entries.feature_gates;
    var parsedGates = typeof rawGates === "string"
        ? JSON.parse(rawGates || "{}")
        : rawGates;

    if (parsedGates && typeof parsedGates === "object" && !Array.isArray(parsedGates)) {
        originalFeatureGates = parsedGates;
    }
} catch (e) {}


    // 1. GOLD CONFIGURATION, FEATURE GATES & PAYWALL
    Object.assign(obj.entries, {
        feature_gates: JSON.stringify(Object.assign({}, originalFeatureGates, {
            app_icon_picker: "enabled", camera_roll: "enabled", camera_theme: "enabled", locket_views: "enabled",
            long_captions: "enabled", longer_video: "enabled", unlimited_friends: "enabled", priority_support: "enabled",
            profile_badge: "enabled", remove_ads: "enabled", video: "enabled", custom_widget_frames: "enabled", streak_recovery: "enabled"
        })),
        upsell_features: JSON.stringify({
            app_icon_picker: true, camera_roll: true, camera_theme: true,
            locket_views: true, remove_ads: true, custom_widget_frames: true
        }),
        paywall_presentation_config: JSON.stringify({
            uid: "paywall_testflight", onboarding: false, after_sent_moment: false,
            on_foreground: false, interval: 2592000, profile_banner: true
        }),
        feature_discovery_popup_config: JSON.stringify({
            tag: "LOCKET GOLD MKC", tag_gradient: true, tag_style: "gold_gradient", title: "Activated 💛",
            feature_set: [
                { title: "Mikenco7878 🦉", body: "🔔Contact Zalo: 0789547878 for the best support🔔", imageURL: "https://i.postimg.cc/rVprsBtm/Dac-Vu-Cu-MKC.png" }
            ],
            primary_button_title: "Done!", campaign: "locket_gold_welcome",
            start_at: "2020-01-01T00:00:00", end_at: "2099-12-31T23:59:59", use_local_time_zone: true
        }),
        android_subscribe_gold_button_enabled: "false", profile_badge_visible: "true", lunar_new_year_app_icon_enabled: "true"
    });

    // 2. BLOCK ADS & DISABLE TRACKING (SENTRY)
    Object.assign(obj.entries, {
        history_ads_mode: "off", history_ads_prefetch_count: "0",
        history_ads_prefetch_immediate: "false", history_ads_prefetch_reroute: "false",
        history_ads_dynamic_insertion: "false", history_ads_refresh_prefetch_on_foreground: "false",
        history_ads_floor_price: "0", history_ads_floor_price_att: "0",
        history_ad_log_displayed_on_background: "false", history_ads_debug_menu: "false",
        sentry_sample_rate: "0", sentry_network_tracing: "false",
        sentry_performance_tracking: "false", sentry_trace_sample_rate: "0", sentry_profiles_sample_rate: "0"
    });

    // 3. CAMERA, VIDEO, FILTERS & UPLOAD QUALITY
    Object.assign(obj.entries, {
        camera: JSON.stringify({
            gold_max_duration: 30.0, goldMaxDuration: 30.0, max_duration: 30.0, maxDuration: 30.0,
            ultra_wide: true, ultraWide: true, volume_button: true, volumeButton: true,
            flash_button: true, telephoto: true, srgb: true, lanczos: true,
            quality_mbps: 0.9, qualityMbps: 0.9
        }),
        camera_roll: JSON.stringify({
            gold_max_duration: 30.0, goldMaxDuration: 30.0, video_max_duration: 30.0, videoMaxDuration: 30.0,
            max_duration: 30.0, maxDuration: 30.0, trim_max_duration: 30.0, trimMaxDuration: 30.0,
            camera_roll_max_duration: 30.0, quality_mbps: 0.9, qualityMbps: 0.9, flash_button: true
        }),
        live_photos: JSON.stringify({ capture: true, viewing: true, catch_up: true, widget_looping_mode: "never" }),
        camera_filter_config: JSON.stringify(Object.assign({}, originalCameraFilterConfig, {
            allows_custom_filters: true, show_filter_button: true, sheet_enabled: true, open_sheet_immediately: true,
            sheet_filters: [
                { title: { en: "Goofy" }, filter_ids: ["okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows"] },
                { title: { en: "Looks" }, filter_ids: ["bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns", "tatted", "mohawk", "braces", "bye_brows"] },
                { title: { en: "Celebrate" }, filter_ids: ["slimed", "princess", "disco_lights", "cash_money", "happy_birthday"] },
                { title: { en: "Cute" }, filter_ids: ["cutesy", "sticker_face", "flower_crown", "love_bug"] },
                { title: { en: "Costumes" }, filter_ids: ["wedding", "cowboy_cowgirl", "giraffe", "clown"] },
                { title: { en: "Holidays" }, filter_ids: ["easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun", "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"] }
            ],
            picker_filters: [
                "okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows",
                "bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns", "tatted", "mohawk", "braces",
                "slimed", "princess", "disco_lights", "cash_money", "happy_birthday",
                "cutesy", "sticker_face", "flower_crown", "love_bug",
                "wedding", "cowboy_cowgirl", "giraffe", "clown",
                "easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun",
                "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"
            ]
        })),
        camera_roll_preview_enabled: "true", camera_roll_video_enabled: "true",
        camera_roll_video_upload_enabled: "true", internal_camera_roll_video_upload_enabled: "true",
        longer_camera_roll_videos_enabled: "true",
        camera_roll_video_max_duration: "30.0", camera_roll_max_duration: "30.0", camera_roll_duration: "30.0",
        max_video_duration: "30.0", video_max_duration: "30.0", video_trim_max_duration: "30.0",
        trim_max_duration: "30.0", gold_max_duration: "30.0", goldMaxDuration: "30.0",
        video_quality_mbps: "0.9", video_sound_enabled: "true",
        microphone_enabled: "true", camera_microphone_enabled: "true",
        audio_session_deactivation_enabled: "true", zoom_enabled: "true",
        upload_main: "false", upload_main_image_quality: "1.0", upload_main_image_size: "1440",
        upload_thumbnail_image_quality: "1.0", upload_thumbnail_image_size: "1020"
    });

    // 4. FRIENDS, LIMITS & FRIEND SUGGESTIONS
    Object.assign(obj.entries, {
        max_friends_count: "999999", friend_limit_mode: "0", soft_friend_limit_threshold_count: "999999",
        show_friend_limit_on_cam: "false", signup_max_friends_count: "999999", celebrity_inbox_limit: "999999",
        friend_limit_geo_override: JSON.stringify({ experiments: {}, area_code_overrides: {} }),
        friends_sheet_locket_count_config: JSON.stringify({
            items: [
                { threshold: 0, icon_name: "heart" }, { threshold: 1, icon_name: "heart.fill" },
                { threshold: 10, emoji: "🤍" }, { threshold: 100, emoji: "💛" },
                { threshold: 500, emoji: "❤️‍🔥" }, { threshold: 1000, emoji: "🌟🫶🌟" },
                { threshold: 2000, emoji: "✨💟✨" }, { threshold: 5000, emoji: "⚡️😵‍💫⚡" },
                { threshold: 10000, emoji: "✨⚡️😱⚡✨" }
            ]
        }),
        friend_locket_count_config: JSON.stringify({
            items: [
                { threshold: 0, icon_name: "heart" }, { threshold: 1, icon_name: "heart.fill" },
                { threshold: 10, emoji: "🤍" }, { threshold: 100, emoji: "💛" },
                { threshold: 500, emoji: "❤️‍🔥" }, { threshold: 1000, emoji: "✨💗✨" },
                { threshold: 2000, emoji: "✨️⭐️✨" }, { threshold: 5000, emoji: "✨💎✨" },
                { threshold: 10000, emoji: "✨🔐💛✨" }
            ]
        }),
        new_friends_monitoring_enabled: "true", improved_friend_suggestions: "true",
        show_friend_suggestions_by_default: "true", emoji_friend_suggestions: "true",
        prompt_contact_permissions_on_search: "true", populate_phone_numbers_from_suggest_friends: "true",
        hide_friends_enabled: "true", hide_invite_links: "false", hide_skip_contacts: "true",
        show_all_contacts: "true", show_invite_suggestions: "true",
        show_no_friends_bottom_sheet: "false", signup_allow_skip_add_friends: "true"
    });

    // 5. MOMENTS, STREAK, CHAT & INTERACTIONS
    try {
        var streak = JSON.parse(obj.entries.streak_config || "{}");
        streak.minimum_recovery_count = 0;
        streak.minimum_display_count = 0;
        obj.entries.streak_config = JSON.stringify(streak);
    } catch (e) {}

    Object.assign(obj.entries, {
        moment_views_enabled: "true", moment_views_v2: "true",
        record_moment_views: "true", notify_moment_views: "true",
        get_moment_views_as_cloud_function: "true", moment_reactions_v2: "true",
        chat_reactions_enabled: "true", conversation_reactions: "true",
        typing_indicators_enabled: "true", unsend_message_enabled: "true",
        reply_prototype_enabled: "true", messages_integration: "true",
        conversations_enabled: "true", fetch_moments_in_conversation: "true",
        hide_chat_button: "false", groups_enabled: "true",
        send_to_self_only_mode: "always_enabled", time_travel_rewind_v2_enabled: "true",
        calendar_delete_moment_enabled: "true", calendar_rewind_enabled: "false",
        locket_yearbook_story_sharing_encouraged: "true",
        rollcall_enabled: "true", rollcall_comment_actions: "true",
        rollcall_profile_button: "true", rollcall_prompt_export_after_share: "true",
        rollcall_confirm_skip_tagging: "false", rollcall_tap_to_tag_enabled: "false"
    });

    // 6. WIDGET, NOTIFICATIONS & INTERFACE (JOURNAL / PROFILE)
    Object.assign(obj.entries, {
        widget_frame_event_max_images: "5", android_widget_frame_event_enabled: "true",
        widget_badge_enabled: "true", widget_badge_v2: "true",
        widget_stale_state_enabled: "false", widget_last_sent_indicator: "false",
        widget_sync_token_reload_mode: "clearTokenNever",
        widget_frame_event: JSON.stringify({
            uid: "midautumn_2026", url: "https://i.postimg.cc/fbY7MGdR/hlw.png",
            use_local_time_zone: true, placement: "below",
            start_at: "2020-01-01T00:00:00", end_at: "2099-12-31T23:59:59"
        }),
        live_activity_onboarding: "true", live_activity_onboarding_variant: "friending",
        register_live_activity_push_to_start_token: "true", live_activity_remove_stale_start_token: "true",
        notification_preferences_live_activities: "true", notification_preferences: "true",
        notification_reply_body_visible: "true", prompt_notification_permissions_after_friending: "true",
        activity_bar_enabled: "true", journal_activity_bar_enabled: "true",
        journal_settings: JSON.stringify({
            debug_menu_enabled: false, focus_animation: true, compact_header: true,
            friends_button: true, reverse_scroll_direction: false,
            streak_visualization: true, streak_visualization_style: "gradient",
            streak_header_minimum_count: 0, streak_visualization_minimum_count: 2,
            overlay_indicators: { location: true, music: true, static_content: true, weather: true }
        }),
        qr_code_config: JSON.stringify({ profile_enabled: true, scanning_enabled: true }),
        custom_profile_pics: "true", profile_menu_v2_enabled: "true"
    });

    // 7. SYSTEM, CACHE & CDN STORAGE
    Object.assign(obj.entries, {
        cdn_domain_replacements: JSON.stringify({ "firebasestorage.googleapis.com": "cdn.locketcamera.com" }),
        cdn_domain_replacements_video: "true",
        storage_bucket: "gs://locket-img", storage_bucket_video: "gs://locket-video",
        image_cache_max_age_sec: "157680000", image_cache_max_size: "400000000",
        history_cache_age_days: "1000", user_cache_max_age_sec: "691200", friends_cache_max_age_sec: "2592000",
        image_fetch_cache: "true", image_cache_use_shared: "true", use_doc_dir_for_image_cache: "true",
        efficient_history_cache_invalidation: "true", timestamp_based_history_fetches: "true",
        get_latest_moment_v2: "true", fetch_users_from_cloud_function: "true",
        refresh_interval: "60", firestore_refresh_v2: "true", firestore_refresh_v3: "true",
        keychain_access_retries: "true", blocked_users_cached_sync_enabled: "true",
        beta_features_enabled: "true", join_testflight_enabled: "true",
        safety_center: "true", help_center: "true", support_v2: "true",
        privacy_choices_setting: "true", request_att_permission: "true",
        invite_link_preview_variant: "4",
        share_history_config: JSON.stringify({ prompt_enabled: false, fetching_enabled: true }),
        share_history_prompt_enabled: "false", use_thumbnails_for_sharing: "true",
        use_thumbnails_in_timeline: "true", persist_onboarding_step: "true",
        onboarding_contact_permission_step: "true"
    });

    // 8. OVERLAY & CUSTOM CAPTIONS
    Object.assign(obj.entries, {
        overlay_navigator_enabled: "true",
        overlays_v2_config: JSON.stringify({ suggestions_enabled: true }),
        captions_enabled: "true",
        music_caption_enabled: "true",
        music_caption_song_preview_enabled: "true",
        link_caption_link_enabled: "true",
        overlay_dynamic_captions: JSON.stringify([
            "standard", "poll", "color_palette", "review", "music", "location",
            "weather", "time", "streak", "star_sign", "party_time", "locket_count",
            "good_morning", "goodnight", "ootd", "miss_you", "custom",
            "phunu_2010", "halloween_2026"
        ]),
        overlay_items: JSON.stringify([
            {
                section: "🎨 General",
                items: [
                    { overlay_id: "caption:standard", source: "local", caption: { type: "standard" } },
                    { overlay_id: "caption:review", source: "local", caption: { type: "review" } },
                    { overlay_id: "caption:music", source: "local", caption: { type: "music" } },
                    { overlay_id: "caption:location", source: "local", caption: { type: "location" } },
                    { overlay_id: "caption:weather", source: "local", caption: { type: "weather" } },
                    { overlay_id: "caption:time", source: "local", caption: { type: "time" } },
                    { overlay_id: "caption:streak", source: "local", caption: { type: "streak" } },
                    { overlay_id: "caption:star_sign", source: "local", caption: { type: "star_sign" } },
                    { overlay_id: "caption:poll", source: "local", caption: { type: "poll" } },
                    { overlay_id: "caption:color_palette", source: "local", caption: { type: "color_palette" } },
                    { overlay_id: "caption:locket_count", source: "local", caption: { type: "locket_count" } }
                ]
            },
            {
                section: "🦉Mikenco7878",
                items: [
                    { overlay_id: "caption:mkc_mkc7878_01", source: "remote", caption: { background: { colors: ["#F2B8CF", "#E8C8EE", "#D7C9F5"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "Locket 30s vĩnh viễn có mic", text_color: "#69465F", type: "static_content" } },
                    { overlay_id: "caption:mkc_mkc7878_02", source: "remote", caption: { background: { colors: ["#F0B5CB", "#F6D0DF", "#DCCAF0"] }, icon: { data: "🦉", type: "emoji" }, max_lines: 1, text: "LamDien", text_color: "#70445A", type: "static_content" } },
                    { overlay_id: "caption:mkc_mkc7878_03", source: "remote", caption: { background: { colors: ["#F4BFD3", "#F9D9CF", "#DCCDF5"] }, icon: { data: "💗", type: "emoji" }, max_lines: 1, text: "Mikenco7878", text_color: "#70465F", type: "static_content" } }
                ]
            },
            {
                section: "🎨Holiday",
                items: [
                    // 11/11/2026 - Ngày Độc thân
                    { overlay_id: "caption:mkc_h02", source: "remote", end_at: "2026-11-12T00:00:00+07:00", caption: { background: { colors: ["#A18CD1", "#FBC2EB"] }, icon: { data: "💗", type: "emoji" }, max_lines: 1, text: "Quốc tế độc thân =)))", text_color: "#FFFFFF", type: "static_content" } },

                    // 19/11/2026 - Quốc tế Nam giới
                    { overlay_id: "caption:mkc_h04", source: "remote", end_at: "2026-11-20T00:00:00+07:00", caption: { background: { colors: ["#1565C0", "#42A5F5"] }, icon: { data: "👑", type: "emoji" }, max_lines: 1, text: "Mấy fen 19/11 vui vẻ nhó", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_h05", source: "remote", end_at: "2026-11-20T00:00:00+07:00", caption: { background: { colors: ["#1A237E", "#536DFE"] }, icon: { data: "💙", type: "emoji" }, max_lines: 1, text: "Quốc tế Nam giới 19/11 ", text_color: "#FFFFFF", type: "static_content" } },

                    // 20/11/2026 - Nhà giáo Việt Nam
                    { overlay_id: "caption:mkc_h06", source: "remote", end_at: "2026-11-21T00:00:00+07:00", caption: { background: { colors: ["#F06292", "#F8BBD0"] }, icon: { data: "👩‍🏫", type: "emoji" }, max_lines: 1, text: "20/11 của Cô", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_h07", source: "remote", end_at: "2026-11-21T00:00:00+07:00", caption: { background: { colors: ["#7E57C2", "#CE93D8"] }, icon: { data: "👨‍🏫", type: "emoji" }, max_lines: 1, text: "20/11 của Thầy", text_color: "#FFFFFF", type: "static_content" } },

                    // 24/12/2026 - Đêm Giáng sinh
                    { overlay_id: "caption:mkc_h13", source: "remote", end_at: "2026-12-25T00:00:00+07:00", caption: { background: { colors: ["#145A32", "#2ECC71"] }, icon: { data: "🕯️", type: "emoji" }, max_lines: 1, text: "Giáng sinh an lành", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_h14", source: "remote", end_at: "2026-12-25T00:00:00+07:00", caption: { background: { colors: ["#B71C1C", "#EF5350"] }, icon: { data: "🎅", type: "emoji" }, max_lines: 1, text: "hoo-hoo-hooo", text_color: "#FFFFFF", type: "static_content" } },

                    // 25/12/2026 - Giáng sinh
                    { overlay_id: "caption:mkc_h15", source: "remote", end_at: "2026-12-26T00:00:00+07:00", caption: { background: { colors: ["#C62828", "#FF7043"] }, icon: { data: "🎄", type: "emoji" }, max_lines: 1, text: "Merry Chrismas", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_h16", source: "remote", end_at: "2026-12-26T00:00:00+07:00", caption: { background: { colors: ["#00695C", "#26A69A"] }, icon: { data: "💁‍♂️", type: "emoji" }, max_lines: 1, text: "Noel no em", text_color: "#FFFFFF", type: "static_content" } },

                    // 31/12/2026 - Đêm cuối năm
                    { overlay_id: "caption:mkc_h17", source: "remote", end_at: "2027-01-01T00:00:00+07:00", caption: { background: { colors: ["#311B92", "#7C4DFF"] }, icon: { data: "🎆", type: "emoji" }, max_lines: 1, text: "Happy new year", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_h18", source: "remote", end_at: "2027-01-01T00:00:00+07:00", caption: { background: { colors: ["#212121", "#D4AF37"] }, icon: { data: "💕", type: "emoji" }, max_lines: 1, text: "Goodbye 2026", text_color: "#FFFFFF", type: "static_content" } },

                    // 30/01/2027 - Đưa ông Táo
                    { overlay_id: "caption:mkc_h23", source: "remote", end_at: "2027-01-31T00:00:00+07:00", caption: { background: { colors: ["#E65100", "#FFB74D"] }, icon: { data: "🐟", type: "emoji" }, max_lines: 1, text: "Đưa ông Táo về trời", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_h24", source: "remote", end_at: "2027-01-31T00:00:00+07:00", caption: { background: { colors: ["#B71C1C", "#FF8A65"] }, icon: { data: "🧧", type: "emoji" }, max_lines: 1, text: "23/", text_color: "#FFFFFF", type: "static_content" } },

                    // Dọn nhà và chợ hoa Tết
                    { overlay_id: "caption:mkc_h25", source: "remote", end_at: "2027-02-06T00:00:00+07:00", caption: { background: { colors: ["#81C784", "#C8E6C9"] }, icon: { data: "🧹", type: "emoji" }, max_lines: 1, text: "Dọn nhà ăn tết", text_color: "#1B5E20", type: "static_content" } },
                    { overlay_id: "caption:mkc_h26", source: "remote", end_at: "2027-02-06T00:00:00+07:00", caption: { background: { colors: ["#F48FB1", "#FFD54F"] }, icon: { data: "🌼", type: "emoji" }, max_lines: 1, text: "chợ hoa", text_color: "#6D3500", type: "static_content" } },

                    // 05/02/2027 - Rước ông Táo và giao thừa
                    { overlay_id: "caption:mkc_h31", source: "remote", end_at: "2027-02-06T00:00:00+07:00", caption: { background: { colors: ["#BF360C", "#FFAB40"] }, icon: { data: "🏮", type: "emoji" }, max_lines: 1, text: "Rước ông Táo về nhaaa", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_h32", source: "remote", end_at: "2027-02-06T00:00:00+07:00", caption: { background: { colors: ["#B71C1C", "#FFCA28"] }, icon: { data: "🎆", type: "emoji" }, max_lines: 1, text: "Pháo hoa", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_h33", source: "remote", end_at: "2027-02-06T00:00:00+07:00", caption: { background: { colors: ["#4A148C", "#FFD54F"] }, icon: { data: "🙏", type: "emoji" }, max_lines: 1, text: "Năm mới bình an", text_color: "#FFFFFF", type: "static_content" } },

                    // 06/02/2027 - Mùng 1 Tết
                    { overlay_id: "caption:mkc_h34", source: "remote", end_at: "2027-02-07T00:00:00+07:00", caption: { background: { colors: ["#D50000", "#FFC400"] }, icon: { data: "🧧", type: "emoji" }, max_lines: 1, text: "Lì xì", text_color: "#FFFFFF", type: "static_content" } },

                    // 14/02/2027 - Valentine
                    { overlay_id: "caption:mkc_h40", source: "remote", end_at: "2027-02-15T00:00:00+07:00", caption: { background: { colors: ["#E91E63", "#F8BBD0"] }, icon: { data: "💝", type: "emoji" }, max_lines: 1, text: "Happy Valentine", text_color: "#FFFFFF", type: "static_content" } },

                    // 15/02/2027 - Vía Thần Tài
                    { overlay_id: "caption:mkc_h42", source: "remote", end_at: "2027-02-16T00:00:00+07:00", caption: { background: { colors: ["#F9A825", "#FFD700"] }, icon: { data: "💰", type: "emoji" }, max_lines: 1, text: "Vía thần tài", text_color: "#5D3500", type: "static_content" } },

                    // 08/03/2027 - Quốc tế Phụ nữ
                    { overlay_id: "caption:mkc_h47", source: "remote", end_at: "2027-03-09T00:00:00+07:00", caption: { background: { colors: ["#EC407A", "#F8BBD0"] }, icon: { data: "💐", type: "emoji" }, max_lines: 1, text: "8/3 dui dẻ", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_h48", source: "remote", end_at: "2027-03-09T00:00:00+07:00", caption: { background: { colors: ["#AB47BC", "#F48FB1"] }, icon: { data: "🌷", type: "emoji" }, max_lines: 1, text: "chúc mấy pà tất cả trừ vất vả", text_color: "#FFFFFF", type: "static_content" } }
                ]
                .filter(item => Date.now() < Date.parse(item.end_at))
                .sort((a, b) => Date.parse(a.end_at) - Date.parse(b.end_at))
                .map(({ overlay_id, source, caption }) => ({ overlay_id, source, caption }))
            },
            {
                section: "💕LOVE",
                items: [
                    { overlay_id: "caption:mkc_love_01", source: "remote", caption: { background: { colors: ["#F2B8CF", "#E8C8EE", "#D7C9F5"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "nhớ ẻmm", text_color: "#69465F", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_02", source: "remote", caption: { background: { colors: ["#F0B5CB", "#F6D0DF", "#DCCAF0"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "nhớ ảnh", text_color: "#70445A", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_03", source: "remote", caption: { background: { colors: ["#F4BFD3", "#F9D9CF", "#DCCDF5"] }, icon: { data: "💗", type: "emoji" }, max_lines: 1, text: "love you so much", text_color: "#70465F", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_04", source: "remote", caption: { background: { colors: ["#F2B5C8", "#F8D5D9", "#F6E5D2"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "iuu baeee", text_color: "#754454", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_05", source: "remote", caption: { background: { colors: ["#F2AFC6", "#F7C9D9", "#E5CFF4"] }, icon: { data: "💗", type: "emoji" }, max_lines: 1, text: "Yeu Emmm", text_color: "#70445C", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_06", source: "remote", caption: { background: { colors: ["#B8C9F2", "#D5DDF8", "#E8CFF0"] }, icon: { data: "🫶", type: "emoji" }, max_lines: 1, text: "Yeu Anhhh", text_color: "#414C72", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_07", source: "remote", caption: { background: { colors: ["#F3AFC7", "#F8D0D8", "#F4C9BB"] }, icon: { data: "😘", type: "emoji" }, max_lines: 1, text: "hun míng coaiii", text_color: "#754252", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_08", source: "remote", caption: { background: { colors: ["#C4C8EF", "#DED3F4", "#EBCDE4"] }, icon: { data: "💤", type: "emoji" }, max_lines: 1, text: "mê anh hơn mê ngủ", text_color: "#4F4770", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_09", source: "remote", caption: { background: { colors: ["#F4C2D5", "#F9E1E8", "#E9D4F5"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "em bé cần được dỗ", text_color: "#75495F", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_10", source: "remote", caption: { background: { colors: ["#F4BFD0", "#E9C7EF", "#D7D0F4"] }, icon: { data: "😋", type: "emoji" }, max_lines: 1, text: "iu thì nói đói thì anh oii", text_color: "#68465F", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_11", source: "remote", caption: { background: { colors: ["#F1B5CE", "#F8D6E4", "#E8C8F0"] }, icon: { data: "😍", type: "emoji" }, max_lines: 1, text: "Mê rui chứ gi", text_color: "#70445E", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_12", source: "remote", caption: { background: { colors: ["#E9B9CF", "#F5D5DF", "#D8C8F0"] }, icon: { data: "🥹", type: "emoji" }, max_lines: 1, text: "anh có thương em thiệt hong", text_color: "#70465D", type: "static_content" } },
                    { overlay_id: "caption:mkc_love_13", source: "remote", caption: { background: { colors: ["#E91E63", "#F44336"] }, icon: { data: "💕", type: "emoji" }, max_lines: 1, text: "Dating Time!", text_color: "#FFFFFFE6", type: "static_content" } }
                ]
            },
            {
                section: "💅 Gen Z",
                items: [
                    { overlay_id: "caption:mkc_genz_01", source: "remote", caption: { background: { colors: ["#F3C1D4", "#F8DDE5", "#E8CFF0"] }, icon: { data: "💗", type: "emoji" }, max_lines: 1, text: "ngoan xinh iu của ai đây", text_color: "#71465D", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_02", source: "remote", caption: { background: { colors: ["#FC5C7D", "#6A82FB"] }, icon: { data: "💅", type: "emoji" }, max_lines: 1, text: "Vuýpppp", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_03", source: "remote", caption: { background: { colors: ["#C5B5E8", "#DDD0F2", "#F0C9DD"] }, icon: { data: "💃", type: "emoji" }, max_lines: 1, text: "Slayyy", text_color: "#514368", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_04", source: "remote", caption: { background: { colors: ["#F77062", "#FE5196"] }, icon: { data: "💅", type: "emoji" }, max_lines: 1, text: "Xinh gái ấn phím 1", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_05", source: "remote", caption: { background: { colors: ["#F0B5CA", "#F5D2DD", "#EAD1F0"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "xinh là một loại tài năng", text_color: "#70435B", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_06", source: "remote", caption: { background: { colors: ["#FF5722", "#FFC107"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "Bá dô", text_color: "#000000E6", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_08", source: "remote", caption: { background: { colors: ["#A7B9D5", "#C8D4E8", "#DCCCEB"] }, icon: { data: "🤣", type: "emoji" }, max_lines: 1, text: "M nooo", text_color: "#3E4B64", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_09", source: "remote", caption: { background: { colors: ["#8EACCD", "#B5C8DE", "#D7C7E6"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "bá khí ", text_color: "#35475D", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_10", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "🥬", type: "emoji" }, max_lines: 1, text: "oách xà lách", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_11", source: "remote", caption: { background: { colors: ["#FFC107", "#FFA000"] }, icon: { data: "🔥", type: "emoji" }, max_lines: 1, text: "Chan bố m đeee", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_12", source: "remote", caption: { background: { colors: ["#BCC5D6", "#D7DEEA", "#EDE8F5"] }, icon: { data: "🕶️", type: "emoji" }, max_lines: 1, text: "Ra đường nể mỗi anh", text_color: "#384358", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_13", source: "remote", caption: { background: { colors: ["#2980B9", "#2C3E50"] }, icon: { data: "👌", type: "emoji" }, max_lines: 1, text: "Uy tín luonnnnn", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_14", source: "remote", caption: { background: { colors: ["#D4B7D9", "#E8C7D5", "#F1D9D0"] }, icon: { data: "🤞", type: "emoji" }, max_lines: 1, text: "m tưởng m là ai", text_color: "#63435B", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_15", source: "remote", caption: { background: { colors: ["#C6B8D9", "#D9C8D8", "#E8C4C9"] }, icon: { data: "😒", type: "emoji" }, max_lines: 1, text: "cái nết ngộ z má", text_color: "#514052", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_16", source: "remote", caption: { background: { colors: ["#A9A4C8", "#C7A6BE", "#E0B9C3"] }, icon: { data: "😒", type: "emoji" }, max_lines: 1, text: "thấy ghét", text_color: "#493F55", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_17", source: "remote", caption: { background: { colors: ["#B8B6D2", "#D1C4DA", "#E5C5CF"] }, icon: { data: "😒", type: "emoji" }, max_lines: 1, text: "làm cái gì mà khó coi", text_color: "#4D4358", type: "static_content" } },
                    { overlay_id: "caption:mkc_genz_18", source: "remote", caption: { background: { colors: ["#FF4E50", "#F9D423"] }, icon: { data: "👎", type: "emoji" }, max_lines: 1, text: "chê nhaa", text_color: "#FFFFFF", type: "static_content" } }
                ]
            },
            {
                section: "🤡 Meme",
                items: [
                    { overlay_id: "caption:mkc_meme_01", source: "remote", caption: { background: { colors: ["#F7971E", "#FFD200", "#FFEE58"] }, icon: { data: "😂", type: "emoji" }, max_lines: 1, text: "Cười vcl m oi", text_color: "#000000E6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_02", source: "remote", caption: { background: { colors: ["#FFEB3B", "#FF9800"] }, icon: { data: "🫨", type: "emoji" }, max_lines: 1, text: "Ảo thật đếyy", text_color: "#000000E6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_03", source: "remote", caption: { background: { colors: ["#00F2FE", "#4FACFE"] }, icon: { data: "🤡", type: "emoji" }, max_lines: 1, text: "Hàii", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_04", source: "remote", caption: { background: { colors: ["#A8C3A0", "#DCE5D1"] }, icon: { data: "🍂", type: "emoji" }, max_lines: 1, text: "côn viên lá làn", text_color: "#344536", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_05", source: "remote", caption: { background: { colors: ["#F3C6D8", "#F8E1E8", "#E7B8D0"] }, icon: { data: "🪳", type: "emoji" }, max_lines: 1, text: "Gián đáng iu hong🎀", text_color: "#704458", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_06", source: "remote", caption: { background: { colors: ["#E9B8C8", "#F6D4C8", "#D9C9EF"] }, icon: { data: "🙀", type: "emoji" }, max_lines: 1, text: "Nấu xói", text_color: "#62445C", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_07", source: "remote", caption: { background: { colors: ["#F1C0D2", "#F5D9E1", "#E7D1F2"] }, icon: { data: "😯", type: "emoji" }, max_lines: 1, text: "Bà nói thiệt hả bà Thơ", text_color: "#70475C", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_08", source: "remote", caption: { background: { colors: ["#FF512F", "#F09819", "#FFD200"] }, icon: { data: "🚨", type: "emoji" }, max_lines: 1, text: "Có biến có biến", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_09", source: "remote", caption: { background: { colors: ["#F5B8A9", "#F6D0B2", "#E8BFCB"] }, icon: { data: "🙂", type: "emoji" }, max_lines: 1, text: "sơ hở là báo", text_color: "#713F40", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_10", source: "remote", caption: { background: { colors: ["#F0B5B5", "#F2D0C4", "#E4C5DB"] }, icon: { data: "🚨", type: "emoji" }, max_lines: 1, text: "bớt báo giùm cái", text_color: "#693F4B", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_11", source: "remote", caption: { background: { colors: ["#B71C1C", "#FF5722"] }, icon: { data: "🏃", type: "emoji" }, max_lines: 1, text: "ai sợ thì đi về", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_12", source: "remote", caption: { background: { colors: ["#D7CCC8", "#EFEBE9", "#F5F5F0"] }, icon: { data: "🙏🥺", type: "emoji" }, max_lines: 1, text: "Đi chùa không biết lạy ai", text_color: "#5D4037", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_13", source: "remote", caption: { background: { colors: ["#E53935", "#FF7043"] }, icon: { data: "🥊", type: "emoji" }, max_lines: 1, text: "Chan bố m đê", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_14", source: "remote", caption: { background: { colors: ["#D8B4E2", "#F8BBD0"] }, icon: { data: "🪷", type: "emoji" }, max_lines: 1, text: "Mong tôn hoa sen thấy cảnh này", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_15", source: "remote", caption: { background: { colors: ["#263238", "#455A64"] }, icon: { data: "🛞", type: "emoji" }, max_lines: 1, text: "Lốp dự phòng", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_16", source: "remote", caption: { background: { colors: ["#FFF59D", "#80DEEA"] }, icon: { data: "😒", type: "emoji" }, max_lines: 1, text: "Tém tém lại đi má", text_color: "#000000E6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_17", source: "remote", caption: { background: { colors: ["#FFB74D", "#F8BBD0"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "Mắc cỡ quá hai ơi", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_18", source: "remote", caption: { background: { colors: ["#607D8B", "#37474F"] }, icon: { data: "😔", type: "emoji" }, max_lines: 1, text: "Thân chưa mà dỡn", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_19", source: "remote", caption: { background: { colors: ["#C5C9E8", "#DFD1F0", "#F0D1DB"] }, icon: { data: "🤨", type: "emoji" }, max_lines: 1, text: "ủa rồi ai mượn?", text_color: "#49435E", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_20", source: "remote", caption: { background: { colors: ["#D1C8E5", "#E8D4DF", "#E8D7BC"] }, icon: { data: "😌", type: "emoji" }, max_lines: 1, text: "sống sao cho vừa lòng thiên hạ? thôi khỏi", text_color: "#51465E", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_21", source: "remote", caption: { background: { colors: ["#9C27B0", "#7B1FA2"] }, icon: { data: "🎁", type: "emoji" }, max_lines: 1, text: "Bóc trúng sít rịt", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_22", source: "remote", caption: { background: { colors: ["#00BCD4", "#0097A7"] }, icon: { data: "😅", type: "emoji" }, max_lines: 1, text: "Hên lắm mới xui được vậy á", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_23", source: "remote", caption: { background: { colors: ["#4CAF50", "#00BCD4"] }, icon: { data: "🎮", type: "emoji" }, max_lines: 1, text: "Giảm sức mạnh con tướng", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_24", source: "remote", caption: { background: { colors: ["#FF0844", "#FFB199"] }, icon: { data: "🙈", type: "emoji" }, max_lines: 1, text: "Phụ huynh đừng xem", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_25", source: "remote", caption: { background: { colors: ["#232526", "#414345"] }, icon: { data: "🕯️", type: "emoji" }, max_lines: 1, text: "Xin vĩnh biệt cụ", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_26", source: "remote", caption: { background: { colors: ["#FF6B6B", "#FF8E53", "#FFD166"] }, icon: { data: "🤬", type: "emoji" }, max_lines: 1, text: "cái đéo má ??", text_color: "#542323", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_27", source: "remote", caption: { background: { colors: ["#1F1C2C", "#928DAB", "#C9D6FF"] }, icon: { data: "😳", type: "emoji" }, max_lines: 1, text: "vl m ơi?", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_28", source: "remote", caption: { background: { colors: ["#C9CBE8", "#E2D9F3", "#F5E9F7"] }, icon: { data: "🐱", type: "emoji" }, max_lines: 1, text: "Ủa alo❓", text_color: "#463E5E", type: "static_content" } },
                    { overlay_id: "caption:mkc_meme_29", source: "remote", caption: { background: { colors: ["#B8D8E8", "#D8C9F0", "#F3D2DF"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "Ủa alo, gì dạ?", text_color: "#39485E", type: "static_content" } }
                ]
            },
            {
                section: "🫠 Saddd",
                items: [
                    { overlay_id: "caption:mkc_sad_01", source: "remote", caption: { background: { colors: ["#636363", "#A2AB58"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "Bất ổn thật sự", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_02", source: "remote", caption: { background: { colors: ["#B8C9E8", "#D5D5F0", "#E9CDE0"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "hết cứuuu", text_color: "#454660", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_03", source: "remote", caption: { background: { colors: ["#F2B5A7", "#F6D1B5", "#E9C2D5"] }, icon: { data: "💀", type: "emoji" }, max_lines: 1, text: "tới công chuyện nữa rồi", text_color: "#634044", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_04", source: "remote", caption: { background: { colors: ["#F44336", "#B71C1C"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "Toang luônnn", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_05", source: "remote", caption: { background: { colors: ["#F3B6AF", "#F6D2C2", "#EAC8D9"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "gòi xong lun á", text_color: "#6A4549", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_06", source: "remote", caption: { background: { colors: ["#C0B7E5", "#D8D0F0", "#EACDE2"] }, icon: { data: "😵", type: "emoji" }, max_lines: 1, text: "xĩu lên xĩu xuống", text_color: "#504567", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_07", source: "remote", caption: { background: { colors: ["#2C3E50", "#3498DB"] }, icon: { data: "🏳️", type: "emoji" }, max_lines: 1, text: "Bất lực", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_08", source: "remote", caption: { background: { colors: ["#1CB5E0", "#000046"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "Rớt nước mắt", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_09", source: "remote", caption: { background: { colors: ["#2C3E50", "#4CA1AF"] }, icon: { data: "🤯", type: "emoji" }, max_lines: 1, text: "Overthinking vaichuong", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_10", source: "remote", caption: { background: { colors: ["#1F1C2C", "#928DAB"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "Trầm cảm nhẹ", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_11", source: "remote", caption: { background: { colors: ["#C5C8D8", "#D9CBDD", "#E7C9CE"] }, icon: { data: "🙂", type: "emoji" }, max_lines: 1, text: "miệng cười nhưng lòng thì không", text_color: "#4F4B5B", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_12", source: "remote", caption: { background: { colors: ["#141E30", "#243B55"] }, icon: { data: "🥀", type: "emoji" }, max_lines: 1, text: "hôm nay tui buồn", text_color: "#FFFFFF", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_13", source: "remote", caption: { background: { colors: ["#F3C7D9", "#F6D9D0", "#E5CFF0"] }, icon: { data: "🥹", type: "emoji" }, max_lines: 1, text: "tui là nạn nhân", text_color: "#70495D", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_14", source: "remote", caption: { background: { colors: ["#F0B6B6", "#F5D0C3", "#E8C6DE"] }, icon: { data: "🆘", type: "emoji" }, max_lines: 1, text: "cứu tui cứu tuiii", text_color: "#6A4248", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_15", source: "remote", caption: { background: { colors: ["#AFC6D8", "#C8D5E2", "#E0D1DE"] }, icon: { data: "🌧️", type: "emoji" }, max_lines: 1, text: "chắc tại mình không đủ tốt", text_color: "#455467", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_16", source: "remote", caption: { background: { colors: ["#C5B8D8", "#D8C8DF", "#E7CBD2"] }, icon: { data: "🥀", type: "emoji" }, max_lines: 1, text: "một chút hy vọng, một đống thất vọng", text_color: "#52445B", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_17", source: "remote", caption: { background: { colors: ["#B9B9D9", "#D2CBE5", "#E8D2E0"] }, icon: { data: "💭", type: "emoji" }, max_lines: 1, text: "hết duyên hay hết thương?", text_color: "#4E4968", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_18", source: "remote", caption: { background: { colors: ["#D7C1E8", "#E9D6EF", "#F2C9D5"] }, icon: { data: "🥲", type: "emoji" }, max_lines: 1, text: "em hong có dỗi, em chỉ buồn", text_color: "#624966", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_19", source: "remote", caption: { background: { colors: ["#F6D365", "#FDA085"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "Xin lũi được chưa", text_color: "#000000", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_20", source: "remote", caption: { background: { colors: ["#F0C5D6", "#F4D8E2", "#DED0F0"] }, icon: { data: "🥲", type: "emoji" }, max_lines: 1, text: "bíc gòi khổ lém", text_color: "#704A60", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_21", source: "remote", caption: { background: { colors: ["#F3B9D0", "#F8D9E5", "#E8D0F2"] }, icon: { data: "🥹", type: "emoji" }, max_lines: 1, text: "hong bé ơi", text_color: "#70465E", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_22", source: "remote", caption: { background: { colors: ["#C4B9E6", "#DDD0F1", "#EBD1E4"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "khum có bíc nữa", text_color: "#514766", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_23", source: "remote", caption: { background: { colors: ["#C0B9D9", "#D8C9E3", "#E9CDD6"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "nói chuyện nghe mắc mệt", text_color: "#50445D", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_24", source: "remote", caption: { background: { colors: ["#B9B5D6", "#D4C7E2", "#E6C9D4"] }, icon: { data: "🙄", type: "emoji" }, max_lines: 1, text: "đúng là hết nói nổi", text_color: "#4B435C", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_25", source: "remote", caption: { background: { colors: ["#C4D9CB", "#E5E6D0", "#F3D9C5"] }, icon: { data: "🙈", type: "emoji" }, max_lines: 1, text: "không biết, không thấy, không nghe", text_color: "#425348", type: "static_content" } },
                    { overlay_id: "caption:mkc_sad_26", source: "remote", caption: { background: { colors: ["#B9AFD5", "#D5BED4", "#E8C5CE"] }, icon: { data: "🤫", type: "emoji" }, max_lines: 1, text: "nói ít thôi", text_color: "#4E4058", type: "static_content" } }
                ]
            }
        ])
    });
}

$done({ body: JSON.stringify(obj) });
