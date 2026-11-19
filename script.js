const OWNER_EMAIL = "dobleceonandrei@gmail.com";

document.querySelectorAll(".photo img").forEach(function (img) {
  const box = img.parentElement;

  function photoLoaded() {
    box.classList.add("has-photo");
  }

  function photoMissing() {
    img.hidden = true;
  }

  if (img.complete) {
    if (img.naturalWidth > 0) photoLoaded();
    else photoMissing();
  }
  img.addEventListener("load", photoLoaded);
  img.addEventListener("error", photoMissing);
});

const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.getElementById("site-menu");

function setMenu(open) {
  siteMenu.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", function () {
  setMenu(!siteMenu.classList.contains("open"));
});

document.querySelectorAll(".nav-links a").forEach(function (link) {
  link.addEventListener("click", function () { setMenu(false); });
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") setMenu(false);
});

const navLinks = document.querySelectorAll(".nav-links a");
const sections = Array.from(navLinks).map(function (a) {
  return document.querySelector(a.getAttribute("href"));
});

function updateActiveLink() {
  const line = window.scrollY + 140;
  let current = sections[0];
  sections.forEach(function (s) {
    if (s.offsetTop <= line) current = s;
  });
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
    current = sections[sections.length - 1];
  }
  navLinks.forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
  });
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("resize", updateActiveLink);
updateActiveLink();

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchStatus = document.getElementById("search-status");
const cards = Array.from(document.querySelectorAll(".card"));

function runSearch() {
  const term = searchInput.value.trim();
  const query = term.toLowerCase();
  let shown = 0;

  cards.forEach(function (card) {
    const text = (card.textContent + " " + card.dataset.keywords).toLowerCase();
    const match = !query || text.indexOf(query) !== -1;
    card.hidden = !match;
    if (match) shown++;
  });

  if (!query) {
    searchStatus.hidden = true;
    searchStatus.textContent = "";
    return;
  }

  searchStatus.hidden = false;
  searchStatus.textContent = shown
    ? "Showing " + shown + " of " + cards.length + " hobbies for \u201C" + term + "\u201D."
    : "No hobbies match \u201C" + term + "\u201D. Try \u201Cbasketball\u201D, \u201Creading\u201D or \u201Cgames\u201D.";

  const clear = document.createElement("button");
  clear.type = "button";
  clear.textContent = "Clear search";
  clear.addEventListener("click", function () {
    searchInput.value = "";
    runSearch();
  });
  searchStatus.appendChild(clear);
}

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  runSearch();
  setMenu(false);
  document.getElementById("hobbies").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", function () {
  if (!searchInput.value.trim()) runSearch();
});

const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

const rules = {
  name: function (v) {
    return v.length < 2 ? "Enter your name (at least 2 characters)." : "";
  },
  email: function (v) {
    if (!v) return "Enter your email address.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email, like name@example.com.";
  },
  message: function (v) {
    return v.length < 10 ? "Write a message of at least 10 characters." : "";
  }
};

function validateField(field) {
  const message = rules[field.name](field.value.trim());
  document.getElementById(field.name + "-error").textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

const fields = Object.keys(rules).map(function (name) {
  return form.elements[name];
});

fields.forEach(function (field) {
  field.addEventListener("blur", function () { validateField(field); });
  field.addEventListener("input", function () {
    if (field.getAttribute("aria-invalid") === "true") validateField(field);
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  formStatus.textContent = "";

  const results = fields.map(validateField);
  const firstBad = results.indexOf(false);

  if (firstBad !== -1) {
    fields[firstBad].focus();
    return;
  }

  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();

  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");

  form.reset();
  fields.forEach(function (f) { f.removeAttribute("aria-invalid"); });
  formStatus.textContent = "Opening your email app so you can send the message.";
  window.location.href = "mailto:" + OWNER_EMAIL + "?subject=" + subject + "&body=" + body;
});
Compose
Write to Doble Ceon Andrei
