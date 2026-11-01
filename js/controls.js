(function (Y) {
  const swap = (btn, name) => { btn.innerHTML = `<i data-icon="${name}"></i>`; Y.renderIcons(btn); };
  Y.controls = { init() {
    const s = document.getElementById("btnSound"), f = document.getElementById("btnFull");
    s.onclick = () => { const v = Y.video.el; v.muted = !v.muted; if (!v.muted) v.play().catch(() => {});
      swap(s, v.muted ? "mute" : "volume"); s.setAttribute("aria-label", v.muted ? "Unmute background video" : "Mute background video"); };
    s.setAttribute("aria-label", "Unmute background video"); swap(s, "mute");
    f.onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {}); };
    document.querySelectorAll(".social").forEach(a => { const u = Y.config.social[a.dataset.key]; if (u) a.href = u; });
  } };
})(window.YOUO);
