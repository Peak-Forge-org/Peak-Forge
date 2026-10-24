document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".panel")
      .forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    const panel = document.getElementById(tab.dataset.target);
    panel.classList.add("active");
    const list = panel.querySelector(".messages");
    list.scrollTop = list.scrollHeight;
  });
});

document.querySelectorAll(".priority-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", String(!on));
    btn.closest(".composer").classList.toggle("is-priority", !on);
  });
});

document.querySelectorAll(".composer").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const text = input.value.trim();
    if (!text) return;

    const list = document.getElementById(form.dataset.list);
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

document
  .querySelectorAll(".messages")
  .forEach((l) => (l.scrollTop = l.scrollHeight));
