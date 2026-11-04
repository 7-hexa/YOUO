(function (Y) {
  Y.background = { el: null, objectUrl: null,
    init() {
      this.el = document.getElementById("bgImage");
      this.setOverlay(Y.config.overlay.dark, Y.config.overlay.purple);
    },
    setSource(src) {
      if (!src) return;
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = src.startsWith("blob:") ? src : null;
      this.el.src = src;
    },
    setOverlay(dark, purple) {
      document.getElementById("overlayDark").style.opacity = dark / 100;
      document.getElementById("overlayPurple").style.opacity = purple / 100;
    }
  };
})(window.YOUO);
