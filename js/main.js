(function (Y) {
  const P = {
    play: '<polygon points="7 4 20 12 7 20"/>',
    pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
    prev: '<polygon points="19 20 9 12 19 4"/><line x1="5" y1="19" x2="5" y2="5"/>',
    next: '<polygon points="5 4 15 12 5 20"/><line x1="19" y1="5" x2="19" y2="19"/>',
    shuffle: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
    repeat: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    mute: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>',
    settings: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/>',
    full: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
    arrow: '<line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>'
  };
  Y.renderIcons = (root = document) => root.querySelectorAll("i[data-icon]").forEach(el => {
    if (el.firstChild) return;
    el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${P[el.dataset.icon] || ""}</svg>`;
  });
  document.addEventListener("DOMContentLoaded", async () => {
    Y.renderIcons();
    for (const k of ["video", "birthday", "player", "controls", "settings"]) {
      try { await Y[k].init(); } catch (e) { console.warn("YOUO:", k, e); }
    }
    try { await Y.ownerMusic.init(); } catch (e) { console.warn("YOUO: ownerMusic", e); }
  });
})(window.YOUO);
