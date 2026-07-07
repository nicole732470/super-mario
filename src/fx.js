const SproutFX = (() => {
  let combo = 0;
  let comboTimer = null;
  const MILESTONES = [5, 10, 25, 50, 75, 100];

  const QUIPS = {
    connect: ["+1!", "Nice!", "Let's go!", "Jump!"],
    apply: ["+1!", "Wahoo!", "Send it!", "Yes!"],
  };

  const COMBO_QUIPS = ["Combo!", "On fire!", "Unstoppable!", "CRUSHING IT!"];

  function quip(kind) {
    if (combo >= 3) return COMBO_QUIPS[Math.min(combo - 3, COMBO_QUIPS.length - 1)];
    const list = QUIPS[kind];
    return list[Math.floor(Math.random() * list.length)];
  }

  function bumpCombo() {
    combo += 1;
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => { combo = 0; }, 2000);
    return combo;
  }

  function coinPop(plotEl, kind, count, goal) {
    const layer = document.getElementById("fx-layer");
    const hero = plotEl.querySelector(".hero");
    const scene = document.getElementById("scene").getBoundingClientRect();
    const hRect = hero.getBoundingClientRect();
    const left = count;
    const leftN = Math.max(goal - count, 0);

    const el = document.createElement("div");
    el.className = "coin-pop";
    el.textContent = quip(kind);
    el.style.left = `${hRect.left - scene.left + 4}px`;
    el.style.top = `${hRect.top - scene.top - 4}px`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 600);

    if (MILESTONES.includes(left) || leftN === 10 || leftN === 5 || leftN === 1) {
      const hint = document.createElement("div");
      hint.className = "milestone-pop";
      hint.textContent = leftN === 0 ? "GOAL!" : `${leftN} to go!`;
      hint.style.left = `${hRect.left - scene.left - 4}px`;
      hint.style.top = `${hRect.top - scene.top - 18}px`;
      layer.appendChild(hint);
      setTimeout(() => hint.remove(), 900);
    }

    for (let i = 0; i < 4; i++) {
      const d = document.createElement("div");
      d.className = "dust";
      d.style.left = `${hRect.left - scene.left + 8 + i * 5}px`;
      d.style.top = `${hRect.bottom - scene.top - 6}px`;
      layer.appendChild(d);
      setTimeout(() => d.remove(), 450);
    }
  }

  function step(plotEl, kind, count, goal) {
    bumpCombo();
    const hero = plotEl.querySelector(".hero");
    const stage = plotEl.querySelector(".stage");
    const hud = plotEl.querySelector(".hud em");

    hero.classList.remove("hop");
    stage.classList.remove("shake");
    void hero.offsetWidth;
    hero.classList.add("hop");
    hero.querySelector(".hero-img")?.addEventListener(
      "animationend",
      () => hero.classList.remove("hop"),
      { once: true }
    );
    stage.classList.add("shake");
    if (hud) {
      hud.classList.remove("bump");
      void hud.offsetWidth;
      hud.classList.add("bump");
    }

    setTimeout(() => stage.classList.remove("shake"), 300);
    coinPop(plotEl, kind, count, goal);
    SproutSounds.clickConnect && (kind === "connect" ? SproutSounds.clickConnect() : SproutSounds.clickApply());
  }

  function victory(plotEl) {
    const stage = plotEl.querySelector(".stage");
    stage.classList.add("victory-flash");
    setTimeout(() => stage.classList.remove("victory-flash"), 800);
    combo = 0;
  }

  return { step, victory };
})();

window.SproutFX = SproutFX;
