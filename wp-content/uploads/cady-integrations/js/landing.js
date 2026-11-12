/* Landing page behavior: booking links, live integration count, and the "Popular pairings" card,
   all read from the explorer's own settings and data so nothing is typed twice. */
(function () {
  var SCRIPT_BASE = (function () {
    var c = document.currentScript;
    return c && c.src ? c.src.replace(/[^\/]*$/, "").replace(/js\/$/, "") : "";
  })();
  function init() {
    var D = window.CADY_IX_DATA, L = window.CADY_IX_LOGOS || {};
    var base = (D && D.settings && D.settings.assetBase) || SCRIPT_BASE;
    /* the page may be one container (#cady-lp) or one per Divi section (#cady-lp-1, #cady-lp-2, ...) */
    var parts = document.querySelectorAll('#cady-lp, [id^="cady-lp-"]');
    if (!D || !parts.length) return;
    function all(sel) { var out = []; parts.forEach(function (p) { p.querySelectorAll(sel).forEach(function (el) { out.push(el); }); }); return out; }
    var S = D.settings || {};
    var book = S.bookingUrl || "#book-a-call";  /* placeholder until Cady's booking link is set */
    all("[data-book]").forEach(function (a) { a.href = book; if (S.bookingUrl) { a.target = "_blank"; a.rel = "noopener"; } });
    var phone = S.phone || "800-347-3886";
    all("[data-phone]").forEach(function (a) { a.href = "tel:" + phone.replace(/[^0-9+]/g, ""); a.textContent = "or call " + phone; });
    /* Call now buttons: on phones they dial; on computers the number is shown so people can dial it */
    var wide = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    all("[data-call]").forEach(function (a) { a.href = "tel:" + phone.replace(/[^0-9+]/g, ""); a.textContent = wide ? "Call " + phone : "Call now"; a.setAttribute("aria-label", "Call Cady at " + phone); });
    all("[data-count-integrations]").forEach(function (el) { el.textContent = (D.integrations || []).length; });
    function slug(n) { return String(n).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
    function tile(logo, name, sys) {
      var src = L[logo] ? (/^(https?:|data:|\/)/.test(L[logo]) ? L[logo] : base + L[logo]) : (/^(https?:|data:|\/)/.test(logo || "") ? logo : "");
      return '<span class="lp-pair-logo' + (sys ? " is-sys" : "") + '">' + (src ? '<img src="' + esc(src) + '" alt="">' : esc(name.slice(0, 2).toUpperCase())) + "</span>";
    }
    var labels = { direct: ["Works directly", "t-native"], builtin: ["Works directly", "t-native"], native: ["Works directly", "t-native"], addon: ["Works with an add-on", "t-middleware"], middleware: ["Works with an add-on", "t-middleware"], custom: ["Custom setup", "t-custom"], customapi: ["Custom setup", "t-custom"] };
    all("[data-example-pairs]").forEach(function (ul) {
      ul.innerHTML = ul.getAttribute("data-example-pairs").split(",").map(function (pair) {
        var p = pair.split(":"), sys = (D.systems || []).filter(function (s) { return s.id === p[0]; })[0];
        var app = (D.integrations || []).filter(function (a) { return slug(a.name) === p[1]; })[0];
        if (!sys || !app || !app.systems || !app.systems[sys.id]) return "";
        var t = labels[String(app.systems[sys.id]).toLowerCase().replace(/[^a-z]/g, "")];
        if (!t) return "";
        return '<li><a class="lp-pair" href="#/' + sys.id + "/" + p[1] + '">' + tile(sys.logo, sys.name, true) + '<span class="lp-pair-dots"></span><span class="lp-badge ' + t[1] + '">' + t[0] + '</span><span class="lp-pair-dots"></span>' +
          tile(app.logo, app.name) + '<span class="lp-pair-name">' + esc(app.name) + "</span></a></li>";
      }).join("");
    });
    /* pairing links jump down to the explorer, which opens that pair */
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#/"]');
      if (!a || a.closest("#cady-ix") || !a.closest('#cady-lp, [id^="cady-lp-"]')) return;
      setTimeout(function () { document.getElementById("explorer").scrollIntoView({ behavior: "smooth", block: "start" }); }, 0);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
