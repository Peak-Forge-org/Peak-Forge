let filter = "همه";
const dismissed = new Set();
const reminded = new Set();
const settings = getSettings();

function renderStats() {
  const a = ATHLETES;
  $("limitNote").textContent =
    `ظرفیت اشتراک رایگان: ${fa(a.length)} از ${fa(ATHLETE_LIMIT)} ورزشکار`;
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
      const b = el("button", "btn ghost lock-mini", "🔒 یادآوری");
      b.type = "button";
      b.dataset.premium = "ارسال یادآوری به ورزشکار";
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
    if (c === "همه")
      b.addEventListener("click", () => {
        filter = c;
        renderFilters();
        renderList();
      });
    else {
      b.dataset.premium = "دسته‌بندی ورزشکاران";
      b.textContent = "🔒 " + c;
    }
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
    );
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
    const lk = el("button", "lock-card");
    lk.type = "button";
    lk.dataset.premium = "مشاهده‌ی عملکرد کامل هر ورزشکار";
    lk.style.gridColumn = "1 / -1";
    lk.innerHTML = `<span class="lock-ico">🔒</span><span><strong>عملکرد کامل ورزشکار</strong><small>جلسات، تغییر وزن و رکوردها</small></span><span class="pro">Premium</span>`;
    body.appendChild(lk);
    const go = el("div", "go");
    const a1 = el("a", "btn ghost", "پیام");
    a1.href = "./coach_free_chat.html";
    const a2 = el("a", "btn ghost", "ارسال برنامه");
    a2.href = "./coach_free_programs.html";
    go.append(a1, a2);
    body.appendChild(go);
    d.appendChild(body);
    box.appendChild(d);
  });
}

$("addForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (ATHLETES.length >= ATHLETE_LIMIT)
    return premiumNote("مدیریت تعداد بیشتر ورزشکار");
  const name = $("newName").value.trim();
  if (!name) return;
  ATHLETES.push({
    id: Math.max(...ATHLETES.map((a) => a.id)) + 1,
    name,
    cat: "—",
    adh: 0,
    idle: 0,
    wd: 0,
    sessions: 0,
    pr: "—",
  });
  $("newName").value = "";
  toast("ورزشکار اضافه شد");
  renderStats();
  renderList();
});

renderStats();
renderAlerts();
renderFilters();
renderList();
