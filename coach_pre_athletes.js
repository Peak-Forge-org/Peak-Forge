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
    a1.href = "./coach_pre_chat.html";
    const a2 = el("a", "btn ghost", "ارسال برنامه");
    a2.href = "./coach_pre_programs.html";
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
  ATHLETES.push({
    id: Math.max(...ATHLETES.map((a) => a.id)) + 1,
    name,
    cat: $("newCat").value,
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
