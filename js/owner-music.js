(function (Y) {
  const $ = id => document.getElementById(id);
  const sessionKey = "youo-owner-session";
  const bucket = "youo-music";
  const maxAudioSize = 50 * 1024 * 1024;
  const maxCoverSize = 5 * 1024 * 1024;
  const audioTypes = new Map([
    ["audio/mpeg", "mp3"],
    ["audio/mp4", "m4a"],
    ["audio/aac", "aac"],
    ["audio/ogg", "ogg"],
    ["audio/wav", "wav"],
    ["audio/x-wav", "wav"],
    ["audio/flac", "flac"]
  ]);
  const coverTypes = new Map([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"]
  ]);

  const apiBase = () => {
    const config = Y.config.supabase;
    if (!config?.url || !config?.publishableKey) throw new Error("Supabase is not configured.");
    return config.url.replace(/\/+$/, "").replace(/\/(rest\/v1|auth\/v1)$/i, "");
  };
  const getSession = () => {
    try { return JSON.parse(sessionStorage.getItem(sessionKey) || "null"); }
    catch (error) { console.warn("YOUO: Invalid saved owner session.", error); return null; }
  };
  const setSession = session => {
    if (session) sessionStorage.setItem(sessionKey, JSON.stringify(session));
    else sessionStorage.removeItem(sessionKey);
  };
  const status = message => { $("ownerStatus").textContent = message || ""; };
  const showSession = signedIn => {
    $("ownerLoginForm").hidden = signedIn;
    $("ownerSongForm").hidden = !signedIn;
  };
  const endpoint = path => `${apiBase()}${path}`;
  const errorMessage = async response => {
    const body = await response.text();
    try {
      const error = JSON.parse(body);
      return error.msg || error.message || error.error_description || error.error || body;
    } catch { return body || response.statusText; }
  };
  const request = async (path, options = {}, token) => {
    const headers = new Headers(options.headers || {});
    headers.set("apikey", Y.config.supabase.publishableKey);
    headers.set("Authorization", `Bearer ${token || Y.config.supabase.publishableKey}`);
    const response = await fetch(endpoint(path), { ...options, headers });
    if (!response.ok) throw new Error(await errorMessage(response));
    const body = await response.text();
    return body ? JSON.parse(body) : null;
  };
  const refreshSession = async session => {
    if (!session?.refresh_token) throw new Error("Please sign in again.");
    const renewed = await request("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refresh_token })
    });
    const next = { ...renewed, expires_at: Math.floor(Date.now() / 1000) + renewed.expires_in };
    setSession(next);
    return next;
  };
  const validSession = async () => {
    let session = getSession();
    if (!session?.access_token) throw new Error("Sign in to continue.");
    if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000) + 30) {
      session = await refreshSession(session);
    }
    return session;
  };
  const ownerRequest = async (path, options = {}) => {
    let session = await validSession();
    try {
      return await request(path, options, session.access_token);
    } catch (error) {
      if (!/401|jwt|token/i.test(error.message)) throw error;
      session = await refreshSession(session);
      return request(path, options, session.access_token);
    }
  };
  const fileExtension = (file, types, label, maxSize) => {
    if (!file) throw new Error(`Choose ${label}.`);
    const extension = types.get(file.type.toLowerCase());
    if (!extension) throw new Error(`Unsupported ${label} format.`);
    if (file.size > maxSize) throw new Error(`${label} must be smaller than ${Math.floor(maxSize / 1024 / 1024)} MB.`);
    return extension;
  };
  const objectPath = url => {
    if (!url) return null;
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = url.indexOf(marker);
    if (index < 0) return null;
    return url.slice(index + marker.length).split("/").map(decodeURIComponent).join("/");
  };
  const storageUrl = path => `${apiBase()}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`;
  const upload = async (path, file) => {
    await ownerRequest(`/storage/v1/object/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`, {
      method: "POST",
      headers: { "Content-Type": file.type, "x-upsert": "false", "cache-control": "3600" },
      body: file
    });
    return storageUrl(path);
  };
  const removeObject = async path => {
    if (!path) return;
    await ownerRequest(`/storage/v1/object/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`, { method: "DELETE" });
  };
  const loadSharedSong = async () => {
    const rows = await request("/rest/v1/music_settings?select=title,artist,audio_url,cover_url&id=eq.1");
    if (!Array.isArray(rows) || !rows.length) return;
    const song = rows[0];
    if (![song.title, song.artist, song.audio_url, song.cover_url].every(value => typeof value === "string" && value.trim())) {
      throw new Error("The shared song record is incomplete.");
    }
    Y.config.playlist = [{ title: song.title, artist: song.artist, src: song.audio_url, cover: song.cover_url }];
    if (Y.player?.setPlaylist) Y.player.setPlaylist(Y.config.playlist);
  };

  Y.ownerMusic = {
    async init() {
      const backdrop = $("ownerBackdrop");
      const panel = $("ownerPanel");
      const close = () => {
        backdrop.hidden = true;
        if (new URLSearchParams(location.search).has("owner")) {
          history.replaceState(null, "", location.pathname);
        }
      };
      $("ownerClose").addEventListener("click", close);
      backdrop.addEventListener("click", event => { if (event.target === backdrop) close(); });
      document.addEventListener("keydown", event => { if (event.key === "Escape" && !backdrop.hidden) close(); });
      if (new URLSearchParams(location.search).get("owner") === "1") backdrop.hidden = false;

      const savedSession = getSession();
      showSession(Boolean(savedSession?.access_token));
      $("ownerLoginForm").addEventListener("submit", async event => {
        event.preventDefault();
        const button = $("ownerLoginForm").querySelector('[type="submit"]');
        button.disabled = true;
        status("Signing in…");
        try {
          const result = await request("/auth/v1/token?grant_type=password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: $("ownerEmail").value.trim(),
              password: $("ownerPassword").value
            })
          });
          setSession({ ...result, expires_at: Math.floor(Date.now() / 1000) + result.expires_in });
          $("ownerPassword").value = "";
          showSession(true);
          status("Signed in. Only the configured owner can save changes.");
        } catch (error) {
          status(`Sign-in failed: ${error.message}`);
        } finally {
          button.disabled = false;
        }
      });

      $("ownerSignOut").addEventListener("click", async () => {
        const session = getSession();
        setSession(null);
        showSession(false);
        status("Signed out.");
        if (session?.access_token) {
          try { await request("/auth/v1/logout", { method: "POST" }, session.access_token); }
          catch (error) { console.warn("YOUO: Supabase sign-out request failed.", error); }
        }
      });

      $("ownerSongForm").addEventListener("submit", async event => {
        event.preventDefault();
        const form = $("ownerSongForm");
        const button = form.querySelector('[type="submit"]');
        button.disabled = true;
        let audioPath, coverPath;
        let saved = false;
        const uploadedPaths = [];
        status("Uploading song and cover…");
        try {
          const title = $("ownerSongTitle").value.trim();
          const artist = $("ownerSongArtist").value.trim();
          const audioFile = $("ownerAudioFile").files[0];
          const coverFile = $("ownerCoverFile").files[0];
          if (!title || !artist) throw new Error("Enter both the song title and artist.");
          const audioExtension = fileExtension(audioFile, audioTypes, "an audio file", maxAudioSize);
          const coverExtension = fileExtension(coverFile, coverTypes, "a cover image", maxCoverSize);
          const version = crypto.randomUUID();
          audioPath = `${version}/track.${audioExtension}`;
          coverPath = `${version}/cover.${coverExtension}`;
          const audioUrl = await upload(audioPath, audioFile);
          uploadedPaths.push(audioPath);
          const coverUrl = await upload(coverPath, coverFile);
          uploadedPaths.push(coverPath);
          const previousRows = await request("/rest/v1/music_settings?select=audio_url,cover_url&id=eq.1");
          await ownerRequest("/rest/v1/music_settings?on_conflict=id", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify({
              id: 1,
              title,
              artist,
              audio_url: audioUrl,
              cover_url: coverUrl,
              updated_at: new Date().toISOString()
            })
          });
          saved = true;
          Y.config.playlist = [{ title, artist, src: audioUrl, cover: coverUrl }];
          Y.player.setPlaylist(Y.config.playlist);
          status("Song updated for all visitors.");
          $("ownerSongForm").reset();
          for (const oldUrl of [previousRows?.[0]?.audio_url, previousRows?.[0]?.cover_url]) {
            const oldPath = objectPath(oldUrl);
            if (oldPath && oldPath !== audioPath && oldPath !== coverPath) {
              try { await removeObject(oldPath); }
              catch (error) { console.warn("YOUO: Old music file could not be removed.", error); }
            }
          }
        } catch (error) {
          status(saved ? `Song saved, but cleanup failed: ${error.message}` : `Could not update song: ${error.message}`);
          if (!saved) {
            for (const path of uploadedPaths) {
              try { await removeObject(path); }
              catch (cleanupError) { console.warn("YOUO: Uploaded music file cleanup failed.", cleanupError); }
            }
          }
        } finally {
          button.disabled = false;
        }
      });

      try {
        await loadSharedSong();
      } catch (error) {
        console.warn("YOUO: Could not load the shared song from Supabase.", error);
        status(`Shared music is unavailable; showing the saved site song. Check Supabase setup. (${error.message})`);
      }
    }
  };
})(window.YOUO);
