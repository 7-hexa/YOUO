(function (Y) {
  Y.video = { el: null,
    init() {
      const v = this.el = document.getElementById("bgVideo");
      v.muted = true; v.addEventListener("error", () => v.removeAttribute("src"));
      this.setSource(Y.config.videoSrc);
      this.setOverlay(Y.config.overlay.dark, Y.config.overlay.purple);
    },
    setSource(src) { if (!src) return; this.el.src = src; this.el.load(); const p = this.el.play(); if (p) p.catch(() => {}); },
    setOverlay(dark, purple) {
      document.getElementById("overlayDark").style.opacity = dark / 100;
      document.getElementById("overlayPurple").style.opacity = purple / 100;
    }
  };
})(window.YOUO);
