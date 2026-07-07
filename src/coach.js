function localDateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekDaysLeft() {
  const d = new Date().getDay();
  return d === 0 ? 1 : 8 - d;
}

function hoursLeftToday() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return Math.max((end - now) / 3600000, 0.5);
}

function avgRecent(history, type, n = 7) {
  const rows = history.filter((h) => h.type === type).slice(-n);
  if (!rows.length) return null;
  return rows.reduce((s, r) => s + r.count, 0) / rows.length;
}

function streakDays(history) {
  const apps = history
    .filter((h) => h.type === "applications" && h.count >= 1)
    .map((h) => h.period)
    .sort()
    .reverse();
  if (!apps.length) return 0;

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = localDateStr(d);
    if (apps.includes(key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function paceStatus(count, goal, timeFraction) {
  const expected = goal * timeFraction;
  const ratio = count / Math.max(expected, 0.01);
  if (count >= goal) return "done";
  if (ratio >= 0.9) return "on-track";
  if (ratio >= 0.6) return "ok";
  return "behind";
}

function weekTimeFraction() {
  const d = new Date().getDay();
  const day = d === 0 ? 7 : d;
  return day / 7;
}

function dayTimeFraction() {
  const now = new Date();
  return (now.getHours() * 60 + now.getMinutes()) / 1440;
}

const ENCOURAGE = {
  connect: ["Let's-a go!", "Nice connect!", "Jump! +1"],
  apply: ["Wahoo! +1", "Another one!", "Mario time!"],
  done: ["Goal reached!", "You made it!", "All done for now!"],
  morning: ["Good morning — let's go!", "Fresh day, fresh start"],
  evening: ["Push a little more!", "Almost there"],
  streak: (n) => [`${n}-day apply streak!`, `${n} days strong — keep going`],
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildCoach(state, lastAction) {
  const cGoal = state.goals.connectsWeekly;
  const aGoal = state.goals.applicationsDaily;
  const c = state.connects.count;
  const a = state.applications.count;
  const cLeft = Math.max(cGoal - c, 0);
  const aLeft = Math.max(aGoal - a, 0);
  const cDone = c >= cGoal;
  const aDone = a >= aGoal;

  if (lastAction === "connect") {
    return { main: random(ENCOURAGE.connect), sub: "", show: true };
  }
  if (lastAction === "apply") {
    return { main: random(ENCOURAGE.apply), sub: "", show: true };
  }

  const hour = new Date().getHours();
  const streak = streakDays(state.history);
  const subs = [];
  let main = "";
  let urgent = false;

  if (!aDone && paceStatus(a, aGoal, dayTimeFraction()) === "behind") {
    const perHour = Math.ceil(aLeft / hoursLeftToday());
    subs.push(`${aLeft} apps left — ~${perHour}/hr`);
    urgent = true;
  }

  if (!cDone && paceStatus(c, cGoal, weekTimeFraction()) === "behind") {
    const perDay = Math.ceil(cLeft / weekDaysLeft());
    subs.push(`${cLeft} connects left — ~${perDay}/day`);
    urgent = true;
  }

  if (cDone && aDone) {
    main = random(ENCOURAGE.done);
    urgent = true;
  } else if (cDone || aDone) {
    main = cDone ? "Connects done — keep applying" : "Apps done — finish connects";
    urgent = true;
  } else if (hour >= 20 && (!aDone || !cDone)) {
    main = random(ENCOURAGE.evening);
    urgent = true;
  } else if (streak >= 3) {
    main = random(ENCOURAGE.streak(streak));
    urgent = true;
  }

  return { main, sub: subs[0] || "", show: urgent };
}

window.SproutCoach = {
  buildCoach,
  weekDaysLeft,
  hoursLeftToday,
};
