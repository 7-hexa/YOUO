(function (Y) {
  const pad = n => String(n).padStart(2, "0");
  Y.birthday = { init() {
    const dateEl = document.getElementById("birthDate");
    const countdown = document.getElementById("birthdayCountdown");
    if (!dateEl || !countdown) return;

    dateEl.textContent = Y.config.birthDate.replaceAll("-", "/");

    const tick = () => {
      const now = new Date();
      let nextBirthday = new Date(now.getFullYear(), 1, 26);
      if (nextBirthday <= now) nextBirthday = new Date(now.getFullYear() + 1, 1, 26);

      const secondsLeft = Math.floor((nextBirthday - now) / 1000);
      const days = Math.floor(secondsLeft / 86400);
      const hours = Math.floor((secondsLeft % 86400) / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;

      countdown.replaceChildren(
        ...[
          [days, "days"],
          [pad(hours), "hrs"],
          [pad(minutes), "min"],
          [pad(seconds), "sec"]
        ].flatMap(([value, label]) => {
          const unit = document.createElement("span");
          unit.className = "birthday-unit";
          const number = document.createElement("b");
          number.textContent = value;
          const text = document.createElement("small");
          text.textContent = label;
          unit.append(number, text);
          return unit;
        })
      );
      countdown.setAttribute("aria-label", `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds until the next birthday`);
    };

    tick();
    setInterval(tick, 1000);
  } };
})(window.YOUO);
