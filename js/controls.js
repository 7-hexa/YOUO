(function (Y) {
  Y.controls = { init() {
    const f = document.getElementById("btnFull");
    f.onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {}); };
    document.querySelectorAll(".social").forEach(a => { const u = Y.config.social[a.dataset.key]; if (u) a.href = u; });
  } };
})(window.YOUO);
