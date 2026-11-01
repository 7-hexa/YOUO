(function (Y) {
  const pad = n => String(n).padStart(2, "0");
  Y.clock = { init() {
    const t = document.getElementById("clockTime"), d = document.getElementById("clockDate");
    if (!t || !d) return;
    t.replaceChildren(...Array.from("00:00:00", char => {
      const slot = document.createElement("span");
      slot.className = char === ":" ? "clock-separator" : "clock-digit";
      slot.setAttribute("aria-hidden", "true");
      slot.textContent = char;
      return slot;
    }));
    const period = document.createElement("span");
    period.className = "clock-period";
    period.setAttribute("aria-hidden", "true");
    t.append(period);
    const tick = () => {
      const n = new Date();
      const hours = n.getHours();
      const time = `${pad(hours % 12 || 12)}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
      Array.from(time, (char, index) => { t.children[index].textContent = char; });
      period.textContent = hours < 12 ? "AM" : "PM";
      t.setAttribute("aria-label", `${time} ${period.textContent}`);
      d.textContent = n.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    };
    tick(); setInterval(tick, 1000);
  } };
})(window.YOUO);
