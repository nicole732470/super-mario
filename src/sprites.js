window.SproutSprites = {
  qblock: `<div class="qblock" aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 16 16" shape-rendering="crispEdges">
      <rect width="16" height="16" fill="#e8a838"/>
      <rect x="1" y="1" width="14" height="14" fill="#f0c848"/>
      <rect x="2" y="2" width="12" height="1" fill="#ffe99a"/>
      <rect x="2" y="13" width="12" height="1" fill="#c47a18"/>
      <rect x="13" y="2" width="1" height="12" fill="#c47a18"/>
      <rect x="2" y="2" width="1" height="12" fill="#ffe99a"/>
      <rect x="6" y="3" width="4" height="2" fill="#7a3e0c"/>
      <rect x="9" y="5" width="2" height="2" fill="#7a3e0c"/>
      <rect x="7" y="7" width="2" height="2" fill="#7a3e0c"/>
      <rect x="7" y="10" width="2" height="2" fill="#7a3e0c"/>
      <rect x="1" y="1" width="2" height="2" fill="#5a2e08"/>
      <rect x="13" y="1" width="2" height="2" fill="#5a2e08"/>
      <rect x="1" y="13" width="2" height="2" fill="#5a2e08"/>
      <rect x="13" y="13" width="2" height="2" fill="#5a2e08"/>
    </svg>
  </div>`,
  connect: () =>
    `${window.SproutSprites.qblock}<div class="hero"><img src="../assets/luigi.png" width="28" height="28" alt="" class="hero-img" draggable="false" /></div>`,
  apply: () =>
    `${window.SproutSprites.qblock}<div class="hero"><img src="../assets/mario.png" width="28" height="28" alt="" class="hero-img" draggable="false" /></div>`,
  goal:
    `<svg class="goal-flag" viewBox="0 0 16 32" width="16" height="32" aria-hidden="true">
      <rect x="7" y="5" width="2" height="26" fill="#ddd"/>
      <rect x="6" y="3" width="4" height="3" fill="#aaa"/>
      <rect x="9" y="4" width="6" height="5" fill="#2ecc40"/>
      <rect x="9" y="4" width="6" height="2" fill="#5efc4a"/>
      <rect x="6" y="2" width="4" height="2" fill="#e74c3c"/>
    </svg>`,
  TRAVEL: 140,
};
