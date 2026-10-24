const profile = {
  first: "امیر",
  last: "کریمی",
  height: 178,
  weight: 79.5,
  city: "تهران",
  country: "ایران",
  history: "۴ سال بدنسازی، ۲ سال کراس‌فیت",
  years: 4,
};
const medals = [
  { t: "مدال طلا — مسابقات پرس سینه", s: "باشگاه‌های تهران · ۱۴۰۳" },
  { t: "مدال نقره — ددلیفت", s: "جام دانشجویی · ۱۴۰۲" },
  { t: "عنوان سوم — کراس‌فیت تیمی", s: "لیگ شهری · ۱۴۰۲" },
];

const fa = (n, d = 0) =>
  Number(n).toLocaleString("fa-IR", {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });
const $ = (id) => document.getElementById(id);

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

function renderMedals() {
  medals.forEach((m) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong></strong><small></small>`;
    li.querySelector("strong").textContent = m.t;
    li.querySelector("small").textContent = m.s;
    $("medals").appendChild(li);
  });
}

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
renderMedals();
fillForm();
