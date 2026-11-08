// coach-programs.js — coach programs, templates & calendar (free + premium)
if (typeof requireAuth === "function" && !requireAuth()) throw new Error("unauthorized");
if (typeof requireRole === "function") requireRole("coach");

const IS_PREMIUM = () =>
  typeof getLocalUser === "function" && getLocalUser()?.tier === "premium";

const DAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
const todayIdx = (new Date().getDay() + 1) % 7;

let plans = []; // [{id, _kind, name, type, weeks, sent_count}]
let athletes = []; // [{id, name, category, ...}]
let schedule = []; // [{id, day_index, plan_kind, plan_id, target}]
let sendPlan = null;
let sendBulk = false;
let contentPlan = null;

const athName = (a) =>
  a.name || `${a.first_name || ""} ${a.last_name || ""}`.trim() || "ورزشکار";

// ── Tabs (Programs vs Weekly Calendar) ───────────────────────────────────────

if (IS_PREMIUM() && $("calTab")) {
  $("calTab").textContent = "تقویم تمرینی";
}

document.querySelectorAll(".tab[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.target === "calPanel" && !IS_PREMIUM()) return;
    document.querySelectorAll(".tab[data-target]").forEach((b) =>
      b.classList.toggle("active", b === btn),
    );
    document.querySelectorAll(".panel").forEach((p) => {
      p.hidden = p.id !== btn.dataset.target;
    });
  });
});

// ── Data Loading ─────────────────────────────────────────────────────────────

async function loadPlans() {
  const [workout, diet] = await Promise.all([
    apiFetch("/workouts/programs"),
    apiFetch("/diet/plans"),
  ]);
  plans = [];
  if (workout && workout.ok) {
    (workout.data.programs || []).forEach((p) =>
      plans.push({
        ...p,
        _kind: "workout",
        type: p.type || "تمرینی",
        sent_count: p.sent_count || 0,
      }),
    );
  }
  if (diet && diet.ok) {
    (diet.data.plans || []).forEach((p) =>
      plans.push({
        ...p,
        _kind: "diet",
        type: "غذایی",
        sent_count: p.sent_count || 0,
      }),
    );
  }
  renderPlans();
  if (IS_PREMIUM()) renderCalSelects();
}

async function loadAthletes() {
  const res = await apiFetch("/coach/athletes");
  if (res && res.ok) {
    athletes = res.data.athletes || [];
    return;
  }
  const fallback = await apiFetch("/workouts/athletes");
  if (fallback && fallback.ok) athletes = fallback.data.athletes || [];
}

async function loadSchedule() {
  if (!IS_PREMIUM()) return;
  const res = await apiFetch("/coach/schedule");
  if (res && res.ok) schedule = res.data.schedule || [];
}

// ── Render Programs / Templates ──────────────────────────────────────────────

function renderPlans() {
  const box = $("templates");
  box.innerHTML = "";
  if (!plans.length) {
    box.appendChild(el("p", "empty", "هنوز برنامه‌ای تعریف نکرده‌اید."));
    return;
  }

  plans.forEach((p) => {
    const c = el("article", "card tpl");

    const top = el("div", "tpl-top");
    const typeLabel = p._kind === "diet" ? "غذایی" : p.type || "تمرینی";
    top.append(
      el("h3", null, p.name),
      el("span", "type" + (p._kind === "diet" ? " food" : ""), typeLabel),
    );

    const meta = el("div", "tpl-meta");
    meta.append(
      el("span", "muted", `${fa(p.weeks)} هفته`),
      el("span", "muted", `ارسال‌شده به ${fa(p.sent_count || 0)} ورزشکار`),
    );

    const act = el("div", "tpl-actions");
    const contentBtn = el("button", "btn ghost", "محتوا");
    const sendBtn = el("button", "btn", "ارسال به ورزشکار");
    contentBtn.type = "button";
    sendBtn.type = "button";
    contentBtn.addEventListener("click", () => openContent(p));
    sendBtn.addEventListener("click", () => openSend(p, false));
    act.append(contentBtn, sendBtn);

    if (IS_PREMIUM()) {
      const groupBtn = el("button", "btn ghost", "ارسال گروهی");
      const copyBtn = el("button", "btn ghost", "کپی");
      const editBtn = el("button", "btn ghost", "شخصی‌سازی نام");
      [groupBtn, copyBtn, editBtn].forEach((b) => (b.type = "button"));
      groupBtn.addEventListener("click", () => openSend(p, true));
      copyBtn.addEventListener("click", () => copyPlan(p));
      editBtn.addEventListener("click", () => renamePlan(p));
      act.append(groupBtn, copyBtn, editBtn);
    } else {
      const groupBtn = el("button", "lock-mini", "🔒 ارسال گروهی");
      const copyBtn = el("button", "lock-mini", "🔒 کپی و شخصی‌سازی");
      groupBtn.type = "button";
      copyBtn.type = "button";
      groupBtn.dataset.premium = "ارسال گروهی برنامه";
      copyBtn.dataset.premium = "کپی و شخصی‌سازی برنامه";
      act.append(groupBtn, copyBtn);
    }

    const delBtn = el("button", "btn ghost", "حذف");
    delBtn.type = "button";
    delBtn.addEventListener("click", () => deletePlan(p));
    act.appendChild(delBtn);

    c.append(top, meta, act);
    box.appendChild(c);
  });
}

// ── Create / Copy / Rename / Delete Program ──────────────────────────────────

$("tplForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("tplName").value.trim();
  if (!name) return;

  const type = $("tplType").value;
  const weeks = +$("tplWeeks").value || 4;
  const isDiet = type === "غذایی";
  const path = isDiet ? "/diet/plans" : "/workouts/programs";

  const submitBtn = $("tplForm").querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const body = isDiet ? { name, weeks } : { name, type, weeks };
  const res = await apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  submitBtn.disabled = false;

  if (!res || !res.ok) {
    toast((res && res.data && res.data.error) || "خطا در ساخت برنامه");
    return;
  }

  $("tplName").value = "";
  toast("برنامه ساخته شد");
  await loadPlans();
});

async function copyPlan(p) {
  const path =
    p._kind === "diet"
      ? `/diet/plans/${p.id}/copy`
      : `/workouts/programs/${p.id}/copy`;
  const res = await apiFetch(path, {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (res && res.ok) {
    toast("نسخه‌ی کپی ساخته شد");
    await loadPlans();
  } else {
    toast((res && res.data && res.data.error) || "خطا در کپی");
  }
}

async function renamePlan(p) {
  const n = prompt("نام جدید برنامه:", p.name);
  if (!n || !n.trim() || n.trim() === p.name) return;
  const path =
    p._kind === "diet"
      ? `/diet/plans/${p.id}`
      : `/workouts/programs/${p.id}`;
  const res = await apiFetch(path, {
    method: "PATCH",
    body: JSON.stringify({ name: n.trim() }),
  });
  if (res && res.ok) {
    p.name = n.trim();
    renderPlans();
    if (IS_PREMIUM()) {
      renderCalSelects();
      renderCalendar();
    }
    toast("نام برنامه تغییر کرد");
  } else {
    toast((res && res.data && res.data.error) || "خطا در تغییر نام");
  }
}

async function deletePlan(p) {
  if (!confirm(`آیا می‌خواهید برنامه «${p.name}» را حذف کنید؟`)) return;
  const path =
    p._kind === "diet"
      ? `/diet/plans/${p.id}`
      : `/workouts/programs/${p.id}`;
  const res = await apiFetch(path, { method: "DELETE" });
  if (!res || !res.ok) {
    toast((res && res.data && res.data.error) || "خطا در حذف برنامه");
    return;
  }
  plans = plans.filter((x) => !(x.id === p.id && x._kind === p._kind));
  renderPlans();
  if (IS_PREMIUM()) {
    renderCalSelects();
    renderCalendar();
  }
  toast("برنامه حذف شد");
}

// ── Content Editor (exercises / meals) ───────────────────────────────────────

DAYS.forEach((d, i) => {
  const o = el("option", null, d);
  o.value = i;
  $("cDay").appendChild(o);
});

async function openContent(p) {
  contentPlan = p;
  const isDiet = p._kind === "diet";
  $("contentTitle").textContent = `محتوای «${p.name}»`;
  $("contentSub").textContent = isDiet
    ? "وعده‌های برنامه‌ی غذایی را مدیریت کنید"
    : "حرکات برنامه‌ی تمرینی را مدیریت کنید";

  $("cDayWrap").hidden = isDiet;
  $("cSetsWrap").hidden = isDiet;
  $("cRestWrap").hidden = isDiet;
  $("cTimeWrap").hidden = !isDiet;
  $("cKcalWrap").hidden = !isDiet;
  $("cItemsWrap").hidden = !isDiet;
  $("cAltWrap").hidden = !isDiet;

  await renderContentList();
  $("contentDlg").showModal();
}

async function renderContentList() {
  const box = $("contentList");
  box.innerHTML = "";
  const isDiet = contentPlan._kind === "diet";
  const path = isDiet
    ? `/diet/plans/${contentPlan.id}/meals`
    : `/workouts/programs/${contentPlan.id}/exercises`;

  const result = await apiFetch(path);
  const items =
    (result && result.ok && (result.data.meals || result.data.exercises)) || [];

  if (!items.length) {
    box.appendChild(
      el(
        "p",
        "muted",
        isDiet ? "هنوز وعده‌ای اضافه نشده." : "هنوز حرکتی اضافه نشده.",
      ),
    );
    return;
  }

  items.forEach((item) => {
    const row = el("div", "content-row");
    const txt = el("div", "content-text");
    if (isDiet) {
      txt.append(
        el("strong", null, `${item.name}${item.time ? " · " + item.time : ""}`),
        el(
          "small",
          null,
          `${item.items || "—"}${item.kcal != null ? " · " + fa(item.kcal) + " کیلوکالری" : ""}${item.alt ? " · جایگزین: " + item.alt : ""}`,
        ),
      );
    } else {
      txt.append(
        el("strong", null, item.name),
        el(
          "small",
          null,
          `${item.sets || "—"}${item.rest ? " · استراحت " + item.rest : ""} · ${item.day_name || DAYS[item.day_index] || ""}`,
        ),
      );
    }
    const x = el("button", "icon-btn", "✕");
    x.type = "button";
    x.setAttribute("aria-label", "حذف");
    x.addEventListener("click", async () => {
      const delPath = isDiet
        ? `/diet/plans/${contentPlan.id}/meals/${item.id}`
        : `/workouts/programs/${contentPlan.id}/exercises/${item.id}`;
      const res = await apiFetch(delPath, { method: "DELETE" });
      if (res && res.ok) renderContentList();
      else toast((res && res.data && res.data.error) || "خطا در حذف");
    });
    row.append(txt, x);
    box.appendChild(row);
  });
}

$("contentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!contentPlan) return;
  const isDiet = contentPlan._kind === "diet";
  const name = $("cName").value.trim();
  if (!name) return;

  const path = isDiet
    ? `/diet/plans/${contentPlan.id}/meals`
    : `/workouts/programs/${contentPlan.id}/exercises`;

  const body = isDiet
    ? {
        name,
        time: $("cTime").value.trim(),
        items: $("cItems").value.trim(),
        kcal: $("cKcal").value === "" ? null : +$("cKcal").value,
        alt: $("cAlt").value.trim(),
      }
    : {
        name,
        sets: $("cSets").value.trim(),
        rest: $("cRest").value.trim(),
        day_index: +$("cDay").value,
        day_name: DAYS[+$("cDay").value],
      };

  const res = await apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (res && res.ok) {
    $("cName").value = "";
    $("cSets").value = "";
    $("cRest").value = "";
    $("cTime").value = "";
    $("cItems").value = "";
    $("cKcal").value = "";
    $("cAlt").value = "";
    toast(isDiet ? "وعده اضافه شد" : "حرکت اضافه شد");
    await renderContentList();
  } else {
    toast((res && res.data && res.data.error) || "خطا در افزودن");
  }
});
$("contentClose").addEventListener("click", () => $("contentDlg").close());

// ── Send Dialog (Single & Bulk) ──────────────────────────────────────────────

function openSend(p, bulk = false) {
  sendPlan = p;
  sendBulk = !!bulk;
  $("sendTitle").textContent = `ارسال «${p.name}»`;
  $("sendSub").textContent = sendBulk
    ? "ورزشکاران مقصد را انتخاب کنید"
    : "ورزشکار مقصد را انتخاب کنید";

  const cats = $("sendCats");
  cats.innerHTML = "";
  cats.hidden = !sendBulk;

  const list = $("sendList");
  list.innerHTML = "";

  if (!athletes.length) {
    list.appendChild(el("p", "muted", "هنوز ورزشکاری ندارید."));
    $("sendDlg").showModal();
    return;
  }

  athletes.forEach((a, i) => {
    const row = el("label", "check-row");
    const inp = el("input");
    inp.type = sendBulk ? "checkbox" : "radio";
    if (!sendBulk) {
      inp.name = "target";
      inp.checked = i === 0;
    }
    inp.value = a.id;
    inp.dataset.cat = a.category || "";
    row.append(inp, el("span", null, athName(a)));
    if (sendBulk) {
      row.appendChild(el("small", null, a.category || "بدون دسته"));
    }
    list.appendChild(row);
  });

  if (sendBulk) {
    const mk = (label, fn) => {
      const b = el("button", "chip", label);
      b.type = "button";
      b.addEventListener("click", fn);
      cats.appendChild(b);
    };
    mk("همه", () =>
      list.querySelectorAll("input").forEach((i) => (i.checked = true)),
    );
    CATS.forEach((c) =>
      mk(c, () =>
        list
          .querySelectorAll("input")
          .forEach((i) => (i.checked = i.dataset.cat === c)),
      ),
    );
    mk("هیچ‌کدام", () =>
      list.querySelectorAll("input").forEach((i) => (i.checked = false)),
    );
  }

  $("sendDlg").showModal();
}

$("sendCancel").addEventListener("click", () => $("sendDlg").close());

$("sendGo").addEventListener("click", async () => {
  const checked = [...$("sendList").querySelectorAll("input:checked")];
  if (!checked.length) {
    toast("حداقل یک ورزشکار انتخاب کنید");
    return;
  }

  const path =
    sendPlan._kind === "diet"
      ? `/diet/plans/${sendPlan.id}/assign`
      : `/workouts/programs/${sendPlan.id}/assign`;

  let ok = 0;
  let lastError = null;
  for (const inp of checked) {
    const res = await apiFetch(path, {
      method: "POST",
      body: JSON.stringify({ athlete_id: inp.value }),
    });
    if (res && res.ok) ok += 1;
    else lastError = res?.data?.error;
  }

  $("sendDlg").close();
  if (!ok) {
    toast(lastError || "خطا در ارسال برنامه");
    return;
  }

  await loadPlans();
  if (!sendBulk && checked.length === 1) {
    const a = athletes.find((x) => String(x.id) === String(checked[0].value));
    toast(`برنامه برای ${ a ? athName(a) : "ورزشکار" } ارسال شد`);
  } else {
    toast(`برنامه برای ${fa(ok)} ورزشکار ارسال شد`);
  }
});

// ── Weekly Calendar (Premium only, persisted on server) ──────────────────────

const findPlanName = (kind, id) => {
  const t = plans.find((x) => x._kind === kind && String(x.id) === String(id));
  return t ? t.name : "(حذف‌شده)";
};

function renderCalendar() {
  const box = $("calendar");
  if (!box) return;
  box.innerHTML = "";
  DAYS.forEach((d, i) => {
    const c = el("div", "card day-card" + (i === todayIdx ? " today" : ""));
    const name = el("div", "day-name", d);
    if (i === todayIdx) name.appendChild(el("small", null, "امروز"));
    const slots = el("div", "slots");
    const items = schedule.filter((s) => s.day_index === i);
    if (!items.length)
      slots.appendChild(el("span", "muted", "برنامه‌ای ثبت نشده"));
    items.forEach((s) => {
      const chip = el("span", "slot");
      chip.append(
        el("span", null, findPlanName(s.plan_kind, s.plan_id)),
        el("small", null, s.target || ""),
      );
      const x = el("button", "icon-btn", "✕");
      x.type = "button";
      x.setAttribute("aria-label", "حذف از تقویم");
      x.addEventListener("click", async () => {
        const res = await apiFetch(`/coach/schedule/${s.id}`, {
          method: "DELETE",
        });
        if (res && res.ok) {
          await loadSchedule();
          renderCalendar();
        } else {
          toast((res && res.data && res.data.error) || "خطا در حذف");
        }
      });
      chip.appendChild(x);
      slots.appendChild(chip);
    });
    c.append(name, slots);
    box.appendChild(c);
  });
}

function renderCalSelects() {
  const sel = $("calTpl");
  if (!sel) return;
  sel.innerHTML = "";
  plans.forEach((t) => {
    const o = el("option", null, t.name);
    o.value = t._kind + ":" + t.id;
    sel.appendChild(o);
  });
}

DAYS.forEach((d, i) => {
  const o = el("option", null, d);
  o.value = i;
  $("calDay").appendChild(o);
});
$("calDay").value = todayIdx;

function fillCalTargets() {
  const sel = $("calTarget");
  if (!sel) return;
  sel.innerHTML = "";
  [
    "همه‌ی ورزشکاران",
    ...CATS.map((c) => "دسته‌ی " + c),
    ...athletes.map((a) => athName(a)),
  ].forEach((t) => sel.appendChild(el("option", null, t)));
}

$("calForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const raw = String($("calTpl").value || "");
  const [kind, tplId] = raw.split(":");
  if (!tplId || !plans.some((t) => String(t.id) === tplId && t._kind === kind)) {
    return toast("اول یک برنامه بسازید");
  }
  const res = await apiFetch("/coach/schedule", {
    method: "POST",
    body: JSON.stringify({
      day_index: +$("calDay").value,
      plan_kind: kind,
      plan_id: +tplId,
      target: $("calTarget").value,
    }),
  });
  if (res && res.ok) {
    await loadSchedule();
    renderCalendar();
    toast("به تقویم اضافه شد");
  } else {
    toast((res && res.data && res.data.error) || "خطا در افزودن به تقویم");
  }
});

// ── Bootstrap ────────────────────────────────────────────────────────────────

(async () => {
  await Promise.all([loadPlans(), loadAthletes(), loadSchedule()]);
  if (IS_PREMIUM()) {
    fillCalTargets();
    renderCalendar();
  }
})();
