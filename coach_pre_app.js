// کل برنامه‌ی مربی Premium در یک فایل.
// ابتدا ابزارها و داده‌ی مشترک (coach_pre_common.js)، سپس هر صفحه‌ی قبلی به‌صورت یک تابع بسته (IIFE)
// تا متغیرهایش با بقیه تداخل نکند. در هر نما: $ و byId به idهای همان نما (با پیشوند) نگاه می‌کنند و
// document.querySelectorAll → root.querySelectorAll (محدود به همان نما).
const VIEWS = {};

// ==================== مشترک: coach_pre_common.js ====================
// ابزارها و داده‌ی نمونه‌ی مشترک بین صفحه‌های مربی
const fa = (n, d = 0) => Number(n).toLocaleString("fa-IR", { maximumFractionDigits: d, minimumFractionDigits: d });
const $ = (id) => document.getElementById(id);
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function toast(msg) {
  const t = el("div", "toast", msg);
  t.setAttribute("role", "status");
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

const CATS = ["کاهش وزن", "حجم", "مبتدی"];

// ورزشکاران زیرمجموعه (نمونه) — بعداً از بک‌اند
const ATHLETES = [
  { id: 1, name: "سارا محمدی", cat: "حجم", adh: 92, idle: 0, wd: 1.2, sessions: 14, pr: "ددلیفت ۸۵ کیلو", newPr: true },
  { id: 2, name: "امیر کریمی", cat: "کاهش وزن", adh: 85, idle: 1, wd: -2.4, sessions: 12, pr: "پرس سینه ۷۰ کیلو" },
  { id: 3, name: "مهدی احمدی", cat: "مبتدی", adh: 48, idle: 5, wd: 0.3, sessions: 5, pr: "اسکوات ۴۰ کیلو" },
  { id: 4, name: "نگار رستمی", cat: "کاهش وزن", adh: 78, idle: 2, wd: -1.6, sessions: 11, pr: "لانژ ۲۰ کیلو" },
  { id: 5, name: "پویا صادقی", cat: "حجم", adh: 66, idle: 4, wd: 2.1, sessions: 8, pr: "ددلیفت ۱۱۰ کیلو" },
  { id: 6, name: "الهام نوری", cat: "مبتدی", adh: 95, idle: 0, wd: -0.8, sessions: 15, pr: "پلانک ۲ دقیقه" },
  { id: 7, name: "حسین فرجی", cat: "حجم", adh: 71, idle: 3, wd: 1.0, sessions: 9, pr: "پرس سرشانه ۴۵ کیلو" },
];

// تنظیمات اعلان مربی (در صفحه‌ی پروفایل تغییر می‌کند)
const DEFAULT_SETTINGS = { autoRemind: true, idleDays: 3, weight: true, pr: true, priority: true };
function getSettings() {
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("coachSettings") || "{}") }; }
  catch { return { ...DEFAULT_SETTINGS }; }
}
function saveSettings(s) {
  try { localStorage.setItem("coachSettings", JSON.stringify(s)); } catch {}
}

// ==================== نما: chat ====================
(function () {
  const root = document.getElementById("view-chat");
  const byId = (id) => document.getElementById("chat-" + id);
  const $ = (id) => byId(id);

  const nowTime = () => new Date().toLocaleTimeString("fa-IR", { hour: "numeric", minute: "2-digit" });

  // گفت‌وگوها: a = ورزشکار، c = مربی؛ p = اولویت‌دار، done = پاسخ داده شده
  const convs = ATHLETES.slice(0, 5).map((a) => ({ id: a.id, name: a.name, msgs: [] }));
  convs[0].msgs = [{ f: "a", t: "سلام مربی، می‌تونم تمرین امروز رو فردا انجام بدم؟", time: "۹:۱۰", p: true }];
  convs[1].msgs = [{ f: "c", t: "وزنت این هفته عالی بود.", time: "دیروز" }, { f: "a", t: "ممنون! برای شام می‌تونم جایگزین ماهی داشته باشم؟", time: "۸:۴۰", p: true }];
  convs[2].msgs = [{ f: "a", t: "برنامه‌ی جدید رو دیدم، ممنون.", time: "دیروز" }, { f: "c", t: "خواهش می‌کنم، موفق باشی.", time: "دیروز" }];
  convs[3].msgs = [{ f: "a", t: "درد خفیفی تو زانو دارم، اسکوات رو ادامه بدم؟", time: "۷:۵۵", p: true }];
  convs[4].msgs = [{ f: "c", t: "فردا ددلیفت سنگین داری، خوب بخواب.", time: "دیروز" }];

  const forums = [
    { id: 1, name: "گروه حجم", members: 3, msgs: [
      { f: "c", t: "یادتون نره وزنه‌ها رو ثبت کنید.", time: "۸:۰۰" },
      { f: "s", s: "سارا", t: "رکورد جدید ددلیفتم ثبت شد!", time: "۱۰:۳۲" } ] },
    { id: 2, name: "گروه کاهش وزن", members: 2, msgs: [{ f: "c", t: "این هفته تمرکز روی پایبندی به رژیم باشه.", time: "دیروز" }] },
  ];

  let tab = "priority";
  let open = null; // { kind: "conv" | "forum", id }
  const pending = (c) => c.msgs.some((m) => m.p && !m.done);
  const lastText = (x) => (x.msgs.length ? x.msgs[x.msgs.length - 1].t : "هنوز پیامی نیست");

  function updateBadge() {
    const n = convs.filter(pending).length;
    $("prioN").textContent = fa(n);
    $("prioN").hidden = !n;
  }

  function convRow(c, showStar) {
    const b = el("button", "conv" + (pending(c) ? " prio" : ""));
    b.type = "button";
    const body = el("div", "conv-body");
    body.append(el("strong", null, c.name), el("span", null, lastText(c)));
    b.append(el("div", "avatar", c.name[0]), body);
    if (showStar && pending(c)) b.appendChild(el("span", "star", "★"));
    b.addEventListener("click", () => { open = { kind: "conv", id: c.id }; render(); });
    return b;
  }

  function renderList() {
    const view = $("view");
    view.innerHTML = "";
    const list = el("div", "list");
    if (tab === "priority") {
      const items = convs.filter(pending);
      if (!items.length) list.appendChild(el("p", "empty", "پیام اولویت‌دار بی‌پاسخی ندارید."));
      items.forEach((c) => list.appendChild(convRow(c, true)));
    } else if (tab === "convs") {
      convs.forEach((c) => list.appendChild(convRow(c, true)));
    } else {
      const form = el("form", "card new-forum");
      form.innerHTML = `<div class="form-row"><label class="field">تالار جدید<input required placeholder="نام تالار" /></label><label class="field">اعضا<select></select></label><button class="btn" type="submit">ایجاد</button></div>`;
      const sel = form.querySelector("select");
      ["همه‌ی ورزشکاران", ...CATS].forEach((c) => sel.appendChild(el("option", null, c)));
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.querySelector("input").value.trim();
        if (!name) return;
        const count = sel.value === "همه‌ی ورزشکاران" ? ATHLETES.length : ATHLETES.filter((a) => a.cat === sel.value).length;
        forums.push({ id: forums.length + 1, name, members: count, msgs: [] });
        toast("تالار ایجاد شد");
        render();
      });
      list.appendChild(form);
      forums.forEach((f) => {
        const b = el("button", "conv");
        b.type = "button";
        const body = el("div", "conv-body");
        body.append(el("strong", null, f.name), el("span", null, `${fa(f.members)} عضو · ${lastText(f)}`));
        b.append(el("div", "avatar", f.name[0]), body);
        b.addEventListener("click", () => { open = { kind: "forum", id: f.id }; render(); });
        list.appendChild(b);
      });
    }
    view.appendChild(list);
  }

  function drawMsgs(box, thread, isForum) {
    box.innerHTML = "";
    if (!thread.msgs.length) box.appendChild(el("p", "empty", "گفت‌وگو را شروع کنید."));
    thread.msgs.forEach((m) => {
      const d = el("div", "msg " + (m.f === "c" ? "out" : "in") + (m.p && !m.done ? " priority" : ""));
      if (isForum && m.f === "s") d.appendChild(el("span", "sender", m.s));
      d.append(m.t, el("span", "time", m.time));
      box.appendChild(d);
    });
    box.scrollTop = box.scrollHeight;
  }

  function renderThread() {
    const isForum = open.kind === "forum";
    const thread = (isForum ? forums : convs).find((x) => x.id === open.id);
    const view = $("view");
    view.innerHTML = "";

    const peer = el("div", "peer");
    const back = el("button", "icon-btn", "‹ بازگشت");
    back.type = "button";
    back.addEventListener("click", () => { open = null; render(); });
    peer.append(back, el("h2", null, thread.name), el("div", "avatar", thread.name[0]));

    const box = el("div", "messages");
    const form = el("form", "composer");
    form.innerHTML = `<input type="text" placeholder="${isForum ? "پیام به تالار…" : "پاسخ به ورزشکار…"}" aria-label="پیام" /><button class="send-btn" type="submit" aria-label="ارسال">➤</button>`;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      const t = input.value.trim();
      if (!t) return;
      if (!isForum) thread.msgs.forEach((m) => { if (m.p) m.done = true; }); // پاسخ مربی = پیام اولویت‌دار پاسخ داده شد
      thread.msgs.push({ f: "c", t, time: nowTime() });
      input.value = "";
      drawMsgs(box, thread, isForum);
      updateBadge();
    });
    view.append(peer, box, form);
    drawMsgs(box, thread, isForum);
  }

  function render() {
    $("tabs").hidden = !!open;
    updateBadge();
    open ? renderThread() : renderList();
  }

  root.querySelectorAll(".tab").forEach((t) =>
    t.addEventListener("click", () => {
      tab = t.dataset.tab;
      root.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x === t));
      render();
    })
  );
  render();

  // هنگام نمایش نما، اگر گفت‌وگویی باز است پیام‌ها به آخر اسکرول شوند (وقتی نما پنهان بود اسکرول معنا نداشت)
  VIEWS.chat = {
    onShow() {
      const l = root.querySelector(".messages");
      if (l) l.scrollTop = l.scrollHeight;
    },
  };
})();

// ==================== نما: athletes ====================
(function () {
  const root = document.getElementById("view-athletes");
  const byId = (id) => document.getElementById("athletes-" + id);
  const $ = (id) => byId(id);

  let filter = "همه";
  const dismissed = new Set();
  const reminded = new Set();
  const settings = getSettings();

  function renderStats() {
    const a = ATHLETES;
    $("sTotal").textContent = fa(a.length);
    $("sActive").textContent = fa(a.filter((x) => x.idle === 0).length);
    $("sAttn").textContent = fa(a.filter((x) => x.idle >= settings.idleDays).length);
    $("sAvg").textContent = fa(a.length ? a.reduce((s, x) => s + x.adh, 0) / a.length : 0) + "٪";
  }

  function buildAlerts() {
    const list = [];
    ATHLETES.forEach((x) => {
      if (x.idle >= settings.idleDays)
        list.push({ key: x.id + "i", x, title: "بدون ثبت تمرین", text: `${fa(x.idle)} روز است تمرین ثبت نکرده`, remind: true });
      if (settings.weight && Math.abs(x.wd) >= 2)
        list.push({ key: x.id + "w", x, title: "تغییر مهم وزن", text: `${x.wd > 0 ? "+" : "−"}${fa(Math.abs(x.wd), 1)} کیلوگرم در ماه اخیر`, info: true });
      if (settings.pr && x.newPr)
        list.push({ key: x.id + "p", x, title: "رکورد جدید", text: x.pr, info: true });
    });
    return list.filter((a) => !dismissed.has(a.key));
  }

  function renderAlerts() {
    const box = $("alerts");
    box.innerHTML = "";
    const list = buildAlerts();
    $("alertN").textContent = fa(list.length);
    if (!list.length) box.appendChild(el("p", "empty", "هشدار جدیدی وجود ندارد."));
    list.forEach((a) => {
      const row = el("div", "alert" + (a.info ? " info" : ""));
      const txt = el("div", "alert-text");
      txt.append(el("strong", null, `${a.x.name} · ${a.title}`), el("span", null, a.text));
      row.appendChild(txt);
      if (a.remind) {
        const auto = settings.autoRemind;
        const b = el("button", "btn", auto || reminded.has(a.key) ? "ارسال شد" : "یادآوری");
        b.type = "button";
        b.disabled = auto || reminded.has(a.key);
        b.title = auto ? "یادآوری خودکار فعال است" : "";
        b.addEventListener("click", () => { reminded.add(a.key); toast(`یادآوری برای ${a.x.name} ارسال شد`); renderAlerts(); });
        row.appendChild(b);
      }
      const x = el("button", "icon-btn", "✕");
      x.type = "button";
      x.setAttribute("aria-label", "بستن هشدار");
      x.addEventListener("click", () => { dismissed.add(a.key); renderAlerts(); });
      row.appendChild(x);
      box.appendChild(row);
    });
  }

  function renderFilters() {
    const box = $("filters");
    box.innerHTML = "";
    ["همه", ...CATS].forEach((c) => {
      const b = el("button", "chip" + (c === filter ? " on" : ""), c);
      b.type = "button";
      b.addEventListener("click", () => { filter = c; renderFilters(); renderList(); });
      box.appendChild(b);
    });
  }

  function renderList() {
    const box = $("athletes");
    box.innerHTML = "";
    const list = ATHLETES.filter((x) => filter === "همه" || x.cat === filter).sort((a, b) => b.adh - a.adh);
    if (!list.length) box.appendChild(el("p", "empty", "ورزشکاری در این دسته نیست."));
    list.forEach((x) => {
      const d = el("details", "ath");
      const s = el("summary");
      const top = el("div", "ath-top");
      top.append(el("span", "dot" + (x.idle >= settings.idleDays ? " idle" : "")), el("strong", null, x.name), el("span", "cat", x.cat));
      const bar = el("div", "bar");
      const fill = el("i");
      fill.style.width = x.adh + "%";
      bar.appendChild(fill);
      s.append(top, el("span", "pct", fa(x.adh) + "٪"), bar);
      d.appendChild(s);

      const body = el("div", "ath-body");
      const cell = (label, val) => { const c = el("div"); c.append(el("small", null, label), el("strong", null, val)); return c; };
      body.append(
        cell("جلسات این ماه", fa(x.sessions)),
        cell("آخرین فعالیت", x.idle === 0 ? "امروز" : `${fa(x.idle)} روز پیش`),
        cell("تغییر وزن (ماه)", `${x.wd > 0 ? "+" : x.wd < 0 ? "−" : ""}${fa(Math.abs(x.wd), 1)} کیلوگرم`),
        cell("بهترین رکورد", x.pr)
      );
      const go = el("div", "go");
      const a1 = el("a", "btn ghost", "پیام"); a1.href = "#chat";
      const a2 = el("a", "btn ghost", "ارسال برنامه"); a2.href = "#programs";
      go.append(a1, a2);
      body.appendChild(go);
      d.appendChild(body);
      box.appendChild(d);
    });
  }

  $("newCat").append(...CATS.map((c) => el("option", null, c)));
  $("addForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("newName").value.trim();
    if (!name) return;
    ATHLETES.push({ id: Math.max(...ATHLETES.map((a) => a.id)) + 1, name, cat: $("newCat").value, adh: 0, idle: 0, wd: 0, sessions: 0, pr: "—" });
    $("newName").value = "";
    toast("ورزشکار اضافه شد");
    renderStats(); renderList();
  });

  renderStats(); renderAlerts(); renderFilters(); renderList();

  // قبلاً با هر ورود به این صفحه، تنظیمات اعلانِ پروفایل دوباره خوانده می‌شد؛ حالا موقع نمایش نما همین کار را می‌کنیم
  VIEWS.athletes = {
    onShow() {
      Object.assign(settings, getSettings());
      renderStats();
      renderAlerts();
      renderFilters();
      renderList();
    },
  };
})();

// ==================== نما: programs ====================
(function () {
  const root = document.getElementById("view-programs");
  const byId = (id) => document.getElementById("programs-" + id);
  const $ = (id) => byId(id);

  const templates = [
    { id: 1, name: "حجم‌گیری ۴ روزه", type: "تمرینی", weeks: 8, sent: 4 },
    { id: 2, name: "کاهش وزن مبتدی", type: "تمرینی", weeks: 6, sent: 3 },
    { id: 3, name: "رژیم ۲۰۰۰ کالری پروتئینی", type: "غذایی", weeks: 4, sent: 2 },
    { id: 4, name: "فول‌بادی مبتدی", type: "تمرینی", weeks: 4, sent: 2 },
  ];
  const DAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
  const schedule = [
    { day: 0, tpl: 1, target: "دسته‌ی حجم" },
    { day: 1, tpl: 2, target: "دسته‌ی کاهش وزن" },
    { day: 3, tpl: 4, target: "دسته‌ی مبتدی" },
    { day: 5, tpl: 1, target: "دسته‌ی حجم" },
  ];
  const todayIdx = (new Date().getDay() + 1) % 7;
  const tplName = (id) => (templates.find((t) => t.id === id) || { name: "(حذف‌شده)" }).name;

  /* ---- تب‌ها ---- */
  root.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      root.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
      root.querySelectorAll(".panel").forEach((p) => (p.hidden = p.id !== "programs-" + tab.dataset.target));
    });
  });

  /* ---- قالب‌ها ---- */
  function renderTemplates() {
    const box = $("templates");
    box.innerHTML = "";
    templates.forEach((t) => {
      const c = el("article", "card tpl");
      const top = el("div", "tpl-top");
      top.append(el("h3", null, t.name), el("span", "type" + (t.type === "غذایی" ? " food" : ""), t.type));
      const meta = el("div", "tpl-meta");
      meta.append(el("span", "muted", `${fa(t.weeks)} هفته`), el("span", "muted", `ارسال‌شده به ${fa(t.sent)} ورزشکار`));
      const act = el("div", "tpl-actions");
      const send = el("button", "btn", "ارسال گروهی");
      const copy = el("button", "btn ghost", "کپی");
      const edit = el("button", "btn ghost", "شخصی‌سازی نام");
      [send, copy, edit].forEach((b) => (b.type = "button"));
      send.addEventListener("click", () => openSend(t));
      copy.addEventListener("click", () => {
        templates.push({ ...t, id: Math.max(...templates.map((x) => x.id)) + 1, name: t.name + " (کپی)", sent: 0 });
        renderTemplates(); renderCalSelects(); toast("نسخه‌ی کپی ساخته شد");
      });
      edit.addEventListener("click", () => {
        const n = prompt("نام جدید قالب:", t.name);
        if (n && n.trim()) { t.name = n.trim(); renderTemplates(); renderCalSelects(); renderCalendar(); }
      });
      act.append(send, copy, edit);
      c.append(top, meta, act);
      box.appendChild(c);
    });
  }
  $("tplForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("tplName").value.trim();
    if (!name) return;
    templates.push({ id: Math.max(...templates.map((x) => x.id)) + 1, name, type: $("tplType").value, weeks: +$("tplWeeks").value || 4, sent: 0 });
    $("tplName").value = "";
    renderTemplates(); renderCalSelects(); toast("قالب ساخته شد");
  });

  /* ---- ارسال گروهی ---- */
  let sendTpl = null;
  function openSend(t) {
    sendTpl = t;
    $("sendTitle").textContent = `ارسال «${t.name}»`;
    const cats = $("sendCats");
    cats.innerHTML = "";
    const boxes = $("sendList");
    boxes.innerHTML = "";
    ATHLETES.forEach((a) => {
      const row = el("label", "check-row");
      const cb = el("input"); cb.type = "checkbox"; cb.dataset.cat = a.cat;
      row.append(cb, el("span", null, a.name), el("small", null, a.cat));
      boxes.appendChild(row);
    });
    const mk = (label, fn) => { const b = el("button", "chip", label); b.type = "button"; b.addEventListener("click", fn); cats.appendChild(b); };
    mk("همه", () => boxes.querySelectorAll("input").forEach((i) => (i.checked = true)));
    CATS.forEach((c) => mk(c, () => boxes.querySelectorAll("input").forEach((i) => (i.checked = i.dataset.cat === c))));
    mk("هیچ‌کدام", () => boxes.querySelectorAll("input").forEach((i) => (i.checked = false)));
    $("sendDlg").showModal();
  }
  $("sendCancel").addEventListener("click", () => $("sendDlg").close());
  $("sendGo").addEventListener("click", () => {
    const n = $("sendList").querySelectorAll("input:checked").length;
    if (!n) return toast("حداقل یک ورزشکار انتخاب کنید");
    sendTpl.sent += n;
    $("sendDlg").close();
    renderTemplates();
    toast(`برنامه برای ${fa(n)} ورزشکار ارسال شد`);
  });

  /* ---- تقویم ---- */
  function renderCalendar() {
    const box = $("calendar");
    box.innerHTML = "";
    DAYS.forEach((d, i) => {
      const c = el("div", "card day-card" + (i === todayIdx ? " today" : ""));
      const name = el("div", "day-name", d);
      if (i === todayIdx) name.appendChild(el("small", null, "امروز"));
      const slots = el("div", "slots");
      const items = schedule.filter((s) => s.day === i);
      if (!items.length) slots.appendChild(el("span", "muted", "برنامه‌ای ثبت نشده"));
      items.forEach((s) => {
        const chip = el("span", "slot");
        chip.append(el("span", null, tplName(s.tpl)), el("small", null, s.target));
        const x = el("button", "icon-btn", "✕");
        x.type = "button"; x.setAttribute("aria-label", "حذف از تقویم");
        x.addEventListener("click", () => { schedule.splice(schedule.indexOf(s), 1); renderCalendar(); });
        chip.appendChild(x);
        slots.appendChild(chip);
      });
      c.append(name, slots);
      box.appendChild(c);
    });
  }
  function renderCalSelects() {
    $("calTpl").innerHTML = "";
    templates.forEach((t) => { const o = el("option", null, t.name); o.value = t.id; $("calTpl").appendChild(o); });
  }
  DAYS.forEach((d, i) => { const o = el("option", null, d); o.value = i; $("calDay").appendChild(o); });
  ["همه‌ی ورزشکاران", ...CATS.map((c) => "دسته‌ی " + c), ...ATHLETES.map((a) => a.name)].forEach((t) => $("calTarget").appendChild(el("option", null, t)));
  $("calDay").value = todayIdx;
  $("calForm").addEventListener("submit", (e) => {
    e.preventDefault();
    schedule.push({ day: +$("calDay").value, tpl: +$("calTpl").value, target: $("calTarget").value });
    renderCalendar(); toast("به تقویم اضافه شد");
  });

  renderTemplates(); renderCalSelects(); renderCalendar();

})();

// ==================== نما: user ====================
(function () {
  const root = document.getElementById("view-user");
  const byId = (id) => document.getElementById("user-" + id);
  const $ = (id) => byId(id);

  const profile = {
    first: "علی", last: "رضایی", height: 182, weight: 85, city: "تهران", country: "ایران",
    history: "۱۰ سال مربیگری بدنسازی و تغذیه‌ی ورزشی", years: 10,
  };
  const medals = [
    { t: "مربی برتر استان تهران", s: "فدراسیون بدنسازی · ۱۴۰۳" },
    { t: "مدرک مربیگری درجه‌ی یک", s: "فدراسیون بدنسازی · ۱۳۹۹" },
    { t: "مربی تیم قهرمان لیگ شهری", s: "۱۴۰۲" },
  ];
  const store = {
    name: "فروشگاه مربی علی",
    products: [
      { name: "پروتئین وی ۲ پوند", price: 1450000 },
      { name: "کش تمرینی مقاومتی", price: 320000 },
      { name: "پکیج مشاوره‌ی ماهانه", price: 900000 },
    ],
  };

  function renderProfile() {
    $("fullName").textContent = `${profile.first} ${profile.last}`;
    $("avatar").textContent = profile.first[0];
    $("place").textContent = `${profile.city}، ${profile.country}`;
    $("history").textContent = profile.history;
    $("sAth").textContent = fa(ATHLETES.length);
    $("sYears").textContent = fa(profile.years);
    $("sProd").textContent = fa(store.products.length);
  }
  function renderMedals() {
    medals.forEach((m) => {
      const li = el("li");
      li.append(el("strong", null, m.t), el("small", null, m.s));
      $("medals").appendChild(li);
    });
  }

  /* ویرایش پروفایل */
  const form = $("profileForm"), editBtn = $("editBtn");
  let editing = false;
  const fillForm = () => Object.keys(profile).forEach((k) => { if (form.elements[k]) form.elements[k].value = profile[k]; });
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

  /* فروشگاه */
  function renderStore() {
    $("storeName").textContent = store.name;
    const box = $("products");
    box.innerHTML = "";
    if (!store.products.length) box.appendChild(el("p", "empty", "هنوز محصولی ثبت نشده."));
    store.products.forEach((p) => {
      const row = el("div", "product");
      row.append(el("strong", null, p.name), el("span", "price", fa(p.price) + " تومان"));
      const x = el("button", "icon-btn", "✕");
      x.type = "button"; x.setAttribute("aria-label", "حذف محصول");
      x.addEventListener("click", () => { store.products.splice(store.products.indexOf(p), 1); renderStore(); renderProfile(); });
      row.appendChild(x);
      box.appendChild(row);
    });
  }
  $("prodForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("pName").value.trim(), price = +$("pPrice").value;
    if (!name || price < 0) return;
    store.products.push({ name, price });
    $("pName").value = ""; $("pPrice").value = "";
    renderStore(); renderProfile(); toast("محصول ثبت شد");
  });

  /* تنظیمات اعلان (ذخیره در مرورگر؛ صفحه‌ی ورزشکاران از همین تنظیمات استفاده می‌کند) */
  const settings = getSettings();
  [2, 3, 5, 7].forEach((d) => { const o = el("option", null, `${fa(d)} روز`); o.value = d; $("idleDays").appendChild(o); });
  $("idleDays").value = settings.idleDays;
  ["autoRemind", "weight", "pr", "priority"].forEach((k) => {
    $(k).checked = settings[k];
    $(k).addEventListener("change", () => { settings[k] = $(k).checked; saveSettings(settings); });
  });
  $("idleDays").addEventListener("change", () => { settings.idleDays = +$("idleDays").value; saveSettings(settings); });

  renderProfile(); renderMedals(); fillForm(); renderStore();

  // تعداد ورزشکاران و محصولات (آمار بالای صفحه) موقع نمایش نما به‌روز شود
  VIEWS.user = {
    onShow() {
      renderProfile();
    },
  };
})();

// ==================== ناوبری (فوتر) ====================
const ORDER = ['chat', 'athletes', 'programs', 'user'];
const TITLES = {'chat': 'چت', 'athletes': 'ورزشکاران من', 'programs': 'مدیریت برنامه\u200cها', 'user': 'پروفایل مربی'};
const DEFAULT_VIEW = "athletes";
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

// لینک «تنظیم اعلان‌ها» (#settings) = صفحه‌ی پروفایل و اسکرول به بخش تنظیمات (مثل لینک قبلی coach_pre_user.html#settings)
function route() {
  const h = location.hash.slice(1);
  if (h === "settings") {
    show("user");
    const s = document.getElementById("user-settings");
    if (s) s.scrollIntoView();
  } else show(h);
}
window.addEventListener("hashchange", route);
route();
