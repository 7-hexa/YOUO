(function (Y) {
  const $ = id => document.getElementById(id);
  const fmt = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";
  Y.player = { init() {
    let list = Y.config.playlist || [];
    if (!list.length) return;
    const a = new Audio(); a.preload = "metadata";
    let i = 0, shuffle = false, repeat = false, playbackRequested = false;
    const msg = t => { $("plMsg").textContent = t || ""; };
    const setPlayIcon = playing => {
      $("plPlay").innerHTML = `<i data-icon="${playing ? "pause" : "play"}"></i>`; Y.renderIcons($("plPlay"));
      $("plPlay").setAttribute("aria-label", playing ? "Pause" : "Play");
      $("plEq").classList.toggle("on", playing);
    };
    const load = idx => {
      i = (idx + list.length) % list.length; const t = list[i];
      a.src = t.src; $("plTitle").textContent = t.title; $("plArtist").textContent = t.artist;
      $("plCover").src = t.cover; $("plFill").style.width = "0%"; $("plCur").textContent = "0:00"; $("plDur").textContent = "0:00"; msg("");
    };
    const play = () => { playbackRequested = true; return a.play().then(() => setPlayIcon(true)).catch(() => { setPlayIcon(false); msg("Audio not found or blocked — add your tracks in assets/music/"); }); };
    const next = () => { let n = i + 1; if (shuffle && list.length > 1) { do { n = Math.floor(Math.random() * list.length); } while (n === i); } load(n); play(); };
    $("plPlay").onclick = () => a.paused ? play() : (a.pause(), setPlayIcon(false));
    $("plNext").onclick = next;
    $("plPrev").onclick = () => { if (a.currentTime > 3) a.currentTime = 0; else { load(i - 1); play(); } };
    $("plShuffle").onclick = e => { shuffle = !shuffle; e.currentTarget.setAttribute("aria-pressed", shuffle); };
    $("plRepeat").onclick = e => { repeat = !repeat; e.currentTarget.setAttribute("aria-pressed", repeat); };
    a.addEventListener("loadedmetadata", () => $("plDur").textContent = fmt(a.duration));
    a.addEventListener("timeupdate", () => {
      const p = a.duration ? a.currentTime / a.duration * 100 : 0;
      $("plFill").style.width = p + "%"; $("plCur").textContent = fmt(a.currentTime); $("plBar").setAttribute("aria-valuenow", Math.round(p));
    });
    a.addEventListener("ended", () => repeat ? (a.currentTime = 0, play()) : next());
    a.addEventListener("error", () => { setPlayIcon(false); if (playbackRequested) msg("Audio file not found — add your tracks in assets/music/"); });
    const seek = x => { const r = $("plBar").getBoundingClientRect(); if (a.duration) a.currentTime = Math.min(1, Math.max(0, (x - r.left) / r.width)) * a.duration; };
    $("plBar").addEventListener("click", e => seek(e.clientX));
    $("plBar").addEventListener("keydown", e => { if (!a.duration) return; if (e.key === "ArrowRight") a.currentTime += 5; if (e.key === "ArrowLeft") a.currentTime -= 5; });
    Y.player.setPlaylist = songs => {
      if (!Array.isArray(songs) || !songs.length) throw new Error("At least one song is required.");
      list = songs;
      shuffle = false;
      repeat = false;
      playbackRequested = false;
      a.pause();
      load(0);
      setPlayIcon(false);
    };
    load(0); setPlayIcon(false);
  } };
})(window.YOUO);
