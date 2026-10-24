const ex = (name, sets, rest, done = false) => ({ name, sets, rest, done });

const days = [
  {
    d: "ش",
    name: "شنبه",
    focus: "سینه و پشت بازو",
    list: [
      ex("پرس سینه هالتر", "۴ × ۱۰", "۹۰ ثانیه", true),
      ex("پرس بالا سینه دمبل", "۳ × ۱۲", "۶۰ ثانیه", true),
      ex("دیپ", "۳ × ۱۰", "۶۰ ثانیه", true),
      ex("پشت بازو سیم‌کش", "۳ × ۱۲", "۴۵ ثانیه", true),
    ],
  },
  {
    d: "ی",
    name: "یکشنبه",
    focus: "پا",
    list: [
      ex("اسکوات", "۴ × ۸", "۱۲۰ ثانیه", true),
      ex("پرس پا", "۳ × ۱۲", "۹۰ ثانیه", true),
      ex("لانژ", "۳ × ۱۰", "۶۰ ثانیه", true),
      ex("ساق پا ایستاده", "۴ × ۱۵", "۴۵ ثانیه", false),
    ],
  },
  { d: "د", name: "دوشنبه", focus: "استراحت", rest: true, list: [] },
  {
    d: "س",
    name: "سه‌شنبه",
    focus: "پشت و جلو بازو",
    list: [
      ex("بارفیکس", "۴ × ۸", "۹۰ ثانیه", true),
      ex("روئینگ هالتر", "۴ × ۱۰", "۹۰ ثانیه", true),
      ex("لت سیم‌کش", "۳ × ۱۲", "۶۰ ثانیه", true),
      ex("جلو بازو دمبل", "۳ × ۱۲", "۴۵ ثانیه", true),
    ],
  },
  {
    d: "چ",
    name: "چهارشنبه",
    focus: "شانه",
    list: [
      ex("پرس سرشانه", "۴ × ۱۰", "۹۰ ثانیه", true),
      ex("نشر از جانب", "۴ × ۱۵", "۴۵ ثانیه", true),
      ex("نشر خم", "۳ × ۱۵", "۴۵ ثانیه", false),
      ex("شراگ", "۳ × ۱۲", "۶۰ ثانیه", false),
    ],
  },
  {
    d: "پ",
    name: "پنجشنبه",
    focus: "هوازی و شکم",
    list: [
      ex("دویدن روی تردمیل", "۲۰ دقیقه", "—"),
      ex("پلانک", "۳ × ۶۰ ثانیه", "۳۰ ثانیه"),
      ex("کرانچ", "۳ × ۲۰", "۳۰ ثانیه"),
      ex("بالا آوردن پا", "۳ × ۱۵", "۳۰ ثانیه"),
    ],
  },
  { d: "ج", name: "جمعه", focus: "استراحت", rest: true, list: [] },
];

const PROGRAM = {
  weeks: 8,
  current: 3,
  sessionsPerWeek: days.filter((x) => !x.rest).length,
};

const todayIdx = (new Date().getDay() + 1) % 7;
let selected = todayIdx;

const fa = (n) => Math.round(n).toLocaleString("fa-IR");
const pctOf = (day) =>
  day.list.length
    ? (day.list.filter((e) => e.done).length / day.list.length) * 100
    : 0;

function renderWeek() {
  const box = document.getElementById("week");
  box.innerHTML = "";
  days.forEach((day, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className =
      "day" +
      (i === selected ? " selected-day" : "") +
      (i === todayIdx ? " today" : "") +
      (day.rest ? " is-rest" : "");
    b.innerHTML = `<div class="col"><i></i></div><span></span>`;
    b.querySelector("i").style.height = day.rest
      ? "4%"
      : Math.max(pctOf(day), 4) + "%";
    b.querySelector("span").textContent = day.d;
    b.title =
      day.name + (day.rest ? " (استراحت)" : " — " + fa(pctOf(day)) + "٪");
    b.addEventListener("click", () => {
      selected = i;
      render();
    });
    box.appendChild(b);
  });
}

function item(e, onToggle) {
  const el = document.createElement("label");
  el.className = "item" + (e.done ? " done" : "");
  el.innerHTML = `<input type="checkbox" /><span class="box"></span><div><strong></strong><small></small></div><button type="button" class="lock-mini" data-premium="ثبت جزئیات تمرین (وزن، تکرار، رکورد)">🔒 جزئیات</button>`;
  el.querySelector("input").checked = e.done;
  el.querySelector("strong").textContent = e.name;
  el.querySelector("small").textContent = `${e.sets} · استراحت ${e.rest}`;
  el.querySelector("input").addEventListener("change", onToggle);
  return el;
}

function renderDay() {
  const day = days[selected];
  const done = day.list.filter((e) => e.done).length;
  const pct = pctOf(day);

  document.getElementById("dayName").textContent =
    day.name + (selected === todayIdx ? " (امروز)" : "");
  document.getElementById("dayFocus").textContent = day.focus;
  document.getElementById("dayCount").textContent = day.rest
    ? "روز استراحت"
    : `${fa(done)} از ${fa(day.list.length)} حرکت`;
  document.getElementById("percent").textContent = day.rest
    ? "—"
    : fa(pct) + "٪";

  const C = 2 * Math.PI * 52;
  const ring = document.getElementById("ringFill");
  ring.style.strokeDasharray = C;
  ring.style.strokeDashoffset = C * (1 - (day.rest ? 0 : pct) / 100);

  document.getElementById("lists").hidden = day.rest;
  document.getElementById("restBox").hidden = !day.rest;
  if (day.rest) return;

  const todo = document.getElementById("todoList"),
    dn = document.getElementById("doneList");
  todo.innerHTML = "";
  dn.innerHTML = "";
  day.list.forEach((e) => {
    (e.done ? dn : todo).appendChild(
      item(e, () => {
        e.done = !e.done;
        render();
      }),
    );
  });
  if (!todo.children.length)
    todo.innerHTML = `<p class="empty">همه‌ی حرکت‌ها انجام شد. دمت گرم!</p>`;
  if (!dn.children.length)
    dn.innerHTML = `<p class="empty">هنوز حرکتی انجام نشده. با اولین حرکت شروع کنید.</p>`;
  document.getElementById("todoN").textContent = fa(day.list.length - done);
  document.getElementById("doneN").textContent = fa(done);
}

function renderProgram() {
  const perWeek = PROGRAM.sessionsPerWeek;
  const total = PROGRAM.weeks * perWeek;
  const pastDone = (PROGRAM.current - 1) * perWeek;
  const thisWeek = days
    .filter((x) => !x.rest)
    .reduce((s, x) => s + pctOf(x) / 100, 0);
  const pct = ((pastDone + thisWeek) / total) * 100;

  document.getElementById("programWeek").textContent =
    `هفته‌ی ${fa(PROGRAM.current)} از ${fa(PROGRAM.weeks)}`;
  document.getElementById("programBar").style.width = pct + "%";
  document.getElementById("programText").textContent =
    `${fa(pct)}٪ از دوره طی شده`;
  document.getElementById("programLeft").textContent =
    `${fa(PROGRAM.weeks - PROGRAM.current)} هفته‌ی دیگر`;
}

function render() {
  renderWeek();
  renderDay();
  renderProgram();
}
render();
