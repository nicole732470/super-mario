const SproutSounds = (() => {
  let ctx = null;

  async function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") await ctx.resume();
    return ctx;
  }

  function unlock() {
    ac().catch(() => {});
  }

  async function tone(freq, start, dur, type = "square", vol = 0.08) {
    const c = await ac();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  async function jump(freqStart, freqEnd) {
    const c = await ac();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freqStart, t);
    osc.frequency.linearRampToValueAtTime(freqEnd, t + 0.09);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  async function coinArpeggio(freqs) {
    const c = await ac();
    const t = c.currentTime;
    freqs.forEach((freq, i) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      const s = t + i * 0.03;
      g.gain.setValueAtTime(0.07, s);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.12);
      osc.connect(g);
      g.connect(c.destination);
      osc.start(s);
      osc.stop(s + 0.14);
    });
  }

  async function goalFanfare() {
    const c = await ac();
    const t = c.currentTime;
    const melody = [
      [659.25, 0], [659.25, 0.1], [659.25, 0.2],
      [523.25, 0.3], [659.25, 0.4], [783.99, 0.55], [392.0, 0.75],
    ];
    melody.forEach(([freq, delay]) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      const s = t + delay;
      g.gain.setValueAtTime(0.07, s);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.2);
      osc.connect(g);
      g.connect(c.destination);
      osc.start(s);
      osc.stop(s + 0.22);
    });
  }

  return {
    unlock,
    clickConnect: () => {
      jump(300, 600);
      setTimeout(() => coinArpeggio([1318.51, 1567.98, 2093.0]), 35);
    },
    clickApply: () => {
      jump(240, 520);
      setTimeout(() => coinArpeggio([1046.5, 1318.51, 1760.0]), 35);
    },
    bloom: () => goalFanfare(),
  };
})();

window.SproutSounds = SproutSounds;
