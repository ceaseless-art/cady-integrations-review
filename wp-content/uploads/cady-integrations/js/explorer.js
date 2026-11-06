/* Cady Integration Explorer: behavior. No need to edit. */
(function () {
  /* where this script was loaded from, so logo files like "logos/salesforce.svg" resolve next to it */
  var SCRIPT_BASE = (function () {
    var c = document.currentScript;
    return c && c.src ? c.src.replace(/[^\/]*$/, "").replace(/js\/$/, "") : "";
  })();
  function init() {
  var D = window.CADY_IX_DATA;
  var LOGOS = window.CADY_IX_LOGOS || {};
  var root = document.getElementById("cady-ix");
  if (!D || !root || root.getAttribute("data-ready")) return;
  root.setAttribute("data-ready", "1");
  var TYPES = [
    { id: "native", label: "Works directly", css: "t-native", short: "Connects straight to your phone system.",
      text: "Your phone system connects to this app directly, with nothing extra in between. Cady turns it on and sets it up. Some apps need a specific plan or carry a fee, and we'll tell you up front." },
    { id: "middleware", label: "Works with an add-on", css: "t-middleware", short: "Needs a small connector app in between.",
      text: "It connects through a separate connector app that sits between your phone system and this software. Cady sets it up and tells you about any extra cost first." },
    { id: "custom", label: "Custom setup", css: "t-custom", short: "Can be connected with custom work.",
      text: "It can be connected, but it takes custom work. Cady plans it with you and quotes it before anything is built." },
    { id: "ask", label: "Ask us", css: "t-ask", short: "Not confirmed yet. We'll check for free.",
      text: "We haven't confirmed this one yet. Book a call and we'll find out for you, free of charge." }
  ];
  var TYPE_BY_ID = {};
  TYPES.forEach(function (t) { TYPE_BY_ID[t.id] = t; });
  function typeId(v) {
    v = String(v || "").toLowerCase().replace(/[^a-z]/g, "");
    if (v === "direct" || v === "worksdirectly" || v === "builtin" || v === "native") return "native";
    if (v === "addon" || v === "workswithanaddon" || v === "middleware") return "middleware";
    if (v === "custom" || v === "customsetup" || v === "customapi") return "custom";
    return "ask";
  }
  function slug(n) { return String(n).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  var S = D.settings || {};
  var systems = (D.systems || []).filter(function (s) { return s.status !== "hidden"; });
  var sysById = {};
  systems.forEach(function (s) { sysById[s.id] = s; });
  var cats = (D.categories || []).slice();
  var inds = (D.industries || []).slice();
  var apps = (D.integrations || []).map(function (it, i) {
    var sys = {};
    Object.keys(it.systems || {}).forEach(function (k) { sys[k] = typeId(it.systems[k]); });
    var cat = cats.indexOf(it.category) > -1 ? it.category : "Other";
    return {
      i: i, name: String(it.name || ""), slug: slug(it.name || ""), category: cat, systems: sys, desc: it.desc || "", note: it.note || "",
      industries: it.industries || [], featured: !!it.featured, intl: !!it.international, logo: it.logo || "", details: it.details || {},
      hay: [it.name, it.aka, cat, (it.industries || []).join(" "), it.desc].join(" ").toLowerCase()
    };
  });
  var appBySlug = {};
  apps.forEach(function (a) { appBySlug[a.slug] = a; });
  /* ----- page settings: URL > container attributes > window.CADY_IX > defaults ----- */
  var params = {};
  try { new URLSearchParams(location.search).forEach(function (v, k) { params[k] = v; }); } catch (e) {}
  var W = window.CADY_IX || {};
  var startSys = String(params["ix-system"] || root.getAttribute("data-system") || W.system || S.defaultSystem || "all").toLowerCase();
  if (!sysById[startSys]) startSys = "all";
  var startApp = slug(params["ix-app"] || W.app || "");
  if (!appBySlug[startApp]) startApp = "";
  var startInd = params["ix-industry"] || W.industry || "";
  if (/^(1|true|yes)$/i.test(String(root.getAttribute("data-compact") || W.compact || ""))) root.classList.add("is-compact");
  var state = { q: params["ix-q"] || "", cat: "", ind: inds.indexOf(startInd) > -1 ? startInd : "", type: "", sort: "az", intl: !S.hideInternational };
  /* ----- links ----- */
  var framed = window.self !== window.top;
  var tgt = framed ? ' target="_top"' : "";
  var contactUrl = S.contactUrl || "https://cadybt.com/contact-us/";
  /* no booking link yet: the buttons stay as placeholders (a harmless in-page anchor) */
  var bookUrl = S.bookingUrl || "#book-a-call";
  var bookAttr = S.bookingUrl ? ' target="_blank" rel="noopener"' : "";
  var phone = S.phone || "800-347-3886";
  var tel = "tel:" + phone.replace(/[^0-9+]/g, "");
  root.querySelectorAll('[data-href="book"]').forEach(function (a) { a.href = bookUrl; if (S.bookingUrl) { a.target = "_blank"; a.rel = "noopener"; } });
  root.querySelectorAll('[data-href="phone"]').forEach(function (a) { a.href = tel; a.textContent = "or call " + phone; if (framed) a.target = "_top"; });
  /* ----- helpers ----- */
  function $(sel) { return root.querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function initials(name) {
    var w = name.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/);
    var s = w.length > 1 ? w[0][0] + w[1][0] : (w[0] || "?").slice(0, 2);
    return s.toUpperCase();
  }
  var assetBase = (D.settings && D.settings.assetBase) || SCRIPT_BASE;
  function asset(u) { return !u || /^(https?:|data:|\/)/.test(u) ? u : assetBase + u; }
  function logo(v, name, cls) {
    var src = asset(LOGOS[v]) || (/^(https?:|data:|\/)/.test(v) ? v : "");
    cls = "ix-logo" + (cls ? " " + cls : "");
    return src
      ? '<span class="' + cls + '"><img src="' + esc(src) + '" alt="" loading="lazy"></span>'
      : '<span class="' + cls + ' is-text" aria-hidden="true">' + esc(initials(name)) + "</span>";
  }
  function sysLogo(s, cls) { return logo(s.logo || "", s.name, "is-sys" + (cls ? " " + cls : "")); }
  function badge(t, label) {
    var T = TYPE_BY_ID[t] || TYPE_BY_ID.ask;
    return '<span class="ix-badge ' + (label ? "t-soon" : T.css) + '">' + esc(label || T.label) + "</span>";
  }
  function relation(a, s) { return a.systems[s.id] || (s.status === "coming-soon" ? "soon" : "ask"); }
  function relBadge(r, soonLabel) { return r === "soon" ? badge("ask", soonLabel || "Coming soon") : badge(r); }
  function liveSystems() { return systems.filter(function (s) { return s.status === "live"; }); }
  function sysCount(s) { return apps.filter(function (a) { return a.systems[s.id] && (state.intl || !a.intl); }).length; }
  function previewing(sysId) {
    var s = sysById[sysId];
    return !!s && s.status === "coming-soon" && !apps.some(function (a) { return a.systems[s.id]; });
  }
  /* ----- routes: each app and each pair has its own link -----
       #/                    step 1, choose a phone system
       #/apps  or  #/wildix  step 2, choose an app (any system, or one)
       #/apps/salesforce     app page
       #/wildix/salesforce   pair page                                   */
  function parse(hash) {
    if (!/^#\//.test(hash || "")) return null;
    var p = hash.slice(2).split("/").filter(Boolean).map(decodeURIComponent);
    if (!p.length) return { view: "systems" };
    if (p[0] === "apps") return p[1] && appBySlug[p[1]] ? { view: "app", app: p[1] } : { view: "apps", sys: "all" };
    if (sysById[p[0]]) return p[1] && appBySlug[p[1]] ? { view: "pair", sys: p[0], app: p[1] } : { view: "apps", sys: p[0] };
    return { view: "systems" };
  }
  function href(r) {
    if (r.view === "systems") return "#/";
    if (r.view === "apps") return sysById[r.sys] ? "#/" + r.sys : "#/apps";
    if (r.view === "app") return "#/apps/" + r.app;
    return "#/" + r.sys + "/" + r.app;
  }
  function fromSettings() {
    if (startApp && sysById[startSys]) return { view: "pair", sys: startSys, app: startApp };
    if (startApp) return { view: "app", app: startApp };
    if (sysById[startSys]) return { view: "apps", sys: startSys };
    if (state.ind || state.q) return { view: "apps", sys: "all" };
    return { view: "systems" };
  }
  function setRoute(r) {
    route = r;
    /* an international app opened from a link should still show its related apps */
    if (r.app && appBySlug[r.app].intl) state.intl = true;
  }
  var route;
  setRoute(parse(location.hash) || fromSettings());
  function go(r) {
    setRoute(r);
    try { history.replaceState(null, "", href(r)); } catch (e) {}
    render(false);
  }
  window.addEventListener("hashchange", function () {
    var r = parse(location.hash);
    if (!r && location.hash) return; /* some other anchor on the page, e.g. #explorer */
    setRoute(r || fromSettings());
    render(true);
  });
  function appHref(a, sysId) { return sysById[sysId] ? "#/" + sysId + "/" + a.slug : "#/apps/" + a.slug; }
  /* ----- step bar ----- */
  function renderSteps() {
    var sys = sysById[route.sys], app = route.app ? appBySlug[route.app] : null;
    var v = route.view;
    var cur = v === "systems" || v === "app" ? 1 : v === "apps" ? 2 : 3;
    var steps = [
      { n: 1, k: "Phone system", val: sys ? sys.name : (v === "apps" ? "All systems" : "Pick one"), done: !!sys, href: "#/",
        clear: sys ? (app ? "#/apps/" + app.slug : "#/apps") : "", clearLabel: "Clear phone system" },
      { n: 2, k: "App", val: app ? app.name : "Pick one", done: !!app, href: sys ? "#/" + sys.id : "#/apps",
        clear: app ? (sys ? "#/" + sys.id : "#/apps") : "", clearLabel: "Clear app" },
      { n: 3, k: "How they work together", val: sys && app ? sys.name + " + " + app.name : "See the result", done: false, href: sys && app ? href({ view: "pair", sys: sys.id, app: app.slug }) : "" }
    ];
    $(".ix-steps").innerHTML = steps.map(function (s) {
      var isCur = s.n === cur, isDone = s.done && !isCur;
      var cls = "ix-step" + (isCur ? " is-current" : "") + (isDone ? " is-done" : "") + (!s.done && !isCur ? " is-off" : "");
      var inner = '<span class="ix-step-n" aria-hidden="true">' + (isDone ? "&#10003;" : s.n) + '</span><span class="ix-step-t"><span class="ix-step-k">Step ' + s.n + '<span class="ix-step-kl"> &middot; ' + esc(s.k) + '</span></span><span class="ix-step-v">' + esc(s.val) + "</span></span>";
      var aria = isCur ? ' aria-current="step"' : "";
      var x = s.clear ? '<a class="ix-step-x" href="' + s.clear + '" aria-label="' + s.clearLabel + '" title="' + s.clearLabel + '">&times;</a>' : "";
      return '<li class="' + cls + (x ? " has-x" : "") + '">' + (s.href ? '<a href="' + s.href + '"' + aria + ">" + inner + "</a>" : "<span" + aria + ">" + inner + "</span>") + x + "</li>";
    }).join("");
  }
  /* ----- step 1 ----- */
  function viewSystems() {
    var cards = systems.map(function (s) {
      var n = sysCount(s);
      var meta = s.status === "coming-soon" && !n ? "Coming soon" : n + " integrations";
      return '<a class="ix-syscard" href="#/' + esc(s.id) + '"><span class="ix-syscard-top">' + sysLogo(s, "is-lg") +
        '<span><span class="ix-syscard-name">' + esc(s.name) + '</span><span class="ix-syscard-meta">' + esc(meta) + "</span></span></span>" +
        (s.blurb ? '<span class="ix-syscard-blurb">' + esc(s.blurb) + "</span>" : "") +
        '<span class="ix-syscard-go">Choose ' + esc(s.name) + " &rarr;</span></a>";
    }).join("");
    cards += '<a class="ix-syscard is-unsure" href="#/apps"><span class="ix-syscard-top"><span class="ix-logo is-lg is-text" aria-hidden="true">?</span>' +
      '<span><span class="ix-syscard-name">Not sure yet</span><span class="ix-syscard-meta">Still choosing a phone system</span></span></span>' +
      '<span class="ix-syscard-blurb">Browse every app and see which phone systems support it.</span><span class="ix-syscard-go">Browse all apps &rarr;</span></a>';
    return '<div class="ix-vh"><p class="ix-kicker">Step 1 of 3</p><h3 class="ix-h" tabindex="-1">Which phone system do you use, or plan to?</h3>' +
      '<p class="ix-sub">Or search for an app above to start from your software.</p></div><div class="ix-syscards">' + cards + "</div>";
  }
  /* ----- step 2 ----- */
  function pool(sysId) {
    var preview = previewing(sysId);
    return apps.filter(function (a) {
      if (!state.intl && a.intl) return false;
      if (!sysById[sysId] || preview) return systems.some(function (s) { return a.systems[s.id]; });
      return !!a.systems[sysId];
    });
  }
  function scope(sysId) { return sysById[sysId] ? [sysById[sysId]] : liveSystems(); }
  function typesOf(a, sysId) { return scope(sysId).map(function (s) { return a.systems[s.id]; }).filter(Boolean); }
  function matchQ(a, q) { return !q || a.hay.indexOf(q) > -1; }
  function passes(a, q, sysId, skip) {
    return matchQ(a, q) &&
      (skip === "cat" || !state.cat || a.category === state.cat) &&
      (skip === "ind" || !state.ind || !a.industries.length || a.industries.indexOf(state.ind) > -1) &&
      (skip === "type" || !state.type || typesOf(a, sysId).indexOf(state.type) > -1);
  }
  function score(a, q) {
    var n = a.name.toLowerCase();
    if (q) {
      if (n === q) return -3;
      if (n.indexOf(q) === 0) return -2;
      if (n.indexOf(q) > -1) return -1;
    }
    return 0;
  }
  function order(x, y) {
    if (state.sort === "featured") return (y.featured - x.featured) || x.name.localeCompare(y.name);
    return state.sort === "za" ? y.name.localeCompare(x.name) : x.name.localeCompare(y.name);
  }
  function select(key, label, allLabel, list, current, countFn) {
    var opts = '<option value="">' + esc(allLabel) + "</option>", shownText = allLabel, count = 1;
    list.forEach(function (o) {
      var n = countFn(o.value);
      if (!n && current !== o.value) return;
      count++;
      if (current === o.value) shownText = o.label + " (" + n + ")";
      opts += '<option value="' + esc(o.value) + '"' + (current === o.value ? " selected" : "") + ">" + esc(o.label) + " (" + n + ")</option>";
    });
    if (count < 2) return "";
    return '<label class="ix-select' + (current ? " is-set" : "") + '"><span class="ix-sr">' + esc(label) + '</span><span class="ix-sel-text" aria-hidden="true">' + esc(shownText) + '</span><select data-filter="' + key + '">' + opts + "</select></label>";
  }
  function sortMenu() {
    var opts = [["az", "Sort: A to Z"], ["za", "Sort: Z to A"], ["featured", "Sort: Best-known first"]];
    var cur = opts.filter(function (o) { return o[0] === state.sort; })[0] || opts[0];
    return '<label class="ix-select ix-sort"><span class="ix-sr">Sort</span><span class="ix-sel-text" aria-hidden="true">' + cur[1] + '</span><select data-filter="sort">' +
      opts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === cur[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select></label>";
  }
  function tile(a, sysId) {
    var foot = scope(sysId).map(function (s) {
      var t = a.systems[s.id];
      if (!t) return s.status === "coming-soon" && sysById[sysId] ? badge("ask", "Coming soon") : "";
      return (sysById[sysId] ? "" : '<span class="ix-on">' + esc(s.name) + "</span>") + badge(t);
    }).join("");
    return '<li><a class="ix-tile" href="' + appHref(a, sysId) + '">' + logo(a.logo, a.name) +
      '<span><span class="ix-name">' + esc(a.name) + '</span><span class="ix-cat">' + esc(a.category) + "</span></span>" +
      '<span class="ix-tile-foot">' + foot + "</span></a></li>";
  }
  function grid(list, sysId) { return '<ul class="ix-grid">' + list.map(function (a) { return tile(a, sysId); }).join("") + "</ul>"; }
  function viewApps() {
    var sysId = route.sys, sys = sysById[sysId], preview = previewing(sysId);
    var q = state.q.trim().toLowerCase();
    var list = pool(sysId);
    var shown = list.filter(function (a) { return passes(a, q, sysId); })
      .sort(function (x, y) { return score(x, q) - score(y, q) || order(x, y); });
    var present = TYPES.filter(function (t) { return list.some(function (a) { return typesOf(a, sysId).indexOf(t.id) > -1; }); });
    var filters =
      select("cat", "Category", "All categories", cats.map(function (c) { return { value: c, label: c }; }), state.cat, function (c) { return list.filter(function (a) { return passes(a, q, sysId, "cat") && a.category === c; }).length; }) +
      select("ind", "Industry", "All industries", inds.map(function (c) { return { value: c, label: c }; }), state.ind, function (c) { return list.filter(function (a) { return passes(a, q, sysId, "ind") && a.industries.indexOf(c) > -1; }).length; }) +
      sortMenu() +
      select("type", "Connection type", "Any connection", present.map(function (t) { return { value: t.id, label: t.label }; }), state.type, function (t) { return list.filter(function (a) { return passes(a, q, sysId, "type") && typesOf(a, sysId).indexOf(t) > -1; }).length; });
    var html = '<div class="ix-vh"><a class="ix-link ix-back" href="#/">&larr; Change phone system</a><p class="ix-kicker">Step 2 of 3</p>' +
      '<h3 class="ix-h" tabindex="-1">' + (sys && !preview ? "Pick an app that works with " + esc(sys.name) : "Pick your app") + "</h3>" +
      '<p class="ix-sub">' + (sys && !preview ? "Then see exactly how it connects." : "Then choose your phone system to see how they work together.") + "</p></div>";
    if (preview) {
      html += '<div class="ix-soon"><div><h3>' + esc(sys.name) + " integrations are coming soon</h3><p>" + esc(sys.blurb || "") +
        " Pick any app below and we'll tell you how it works with " + esc(sys.name) + '.</p></div><a class="ix-btn-line" href="' + esc(bookUrl) + '"' + bookAttr + ">Ask about " + esc(sys.name) + "</a></div>";
    }
    html += '<div class="ix-toolbar"><div class="ix-filters">' + filters + "</div></div>";
    if (!preview) html += '<ul class="ix-legend" aria-label="Connection types">' + TYPES.map(function (t) { return "<li>" + badge(t.id) + "<span>" + esc(t.short) + "</span></li>"; }).join("") + "</ul>";
    html += '<div class="ix-search-slot"></div><p class="ix-status" aria-live="polite">Showing <strong>' + shown.length + "</strong> of " + list.length + (preview || !sys ? " apps" : " integrations for " + esc(sys.name)) +
      (q ? " matching &ldquo;" + esc(state.q.trim()) + "&rdquo;" : "") + "</p>";
    if (!shown.length) {
      var hiddenIntl = !state.intl && q && apps.some(function (a) { return a.intl && matchQ(a, q); });
      html += '<div class="ix-empty"><h3>' + (q ? "No match for &ldquo;" + esc(state.q.trim()) + "&rdquo; yet" : "Nothing matches those filters") + "</h3><p>" +
        (hiddenIntl ? "There's a match among the international listings. Turn them on below, or " : "That doesn't mean it can't connect. ") +
        '<a class="ix-link" href="' + esc(bookUrl) + '"' + bookAttr + ">book a call</a> and we'll check for you.</p></div>";
    } else if (state.ind) {
      var made = shown.filter(function (a) { return a.industries.length; });
      var general = shown.filter(function (a) { return !a.industries.length; });
      html += (made.length ? '<div class="ix-group"><h4 class="ix-group-title">Made for ' + esc(state.ind) + "</h4>" + grid(made, sysId) + "</div>" : "") +
        (general.length ? '<div class="ix-group"><h4 class="ix-group-title">Works for any business</h4>' + grid(general, sysId) + "</div>" : "");
    } else {
      html += grid(shown, sysId);
    }
    var intlCount = apps.filter(function (a) { return a.intl && (!sys || preview || a.systems[sysId]); }).length;
    if (intlCount) html += '<label class="ix-toggle"><input type="checkbox" class="ix-intl-box"' + (state.intl ? " checked" : "") + "> <span>Include international listings (" + intlCount + "), mostly products sold in Europe</span></label>";
    return html;
  }
  /* ----- sub pages ----- */
  function crumbs(items) {
    return '<nav class="ix-crumbs" aria-label="Breadcrumb">' + items.map(function (it, i) {
      return (i ? '<span class="ix-sep" aria-hidden="true">/</span>' : "") + (it[1] ? '<a href="' + it[1] + '">' + esc(it[0]) + "</a>" : '<span aria-current="page">' + esc(it[0]) + "</span>");
    }).join("") + "</nav>";
  }
  function related(a, sysId, title) {
    var onSys = sysById[sysId] && !previewing(sysId);
    var list = apps.filter(function (b) {
      return b !== a && b.category === a.category && (state.intl || !b.intl) && (onSys ? b.systems[sysId] : systems.some(function (s) { return b.systems[s.id]; }));
    }).sort(function (x, y) { return (y.featured - x.featured) || x.name.localeCompare(y.name); }).slice(0, 4);
    if (!list.length) return "";
    return '<div class="ix-related"><h4 class="ix-section-title">' + esc(title) + "</h4>" + grid(list, onSys ? sysId : "all") + "</div>";
  }
  function bookBtn(label) { return '<a class="ix-btn" href="' + esc(bookUrl) + '"' + bookAttr + ">" + esc(label) + "</a>"; }
  function phoneLink() { return '<a class="ix-phone" href="' + tel + '"' + tgt + ">or call " + esc(phone) + "</a>"; }
  function viewApp(a) {
    var cards = systems.map(function (s) {
      var r = relation(a, s);
      var line = r === "soon" ? "We're adding " + s.name + " integrations now. Ask us how it would connect." :
        r === "ask" && s.apiNote ? "Not confirmed yet. " + s.name + " has open connection tools, so a custom setup may be possible." : (TYPE_BY_ID[r] || TYPE_BY_ID.ask).short;
      return '<a class="ix-workcard" href="#/' + esc(s.id) + "/" + a.slug + '"><span class="ix-workcard-top">' + sysLogo(s) +
        '<span class="ix-workcard-name">' + esc(s.name) + "</span></span>" + relBadge(r) + "<p>" + esc(line) + "</p>" +
        '<span class="ix-workcard-go">' + (r === "soon" || r === "ask" ? "Ask about " : "See ") + esc(s.name) + " + " + esc(a.name) + " &rarr;</span></a>";
    }).join("");
    return crumbs([["Integrations", "#/"], ["All apps", "#/apps"], [a.name, ""]]) +
      '<div class="ix-panel"><div class="ix-apphead"><span class="ix-frame">' + logo(a.logo, a.name, "is-xl") + "</span><div>" +
      '<p class="ix-kicker">' + esc(a.category) + '</p><h3 class="ix-h" tabindex="-1">' + esc(a.name) + "</h3>" +
      '<p class="ix-apphead-desc">' + esc(a.desc) + "</p>" +
      (a.industries.length ? '<div class="ix-chips">' + a.industries.map(function (x) { return '<span class="ix-chip">' + esc(x) + "</span>"; }).join("") + "</div>" : "") +
      "</div></div>" +
      '<h4 class="ix-section-title">Step 1 &middot; Choose your phone system</h4><div class="ix-works">' + cards + "</div>" +
      '<div class="ix-actions" style="margin-top:26px">' + bookBtn("Book a call about " + a.name) + phoneLink() + "</div></div>" +
      related(a, "all", "More " + a.category + " apps");
  }
  function viewPair(a, sys) {
    var rel = relation(a, sys);
    var det = a.details[sys.id] || {};
    var gets = det.gets || [], needs = det.needs || [];
    var html = crumbs([["Integrations", "#/"], [sys.name, "#/" + sys.id], [a.name, "#/apps/" + a.slug], [sys.name + " + " + a.name, ""]]) +
      '<div class="ix-panel"><div class="ix-pair-visual"><div class="ix-pair-side"><span class="ix-frame">' + sysLogo(sys, "is-xl") + '</span><span class="ix-pair-name">' + esc(sys.name) + "</span></div>" +
      '<div class="ix-pair-link"><span class="ix-dots"></span>' + relBadge(rel) + '<span class="ix-dots"></span></div>' +
      '<div class="ix-pair-side"><span class="ix-frame">' + logo(a.logo, a.name, "is-xl") + '</span><span class="ix-pair-name">' + esc(a.name) + "</span></div></div>" +
      '<p class="ix-kicker ix-center">Step 3 of 3</p>' +
      '<h3 class="ix-h ix-pair-title" tabindex="-1">' + esc(sys.name) + ' <span class="ix-plus">+</span> ' + esc(a.name) + "</h3>";
    if (systems.length > 1) {
      html += '<div class="ix-switch"><span>Compare phone systems:</span>' + systems.map(function (s) {
        var inner = esc(s.name) + " " + relBadge(relation(a, s), "Soon");
        return s.id === sys.id ? '<span class="is-on" aria-current="page">' + inner + "</span>" : '<a href="#/' + esc(s.id) + "/" + a.slug + '">' + inner + "</a>";
      }).join("") + "</div>";
    }
    if (rel === "soon") {
      html += '<p class="ix-pair-type">We\'re adding ' + esc(sys.name) + " integrations now. Book a call and we'll tell you how " + esc(a.name) + " connects.</p>";
    } else {
      html += '<p class="ix-pair-type">' + esc((TYPE_BY_ID[rel] || TYPE_BY_ID.ask).text) + "</p>" +
        (rel === "ask" && sys.apiNote ? '<p class="ix-pair-type">' + esc(sys.apiNote) + "</p>" : "") +
        '<p class="ix-pair-desc">' + esc(a.desc) + "</p>";
      if (rel !== "ask" && (gets.length || needs.length)) {
        html += '<div class="ix-cols"><div class="ix-col"><h4>What you get</h4>' +
          (gets.length ? "<ul>" + gets.map(function (g) { return "<li>" + esc(g) + "</li>"; }).join("") + "</ul>" : '<p class="ix-none">Ask us for the full feature list.</p>') +
          '</div><div class="ix-col is-needs"><h4>What you need</h4>' +
          (needs.length ? "<ul>" + needs.map(function (g) { return "<li>" + esc(g) + "</li>"; }).join("") + "</ul>" : '<p class="ix-none">Nothing extra listed. Cady will confirm.</p>') +
          "</div></div>";
      }
      /* skip the note when the "what you need" list already says the same thing */
      var note = det.note || a.note || "";
      var noteWords = note.toLowerCase().replace(/[^a-z0-9 -]/g, "").split(/[\s-]+/).filter(function (w) { return w.length > 3 && ["uses", "applies", "each", "with", "from", "that"].indexOf(w) < 0; });
      var needText = needs.join(" ").toLowerCase();
      var covered = noteWords.length > 0 && noteWords.filter(function (w) { return needText.indexOf(w) > -1; }).length / noteWords.length >= 0.6;
      if (note && !covered) html += '<p class="ix-note">' + esc(note) + "</p>";
    }
    html += '<div class="ix-actions">' + bookBtn("Book a call about " + sys.name + " + " + a.name) + phoneLink() +
      (framed || !navigator.clipboard ? "" : '<button type="button" class="ix-copy">Copy link to this page</button>') + "</div></div>";
    return html;
  }
  /* ----- render ----- */
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function render(fromNav) {
    renderSteps();
    var v = route.view, html;
    if (v === "app") html = viewApp(appBySlug[route.app]);
    else if (v === "pair") html = viewPair(appBySlug[route.app], sysById[route.sys]);
    else if (v === "apps") html = viewApps();
    else html = viewSystems();
    var view = $(".ix-view");
    var box = $(".ix-search"), typing = document.activeElement === input;
    view.innerHTML = html;
    /* on the app list the search sits right above the results count; elsewhere it stays above the view */
    var slot = $(".ix-search-slot");
    if (slot) slot.appendChild(box); else view.parentNode.insertBefore(box, view);
    if (typing && document.activeElement !== input) { var end = input.value.length; input.focus({ preventScroll: true }); try { input.setSelectionRange(end, end); } catch (e) {} }
    $(".ix-clear").hidden = !state.q;
    /* step 3 shows only the pairing: the page around it can hide extra sections (see landing.css) */
    root.classList.toggle("is-pair", v === "pair");
    document.documentElement.setAttribute("data-cady-ix-view", v);
    if (fromNav) {
      view.classList.remove("ix-anim"); void view.offsetWidth; view.classList.add("ix-anim");
      if (root.getBoundingClientRect().top < -10) root.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      var h = $(".ix-view .ix-h");
      if (h) h.focus({ preventScroll: true });
    }
  }
  /* ----- events ----- */
  var input = $(".ix-input");
  input.value = state.q;
  /* the full hint doesn't fit on a phone */
  if (window.matchMedia && matchMedia("(max-width: 640px)").matches) input.placeholder = "Search apps";
  input.addEventListener("input", function () {
    state.q = input.value;
    if (route.view !== "apps") go({ view: "apps", sys: sysById[route.sys] ? route.sys : "all" });
    else render(false);
  });
  $(".ix-clear").addEventListener("click", function () { state.q = ""; input.value = ""; render(false); input.focus(); });
  root.addEventListener("change", function (e) {
    var t = e.target;
    if (t.hasAttribute("data-filter")) { state[t.getAttribute("data-filter")] = t.value; render(false); }
    else if (t.classList.contains("ix-intl-box")) { state.intl = t.checked; render(false); }
  });
  root.addEventListener("click", function (e) {
    var b = e.target.closest(".ix-copy");
    if (!b) return;
    navigator.clipboard.writeText(location.href.split("#")[0] + href(route)).then(function () { b.textContent = "Link copied"; });
  });
  render(false);
  /* ----- when inside an iframe, tell the parent page how tall the explorer is ----- */
  if (framed && window.ResizeObserver) {
    new ResizeObserver(function () {
      window.parent.postMessage({ type: "cady-ix-height", height: Math.ceil(root.getBoundingClientRect().height) }, "*");
    }).observe(root);
  }
  }
  /* wait for the whole page so a per-page setting (window.CADY_IX) and the logos below are picked up */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
