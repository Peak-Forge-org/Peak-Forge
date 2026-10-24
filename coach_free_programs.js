const plans = [
  { id: 1, name: "حجم‌گیری ۴ روزه", type: "تمرینی", weeks: 8, sent: 1 },
  { id: 2, name: "رژیم ۲۰۰۰ کالری پروتئینی", type: "غذایی", weeks: 4, sent: 1 },
];
let sendPlan = null;

function renderPlans() {
  const box = $("templates");
  box.innerHTML = "";
  if (!plans.length)
    box.appendChild(el("p", "empty", "هنوز برنامه‌ای تعریف نکرده‌اید."));
  plans.forEach((p) => {
    const c = el("article", "card tpl");
    const top = el("div", "tpl-top");
    top.append(
      el("h3", null, p.name),
      el("span", "type" + (p.type === "غذایی" ? " food" : ""), p.type),
    );
    const meta = el("div", "tpl-meta");
    meta.append(
      el("span", "muted", `${fa(p.weeks)} هفته`),
      el("span", "muted", `ارسال‌شده به ${fa(p.sent)} ورزشکار`),
    );
    const act = el("div", "tpl-actions");
    const send = el("button", "btn", "ارسال به ورزشکار");
    const group = el("button", "lock-mini", "🔒 ارسال گروهی");
    const copy = el("button", "lock-mini", "🔒 کپی و شخصی‌سازی");
    group.dataset.premium = "ارسال گروهی برنامه";
    copy.dataset.premium = "کپی و شخصی‌سازی برنامه";
    [send, group, copy].forEach((b) => (b.type = "button"));
    send.addEventListener("click", () => openSend(p));
    act.append(send, group, copy);
    c.append(top, meta, act);
    box.appendChild(c);
  });
}

$("tplForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("tplName").value.trim();
  if (!name) return;
  plans.push({
    id: Date.now(),
    name,
    type: $("tplType").value,
    weeks: +$("tplWeeks").value || 4,
    sent: 0,
  });
  $("tplName").value = "";
  renderPlans();
  toast("برنامه ساخته شد");
});

function openSend(p) {
  sendPlan = p;
  $("sendTitle").textContent = `ارسال «${p.name}»`;
  const list = $("sendList");
  list.innerHTML = "";
  ATHLETES.forEach((a, i) => {
    const row = el("label", "check-row");
    const r = el("input");
    r.type = "radio";
    r.name = "target";
    r.value = a.id;
    r.checked = i === 0;
    row.append(r, el("span", null, a.name));
    list.appendChild(row);
  });
  $("sendDlg").showModal();
}
$("sendCancel").addEventListener("click", () => $("sendDlg").close());
$("sendGo").addEventListener("click", () => {
  const r = $("sendList").querySelector("input:checked");
  if (!r) return;
  const a = ATHLETES.find((x) => String(x.id) === r.value);
  sendPlan.sent += 1;
  $("sendDlg").close();
  renderPlans();
  toast(`برنامه برای ${a.name} ارسال شد`);
});

renderPlans();
