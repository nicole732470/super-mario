const SproutFX = (() => {
  let combo = 0;
  let comboTimer = null;
  const MILESTONES = [5, 10, 25, 50, 75, 100];

  const QUIPS = {
    connect: ["+1!", "Nice!", "Let's go!", "Bump!"],
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
    const runner = plotEl.querySelector(".runner");
    const qblock = runner?.querySelector(".qblock");
    const scene = document.getElementById("scene").getBoundingClientRect();
    const anchor = (qblock || runner).getBoundingClientRect();
    const left = count;
    const leftN = Math.max(goal - count, 0);

    const el = document.createElement("div");
    el.className = "coin-pop";
    el.textContent = quip(kind);
    el.style.left = `${anchor.left - scene.left + 2}px`;
    el.style.top = `${anchor.top - scene.top - 6}px`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 600);

    if (MILESTONES.includes(left) || leftN === 10 || leftN === 5 || leftN === 1) {
      const hint = document.createElement("div");
      hint.className = "milestone-pop";
      hint.textContent = leftN === 0 ? "GOAL!" : `${leftN} to go!`;
      hint.style.left = `${anchor.left - scene.left - 4}px`;
      hint.style.top = `${anchor.top - scene.top - 18}px`;
      layer.appendChild(hint);
      setTimeout(() => hint.remove(), 900);
    }

    const feet = runner.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      const d = document.createElement("div");
      d.className = "dust";
      d.style.left = `${feet.left - scene.left + 6 + i * 5}px`;
      d.style.top = `${feet.bottom - scene.top - 4}px`;
      layer.appendChild(d);
      setTimeout(() => d.remove(), 450);
    }
  }

  function step(plotEl, kind, count, goal) {
    bumpCombo();
    const runner = plotEl.querySelector(".runner");
    const stage = plotEl.querySelector(".stage");
    const hud = plotEl.querySelector(".hud em");

    runner.classList.remove("hop");
    stage.classList.remove("shake");
    void runner.offsetWidth;
    runner.classList.add("hop");
    runner.querySelector(".hero-img")?.addEventListener(
      "animationend",
      () => runner.classList.remove("hop"),
      { once: true }
    );
    stage.classList.add("shake");
    if (hud) {
      hud.classList.remove("bump");
      void hud.offsetWidth;
      hud.classList.add("bump");
    }

    setTimeout(() => stage.classList.remove("shake"), 300);
    // pop out when head hits the block (~120ms into hop)
    setTimeout(() => coinPop(plotEl, kind, count, goal), 120);
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
