// کل برنامه‌ی ورزشکار Premium در یک فایل.
// هر صفحه‌ی قبلی یک تابع بسته (IIFE) شده تا متغیرهایش با بقیه تداخل نکند؛
// کد هر صفحه همان کد قبلی است، فقط document.getElementById → byId (با پیشوند نما) و
// document.querySelectorAll → root.querySelectorAll (محدود به همان نما).
const VIEWS = {};

// هویت کاربر فعلی در دایرکتوری (ورزشکار: امیر کریمی)
const ME_ID = "a2";

// ============================================================================
// ماژول مشترک: دایرکتوری افراد، جست‌وجو، پروفایل، اعضای تالار، فروشگاه و سبد خرید
// (یک کد برای ورزشکار و مربی؛ فقط ME_ID فرق می‌کند)
// قانون: گفت‌وگوی شخصی فقط بین «مربی» و «ورزشکار» ممکن است (ورزشکار↔ورزشکار و مربی↔مربی نه).
// ============================================================================
const DIRECTORY = [
  // ---- مربیان ----
  {
    id: "c1",
    role: "coach",
    first: "علی",
    last: "رضایی",
    email: "ali.rezaei@example.com",
    city: "تهران",
    country: "ایران",
    height: 182,
    weight: 85,
    years: 10,
    history: "۱۰ سال مربیگری بدنسازی و تغذیه‌ی ورزشی",
    photo: "",
    medals: [
      { t: "مربی برتر استان تهران", s: "فدراسیون بدنسازی · ۱۴۰۳" },
      { t: "مدرک مربیگری درجه‌ی یک", s: "فدراسیون بدنسازی · ۱۳۹۹" },
      { t: "مربی تیم قهرمان لیگ شهری", s: "۱۴۰۲" },
    ],
  },
  {
    id: "c2",
    role: "coach",
    first: "مریم",
    last: "صادقی",
    email: "maryam.sadeghi@example.com",
    city: "اصفهان",
    country: "ایران",
    height: 168,
    weight: 62,
    years: 8,
    history: "مربی کراس‌فیت و تناسب‌اندام بانوان",
    photo: "",
    medals: [{ t: "مربی برتر کراس‌فیت بانوان", s: "فدراسیون · ۱۴۰۲" }],
  },
  {
    id: "c3",
    role: "coach",
    first: "رضا",
    last: "توکلی",
    email: "reza.tavakoli@example.com",
    city: "مشهد",
    country: "ایران",
    height: 185,
    weight: 92,
    years: 14,
    history: "مربی پاورلیفتینگ و آمادگی جسمانی",
    photo: "",
    medals: [
      { t: "قهرمان پاورلیفتینگ کشور", s: "۱۳۹۸" },
      { t: "داور بین‌المللی", s: "۱۴۰۱" },
    ],
  },
  // ---- ورزشکاران مربی علی (a1..a11؛ a1..a7 همان ورزشکاران پنل مربی‌اند) ----
  {
    id: "a1",
    role: "athlete",
    coach: "c1",
    first: "سارا",
    last: "محمدی",
    email: "sara.mohammadi@example.com",
    city: "تهران",
    country: "ایران",
    height: 168,
    weight: 61,
    years: 3,
    history: "۳ سال بدنسازی و ددلیفت",
    photo: "",
    medals: [{ t: "مدال نقره — ددلیفت بانوان", s: "جام دانشجویی · ۱۴۰۳" }],
  },
  {
    id: "a2",
    role: "athlete",
    coach: "c1",
    first: "امیر",
    last: "کریمی",
    email: "amir.karimi@example.com",
    city: "تهران",
    country: "ایران",
    height: 178,
    weight: 79.5,
    years: 4,
    history: "۴ سال بدنسازی، ۲ سال کراس‌فیت",
    photo: "",
    medals: [
      { t: "مدال طلا — مسابقات پرس سینه", s: "باشگاه‌های تهران · ۱۴۰۳" },
      { t: "مدال نقره — ددلیفت", s: "جام دانشجویی · ۱۴۰۲" },
      { t: "عنوان سوم — کراس‌فیت تیمی", s: "لیگ شهری · ۱۴۰۲" },
    ],
  },
  {
    id: "a3",
    role: "athlete",
    coach: "c1",
    first: "مهدی",
    last: "احمدی",
    email: "mahdi.ahmadi@example.com",
    city: "کرج",
    country: "ایران",
    height: 175,
    weight: 88,
    years: 1,
    history: "تازه‌کار، شروع از ۶ ماه پیش",
    photo: "",
    medals: [],
  },
  {
    id: "a4",
    role: "athlete",
    coach: "c1",
    first: "نگار",
    last: "رستمی",
    email: "negar.rostami@example.com",
    city: "تهران",
    country: "ایران",
    height: 165,
    weight: 66,
    years: 2,
    history: "۲ سال تناسب‌اندام و دویدن",
    photo: "",
    medals: [],
  },
  {
    id: "a5",
    role: "athlete",
    coach: "c1",
    first: "پویا",
    last: "صادقی",
    email: "pouya.sadeghi@example.com",
    city: "شیراز",
    country: "ایران",
    height: 181,
    weight: 90,
    years: 5,
    history: "۵ سال بدنسازی حجمی",
    photo: "",
    medals: [{ t: "عنوان دوم — مسابقات استانی", s: "فارس · ۱۴۰۲" }],
  },
  {
    id: "a6",
    role: "athlete",
    coach: "c1",
    first: "الهام",
    last: "نوری",
    email: "elham.nouri@example.com",
    city: "تهران",
    country: "ایران",
    height: 162,
    weight: 55,
    years: 1,
    history: "یک سال یوگا و بدنسازی سبک",
    photo: "",
    medals: [],
  },
  {
    id: "a7",
    role: "athlete",
    coach: "c1",
    first: "حسین",
    last: "فرجی",
    email: "hossein.faraji@example.com",
    city: "قم",
    country: "ایران",
    height: 179,
    weight: 84,
    years: 3,
    history: "۳ سال بدنسازی",
    photo: "",
    medals: [],
  },
  {
    id: "a8",
    role: "athlete",
    coach: "c1",
    first: "زهرا",
    last: "کاظمی",
    email: "zahra.kazemi@example.com",
    city: "تهران",
    country: "ایران",
    height: 166,
    weight: 58,
    years: 2,
    history: "۲ سال پیلاتس و بدنسازی",
    photo: "",
    medals: [],
  },
  {
    id: "a9",
    role: "athlete",
    coach: "c1",
    first: "کیان",
    last: "بهرامی",
    email: "kian.bahrami@example.com",
    city: "رشت",
    country: "ایران",
    height: 183,
    weight: 86,
    years: 6,
    history: "۶ سال کراس‌فیت",
    photo: "",
    medals: [{ t: "مدال برنز — کراس‌فیت", s: "شمال · ۱۴۰۳" }],
  },
  {
    id: "a10",
    role: "athlete",
    coach: "c1",
    first: "ستاره",
    last: "امینی",
    email: "setareh.amini@example.com",
    city: "تهران",
    country: "ایران",
    height: 170,
    weight: 63,
    years: 2,
    history: "۲ سال بدنسازی",
    photo: "",
    medals: [],
  },
  {
    id: "a11",
    role: "athlete",
    coach: "c1",
    first: "بهنام",
    last: "شریفی",
    email: "behnam.sharifi@example.com",
    city: "تبریز",
    country: "ایران",
    height: 177,
    weight: 81,
    years: 4,
    history: "۴ سال بدنسازی",
    photo: "",
    medals: [],
  },
  // ---- ورزشکارانی که مربی علی ندارند (برای نتایج جست‌وجو) ----
  {
    id: "a12",
    role: "athlete",
    coach: "c2",
    first: "دانیال",
    last: "عباسی",
    email: "danial.abbasi@example.com",
    city: "اصفهان",
    country: "ایران",
    height: 180,
    weight: 82,
    years: 3,
    history: "۳ سال کراس‌فیت",
    photo: "",
    medals: [],
  },
  {
    id: "a13",
    role: "athlete",
    coach: "c2",
    first: "مینا",
    last: "قاسمی",
    email: "mina.ghasemi@example.com",
    city: "اصفهان",
    country: "ایران",
    height: 164,
    weight: 57,
    years: 2,
    history: "۲ سال تناسب‌اندام",
    photo: "",
    medals: [],
  },
  {
    id: "a14",
    role: "athlete",
    coach: "c3",
    first: "آرش",
    last: "موسوی",
    email: "arash.mousavi@example.com",
    city: "مشهد",
    country: "ایران",
    height: 186,
    weight: 95,
    years: 7,
    history: "۷ سال پاورلیفتینگ",
    photo: "",
    medals: [{ t: "مدال طلا — پاورلیفتینگ", s: "خراسان · ۱۴۰۳" }],
  },
];
const STORES = {
  c1: {
    name: "فروشگاه مربی علی",
    products: [
      { id: "c1-1", name: "پروتئین وی ۲ پوند", price: 1450000 },
      { id: "c1-2", name: "کش تمرینی مقاومتی", price: 320000 },
      { id: "c1-3", name: "پکیج مشاوره‌ی ماهانه", price: 900000 },
    ],
  },
  c2: {
    name: "فروشگاه مریم صادقی",
    products: [
      { id: "c2-1", name: "شیکر ورزشی", price: 180000 },
      { id: "c2-2", name: "طناب کراس‌فیت", price: 260000 },
    ],
  },
  c3: {
    name: "فروشگاه رضا توکلی",
    products: [
      { id: "c3-1", name: "کمربند پاورلیفتینگ", price: 1250000 },
      { id: "c3-2", name: "مچ‌بند وزنه‌برداری", price: 210000 },
      { id: "c3-3", name: "کرم‌پودر منیزیم", price: 140000 },
    ],
  },
};

const SX = { forums: {}, chatHook: null };
const personById = (id) => DIRECTORY.find((p) => p.id === id);
const fullName = (p) => `${p.first} ${p.last}`.trim();
const canMessage = (a, b) => !!a && !!b && a.id !== b.id && a.role !== b.role; // فقط مربی↔ورزشکار
const roleLabel = (p) => (p.role === "coach" ? "مربی" : "ورزشکار");
const fmtN = (n, d = 0) =>
  Number(n).toLocaleString("fa-IR", {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });
const fmtP = (n) => fmtN(n) + " تومان";
const normQ = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200e\u200f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const maskEmail = (e) => {
  if (!e) return "—";
  const [l, d] = e.split("@");
  return `${l[0]}***@${d}`;
};
function h(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function icon(name, alt = "") {
  const i = document.createElement("img");
  i.src = `./icons/${name}.svg`;
  i.alt = alt;
  i.className = "sx-ic";
  return i;
}
function avatar(p, extra = "") {
  const a = h(
    "div",
    "sx-av" + (p.role === "coach" ? " coach" : "") + (extra ? " " + extra : ""),
  );
  if (p.photo) {
    const i = document.createElement("img");
    i.src = p.photo;
    i.alt = "";
    a.appendChild(i);
  } else a.textContent = p.first ? p.first[0] : "؟";
  return a;
}
function notify(msg) {
  const t = h("div", "sx-toast", msg);
  t.setAttribute("role", "status");
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}
// ورزشکارِ تازه‌اضافه‌شده در پنل مربی هم در دایرکتوری ثبت می‌شود (برای میانبر پیام)
SX.registerAthlete = (a) => {
  if (personById("a" + a.id)) return;
  const parts = a.name.trim().split(/\s+/);
  DIRECTORY.push({
    id: "a" + a.id,
    role: "athlete",
    coach: ME_ID,
    first: parts[0],
    last: parts.slice(1).join(" "),
    email: "",
    city: "",
    country: "",
    height: null,
    weight: null,
    years: null,
    history: "",
    photo: "",
    medals: [],
  });
};

// ---------------------------- سبد خرید ----------------------------
const Cart = (() => {
  const KEY = "cart_" + ME_ID;
  let items = [];
  try {
    items = JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {}
  const product = (it) =>
    ((STORES[it.sid] || {}).products || []).find((p) => p.id === it.pid);
  const clean = () => {
    items = items.filter((it) => product(it) && it.qty > 0);
  };
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  };
  const api = {
    get items() {
      clean();
      return items;
    },
    product,
    count() {
      clean();
      return items.reduce((s, it) => s + it.qty, 0);
    },
    total() {
      clean();
      return items.reduce((s, it) => s + product(it).price * it.qty, 0);
    },
    qty(pid) {
      const it = items.find((x) => x.pid === pid);
      return it ? it.qty : 0;
    },
    add(sid, pid) {
      if (sid === ME_ID) return;
      const it = items.find((x) => x.pid === pid);
      if (it) it.qty++;
      else items.push({ sid, pid, qty: 1 });
      api.changed();
    },
    set(pid, q) {
      const it = items.find((x) => x.pid === pid);
      if (!it) return;
      it.qty = Math.max(0, Math.min(99, q));
      api.changed();
    },
    remove(pid) {
      items = items.filter((x) => x.pid !== pid);
      api.changed();
    },
    clear() {
      items = [];
      api.changed();
    },
    changed() {
      clean();
      save();
      SX.updateBadges();
      Sheet.refresh();
    },
  };
  return api;
})();

// ---------------------------- صفحه‌ی تمام‌صفحه (Sheet) ----------------------------
const Sheet = (() => {
  let root,
    titleEl,
    body,
    backBtn,
    opener = null;
  const stack = [];
  function ensure() {
    if (root) return;
    root = h("div", "sx-sheet");
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    const bar = h("header", "sx-bar");
    backBtn = h("button", "sx-back", "‹ بازگشت");
    backBtn.type = "button";
    backBtn.addEventListener("click", () => Sheet.pop());
    titleEl = h("h2", "sx-title");
    const cb = h("button", "sx-cartbtn");
    cb.type = "button";
    cb.setAttribute("aria-label", "سبد خرید");
    cb.append(icon("cart", "سبد"), h("span", "sx-count"));
    cb.addEventListener("click", () => {
      const top = stack[stack.length - 1];
      if (!top || top.key !== "cart") SX.cart();
    });
    bar.append(backBtn, titleEl, cb);
    body = h("div", "sx-body");
    root.append(bar, body);
    document.body.appendChild(root);
    root.setAttribute("aria-labelledby", "sx-title-id");
    titleEl.id = "sx-title-id";
  }
  function draw(keepScroll) {
    const s = stack[stack.length - 1],
      y = keepScroll ? body.scrollTop : 0;
    titleEl.textContent = s.title;
    body.innerHTML = "";
    s.render(body);
    body.scrollTop = y;
    SX.updateBadges();
  }
  return {
    get isOpen() {
      return !!root && !root.hidden;
    },
    push(key, title, render) {
      ensure();
      if (!stack.length) opener = document.activeElement;
      stack.push({ key, title, render });
      root.hidden = false;
      document.body.classList.add("sx-lock");
      draw(false);
      backBtn.focus();
    },
    replace(key, title, render) {
      stack[stack.length - 1] = { key, title, render };
      draw(false);
    },
    pop() {
      stack.pop();
      if (!stack.length) Sheet.closeAll();
      else draw(false);
    },
    closeAll() {
      stack.length = 0;
      if (root) root.hidden = true;
      document.body.classList.remove("sx-lock");
      SX.updateBadges();
      if (opener && opener.focus && document.contains(opener)) opener.focus();
      opener = null;
    },
    refresh() {
      if (stack.length) draw(true);
    },
  };
})();
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && Sheet.isOpen) {
    e.preventDefault();
    Sheet.pop();
  }
});

// نشان‌ها و دکمه‌ی شناور سبد
let fab;
SX.updateBadges = () => {
  const n = Cart.count();
  document.querySelectorAll(".sx-count").forEach((e) => {
    e.textContent = n ? fmtN(n) : "";
    e.hidden = !n;
  });
  if (!fab) {
    fab = h("button", "sx-fab");
    fab.type = "button";
    fab.setAttribute("aria-label", "سبد خرید");
    fab.append(icon("cart", "سبد"), h("span", "sx-count"));
    fab.addEventListener("click", () => SX.cart());
    document.body.appendChild(fab);
  }
  fab.hidden = !n || Sheet.isOpen;
  const c = fab.querySelector(".sx-count");
  c.textContent = n ? fmtN(n) : "";
  c.hidden = !n;
};

// ---------------------------- صفحه‌ها ----------------------------
function row(label, value) {
  const r = h("div", "sx-kv");
  r.append(h("span", null, label), h("strong", null, value));
  return r;
}
SX.startChat = (id) => {
  const me = personById(ME_ID),
    p = personById(id);
  if (!canMessage(me, p)) return; // قانون: فقط مربی↔ورزشکار
  Sheet.closeAll();
  if (SX.chatHook) SX.chatHook.openChat(id);
  if (location.hash !== "#chat") location.hash = "#chat";
};
SX.profile = (id) => {
  const p = personById(id);
  if (!p) return;
  const me = personById(ME_ID);
  Sheet.push("profile", fullName(p), (box) => {
    const hero = h("div", "sx-hero");
    hero.append(avatar(p, "big"));
    const nm = h("h1", "sx-name", fullName(p));
    const chips = h("div", "sx-chips");
    chips.append(
      h("span", "sx-chip" + (p.role === "coach" ? " coach" : ""), roleLabel(p)),
    );
    if (p.id === ME_ID) chips.append(h("span", "sx-chip you", "شما"));
    hero.append(
      nm,
      chips,
      h("p", "sx-sub", [p.city, p.country].filter(Boolean).join("، ") || "—"),
    );
    box.appendChild(hero);
    const act = h("div", "sx-actions");
    if (canMessage(me, p)) {
      const b = h("button", "sx-btn primary");
      b.type = "button";
      b.append(icon("message"), h("span", null, "ارسال پیام"));
      b.addEventListener("click", () => SX.startChat(p.id));
      act.appendChild(b);
    }
    if (p.role === "coach") {
      const b = h("button", "sx-btn");
      b.type = "button";
      b.setAttribute("aria-label", "فروشگاه " + fullName(p));
      b.append(icon("store"), h("span", null, "فروشگاه"));
      b.addEventListener("click", () => SX.store(p.id));
      act.appendChild(b);
    }
    if (act.children.length) box.appendChild(act);
    const g = h("div", "sx-grid");
    const bmi =
      p.height && p.weight ? p.weight / Math.pow(p.height / 100, 2) : null;
    [
      ["قد (سانتی‌متر)", p.height ? fmtN(p.height) : "—"],
      ["وزن (کیلوگرم)", p.weight ? fmtN(p.weight, 1) : "—"],
      ["BMI", bmi ? fmtN(bmi, 1) : "—"],
      ["سال سابقه", p.years != null ? fmtN(p.years) : "—"],
    ].forEach(([l, v]) => {
      const c = h("div", "sx-stat");
      c.append(h("strong", null, v), h("span", null, l));
      g.appendChild(c);
    });
    box.appendChild(g);
    const info = h("div", "sx-card");
    info.append(
      row("سابقه‌ی ورزشی", p.history || "—"),
      row("ایمیل", p.id === ME_ID ? p.email : maskEmail(p.email)),
    );
    if (p.role === "athlete" && p.coach)
      info.append(
        row("مربی", fullName(personById(p.coach) || { first: "—", last: "" })),
      );
    box.appendChild(info);
    const mc = h("div", "sx-card");
    mc.appendChild(h("h3", null, "مدال‌ها و افتخارات"));
    if (!p.medals || !p.medals.length)
      mc.appendChild(h("p", "sx-empty", "مدالی ثبت نشده است."));
    else {
      const ul = h("ul", "sx-medals");
      p.medals.forEach((m) => {
        const li = h("li");
        li.append(h("strong", null, m.t), h("small", null, m.s || ""));
        ul.appendChild(li);
      });
      mc.appendChild(ul);
    }
    box.appendChild(mc);
  });
};
SX.members = (key) => {
  const f = SX.forums[key];
  if (!f) return;
  Sheet.push("members", f.name, (box) => {
    const hero = h("div", "sx-hero");
    const av = h("div", "sx-av big group", f.name[0]);
    hero.append(
      av,
      h("h1", "sx-name", f.name),
      h("p", "sx-sub", `${fmtN(f.members.length)} عضو`),
    );
    box.appendChild(hero);
    const list = h("div", "sx-list");
    [...f.members]
      .sort(
        (a, b) =>
          (personById(a).role === "coach" ? 0 : 1) -
          (personById(b).role === "coach" ? 0 : 1),
      )
      .forEach((id) => {
        const p = personById(id);
        if (!p) return;
        const r = h("div", "sx-row");
        r.tabIndex = 0;
        r.setAttribute("role", "button");
        r.dataset.profile = id;
        const body = h("div", "sx-rowbody");
        body.append(
          h("strong", null, fullName(p)),
          h("span", null, [p.city, p.history].filter(Boolean)[0] || ""),
        );
        const tags = h("div", "sx-tags");
        tags.append(
          h(
            "span",
            "sx-chip" + (p.role === "coach" ? " coach" : ""),
            p.role === "coach" ? "مربی · مدیر" : "ورزشکار",
          ),
        );
        if (id === ME_ID) tags.append(h("span", "sx-chip you", "شما"));
        r.append(avatar(p), body, tags);
        list.appendChild(r);
      });
    box.appendChild(list);
  });
};
SX.store = (cid) => {
  const c = personById(cid),
    s = STORES[cid];
  if (!c || !s) return;
  Sheet.push("store", s.name, (box) => {
    const seller = h("div", "sx-row");
    seller.tabIndex = 0;
    seller.setAttribute("role", "button");
    seller.dataset.profile = cid;
    const sb = h("div", "sx-rowbody");
    sb.append(
      h("strong", null, "فروشنده: " + fullName(c)),
      h("span", null, `${fmtN(s.products.length)} محصول`),
    );
    seller.append(avatar(c), sb);
    box.appendChild(seller);
    if (cid === ME_ID)
      box.appendChild(
        h(
          "p",
          "sx-note",
          "این فروشگاه شماست؛ خرید از فروشگاه خودتان ممکن نیست. محصولات را از «پروفایل» مدیریت کنید.",
        ),
      );
    if (!s.products.length)
      box.appendChild(h("p", "sx-empty", "این فروشگاه هنوز محصولی ندارد."));
    const list = h("div", "sx-list");
    s.products.forEach((p) => {
      const card = h("div", "sx-prod");
      const info = h("div", "sx-rowbody");
      info.append(
        h("strong", null, p.name),
        h("span", "sx-price", fmtP(p.price)),
      );
      card.appendChild(info);
      if (cid !== ME_ID) {
        const q = Cart.qty(p.id);
        if (!q) {
          const b = h("button", "sx-btn primary", "افزودن به سبد");
          b.type = "button";
          b.addEventListener("click", () => {
            Cart.add(cid, p.id);
            notify("به سبد اضافه شد");
          });
          card.appendChild(b);
        } else card.appendChild(stepper(p.id, q));
      }
      list.appendChild(card);
    });
    box.appendChild(list);
    if (Cart.count()) {
      const b = h(
        "button",
        "sx-btn wide",
        `مشاهده‌ی سبد خرید (${fmtN(Cart.count())})`,
      );
      b.type = "button";
      b.addEventListener("click", () => SX.cart());
      box.appendChild(b);
    }
  });
};
function stepper(pid, q) {
  const w = h("div", "sx-step");
  w.setAttribute("role", "group");
  w.setAttribute("aria-label", "تعداد");
  const m = h("button", null, "−"),
    p = h("button", null, "+");
  m.type = p.type = "button";
  m.setAttribute("aria-label", "کم کردن");
  p.setAttribute("aria-label", "زیاد کردن");
  m.addEventListener("click", () => Cart.set(pid, q - 1));
  p.addEventListener("click", () => Cart.set(pid, q + 1));
  w.append(m, h("span", null, fmtN(q)), p);
  return w;
}
SX.cart = () => {
  const render = (box) => {
    const items = Cart.items;
    if (!items.length) {
      box.appendChild(h("p", "sx-empty big", "سبد خرید شما خالی است."));
      return;
    }
    const bySeller = {};
    items.forEach((it) => (bySeller[it.sid] = bySeller[it.sid] || []).push(it));
    Object.keys(bySeller).forEach((sid) => {
      const sec = h("section", "sx-card");
      sec.appendChild(h("h3", null, STORES[sid].name));
      let sub = 0;
      bySeller[sid].forEach((it) => {
        const p = Cart.product(it);
        sub += p.price * it.qty;
        const r = h("div", "sx-line");
        const info = h("div", "sx-rowbody");
        info.append(
          h("strong", null, p.name),
          h("span", "sx-price", `${fmtP(p.price)} × ${fmtN(it.qty)}`),
        );
        const del = h("button", "sx-x", "✕");
        del.type = "button";
        del.setAttribute("aria-label", "حذف " + p.name);
        del.addEventListener("click", () => Cart.remove(it.pid));
        r.append(info, stepper(it.pid, it.qty), del);
        sec.appendChild(r);
      });
      sec.appendChild(row("جمع این فروشگاه", fmtP(sub)));
      box.appendChild(sec);
    });
    const tot = h("div", "sx-total");
    tot.append(
      h("span", null, "جمع کل"),
      h("strong", null, fmtP(Cart.total())),
    );
    box.appendChild(tot);
    const ok = h("button", "sx-btn primary wide", "ثبت سفارش");
    ok.type = "button";
    ok.addEventListener("click", () => {
      const lines = Cart.items.map((it) => ({
          name: Cart.product(it).name,
          qty: it.qty,
        })),
        total = Cart.total(),
        code = fmtN(100000 + Math.floor(Math.random() * 900000)).replace(
          /٬/g,
          "",
        );
      Cart.clear(); // TODO: ارسال سفارش به بک‌اند و درگاه پرداخت
      Sheet.replace("done", "سفارش ثبت شد", (b2) => {
        const d = h("div", "sx-hero");
        d.append(
          h("div", "sx-av big ok", "✓"),
          h("h1", "sx-name", "سفارش شما ثبت شد"),
          h("p", "sx-sub", `کد پیگیری: ${code}`),
        );
        b2.appendChild(d);
        const c = h("div", "sx-card");
        lines.forEach((l) => c.appendChild(row(l.name, `× ${fmtN(l.qty)}`)));
        c.appendChild(row("مبلغ کل", fmtP(total)));
        b2.appendChild(c);
        const bb = h("button", "sx-btn primary wide", "بستن");
        bb.type = "button";
        bb.addEventListener("click", () => Sheet.closeAll());
        b2.appendChild(bb);
      });
    });
    box.appendChild(ok);
  };
  Sheet.push("cart", "سبد خرید", render);
};

// ---------------------------- جست‌وجو (نام یا ایمیل) ----------------------------
SX.search = (host) => {
  const me = personById(ME_ID);
  let role = "all";
  const wrap = h("div", "sx-search");
  host.appendChild(wrap);
  const lab = h("label", "sx-input");
  const inp = document.createElement("input");
  inp.type = "search";
  inp.placeholder = "جست‌وجوی نام یا ایمیل…";
  inp.setAttribute("aria-label", "جست‌وجوی نام یا ایمیل");
  inp.autocomplete = "off";
  lab.append(icon("search"), inp);
  wrap.appendChild(lab);
  const chips = h("div", "sx-chips row");
  wrap.appendChild(chips);
  wrap.appendChild(
    h(
      "p",
      "sx-note",
      "گفت‌وگوی شخصی فقط بین مربی و ورزشکار ممکن است؛ برای بقیه فقط مشاهده‌ی پروفایل.",
    ),
  );
  const out = h("div", "sx-results");
  out.setAttribute("aria-live", "polite");
  wrap.appendChild(out);
  const draw = () => {
    out.innerHTML = "";
    const q = normQ(inp.value);
    if (!q) {
      out.appendChild(
        h("p", "sx-empty", "نام یا ایمیل مربی یا ورزشکار را وارد کنید."),
      );
      return;
    }
    const res = DIRECTORY.filter(
      (p) =>
        p.id !== ME_ID &&
        (role === "all" || p.role === role) &&
        (normQ(fullName(p)).includes(q) || normQ(p.email).includes(q)),
    ).slice(0, 25);
    if (!res.length) {
      out.appendChild(h("p", "sx-empty", "نتیجه‌ای پیدا نشد."));
      return;
    }
    res.forEach((p) => {
      const r = h("div", "sx-row");
      r.tabIndex = 0;
      r.setAttribute("role", "button");
      r.dataset.profile = p.id;
      const b = h("div", "sx-rowbody");
      b.append(
        h("strong", null, fullName(p)),
        h("span", null, `${p.city || "—"} · ${maskEmail(p.email)}`),
      );
      const tags = h("div", "sx-tags");
      tags.append(
        h(
          "span",
          "sx-chip" + (p.role === "coach" ? " coach" : ""),
          roleLabel(p),
        ),
      );
      if (
        (me.role === "athlete" && me.coach === p.id) ||
        (me.role === "coach" && p.coach === ME_ID)
      )
        tags.append(
          h(
            "span",
            "sx-chip you",
            me.role === "athlete" ? "مربی من" : "ورزشکار شما",
          ),
        );
      r.append(avatar(p), b, tags);
      if (canMessage(me, p)) {
        const m = h("button", "sx-iconbtn");
        m.type = "button";
        m.setAttribute("aria-label", "ارسال پیام به " + fullName(p));
        m.title = "ارسال پیام";
        const i = icon("message", "پیام");
        m.appendChild(i);
        m.addEventListener("click", (ev) => {
          ev.stopPropagation();
          SX.startChat(p.id);
        });
        r.appendChild(m);
      }
      out.appendChild(r);
    });
  };
  [
    ["all", "همه"],
    ["athlete", "ورزشکار"],
    ["coach", "مربی"],
  ].forEach(([k, l]) => {
    const c = h("button", "sx-fchip" + (k === role ? " on" : ""), l);
    c.type = "button";
    c.addEventListener("click", () => {
      role = k;
      chips
        .querySelectorAll("button")
        .forEach((x) => x.classList.toggle("on", x === c));
      draw();
    });
    chips.appendChild(c);
  });
  inp.addEventListener("input", draw);
  draw();
};

// ---------------------------- میانبرهای data-attribute ----------------------------
document.addEventListener("click", (e) => {
  const t = e.target.closest(
    "[data-profile],[data-members],[data-store],[data-open-cart]",
  );
  if (!t) return;
  const inner = e.target.closest("button,a,input,select");
  if (inner && inner !== t && t.contains(inner)) return; // دکمه‌ی داخل ردیف کار خودش را می‌کند
  e.preventDefault();
  if (t.dataset.profile) SX.profile(t.dataset.profile);
  else if (t.dataset.members) SX.members(t.dataset.members);
  else if (t.dataset.store) SX.store(t.dataset.store);
  else SX.cart();
});
document.addEventListener("keydown", (e) => {
  if (
    (e.key === "Enter" || e.key === " ") &&
    e.target.matches &&
    e.target.matches("[data-profile],[data-members]") &&
    !["BUTTON", "A", "INPUT"].includes(e.target.tagName)
  ) {
    e.preventDefault();
    e.target.click();
  }
});
document.addEventListener("DOMContentLoaded", () => SX.updateBadges());
if (document.readyState !== "loading") SX.updateBadges();

// ==================== نما: chat ====================
(function () {
  const root = document.getElementById("view-chat");
  const byId = (id) => document.getElementById("chat-" + id);

  root.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      root
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      root
        .querySelectorAll(".panel")
        .forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = byId(tab.dataset.target);
      panel.classList.add("active");
      const list = panel.querySelector(".messages");
      if (list) list.scrollTop = list.scrollHeight;
    });
  });

  root.querySelectorAll(".priority-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", String(!on));
      btn.closest(".composer").classList.toggle("is-priority", !on);
    });
  });

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
      time.textContent = new Date().toLocaleTimeString("fa-IR", {
        hour: "numeric",
        minute: "2-digit",
      });
      msg.appendChild(time);

      list.appendChild(msg);
      list.scrollTop = list.scrollHeight;
      input.value = "";
    });
  });

  root
    .querySelectorAll(".messages")
    .forEach((l) => (l.scrollTop = l.scrollHeight));

  // ---- جست‌وجو (نام/ایمیل)، اعضای تالار و گفت‌وگو با مربی‌های دیگر ----
  SX.forums["f1"] = {
    name: "گروه ورزشکاران مربی علی",
    members: [
      "c1",
      "a1",
      "a2",
      "a3",
      "a4",
      "a5",
      "a6",
      "a7",
      "a8",
      "a9",
      "a10",
      "a11",
    ],
  };
  SX.search(byId("searchHost"));
  const threads = {};
  function activate(panelId, tabTarget) {
    root
      .querySelectorAll(".panel")
      .forEach((p) => p.classList.remove("active"));
    root
      .querySelectorAll(".tab")
      .forEach((t) =>
        t.classList.toggle("active", t.dataset.target === tabTarget),
      );
    byId(panelId).classList.add("active");
  }
  function openThread(id) {
    const p = personById(id),
      msgs = threads[id] || (threads[id] = []),
      panel = byId("thread");
    panel.innerHTML = "";
    const peer = h("div", "peer");
    peer.dataset.profile = id;
    const back = h("button", "peer-back", "‹ بازگشت");
    back.type = "button";
    back.addEventListener("click", () => activate("search", "search"));
    const info = h("div");
    info.append(
      h("div", "peer-name", fullName(p)),
      h("div", "peer-status", `${roleLabel(p)} · ${p.city || "—"}`),
    );
    peer.append(back, h("div", "avatar", p.first[0]), info);
    const box = h("div", "messages");
    const draw = () => {
      box.innerHTML = "";
      if (!msgs.length)
        box.appendChild(h("div", "day", "گفت‌وگو را شروع کنید"));
      msgs.forEach((m) => {
        const d = h("div", "msg out", m.t);
        d.appendChild(h("span", "time", m.time));
        box.appendChild(d);
      });
      box.scrollTop = box.scrollHeight;
    };
    const form = h("form", "composer");
    form.innerHTML =
      '<input type="text" placeholder="پیام خود را بنویسید…" aria-label="پیام" /><button type="submit" class="send-btn" aria-label="ارسال">➤</button>';
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = form.querySelector("input"),
        t = inp.value.trim();
      if (!t) return;
      msgs.push({
        t,
        time: new Date().toLocaleTimeString("fa-IR", {
          hour: "numeric",
          minute: "2-digit",
        }),
      });
      inp.value = "";
      draw();
    });
    panel.append(peer, box, form);
    draw();
    activate("thread", "search");
  }
  SX.chatHook = {
    openChat(id) {
      if (id === personById(ME_ID).coach) {
        activate("coach", "coach");
        const l = byId("coachMessages");
        l.scrollTop = l.scrollHeight;
      } else openThread(id);
    },
  };

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
    const box = byId("week");
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
    el.innerHTML = `<input type="checkbox" /><span class="box"></span><div><strong></strong><small></small></div>`;
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

    byId("dayName").textContent =
      day.name + (selected === todayIdx ? " (امروز)" : "");
    byId("dayFocus").textContent = day.focus;
    byId("dayCount").textContent = day.rest
      ? "روز استراحت"
      : `${fa(done)} از ${fa(day.list.length)} حرکت`;
    byId("percent").textContent = day.rest ? "—" : fa(pct) + "٪";

    const C = 2 * Math.PI * 52;
    const ring = byId("ringFill");
    ring.style.strokeDasharray = C;
    ring.style.strokeDashoffset = C * (1 - (day.rest ? 0 : pct) / 100);

    byId("lists").hidden = day.rest;
    byId("restBox").hidden = !day.rest;
    if (day.rest) return;

    const todo = byId("todoList"),
      dn = byId("doneList");
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
    byId("todoN").textContent = fa(day.list.length - done);
    byId("doneN").textContent = fa(done);
  }

  function renderProgram() {
    const perWeek = PROGRAM.sessionsPerWeek;
    const total = PROGRAM.weeks * perWeek;
    const pastDone = (PROGRAM.current - 1) * perWeek;
    const thisWeek = days
      .filter((x) => !x.rest)
      .reduce((s, x) => s + pctOf(x) / 100, 0);
    const pct = ((pastDone + thisWeek) / total) * 100;

    byId("programWeek").textContent =
      `هفته‌ی ${fa(PROGRAM.current)} از ${fa(PROGRAM.weeks)}`;
    byId("programBar").style.width = pct + "%";
    byId("programText").textContent = `${fa(pct)}٪ از دوره طی شده`;
    byId("programLeft").textContent =
      `${fa(PROGRAM.weeks - PROGRAM.current)} هفته‌ی دیگر`;
  }

  function render() {
    renderWeek();
    renderDay();
    renderProgram();
  }
  render();
})();

// ==================== نما: diet ====================
(function () {
  const root = document.getElementById("view-diet");
  const byId = (id) => document.getElementById("diet-" + id);

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
          <p class="alt" hidden></p>
          <div class="meal-foot">
            <span class="kcal"></span>
            <button class="alt-btn" type="button">جایگزین</button>
          </div>
        </div>`;
      el.querySelector("h3").textContent = m.name;
      el.querySelector(".muted").textContent = m.time;
      el.querySelector(".items").textContent = m.items;
      el.querySelector(".alt").textContent = "پیشنهاد جایگزین: " + m.alt;
      el.querySelector(".kcal").textContent =
        `${fa(m.kcal)} کیلوکالری · پ ${fa(m.p)} · ک ${fa(m.c)} · چ ${fa(m.f)}`;

      el.querySelector(".check").addEventListener("click", () => {
        m.done = !m.done;
        renderMeals();
        update();
      });
      el.querySelector(".alt-btn").addEventListener("click", () => {
        const a = el.querySelector(".alt");
        a.hidden = !a.hidden;
      });
      box.appendChild(el);
    });
  }

  function update() {
    const total = sum("kcal"),
      done = sum("kcal", true);
    const pct = total ? (done / total) * 100 : 0;

    const R = 52,
      C = 2 * Math.PI * R;
    const ring = byId("ringFill");
    ring.style.strokeDasharray = C;
    ring.style.strokeDashoffset = C * (1 - pct / 100);

    byId("percent").textContent = fa(pct) + "٪";
    byId("calDone").textContent = fa(done);
    byId("calTotal").textContent = fa(total);

    root.querySelectorAll(".macro").forEach((row) => {
      const k = row.dataset.key,
        t = sum(k),
        d = sum(k, true);
      row.querySelector("i").style.width = (t ? (d / t) * 100 : 0) + "%";
      row.querySelector("em").textContent = `${fa(d)}/${fa(t)} گرم`;
    });

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

  const profile = personById(ME_ID); // همان رکورد دایرکتوری؛ ویرایش پروفایل در پروفایل عمومی هم دیده می‌شود
  const game = {
    level: 7,
    xp: 640,
    xpNext: 1000,
    streak: 12,
    coins: 230,
    rank: 5,
  };
  const weights = [84, 83.2, 82.5, 82.8, 81.4, 80.6, 80.1, 79.5];
  const medals = personById(ME_ID).medals;
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

  // ---- مدال‌ها و افتخارات: نمایش + ویرایش (افزودن / ویرایش / حذف) ----
  let medalsEditing = false,
    draft = [];
  function renderMedals() {
    const ul = $("medals"),
      bar = $("medalsBar"),
      btn = $("medalsEdit");
    ul.innerHTML = "";
    bar.innerHTML = "";
    bar.hidden = !medalsEditing;
    btn.textContent = medalsEditing ? "ذخیره" : "ویرایش";
    if (!medalsEditing) {
      if (!medals.length) {
        const li = document.createElement("li");
        li.className = "m-empty";
        li.textContent = "هنوز مدالی ثبت نشده. با «ویرایش» اضافه کنید.";
        ul.appendChild(li);
      }
      medals.forEach((m) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong></strong><small></small>`;
        li.querySelector("strong").textContent = m.t;
        li.querySelector("small").textContent = m.s;
        ul.appendChild(li);
      });
      return;
    }
    draft.forEach((m, i) => {
      const li = document.createElement("li");
      li.className = "m-edit";
      const t = document.createElement("input"),
        s = document.createElement("input"),
        del = document.createElement("button");
      t.className = "m-t";
      s.className = "m-s";
      t.value = m.t;
      s.value = m.s || "";
      t.maxLength = s.maxLength = 80;
      t.placeholder = "عنوان (مثلاً مدال طلا — پرس سینه)";
      s.placeholder = "مسابقه و سال (اختیاری)";
      t.setAttribute("aria-label", "عنوان مدال");
      s.setAttribute("aria-label", "جزئیات مدال");
      t.addEventListener("input", () => (draft[i].t = t.value));
      s.addEventListener("input", () => (draft[i].s = s.value));
      del.type = "button";
      del.className = "m-del";
      del.textContent = "✕";
      del.setAttribute("aria-label", "حذف مدال");
      del.addEventListener("click", () => {
        draft.splice(i, 1);
        renderMedals();
      });
      li.append(t, s, del);
      ul.appendChild(li);
    });
    const add = document.createElement("button"),
      cancel = document.createElement("button");
    add.type = cancel.type = "button";
    add.textContent = "+ افزودن مدال";
    cancel.textContent = "انصراف";
    add.addEventListener("click", () => {
      draft.push({ t: "", s: "" });
      renderMedals();
      const ins = ul.querySelectorAll(".m-t");
      ins[ins.length - 1].focus();
    });
    cancel.addEventListener("click", () => {
      medalsEditing = false;
      renderMedals();
    });
    bar.append(add, cancel);
  }
  $("medalsEdit").addEventListener("click", () => {
    if (!medalsEditing) {
      medalsEditing = true;
      draft = medals.map((m) => ({ ...m }));
      if (!draft.length) draft.push({ t: "", s: "" });
    } else {
      const clean = draft
        .map((m) => ({ t: m.t.trim(), s: (m.s || "").trim() }))
        .filter((m) => m.t);
      medals.splice(0, medals.length, ...clean);
      medalsEditing = false;
    }
    renderMedals();
  });

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
})();

// ==================== ناوبری (فوتر) ====================
const ORDER = ["chat", "exercise", "diet", "user"];
const TITLES = {
  chat: "چت",
  exercise: "برنامه‌ی تمرینی",
  diet: "رژیم غذایی",
  user: "پروفایل",
};
const navItems = document.querySelectorAll(".footer [data-view]");

function show(name) {
  if (!ORDER.includes(name)) name = "chat";
  ORDER.forEach(
    (n) => (document.getElementById("view-" + n).hidden = n !== name),
  );
  navItems.forEach((item) => {
    const on = item.dataset.view === name;
    item.className = on ? "selected" : "icon";
    item.querySelector("img").src = on
      ? item.dataset.activeSrc
      : item.dataset.src;
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
