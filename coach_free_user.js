const profile = {
  first: "علی",
  last: "رضایی",
  height: 182,
  weight: 85,
  city: "تهران",
  country: "ایران",
  history: "۱۰ سال مربیگری بدنسازی و تغذیه‌ی ورزشی",
  years: 10,
};
const medals = [
  { t: "مربی برتر استان تهران", s: "فدراسیون بدنسازی · ۱۴۰۳" },
  { t: "مدرک مربیگری درجه‌ی یک", s: "فدراسیون بدنسازی · ۱۳۹۹" },
  { t: "مربی تیم قهرمان لیگ شهری", s: "۱۴۰۲" },
];
const store = {
  name: "فروشگاه مربی علی",
  products: [
    { name: "پروتئین وی ۲ پوند", price: 1450000 },
    { name: "کش تمرینی مقاومتی", price: 320000 },
    { name: "پکیج مشاوره‌ی ماهانه", price: 900000 },
  ],
};

function renderProfile() {
  $("fullName").textContent = `${profile.first} ${profile.last}`;
  $("avatar").textContent = profile.first[0];
  $("place").textContent = `${profile.city}، ${profile.country}`;
  $("history").textContent = profile.history;
  $("sAth").textContent = fa(ATHLETES.length);
  $("sYears").textContent = fa(profile.years);
  $("sProd").textContent = fa(store.products.length);
}
function renderMedals() {
  medals.forEach((m) => {
    const li = el("li");
    li.append(el("strong", null, m.t), el("small", null, m.s));
    $("medals").appendChild(li);
  });
}

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
  store.products.push({ name, price });
  $("pName").value = "";
  $("pPrice").value = "";
  renderStore();
  renderProfile();
  toast("محصول ثبت شد");
});

renderProfile();
renderMedals();
fillForm();
renderStore();
