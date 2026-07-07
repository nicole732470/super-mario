let state = null;
let toastTimer = null;
let syncTimer = null;

function localDateStr(d = new Date()) {
  return SproutStats.localDateStr(d);
}

function mondayOf(date) {
  return SproutStats.mondayOf(date);
}

function todayStr() {
  return localDateStr(new Date());
}

function ensurePeriods(data) {
  const weekStart = mondayOf(new Date());
  const today = todayStr();

  if (!data.daily) data.daily = [];
  if (!data.history) data.history = [];

  if (!data.connects?.weekStart) {
    data.connects = { count: data.connects?.count || 0, weekStart };
  } else if (data.connects.weekStart !== weekStart) {
    if (data.connects.count > 0) {
      const archived = data.history.some(
        (h) => h.type === "connects" && h.period === data.connects.weekStart
      );
      if (!archived) {
        data.history.push({
          type: "connects",
          period: data.connects.weekStart,
          count: data.connects.count,
        });
      }
    }
    data.connects = { count: 0, weekStart };
  }

  if (!data.applications?.date) {
    data.applications = { count: data.applications?.count || 0, date: today };
  } else if (data.applications.date !== today) {
    if (data.applications.count > 0) {
      const archived = data.history.some(
        (h) => h.type === "applications" && h.period === data.applications.date
      );
      if (!archived) {
        data.history.push({
          type: "applications",
          period: data.applications.date,
          count: data.applications.count,
        });
      }
    }
    data.applications = { count: 0, date: today };
  }

  if (data.history.length > 120) data.history = data.history.slice(-120);

  return SproutStats.upsertToday(data);
}

function fillPct(count, goal) {
  return Math.min(count / goal, 1);
}

function setProgress(type, pct) {
  const hero = document.getElementById(`hero-${type}`);
  const trail = document.getElementById(`trail-${type}`);
  hero.style.transform = `translateX(${pct * SproutSprites.TRAVEL}px)`;
  if (trail) trail.style.width = `${pct * 100}%`;
}

function updateUI(lastAction) {
  const cGoal = state.goals.connectsWeekly;
  const aGoal = state.goals.applicationsDaily;
  const c = state.connects.count;
  const a = state.applications.count;

  document.getElementById("count-connect").textContent = `${c}/${cGoal}`;
  document.getElementById("count-apply").textContent = `${a}/${aGoal}`;

  const weekStart = state.connects.weekStart;
  const weekEnd = weekStart ? SproutStats.weekEndLabel(weekStart) : "";
  const connectSub = document.getElementById("period-connect");
  const applySub = document.getElementById("period-apply");
  if (connectSub) connectSub.textContent = weekStart ? `wk ${weekStart.slice(5)}–${weekEnd}` : "this week";
  if (applySub) applySub.textContent = state.applications.date ? state.applications.date.slice(5) : "today";

  setProgress("connect", fillPct(c, cGoal));
  setProgress("apply", fillPct(a, aGoal));

  document.getElementById("plot-connect").classList.toggle("done", c >= cGoal);
  document.getElementById("plot-apply").classList.toggle("done", a >= aGoal);

  const coach = SproutCoach.buildCoach(state, lastAction);
  document.getElementById("coach-main").textContent = coach.main;
  document.getElementById("coach-wrap").classList.toggle("hidden", !coach.show);
}

async function save({ sync = true } = {}) {
  state = SproutStats.upsertToday(state);
  const svg = SproutStats.buildChartSvg(state, state.goals);
  const report = SproutStats.buildReport(state);
  const markdown = SproutStats.buildStatsMarkdown(report);
  await window.sproutAPI.saveProgress(state);
  await window.sproutAPI.saveStats({ svg, report, markdown });
  if (sync) scheduleAutoSync();
}

function scheduleAutoSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(autoSyncGithub, 2500);
}

async function autoSyncGithub() {
  try {
    await window.sproutAPI.syncGithub();
  } catch {
    /* silent background sync */
  }
}

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

async function addConnect() {
  const prev = state.connects.count;
  const goal = state.goals.connectsWeekly;
  state.connects.count += 1;
  SproutStats.addDaily(state, "connects", 1);

  SproutFX.step(document.getElementById("plot-connect"), "connect", state.connects.count, goal);
  updateUI("connect");

  if (prev < goal && state.connects.count >= goal) {
    SproutSounds.bloom();
    SproutFX.victory(document.getElementById("plot-connect"));
  }

  await save();
}

async function addApply() {
  const prev = state.applications.count;
  const goal = state.goals.applicationsDaily;
  state.applications.count += 1;
  SproutStats.addDaily(state, "applications", 1);

  SproutFX.step(document.getElementById("plot-apply"), "apply", state.applications.count, goal);
  updateUI("apply");

  if (prev < goal && state.applications.count >= goal) {
    SproutSounds.bloom();
    SproutFX.victory(document.getElementById("plot-apply"));
  }

  await save();
}

async function resetAll() {
  const weekStart = mondayOf(new Date());
  const today = todayStr();
  state = {
    connects: { count: 0, weekStart },
    applications: { count: 0, date: today },
    goals: state?.goals || { connectsWeekly: 100, applicationsDaily: 50 },
    history: [],
    daily: [{ date: today, connects: 0, applications: 0 }],
  };
  updateUI();
  await save();
  showToast("Reset to 0");
}

async function syncGithub() {
  try {
    await save();
    const r = await window.sproutAPI.syncGithub();
    showToast(r.ok ? r.message : "Sync failed");
  } catch {
    showToast("Sync failed");
  }
}

async function init() {
  window.SproutApp = { addConnect, addApply };

  document.getElementById("hero-connect").innerHTML = SproutSprites.connect();
  document.getElementById("hero-apply").innerHTML = SproutSprites.apply();
  document.getElementById("goal-connect").innerHTML = SproutSprites.goal;
  document.getElementById("goal-apply").innerHTML = SproutSprites.goal;

  let data = await window.sproutAPI.loadProgress();
  if (!data.goals) data.goals = { connectsWeekly: 100, applicationsDaily: 50 };
  if (!data.history) data.history = [];
  if (!data.daily) data.daily = [];
  state = ensurePeriods(data);
  updateUI();
  await save({ sync: false });

  window.sproutAPI.onHotkey((action) => {
    if (action === "connect") addConnect();
    if (action === "apply") addApply();
    if (action === "sync") syncGithub();
    if (action === "reset") resetAll();
  });

  setInterval(() => {
    const next = ensurePeriods(structuredClone(state));
    if (JSON.stringify(next) !== JSON.stringify(state)) {
      state = next;
      updateUI();
      save();
    }
  }, 60000);
}

init();
