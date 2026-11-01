(function (Y) {
  const $ = id => document.getElementById(id);
  Y.settings = { init() {
    const btn = $("btnSettings"), panel = $("settings"), d = $("rngDark"), p = $("rngPurple");
    const toggle = open => { panel.hidden = !open; btn.setAttribute("aria-expanded", open); };
    btn.onclick = () => toggle(panel.hidden);
    document.addEventListener("keydown", e => { if (e.key === "Escape") toggle(false); });
    document.addEventListener("click", e => { if (!panel.hidden && !e.target.closest(".dock-wrap")) toggle(false); });
    d.value = Y.config.overlay.dark; p.value = Y.config.overlay.purple;
    const apply = () => Y.video.setOverlay(+d.value, +p.value);
    d.oninput = p.oninput = apply;
    $("fileVideo").onchange = e => { const f = e.target.files[0]; if (f) Y.video.setSource(URL.createObjectURL(f)); };
    $("applyVideo").onclick = () => { const u = $("urlVideo").value.trim(); if (u) Y.video.setSource(u); };
    $("resetSettings").onclick = () => { d.value = Y.config.overlay.dark; p.value = Y.config.overlay.purple; apply(); $("urlVideo").value = ""; Y.video.setSource(Y.config.videoSrc); };
  } };
})(window.YOUO);
