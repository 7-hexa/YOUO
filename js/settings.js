(function (Y) {
  const $ = id => document.getElementById(id);
  Y.settings = { init() {
    const btn = $("btnSettings"), panel = $("settings"), d = $("rngDark"), p = $("rngPurple");
    const toggle = open => { panel.hidden = !open; btn.setAttribute("aria-expanded", open); };
    btn.onclick = () => toggle(panel.hidden);
    document.addEventListener("keydown", e => { if (e.key === "Escape") toggle(false); });
    document.addEventListener("click", e => { if (!panel.hidden && !e.target.closest(".dock-wrap")) toggle(false); });
    d.value = Y.config.overlay.dark; p.value = Y.config.overlay.purple;
    const apply = () => Y.background.setOverlay(+d.value, +p.value);
    d.oninput = p.oninput = apply;
    $("fileImage").onchange = e => { const f = e.target.files[0]; if (f) Y.background.setSource(URL.createObjectURL(f)); };
    $("applyImage").onclick = () => { const u = $("urlImage").value.trim(); if (u) Y.background.setSource(u); };
    $("resetSettings").onclick = () => { d.value = Y.config.overlay.dark; p.value = Y.config.overlay.purple; apply(); $("urlImage").value = ""; $("fileImage").value = ""; Y.background.setSource(Y.config.imageSrc); };
  } };
})(window.YOUO);
