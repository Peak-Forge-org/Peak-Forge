// کل برنامه‌ی «ورزشکار بدون Premium» در یک فایل.
// ابتدا کد مشترک، سپس هر صفحه‌ی قبلی به‌صورت یک تابع بسته (IIFE) تا متغیرهایش با بقیه تداخل نکند.
// در هر نما: $ و byId به idهای همان نما (با پیشوند) نگاه می‌کنند و document.querySelectorAll → root.querySelectorAll.
const VIEWS = {};

// ==================== مشترک ====================
// هر عنصری که data-premium داشته باشد، قفل است و به‌جای کارکرد عادی، یادداشت Premium نشان می‌دهد
let premiumDlg;
function premiumNote(feature) {
  if (!premiumDlg) {
    premiumDlg = document.createElement("dialog");
    premiumDlg.className = "premium";
    premiumDlg.innerHTML = `
      <h2>🔒 مخصوص کاربران Premium</h2>
      <p class="pm-msg"></p>
      <ul>
        <li>تحلیل پیشرفته‌ی پیشرفت و گزارش PDF</li>
        <li>برنامه‌ی غذایی با محاسبه‌ی کالری و جایگزین</li>
        <li>ثبت جزئیات تمرین و رکورد شخصی</li>
        <li>سیستم انگیزشی، سکه و کد تخفیف</li>
      </ul>
      <div class="pm-actions">
        <a class="pm-buy" href="#">خرید اشتراک Premium</a>
        <button class="pm-close" type="button">بعداً</button>
      </div>`;
    premiumDlg.querySelector(".pm-close").addEventListener("click", () => premiumDlg.close());
    premiumDlg.addEventListener("click", (e) => { if (e.target === premiumDlg) premiumDlg.close(); });
    document.body.appendChild(premiumDlg);
  }
  premiumDlg.querySelector(".pm-msg").textContent =
    feature === "upgrade"
      ? "با اشتراک Premium به همه‌ی امکانات پیشرفته‌ی پلتفرم دسترسی پیدا می‌کنید."
      : `برای استفاده از «${feature}» باید اشتراک Premium تهیه کنید.`;
  premiumDlg.showModal();
}

// فاز capture: قبل از هر کلیک‌گیر دیگری اجرا می‌شود
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-premium]");
  if (!t) return;
  e.preventDefault();
  e.stopPropagation();
  premiumNote(t.dataset.premium);
}, true);

// ==================== نما: chat ====================
(function () {
  const root = document.getElementById("view-chat");
  const byId = (id) => document.getElementById("chat-" + id);

  // تغییر بین چت مربی و تالار
  root.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      root.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      root.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = byId(tab.dataset.target);
      panel.classList.add("active");
      const list = panel.querySelector(".messages");
      list.scrollTop = list.scrollHeight;
    });
  });

  // ارسال پیام
  root.querySelectorAll(".composer").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      const text = input.value.trim();
      if (!text) return;

      const list = byId(form.dataset.list);
      const msg = document.createElement("div");
      msg.className = "msg out";
      if (form.classList.contains("is-priority")) msg.classList.add("priority");

      msg.textContent = text;
      const time = document.createElement("span");
      time.className = "time";
      time.textContent = new Date().toLocaleTimeString("fa-IR", { hour: "numeric", minute: "2-digit" });
      msg.appendChild(time);

      list.appendChild(msg);
      list.scrollTop = list.scrollHeight;
      input.value = "";
    });
  });

  root.querySelectorAll(".messages").forEach((l) => (l.scrollTop = l.scrollHeight));

  // هنگام نمایش نما، پیام‌ها به آخر اسکرول شوند (وقتی نما پنهان بود اسکرول معنا نداشت)
  VIEWS.chat = {
    onShow() {
      const l = root.querySelector(".panel.active .messages");
      if (l) l.scrollTop = l.scrollHeight;
    },
  };
})();

// ==================== نما: exercise ====================
(function () {
  const root = document.getElementById("view-exercise");
  const byId = (id) => document.getElementById("exercise-" + id);

  // داده‌ی نمونه — بعداً از بک‌اند (برنامه‌ی مربی) می‌آید
  const ex = (name, sets, rest, done = false) => ({ name, sets, rest, done });

  const days = [
    { d: "ش", name: "شنبه", focus: "سینه و پشت بازو", list: [
      ex("پرس سینه هالتر", "۴ × ۱۰", "۹۰ ثانیه", true), ex("پرس بالا سینه دمبل", "۳ × ۱۲", "۶۰ ثانیه", true),
      ex("دیپ", "۳ × ۱۰", "۶۰ ثانیه", true), ex("پشت بازو سیم‌کش", "۳ × ۱۲", "۴۵ ثانیه", true) ] },
    { d: "ی", name: "یکشنبه", focus: "پا", list: [
      ex("اسکوات", "۴ × ۸", "۱۲۰ ثانیه", true), ex("پرس پا", "۳ × ۱۲", "۹۰ ثانیه", true),
      ex("لانژ", "۳ × ۱۰", "۶۰ ثانیه", true), ex("ساق پا ایستاده", "۴ × ۱۵", "۴۵ ثانیه", false) ] },
    { d: "د", name: "دوشنبه", focus: "استراحت", rest: true, list: [] },
    { d: "س", name: "سه‌شنبه", focus: "پشت و جلو بازو", list: [
      ex("بارفیکس", "۴ × ۸", "۹۰ ثانیه", true), ex("روئینگ هالتر", "۴ × ۱۰", "۹۰ ثانیه", true),
      ex("لت سیم‌کش", "۳ × ۱۲", "۶۰ ثانیه", true), ex("جلو بازو دمبل", "۳ × ۱۲", "۴۵ ثانیه", true) ] },
    { d: "چ", name: "چهارشنبه", focus: "شانه", list: [
      ex("پرس سرشانه", "۴ × ۱۰", "۹۰ ثانیه", true), ex("نشر از جانب", "۴ × ۱۵", "۴۵ ثانیه", true),
      ex("نشر خم", "۳ × ۱۵", "۴۵ ثانیه", false), ex("شراگ", "۳ × ۱۲", "۶۰ ثانیه", false) ] },
    { d: "پ", name: "پنجشنبه", focus: "هوازی و شکم", list: [
      ex("دویدن روی تردمیل", "۲۰ دقیقه", "—"), ex("پلانک", "۳ × ۶۰ ثانیه", "۳۰ ثانیه"),
      ex("کرانچ", "۳ × ۲۰", "۳۰ ثانیه"), ex("بالا آوردن پا", "۳ × ۱۵", "۳۰ ثانیه") ] },
    { d: "ج", name: "جمعه", focus: "استراحت", rest: true, list: [] },
  ];

  // طول دوره: ۸ هفته، هفته‌ی جاری ۳، دو هفته‌ی قبل کامل انجام شده
  const PROGRAM = { weeks: 8, current: 3, sessionsPerWeek: days.filter((x) => !x.rest).length };

  // امروز (هفته‌ی ایرانی از شنبه شروع می‌شود)
  const todayIdx = (new Date().getDay() + 1) % 7;
  let selected = todayIdx;

  const fa = (n) => Math.round(n).toLocaleString("fa-IR");
  const pctOf = (day) => (day.list.length ? (day.list.filter((e) => e.done).length / day.list.length) * 100 : 0);

  function renderWeek() {
    const box = byId("week");
    box.innerHTML = "";
    days.forEach((day, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "day" + (i === selected ? " selected-day" : "") + (i === todayIdx ? " today" : "") + (day.rest ? " is-rest" : "");
      b.innerHTML = `<div class="col"><i></i></div><span></span>`;
      b.querySelector("i").style.height = day.rest ? "4%" : Math.max(pctOf(day), 4) + "%";
      b.querySelector("span").textContent = day.d;
      b.title = day.name + (day.rest ? " (استراحت)" : " — " + fa(pctOf(day)) + "٪");
      b.addEventListener("click", () => { selected = i; render(); });
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

    byId("dayName").textContent = day.name + (selected === todayIdx ? " (امروز)" : "");
    byId("dayFocus").textContent = day.focus;
    byId("dayCount").textContent = day.rest ? "روز استراحت" : `${fa(done)} از ${fa(day.list.length)} حرکت`;
    byId("percent").textContent = day.rest ? "—" : fa(pct) + "٪";

    const C = 2 * Math.PI * 52;
    const ring = byId("ringFill");
    ring.style.strokeDasharray = C;
    ring.style.strokeDashoffset = C * (1 - (day.rest ? 0 : pct) / 100);

    byId("lists").hidden = day.rest;
    byId("restBox").hidden = !day.rest;
    if (day.rest) return;

    const todo = byId("todoList"), dn = byId("doneList");
    todo.innerHTML = ""; dn.innerHTML = "";
    day.list.forEach((e) => {
      (e.done ? dn : todo).appendChild(item(e, () => { e.done = !e.done; render(); }));
    });
    if (!todo.children.length) todo.innerHTML = `<p class="empty">همه‌ی حرکت‌ها انجام شد. دمت گرم!</p>`;
    if (!dn.children.length) dn.innerHTML = `<p class="empty">هنوز حرکتی انجام نشده. با اولین حرکت شروع کنید.</p>`;
    byId("todoN").textContent = fa(day.list.length - done);
    byId("doneN").textContent = fa(done);
  }

  function renderProgram() {
    const perWeek = PROGRAM.sessionsPerWeek;
    const total = PROGRAM.weeks * perWeek;
    const pastDone = (PROGRAM.current - 1) * perWeek;
    const thisWeek = days.filter((x) => !x.rest).reduce((s, x) => s + pctOf(x) / 100, 0);
    const pct = ((pastDone + thisWeek) / total) * 100;

    byId("programWeek").textContent = `هفته‌ی ${fa(PROGRAM.current)} از ${fa(PROGRAM.weeks)}`;
    byId("programBar").style.width = pct + "%";
    byId("programText").textContent = `${fa(pct)}٪ از دوره طی شده`;
    byId("programLeft").textContent = `${fa(PROGRAM.weeks - PROGRAM.current)} هفته‌ی دیگر`;
  }

  function render() { renderWeek(); renderDay(); renderProgram(); }
  render();

})();

// ==================== نما: diet ====================
(function () {
  const root = document.getElementById("view-diet");
  const byId = (id) => document.getElementById("diet-" + id);

  // داده‌ی نمونه — بعداً از بک‌اند (برنامه‌ی مربی) می‌آید
  const meals = [
    { name: "صبحانه", time: "۷:۳۰", items: "املت ۳ تخم‌مرغ، نان سبوس‌دار، چای", kcal: 520, p: 32, c: 48, f: 22, alt: "جو دوسر با شیر و موز", done: true },
    { name: "میان‌وعده صبح", time: "۱۰:۳۰", items: "ماست یونانی و گردو", kcal: 220, p: 15, c: 12, f: 12, alt: "پنیر کم‌چرب و خیار", done: true },
    { name: "ناهار", time: "۱۳:۳۰", items: "سینه مرغ گریل، برنج ۱ پیمانه، سالاد", kcal: 680, p: 52, c: 70, f: 18, alt: "ماهی گریل با سیب‌زمینی پخته", done: false },
    { name: "میان‌وعده عصر", time: "۱۷:۰۰", items: "موز و کره بادام‌زمینی", kcal: 250, p: 7, c: 32, f: 11, alt: "سیب و مغز بادام", done: false },
    { name: "شام", time: "۲۰:۳۰", items: "خوراک لوبیا و ماهی تن، سبزی", kcal: 480, p: 38, c: 40, f: 16, alt: "املت سبزیجات با نان", done: false },
  ];
  const week = [
    { d: "ش", v: 92 }, { d: "ی", v: 80 }, { d: "د", v: 100 },
    { d: "س", v: 65 }, { d: "چ", v: 88 }, { d: "پ", v: 0 }, { d: "ج", v: null }, // ج = امروز
  ];
  const TODAY = 6;

  const fa = (n) => Math.round(n).toLocaleString("fa-IR");
  const sum = (key, onlyDone) =>
    meals.filter((m) => !onlyDone || m.done).reduce((s, m) => s + m[key], 0);

  function renderMeals() {
    const box = byId("meals");
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
    const total = meals.length, done = meals.filter((m) => m.done).length;
    const pct = total ? (done / total) * 100 : 0;

    const R = 52, C = 2 * Math.PI * R;
    const ring = byId("ringFill");
    ring.style.strokeDasharray = C;
    ring.style.strokeDashoffset = C * (1 - pct / 100);

    byId("percent").textContent = fa(pct) + "٪";
    byId("calDone").textContent = fa(done);
    byId("calTotal").textContent = fa(total);

    week[TODAY].v = pct;
    renderWeek();
  }

  function renderWeek() {
    const box = byId("week");
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

})();

// ==================== نما: user ====================
(function () {
  const root = document.getElementById("view-user");
  const byId = (id) => document.getElementById("user-" + id);

  // داده‌ی نمونه — بعداً از بک‌اند می‌آید
  const profile = {
    first: "امیر", last: "کریمی", height: 178, weight: 79.5,
    city: "تهران", country: "ایران", history: "۴ سال بدنسازی، ۲ سال کراس‌فیت", years: 4,
  };
  const medals = [
    { t: "مدال طلا — مسابقات پرس سینه", s: "باشگاه‌های تهران · ۱۴۰۳" },
    { t: "مدال نقره — ددلیفت", s: "جام دانشجویی · ۱۴۰۲" },
    { t: "عنوان سوم — کراس‌فیت تیمی", s: "لیگ شهری · ۱۴۰۲" },
  ];

  const fa = (n, d = 0) => Number(n).toLocaleString("fa-IR", { maximumFractionDigits: d, minimumFractionDigits: d });
  const $ = (id) => byId(id);

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

  function renderMedals() {
    medals.forEach((m) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong></strong><small></small>`;
      li.querySelector("strong").textContent = m.t;
      li.querySelector("small").textContent = m.s;
      $("medals").appendChild(li);
    });
  }

  // ویرایش / ذخیره‌ی اطلاعات
  const form = $("profileForm");
  const editBtn = $("editBtn");
  let editing = false;

  function fillForm() {
    Object.keys(profile).forEach((k) => { if (form.elements[k]) form.elements[k].value = profile[k]; });
  }
  editBtn.addEventListener("click", () => {
    if (editing) {
      ["first", "last", "city", "country", "history"].forEach((k) => (profile[k] = form.elements[k].value.trim() || profile[k]));
      ["height", "weight"].forEach((k) => { const v = parseFloat(form.elements[k].value); if (v > 0) profile[k] = v; });
      renderProfile();
    }
    editing = !editing;
    form.querySelectorAll("input").forEach((i) => (i.disabled = !editing));
    form.classList.toggle("editing", editing);
    editBtn.textContent = editing ? "ذخیره" : "ویرایش";
    if (!editing) fillForm();
  });

  renderProfile(); renderMedals(); fillForm();

})();

// ==================== ناوبری (فوتر) ====================
const ORDER = ['chat', 'exercise', 'diet', 'user'];
const TITLES = {'chat': 'چت', 'exercise': 'برنامه\u200cی تمرینی', 'diet': 'رژیم غذایی', 'user': 'پروفایل'};
const DEFAULT_VIEW = "chat";
const navItems = document.querySelectorAll(".footer [data-view]");

function show(name) {
  if (!ORDER.includes(name)) name = DEFAULT_VIEW;
  ORDER.forEach((n) => (document.getElementById("view-" + n).hidden = n !== name));
  navItems.forEach((item) => {
    const on = item.dataset.view === name;
    item.className = on ? "selected" : "icon";
    item.querySelector("img").src = on ? item.dataset.activeSrc : item.dataset.src;
    const a = item.querySelector("a");
    if (on) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = TITLES[name];
  window.scrollTo(0, 0);
  if (VIEWS[name] && VIEWS[name].onShow) VIEWS[name].onShow();
}
window.addEventListener("hashchange", () => show(location.hash.slice(1)));
show(location.hash.slice(1));
