const nowTime = () =>
  new Date().toLocaleTimeString("fa-IR", {
    hour: "numeric",
    minute: "2-digit",
  });

// گفت‌وگوها: a = ورزشکار، c = مربی؛ p = اولویت‌دار، done = پاسخ داده شده
const convs = ATHLETES.slice(0, 5).map((a) => ({
  id: a.id,
  name: a.name,
  msgs: [],
}));
convs[0].msgs = [
  {
    f: "a",
    t: "سلام مربی، می‌تونم تمرین امروز رو فردا انجام بدم؟",
    time: "۹:۱۰",
    p: true,
  },
];
convs[1].msgs = [
  { f: "c", t: "وزنت این هفته عالی بود.", time: "دیروز" },
  {
    f: "a",
    t: "ممنون! برای شام می‌تونم جایگزین ماهی داشته باشم؟",
    time: "۸:۴۰",
    p: true,
  },
];
convs[2].msgs = [
  { f: "a", t: "برنامه‌ی جدید رو دیدم، ممنون.", time: "دیروز" },
  { f: "c", t: "خواهش می‌کنم، موفق باشی.", time: "دیروز" },
];
convs[3].msgs = [
  {
    f: "a",
    t: "درد خفیفی تو زانو دارم، اسکوات رو ادامه بدم؟",
    time: "۷:۵۵",
    p: true,
  },
];
convs[4].msgs = [
  { f: "c", t: "فردا ددلیفت سنگین داری، خوب بخواب.", time: "دیروز" },
];

const forums = [
  {
    id: 1,
    name: "گروه حجم",
    members: 3,
    msgs: [
      { f: "c", t: "یادتون نره وزنه‌ها رو ثبت کنید.", time: "۸:۰۰" },
      { f: "s", s: "سارا", t: "رکورد جدید ددلیفتم ثبت شد!", time: "۱۰:۳۲" },
    ],
  },
  {
    id: 2,
    name: "گروه کاهش وزن",
    members: 2,
    msgs: [
      { f: "c", t: "این هفته تمرکز روی پایبندی به رژیم باشه.", time: "دیروز" },
    ],
  },
];

let tab = "convs";
let open = null; // { kind: "conv" | "forum", id }
const pending = () => false;
const lastText = (x) =>
  x.msgs.length ? x.msgs[x.msgs.length - 1].t : "هنوز پیامی نیست";

function updateBadge() {}

function convRow(c, showStar) {
  const b = el("button", "conv" + (pending(c) ? " prio" : ""));
  b.type = "button";
  const body = el("div", "conv-body");
  body.append(el("strong", null, c.name), el("span", null, lastText(c)));
  b.append(el("div", "avatar", c.name[0]), body);
  if (showStar && pending(c)) b.appendChild(el("span", "star", "★"));
  b.addEventListener("click", () => {
    open = { kind: "conv", id: c.id };
    render();
  });
  return b;
}

function renderList() {
  const view = $("view");
  view.innerHTML = "";
  const list = el("div", "list");
  if (tab === "priority") {
    const items = convs.filter(pending);
    if (!items.length)
      list.appendChild(el("p", "empty", "پیام اولویت‌دار بی‌پاسخی ندارید."));
    items.forEach((c) => list.appendChild(convRow(c, true)));
  } else if (tab === "convs") {
    convs.forEach((c) => list.appendChild(convRow(c, true)));
  } else {
    const form = el("form", "card new-forum");
    form.innerHTML = `<div class="form-row"><label class="field">تالار جدید<input required placeholder="نام تالار" /></label><label class="field">اعضا<select></select></label><button class="btn" type="submit">ایجاد</button></div>`;
    const sel = form.querySelector("select");
    ["همه‌ی ورزشکاران", ...CATS].forEach((c) =>
      sel.appendChild(el("option", null, c)),
    );
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("input").value.trim();
      if (!name) return;
      const count =
        sel.value === "همه‌ی ورزشکاران"
          ? ATHLETES.length
          : ATHLETES.filter((a) => a.cat === sel.value).length;
      forums.push({ id: forums.length + 1, name, members: count, msgs: [] });
      toast("تالار ایجاد شد");
      render();
    });
    list.appendChild(form);
    forums.forEach((f) => {
      const b = el("button", "conv");
      b.type = "button";
      const body = el("div", "conv-body");
      body.append(
        el("strong", null, f.name),
        el("span", null, `${fa(f.members)} عضو · ${lastText(f)}`),
      );
      b.append(el("div", "avatar", f.name[0]), body);
      b.addEventListener("click", () => {
        open = { kind: "forum", id: f.id };
        render();
      });
      list.appendChild(b);
    });
  }
  view.appendChild(list);
}

function drawMsgs(box, thread, isForum) {
  box.innerHTML = "";
  if (!thread.msgs.length)
    box.appendChild(el("p", "empty", "گفت‌وگو را شروع کنید."));
  thread.msgs.forEach((m) => {
    const d = el("div", "msg " + (m.f === "c" ? "out" : "in") + "");
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
  back.addEventListener("click", () => {
    open = null;
    render();
  });
  peer.append(
    back,
    el("h2", null, thread.name),
    el("div", "avatar", thread.name[0]),
  );

  const box = el("div", "messages");
  const form = el("form", "composer");
  form.innerHTML = `<input type="text" placeholder="${isForum ? "پیام به تالار…" : "پاسخ به ورزشکار…"}" aria-label="پیام" /><button class="send-btn" type="submit" aria-label="ارسال">➤</button>`;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const t = input.value.trim();
    if (!t) return;
    if (!isForum)
      thread.msgs.forEach((m) => {
        if (m.p) m.done = true;
      });
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

document.querySelectorAll(".tab").forEach((t) =>
  t.addEventListener("click", () => {
    tab = t.dataset.tab;
    document
      .querySelectorAll(".tab")
      .forEach((x) => x.classList.toggle("active", x === t));
    render();
  }),
);
render();
