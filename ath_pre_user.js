const profile = {
  first: "امیر",
  last: "کریمی",
  height: 178,
  weight: 79.5,
  city: "تهران",
  country: "ایران",
  history: "۴ سال بدنسازی، ۲ سال کراس‌فیت",
  years: 4,
};
const game = {
  level: 7,
  xp: 640,
  xpNext: 1000,
  streak: 12,
  coins: 230,
  rank: 5,
};
const weights = [84, 83.2, 82.5, 82.8, 81.4, 80.6, 80.1, 79.5];
const medals = [
  { t: "مدال طلا — مسابقات پرس سینه", s: "باشگاه‌های تهران · ۱۴۰۳" },
  { t: "مدال نقره — ددلیفت", s: "جام دانشجویی · ۱۴۰۲" },
  { t: "عنوان سوم — کراس‌فیت تیمی", s: "لیگ شهری · ۱۴۰۲" },
];
const badges = [
  { t: "۷ روز پیاپی", on: true },
  { t: "۳۰ روز پیاپی", on: false },
  { t: "اولین رکورد", on: true },
  { t: "۱۰۰ تمرین", on: false },
];

const fa = (n, d = 0) =>
  Number(n).toLocaleString("fa-IR", {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });
const $ = (id) => document.getElementById(id);

function renderProfile() {
  $("fullName").textContent = `${profile.first} ${profile.last}`;
  $("avatar").textContent = profile.first[0];
  $("place").textContent = `${profile.city}، ${profile.country}`;
  $("sHeight").textContent = fa(profile.height);
  $("sWeight").textContent = fa(profile.weight, 1);
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);
  $("sBmi").textContent = fa(bmi, 1);
  $("sYears").textContent = fa(profile.years);
}

function renderGame() {
  $("level").textContent = fa(game.level);
  $("xpText").textContent = `${fa(game.xp)} / ${fa(game.xpNext)} XP`;
  $("xpBar").style.width = (game.xp / game.xpNext) * 100 + "%";
  $("streak").textContent = fa(game.streak);
  $("coins").textContent = fa(game.coins);
  $("rank").textContent = fa(game.rank);
  $("badges").innerHTML = "";
  badges.forEach((b) => {
    const el = document.createElement("span");
    el.className = "chip" + (b.on ? " on" : "");
    el.textContent = (b.on ? "✓ " : "قفل · ") + b.t;
    $("badges").appendChild(el);
  });
}

function renderChart() {
  const W = 320,
    H = 140,
    px = 16,
    py = 20;
  const min = Math.min(...weights) - 1,
    max = Math.max(...weights) + 1;
  const pts = weights.map((w, i) => [
    px + (i / (weights.length - 1)) * (W - 2 * px),
    py + (1 - (w - min) / (max - min)) * (H - 2 * py - 14),
  ]);
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `${px},${H - 14} ${line} ${W - px},${H - 14}`;
  const last = pts[pts.length - 1];
  $("chart").innerHTML = `
    <polygon points="${area}" class="c-area"/>
    <polyline points="${line}" class="c-line"/>
    ${pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" class="c-dot"/>`).join("")}
    <circle cx="${last[0]}" cy="${last[1]}" r="5" class="c-last"/>
    <text x="${px}" y="${H - 1}" class="c-txt">۸ هفته پیش</text>
    <text x="${W - px}" y="${H - 1}" class="c-txt" text-anchor="end">الان</text>`;
  const d = weights[weights.length - 1] - weights[0];
  $("weightDelta").textContent =
    `${d <= 0 ? "−" : "+"}${fa(Math.abs(d), 1)} کیلوگرم در ۸ هفته`;
}

function renderMedals() {
  medals.forEach((m) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong></strong><small></small>`;
    li.querySelector("strong").textContent = m.t;
    li.querySelector("small").textContent = m.s;
    $("medals").appendChild(li);
  });
}

const form = $("profileForm");
const editBtn = $("editBtn");
let editing = false;

function fillForm() {
  Object.keys(profile).forEach((k) => {
    if (form.elements[k]) form.elements[k].value = profile[k];
  });
}
editBtn.addEventListener("click", () => {
  if (editing) {
    ["first", "last", "city", "country", "history"].forEach(
      (k) => (profile[k] = form.elements[k].value.trim() || profile[k]),
    );
    ["height", "weight"].forEach((k) => {
      const v = parseFloat(form.elements[k].value);
      if (v > 0) profile[k] = v;
    });
    renderProfile();
  }
  editing = !editing;
  form.querySelectorAll("input").forEach((i) => (i.disabled = !editing));
  form.classList.toggle("editing", editing);
  editBtn.textContent = editing ? "ذخیره" : "ویرایش";
  if (!editing) fillForm();
});

renderProfile();
renderGame();
renderChart();
renderMedals();
fillForm();
