window.SproutSprites = {
  connect: () =>
    '<img src="../assets/luigi.png" width="36" height="36" alt="" class="hero-img" draggable="false" />',
  apply: () =>
    '<img src="../assets/mario.png" width="36" height="36" alt="" class="hero-img" draggable="false" />',
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
