const templates = [
  { id: 1, name: "حجم‌گیری ۴ روزه", type: "تمرینی", weeks: 8, sent: 4 },
  { id: 2, name: "کاهش وزن مبتدی", type: "تمرینی", weeks: 6, sent: 3 },
  { id: 3, name: "رژیم ۲۰۰۰ کالری پروتئینی", type: "غذایی", weeks: 4, sent: 2 },
  { id: 4, name: "فول‌بادی مبتدی", type: "تمرینی", weeks: 4, sent: 2 },
];
const DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];
const schedule = [
  { day: 0, tpl: 1, target: "دسته‌ی حجم" },
  { day: 1, tpl: 2, target: "دسته‌ی کاهش وزن" },
  { day: 3, tpl: 4, target: "دسته‌ی مبتدی" },
  { day: 5, tpl: 1, target: "دسته‌ی حجم" },
];
const todayIdx = (new Date().getDay() + 1) % 7;
const tplName = (id) =>
  (templates.find((t) => t.id === id) || { name: "(حذف‌شده)" }).name;

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.toggle("active", t === tab));
    document
      .querySelectorAll(".panel")
      .forEach((p) => (p.hidden = p.id !== tab.dataset.target));
  });
});

function renderTemplates() {
  const box = $("templates");
  box.innerHTML = "";
  templates.forEach((t) => {
    const c = el("article", "card tpl");
    const top = el("div", "tpl-top");
    top.append(
      el("h3", null, t.name),
      el("span", "type" + (t.type === "غذایی" ? " food" : ""), t.type),
    );
    const meta = el("div", "tpl-meta");
    meta.append(
      el("span", "muted", `${fa(t.weeks)} هفته`),
      el("span", "muted", `ارسال‌شده به ${fa(t.sent)} ورزشکار`),
    );
    const act = el("div", "tpl-actions");
    const send = el("button", "btn", "ارسال گروهی");
    const copy = el("button", "btn ghost", "کپی");
    const edit = el("button", "btn ghost", "شخصی‌سازی نام");
    [send, copy, edit].forEach((b) => (b.type = "button"));
    send.addEventListener("click", () => openSend(t));
    copy.addEventListener("click", () => {
      templates.push({
        ...t,
        id: Math.max(...templates.map((x) => x.id)) + 1,
        name: t.name + " (کپی)",
        sent: 0,
      });
      renderTemplates();
      renderCalSelects();
      toast("نسخه‌ی کپی ساخته شد");
    });
    edit.addEventListener("click", () => {
      const n = prompt("نام جدید قالب:", t.name);
      if (n && n.trim()) {
        t.name = n.trim();
        renderTemplates();
        renderCalSelects();
        renderCalendar();
      }
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
  templates.push({
    id: Math.max(...templates.map((x) => x.id)) + 1,
    name,
    type: $("tplType").value,
    weeks: +$("tplWeeks").value || 4,
    sent: 0,
  });
  $("tplName").value = "";
  renderTemplates();
  renderCalSelects();
  toast("قالب ساخته شد");
});

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
    const cb = el("input");
    cb.type = "checkbox";
    cb.dataset.cat = a.cat;
    row.append(cb, el("span", null, a.name), el("small", null, a.cat));
    boxes.appendChild(row);
  });
  const mk = (label, fn) => {
    const b = el("button", "chip", label);
    b.type = "button";
    b.addEventListener("click", fn);
    cats.appendChild(b);
  };
  mk("همه", () =>
    boxes.querySelectorAll("input").forEach((i) => (i.checked = true)),
  );
  CATS.forEach((c) =>
    mk(c, () =>
      boxes
        .querySelectorAll("input")
        .forEach((i) => (i.checked = i.dataset.cat === c)),
    ),
  );
  mk("هیچ‌کدام", () =>
    boxes.querySelectorAll("input").forEach((i) => (i.checked = false)),
  );
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

function renderCalendar() {
  const box = $("calendar");
  box.innerHTML = "";
  DAYS.forEach((d, i) => {
    const c = el("div", "card day-card" + (i === todayIdx ? " today" : ""));
    const name = el("div", "day-name", d);
    if (i === todayIdx) name.appendChild(el("small", null, "امروز"));
    const slots = el("div", "slots");
    const items = schedule.filter((s) => s.day === i);
    if (!items.length)
      slots.appendChild(el("span", "muted", "برنامه‌ای ثبت نشده"));
    items.forEach((s) => {
      const chip = el("span", "slot");
      chip.append(
        el("span", null, tplName(s.tpl)),
        el("small", null, s.target),
      );
      const x = el("button", "icon-btn", "✕");
      x.type = "button";
      x.setAttribute("aria-label", "حذف از تقویم");
      x.addEventListener("click", () => {
        schedule.splice(schedule.indexOf(s), 1);
        renderCalendar();
      });
      chip.appendChild(x);
      slots.appendChild(chip);
    });
    c.append(name, slots);
    box.appendChild(c);
  });
}
function renderCalSelects() {
  $("calTpl").innerHTML = "";
  templates.forEach((t) => {
    const o = el("option", null, t.name);
    o.value = t.id;
    $("calTpl").appendChild(o);
  });
}
DAYS.forEach((d, i) => {
  const o = el("option", null, d);
  o.value = i;
  $("calDay").appendChild(o);
});
[
  "همه‌ی ورزشکاران",
  ...CATS.map((c) => "دسته‌ی " + c),
  ...ATHLETES.map((a) => a.name),
].forEach((t) => $("calTarget").appendChild(el("option", null, t)));
$("calDay").value = todayIdx;
$("calForm").addEventListener("submit", (e) => {
  e.preventDefault();
  schedule.push({
    day: +$("calDay").value,
    tpl: +$("calTpl").value,
    target: $("calTarget").value,
  });
  renderCalendar();
  toast("به تقویم اضافه شد");
});

renderTemplates();
renderCalSelects();
renderCalendar();
