const meals = [
  {
    name: "صبحانه",
    time: "۷:۳۰",
    items: "املت ۳ تخم‌مرغ، نان سبوس‌دار، چای",
    kcal: 520,
    p: 32,
    c: 48,
    f: 22,
    alt: "جو دوسر با شیر و موز",
    done: true,
  },
  {
    name: "میان‌وعده صبح",
    time: "۱۰:۳۰",
    items: "ماست یونانی و گردو",
    kcal: 220,
    p: 15,
    c: 12,
    f: 12,
    alt: "پنیر کم‌چرب و خیار",
    done: true,
  },
  {
    name: "ناهار",
    time: "۱۳:۳۰",
    items: "سینه مرغ گریل، برنج ۱ پیمانه، سالاد",
    kcal: 680,
    p: 52,
    c: 70,
    f: 18,
    alt: "ماهی گریل با سیب‌زمینی پخته",
    done: false,
  },
  {
    name: "میان‌وعده عصر",
    time: "۱۷:۰۰",
    items: "موز و کره بادام‌زمینی",
    kcal: 250,
    p: 7,
    c: 32,
    f: 11,
    alt: "سیب و مغز بادام",
    done: false,
  },
  {
    name: "شام",
    time: "۲۰:۳۰",
    items: "خوراک لوبیا و ماهی تن، سبزی",
    kcal: 480,
    p: 38,
    c: 40,
    f: 16,
    alt: "املت سبزیجات با نان",
    done: false,
  },
];
const week = [
  { d: "ش", v: 92 },
  { d: "ی", v: 80 },
  { d: "د", v: 100 },
  { d: "س", v: 65 },
  { d: "چ", v: 88 },
  { d: "پ", v: 0 },
  { d: "ج", v: null }, // ج = امروز
];
const TODAY = 6;

const fa = (n) => Math.round(n).toLocaleString("fa-IR");
const sum = (key, onlyDone) =>
  meals.filter((m) => !onlyDone || m.done).reduce((s, m) => s + m[key], 0);

function renderMeals() {
  const box = document.getElementById("meals");
  box.innerHTML = "";
  meals.forEach((m, i) => {
    const el = document.createElement("article");
    el.className = "meal" + (m.done ? " done" : "");
    el.innerHTML = `
      <button class="check" aria-label="ثبت انجام" aria-pressed="${m.done}"></button>
      <div class="meal-body">
        <div class="row-head"><h3></h3><span class="muted"></span></div>
        <p class="items"></p>
        <div class="meal-foot">
          <button type="button" class="lock-mini" data-premium="محاسبه‌ی کالری و درشت‌مغذی‌ها">🔒 کالری و درشت‌مغذی‌ها</button>
          <button class="alt-btn lock-mini" type="button" data-premium="پیشنهاد جایگزین غذایی">🔒 جایگزین</button>
        </div>
      </div>`;
    el.querySelector("h3").textContent = m.name;
    el.querySelector(".muted").textContent = m.time;
    el.querySelector(".items").textContent = m.items;

    el.querySelector(".check").addEventListener("click", () => {
      m.done = !m.done;
      renderMeals();
      update();
    });
    box.appendChild(el);
  });
}

function update() {
  const total = meals.length,
    done = meals.filter((m) => m.done).length;
  const pct = total ? (done / total) * 100 : 0;

  const R = 52,
    C = 2 * Math.PI * R;
  const ring = document.getElementById("ringFill");
  ring.style.strokeDasharray = C;
  ring.style.strokeDashoffset = C * (1 - pct / 100);

  document.getElementById("percent").textContent = fa(pct) + "٪";
  document.getElementById("calDone").textContent = fa(done);
  document.getElementById("calTotal").textContent = fa(total);

  week[TODAY].v = pct;
  renderWeek();
}

function renderWeek() {
  const box = document.getElementById("week");
  box.innerHTML = "";
  week.forEach((w, i) => {
    const col = document.createElement("div");
    col.className = "day" + (i === TODAY ? " today" : "");
    col.innerHTML = `<div class="col"><i></i></div><span></span>`;
    col.querySelector("i").style.height = Math.max(w.v || 0, 4) + "%";
    col.querySelector("span").textContent = w.d;
    col.title = fa(w.v || 0) + "٪";
    box.appendChild(col);
  });
}

renderMeals();
update();
