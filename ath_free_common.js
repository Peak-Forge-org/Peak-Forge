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
    premiumDlg
      .querySelector(".pm-close")
      .addEventListener("click", () => premiumDlg.close());
    premiumDlg.addEventListener("click", (e) => {
      if (e.target === premiumDlg) premiumDlg.close();
    });
    document.body.appendChild(premiumDlg);
  }
  premiumDlg.querySelector(".pm-msg").textContent =
    feature === "upgrade"
      ? "با اشتراک Premium به همه‌ی امکانات پیشرفته‌ی پلتفرم دسترسی پیدا می‌کنید."
      : `برای استفاده از «${feature}» باید اشتراک Premium تهیه کنید.`;
  premiumDlg.showModal();
}

document.addEventListener(
  "click",
  (e) => {
    const t = e.target.closest("[data-premium]");
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    premiumNote(t.dataset.premium);
  },
  true,
);
