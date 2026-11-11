// coach-common.js — shared helpers for coach pages (free + premium in one):
// formatting helpers, DOM utils, mock-free containers refilled from the API,
// localStorage settings, and the Premium dialog.

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

// filled in place from GET /api/coach/athletes — never redeclare (const)
const ATHLETES = [];
const ATHLETE_LIMIT = 5; // free-tier capacity (also enforced server-side)

const DEFAULT_SETTINGS = {
  autoRemind: false,
  idleDays: 3,
  weight: false,
  pr: false,
  priority: false,
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

let premiumDlg;
function premiumNote(feature) {
  if (typeof getLocalUser === "function" && getLocalUser()?.tier === "premium") {
    return; // already premium — data-premium locks no longer apply
  }
  if (!premiumDlg) {
    premiumDlg = document.createElement("dialog");
    premiumDlg.className = "premium";
    premiumDlg.innerHTML = `
      <h2>🔒 مخصوص مربیان Premium</h2>
      <p class="pm-msg"></p>
      <ul>
        <li>پنل حرفه‌ای: مدیریت و دسته‌بندی تعداد زیادی ورزشکار</li>
        <li>قالب برنامه، کپی، ارسال گروهی و تقویم تمرینی</li>
        <li>اعلان و یادآوری پیشرفته‌ی خودکار</li>
        <li>صندوق اختصاصی پیام‌های اولویت‌دار</li>
      </ul>
      <div class="pm-actions">
        <a class="pm-buy" href="#">خرید اشتراک Premium</a>
        <button class="pm-close" type="button">بعداً</button>
      </div>`;
    premiumDlg
      .querySelector(".pm-close")
      .addEventListener("click", () => premiumDlg.close());
    premiumDlg.addEventListener("click", (e) => {
      if (e.target === premiumDlg) premiumDlg.close();
    });
    // simulated purchase: flip the account tier, then reload
    premiumDlg.querySelector(".pm-buy").addEventListener("click", async (e) => {
      e.preventDefault();
      const btn = e.currentTarget;
      if (typeof apiFetch !== "function") {
        alert("برای خرید، از داخل برنامه وارد شوید.");
        return;
      }
      btn.textContent = "در حال فعال‌سازی…";
      const res = await apiFetch("/profile/upgrade", { method: "POST" });
      if (res && res.ok) {
        try {
          const u = getLocalUser() || {};
          u.tier = "premium";
          localStorage.setItem("user", JSON.stringify(u));
        } catch {}
        premiumDlg.close();
        setTimeout(() => location.reload(), 400);
      } else {
        btn.textContent = "خطا — دوباره تلاش کن";
      }
    });
    document.body.appendChild(premiumDlg);
  }
  premiumDlg.querySelector(".pm-msg").textContent =
    feature === "upgrade"
      ? "با اشتراک Premium به همه‌ی ابزارهای حرفه‌ای مدیریت ورزشکاران دسترسی پیدا می‌کنید."
      : `برای استفاده از «${feature}» باید اشتراک Premium تهیه کنید.`;
  premiumDlg.showModal();
}
document.addEventListener(
  "click",
  (e) => {
    const t = e.target.closest("[data-premium]");
    if (!t) return;
    if (typeof getLocalUser === "function" && getLocalUser()?.tier === "premium") {
      return; // premium users pass through
    }
    e.preventDefault();
    e.stopPropagation();
    premiumNote(t.dataset.premium);
  },
  true,
);
