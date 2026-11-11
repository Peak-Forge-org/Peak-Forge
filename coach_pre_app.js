// کل برنامه‌ی مربی Premium در یک فایل.
// ابتدا ابزارها و داده‌ی مشترک (coach_pre_common.js)، سپس هر صفحه‌ی قبلی به‌صورت یک تابع بسته (IIFE)
// تا متغیرهایش با بقیه تداخل نکند. در هر نما: $ و byId به idهای همان نما (با پیشوند) نگاه می‌کنند و
// document.querySelectorAll → root.querySelectorAll (محدود به همان نما).
const VIEWS = {};

// ==================== مشترک: coach_pre_common.js ====================
// ابزارها و داده‌ی نمونه‌ی مشترک بین صفحه‌های مربی
const fa = (n, d = 0) =>
  Number(n).toLocaleString("fa-IR", {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });
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
  {
    id: 1,
    name: "سارا محمدی",
    cat: "حجم",
    adh: 92,
    idle: 0,
    wd: 1.2,
    sessions: 14,
    pr: "ددلیفت ۸۵ کیلو",
    newPr: true,
  },
  {
    id: 2,
    name: "امیر کریمی",
    cat: "کاهش وزن",
    adh: 85,
    idle: 1,
    wd: -2.4,
    sessions: 12,
    pr: "پرس سینه ۷۰ کیلو",
  },
  {
    id: 3,
    name: "مهدی احمدی",
    cat: "مبتدی",
    adh: 48,
    idle: 5,
    wd: 0.3,
    sessions: 5,
    pr: "اسکوات ۴۰ کیلو",
  },
  {
    id: 4,
    name: "نگار رستمی",
    cat: "کاهش وزن",
    adh: 78,
    idle: 2,
    wd: -1.6,
    sessions: 11,
    pr: "لانژ ۲۰ کیلو",
  },
  {
    id: 5,
    name: "پویا صادقی",
    cat: "حجم",
    adh: 66,
    idle: 4,
    wd: 2.1,
    sessions: 8,
    pr: "ددلیفت ۱۱۰ کیلو",
  },
  {
    id: 6,
    name: "الهام نوری",
    cat: "مبتدی",
    adh: 95,
    idle: 0,
    wd: -0.8,
    sessions: 15,
    pr: "پلانک ۲ دقیقه",
  },
  {
    id: 7,
    name: "حسین فرجی",
    cat: "حجم",
    adh: 71,
    idle: 3,
    wd: 1.0,
    sessions: 9,
    pr: "پرس سرشانه ۴۵ کیلو",
  },
];

// تنظیمات اعلان مربی (در صفحه‌ی پروفایل تغییر می‌کند)
const DEFAULT_SETTINGS = {
  autoRemind: true,
  idleDays: 3,
  weight: true,
  pr: true,
  priority: true,
};
function getSettings() {
  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(localStorage.getItem("coachSettings") || "{}"),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}
function saveSettings(s) {
  try {
    localStorage.setItem("coachSettings", JSON.stringify(s));
  } catch {}
}

// هویت کاربر فعلی در دایرکتوری (مربی: علی رضایی)
const ME_ID = "c1";

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
      b.append(icon("messagered"), h("span", null, "ارسال پیام"));
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
        const i = icon("messagered", "پیام");
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
  const $ = (id) => byId(id);

  const nowTime = () =>
    new Date().toLocaleTimeString("fa-IR", {
      hour: "numeric",
      minute: "2-digit",
    });

  // گفت‌وگوها: a = ورزشکار، c = مربی؛ p = اولویت‌دار، done = پاسخ داده شده
  const convs = ATHLETES.slice(0, 5).map((a) => ({
    id: "a" + a.id,
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
      members: ["c1", "a1", "a5", "a7"],
      msgs: [
        { f: "c", t: "یادتون نره وزنه‌ها رو ثبت کنید.", time: "۸:۰۰" },
        { f: "s", s: "سارا", t: "رکورد جدید ددلیفتم ثبت شد!", time: "۱۰:۳۲" },
      ],
    },
    {
      id: 2,
      name: "گروه کاهش وزن",
      members: ["c1", "a2", "a4"],
      msgs: [
        {
          f: "c",
          t: "این هفته تمرکز روی پایبندی به رژیم باشه.",
          time: "دیروز",
        },
      ],
    },
  ];

  let tab = "priority";
  let open = null; // { kind: "conv" | "forum", id }
  const pending = (c) => c.msgs.some((m) => m.p && !m.done);
  const lastText = (x) =>
    x.msgs.length ? x.msgs[x.msgs.length - 1].t : "هنوز پیامی نیست";

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
    } else if (tab === "forums") {
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
        const pool =
          sel.value === "همه‌ی ورزشکاران"
            ? ATHLETES
            : ATHLETES.filter((a) => a.cat === sel.value);
        const nf = {
          id: forums.length + 1,
          name,
          members: [ME_ID, ...pool.map((a) => "a" + a.id)],
          msgs: [],
        };
        forums.push(nf);
        SX.forums["f" + nf.id] = nf;
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
          el("span", null, `${fa(f.members.length)} عضو · ${lastText(f)}`),
        );
        b.append(el("div", "avatar", f.name[0]), body);
        b.addEventListener("click", () => {
          open = { kind: "forum", id: f.id };
          render();
        });
        list.appendChild(b);
      });
    } else {
      SX.search(list);
    }
    view.appendChild(list);
  }

  function drawMsgs(box, thread, isForum) {
    box.innerHTML = "";
    if (!thread.msgs.length)
      box.appendChild(el("p", "empty", "گفت‌وگو را شروع کنید."));
    thread.msgs.forEach((m) => {
      const d = el(
        "div",
        "msg " +
          (m.f === "c" ? "out" : "in") +
          (m.p && !m.done ? " priority" : ""),
      );
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
    const who = el("div", "peer-who"); // با کلیک روی نام: پروفایل ورزشکار / اعضای تالار
    if (isForum) who.dataset.members = "f" + thread.id;
    else who.dataset.profile = thread.id;
    who.tabIndex = 0;
    who.setAttribute("role", "button");
    who.append(
      el("h2", null, thread.name),
      el("div", "avatar", thread.name[0]),
    );
    peer.append(back, who);

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
        }); // پاسخ مربی = پیام اولویت‌دار پاسخ داده شد
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
      root
        .querySelectorAll(".tab")
        .forEach((x) => x.classList.toggle("active", x === t));
      render();
    }),
  );
  render();

  // ---- ثبت تالارها برای «اعضای تالار»، باز کردن گفت‌وگو از جست‌وجو/پنل ورزشکاران ----
  forums.forEach((f) => (SX.forums["f" + f.id] = f));
  function openConv(id) {
    let c = convs.find((x) => x.id === id);
    if (!c) {
      const p = personById(id);
      c = { id, name: fullName(p), msgs: [] };
      convs.push(c);
    }
    tab = "convs";
    root
      .querySelectorAll(".tab")
      .forEach((x) => x.classList.toggle("active", x.dataset.tab === "convs"));
    open = { kind: "conv", id };
    render();
  }
  SX.chatHook = { openChat: openConv };

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
    $("sAttn").textContent = fa(
      a.filter((x) => x.idle >= settings.idleDays).length,
    );
    $("sAvg").textContent =
      fa(a.length ? a.reduce((s, x) => s + x.adh, 0) / a.length : 0) + "٪";
  }

  function buildAlerts() {
    const list = [];
    ATHLETES.forEach((x) => {
      if (x.idle >= settings.idleDays)
        list.push({
          key: x.id + "i",
          x,
          title: "بدون ثبت تمرین",
          text: `${fa(x.idle)} روز است تمرین ثبت نکرده`,
          remind: true,
        });
      if (settings.weight && Math.abs(x.wd) >= 2)
        list.push({
          key: x.id + "w",
          x,
          title: "تغییر مهم وزن",
          text: `${x.wd > 0 ? "+" : "−"}${fa(Math.abs(x.wd), 1)} کیلوگرم در ماه اخیر`,
          info: true,
        });
      if (settings.pr && x.newPr)
        list.push({
          key: x.id + "p",
          x,
          title: "رکورد جدید",
          text: x.pr,
          info: true,
        });
    });
    return list.filter((a) => !dismissed.has(a.key));
  }

  function renderAlerts() {
    const box = $("alerts");
    box.innerHTML = "";
    const list = buildAlerts();
    $("alertN").textContent = fa(list.length);
    if (!list.length)
      box.appendChild(el("p", "empty", "هشدار جدیدی وجود ندارد."));
    list.forEach((a) => {
      const row = el("div", "alert" + (a.info ? " info" : ""));
      const txt = el("div", "alert-text");
      txt.append(
        el("strong", null, `${a.x.name} · ${a.title}`),
        el("span", null, a.text),
      );
      row.appendChild(txt);
      if (a.remind) {
        const auto = settings.autoRemind;
        const b = el(
          "button",
          "btn",
          auto || reminded.has(a.key) ? "ارسال شد" : "یادآوری",
        );
        b.type = "button";
        b.disabled = auto || reminded.has(a.key);
        b.title = auto ? "یادآوری خودکار فعال است" : "";
        b.addEventListener("click", () => {
          reminded.add(a.key);
          toast(`یادآوری برای ${a.x.name} ارسال شد`);
          renderAlerts();
        });
        row.appendChild(b);
      }
      const x = el("button", "icon-btn", "✕");
      x.type = "button";
      x.setAttribute("aria-label", "بستن هشدار");
      x.addEventListener("click", () => {
        dismissed.add(a.key);
        renderAlerts();
      });
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
      b.addEventListener("click", () => {
        filter = c;
        renderFilters();
        renderList();
      });
      box.appendChild(b);
    });
  }

  function renderList() {
    const box = $("athletes");
    box.innerHTML = "";
    const list = ATHLETES.filter(
      (x) => filter === "همه" || x.cat === filter,
    ).sort((a, b) => b.adh - a.adh);
    if (!list.length)
      box.appendChild(el("p", "empty", "ورزشکاری در این دسته نیست."));
    list.forEach((x) => {
      const d = el("details", "ath");
      const s = el("summary");
      const top = el("div", "ath-top");
      top.append(
        el("span", "dot" + (x.idle >= settings.idleDays ? " idle" : "")),
        el("strong", null, x.name),
        el("span", "cat", x.cat),
      );
      const mb = el("button", "icon-btn msg-btn"); // میانبر: گفت‌وگوی شخصی با همین ورزشکار
      mb.type = "button";
      mb.title = "پیام شخصی";
      mb.setAttribute("aria-label", "پیام شخصی به " + x.name);
      mb.innerHTML =
        '<img class="sx-ic" src="./icons/messagered.svg" alt="پیام" />';
      mb.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        SX.startChat("a" + x.id);
      });
      top.appendChild(mb);
      const bar = el("div", "bar");
      const fill = el("i");
      fill.style.width = x.adh + "%";
      bar.appendChild(fill);
      s.append(top, el("span", "pct", fa(x.adh) + "٪"), bar);
      d.appendChild(s);

      const body = el("div", "ath-body");
      const cell = (label, val) => {
        const c = el("div");
        c.append(el("small", null, label), el("strong", null, val));
        return c;
      };
      body.append(
        cell("جلسات این ماه", fa(x.sessions)),
        cell("آخرین فعالیت", x.idle === 0 ? "امروز" : `${fa(x.idle)} روز پیش`),
        cell(
          "تغییر وزن (ماه)",
          `${x.wd > 0 ? "+" : x.wd < 0 ? "−" : ""}${fa(Math.abs(x.wd), 1)} کیلوگرم`,
        ),
        cell("بهترین رکورد", x.pr),
      );
      const go = el("div", "go");
      const a1 = el("a", "btn ghost", "پیام");
      a1.href = "#chat";
      const a2 = el("a", "btn ghost", "ارسال برنامه");
      a2.href = "#programs";
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
    const na = {
      id:
        Math.max(
          ...ATHLETES.map((a) => a.id),
          ...DIRECTORY.filter((p) => p.role === "athlete").map(
            (p) => +p.id.slice(1),
          ),
        ) + 1,
      name,
      cat: $("newCat").value,
      adh: 0,
      idle: 0,
      wd: 0,
      sessions: 0,
      pr: "—",
    };
    ATHLETES.push(na);
    SX.registerAthlete(na);
    $("newName").value = "";
    toast("ورزشکار اضافه شد");
    renderStats();
    renderList();
  });

  renderStats();
  renderAlerts();
  renderFilters();
  renderList();

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
    {
      id: 3,
      name: "رژیم ۲۰۰۰ کالری پروتئینی",
      type: "غذایی",
      weeks: 4,
      sent: 2,
    },
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

  /* ---- تب‌ها ---- */
  root.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      root
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.toggle("active", t === tab));
      root
        .querySelectorAll(".panel")
        .forEach((p) => (p.hidden = p.id !== "programs-" + tab.dataset.target));
    });
  });

  /* ---- قالب‌ها ---- */
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
})();

// ==================== نما: user ====================
(function () {
  const root = document.getElementById("view-user");
  const byId = (id) => document.getElementById("user-" + id);
  const $ = (id) => byId(id);

  const profile = personById(ME_ID); // همان رکورد دایرکتوری؛ ویرایش پروفایل در پروفایل عمومی هم دیده می‌شود
  const medals = personById(ME_ID).medals;
  const store = STORES[ME_ID]; // فروشگاه مشترک: خریداران همین محصولات را می‌بینند

  function renderProfile() {
    $("fullName").textContent = `${profile.first} ${profile.last}`;
    $("avatar").textContent = profile.first[0];
    $("place").textContent = `${profile.city}، ${profile.country}`;
    $("history").textContent = profile.history;
    $("sAth").textContent = fa(ATHLETES.length);
    $("sYears").textContent = fa(profile.years);
    $("sProd").textContent = fa(store.products.length);
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

  /* ویرایش پروفایل */
  const form = $("profileForm"),
    editBtn = $("editBtn");
  let editing = false;
  const fillForm = () =>
    Object.keys(profile).forEach((k) => {
      if (form.elements[k]) form.elements[k].value = profile[k];
    });
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

  /* فروشگاه */
  function renderStore() {
    $("storeName").textContent = store.name;
    const box = $("products");
    box.innerHTML = "";
    if (!store.products.length)
      box.appendChild(el("p", "empty", "هنوز محصولی ثبت نشده."));
    store.products.forEach((p) => {
      const row = el("div", "product");
      row.append(
        el("strong", null, p.name),
        el("span", "price", fa(p.price) + " تومان"),
      );
      const x = el("button", "icon-btn", "✕");
      x.type = "button";
      x.setAttribute("aria-label", "حذف محصول");
      x.addEventListener("click", () => {
        store.products.splice(store.products.indexOf(p), 1);
        renderStore();
        renderProfile();
      });
      row.appendChild(x);
      box.appendChild(row);
    });
  }
  $("prodForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("pName").value.trim(),
      price = +$("pPrice").value;
    if (!name || price < 0) return;
    store.products.push({ id: "p" + Date.now(), name, price });
    $("pName").value = "";
    $("pPrice").value = "";
    renderStore();
    renderProfile();
    toast("محصول ثبت شد");
  });

  /* تنظیمات اعلان (ذخیره در مرورگر؛ صفحه‌ی ورزشکاران از همین تنظیمات استفاده می‌کند) */
  const settings = getSettings();
  [2, 3, 5, 7].forEach((d) => {
    const o = el("option", null, `${fa(d)} روز`);
    o.value = d;
    $("idleDays").appendChild(o);
  });
  $("idleDays").value = settings.idleDays;
  ["autoRemind", "weight", "pr", "priority"].forEach((k) => {
    $(k).checked = settings[k];
    $(k).addEventListener("change", () => {
      settings[k] = $(k).checked;
      saveSettings(settings);
    });
  });
  $("idleDays").addEventListener("change", () => {
    settings.idleDays = +$("idleDays").value;
    saveSettings(settings);
  });

  renderProfile();
  renderMedals();
  fillForm();
  renderStore();

  // تعداد ورزشکاران و محصولات (آمار بالای صفحه) موقع نمایش نما به‌روز شود
  VIEWS.user = {
    onShow() {
      renderProfile();
    },
  };
})();

// ==================== ناوبری (فوتر) ====================
const ORDER = ["chat", "athletes", "programs", "user"];
const TITLES = {
  chat: "چت",
  athletes: "ورزشکاران من",
  programs: "مدیریت برنامه\u200cها",
  user: "پروفایل مربی",
};
const DEFAULT_VIEW = "athletes";
const navItems = document.querySelectorAll(".footer [data-view]");

function show(name) {
  if (!ORDER.includes(name)) name = DEFAULT_VIEW;
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
