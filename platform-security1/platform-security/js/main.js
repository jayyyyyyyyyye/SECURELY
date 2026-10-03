/* ==========================================================
   main.js — shared layout (header + footer), mobile menu,
   scroll effects. Loaded on every page.
   ========================================================== */

const SITE_NAME = "SECURELY"; // placeholder name — change it here, it updates everywhere

// One list of pages. `nav` = label shown in the desktop navbar (omit to show only in the menu/footer).
const PAGES = [
  { key: "home",      label: "Home",              href: "index.html",            nav: "Home" },
  { key: "basics",    label: "Security Basics",   href: "pages/basics.html",     nav: "Learn" },
  { key: "threats",   label: "Threats",           href: "pages/threats.html",    nav: "Threats" },
  { key: "tips",      label: "Security Tips",     href: "pages/tips.html",       nav: "Tips" },
  { key: "passwords", label: "Password Security", href: "pages/passwords.html" },
  { key: "phishing",  label: "Phishing",          href: "pages/phishing.html" },
  { key: "devices",   label: "Device Security",   href: "pages/devices.html" },
  { key: "network",   label: "Network Security",  href: "pages/network.html" },
  { key: "privacy",   label: "Privacy",           href: "pages/privacy.html" },
  { key: "resources", label: "Resources",         href: "pages/resources.html",  nav: "Resources" },
  { key: "quiz",      label: "Quiz",              href: "pages/quiz.html",       nav: "Quiz" },
];

const FOOTER_COLUMNS = {
  Learn:   ["basics", "threats", "tips", "resources"],
  Protect: ["passwords", "devices", "network", "privacy"],
  Explore: ["phishing", "quiz"],
};

// Lesson order used for the Previous / Next links at the bottom of each lesson page
const LEARNING_PATH = ["basics", "threats", "phishing", "passwords", "devices", "network", "privacy", "quiz"];

const pageByKey = Object.fromEntries(PAGES.map((p) => [p.key, p]));

// Each page tells us where it lives: <body data-page="home" data-root="">
const root = document.body.dataset.root || "";
const currentPage = document.body.dataset.page;

const LOGO_ICON = `
  <svg class="logo-icon" viewBox="0 0 200 240" aria-hidden="true">
    <path d="M100 8 186 40v72c0 56-38 96-86 120C52 208 14 168 14 112V40z" fill="#ff6a00"/>
    <circle cx="100" cy="104" r="17" fill="#1a0b00"/>
    <path d="M91 114h18l5 42H86z" fill="#1a0b00"/>
  </svg>`;

/* ---------- Build the layout ---------- */

function pageLink(page, text) {
  const isCurrent = page.key === currentPage;
  return `<a href="${root}${page.href}"${isCurrent ? ' class="active" aria-current="page"' : ""}>${text}</a>`;
}

function headerHTML() {
  const navItems = PAGES.filter((p) => p.nav).map((p) => `<li>${pageLink(p, p.nav)}</li>`);
  const menuItems = PAGES.map((p) => `<li>${pageLink(p, p.label)}</li>`);

  return `
    <header class="site-header">
      <nav class="container nav" aria-label="Main">
        <a class="logo" href="${root}index.html" aria-label="${SITE_NAME} home">${LOGO_ICON}<span>${SITE_NAME}</span></a>
        <ul class="nav-links">${navItems.join("")}</ul>
        <div class="nav-actions">
          <a class="btn btn-primary btn-sm" href="${root}pages/basics.html">Start Learning</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">☰</button>
        </div>
      </nav>
      <div class="mobile-menu" id="mobile-menu">
        <ul class="container">${menuItems.join("")}</ul>
      </div>
    </header>`;
}

function footerHTML() {
  const columns = Object.entries(FOOTER_COLUMNS).map(([title, keys]) => `
    <div class="footer-col">
      <h4>${title}</h4>
      <ul>${keys.map((k) => `<li>${pageLink(pageByKey[k], pageByKey[k].label)}</li>`).join("")}</ul>
    </div>`);

  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="logo" href="${root}index.html">${LOGO_ICON}<span>${SITE_NAME}</span></a>
            <p>Helping beginners build safer digital habits.</p>
          </div>
          ${columns.join("")}
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Platform Security Awareness Project</span>
          <span>Built for educational purposes.</span>
        </div>
      </div>
    </footer>`;
}

// "← Previous / Next →" links for pages that are part of LEARNING_PATH
function pagerHTML() {
  const i = LEARNING_PATH.indexOf(currentPage);
  if (i === -1) return "";

  const link = (key, direction, label) => `
    <a class="pager-link ${direction}" href="${root}${pageByKey[key].href}">
      <span class="pager-dir">${label}</span>
      <span class="pager-title">${pageByKey[key].label}</span>
    </a>`;

  const prev = i > 0 ? link(LEARNING_PATH[i - 1], "prev", "← Previous") : "";
  const next = i < LEARNING_PATH.length - 1 ? link(LEARNING_PATH[i + 1], "next", "Next →") : "";

  return `<nav class="section pager-section" aria-label="Lesson navigation"><div class="container pager">${prev}${next}</div></nav>`;
}

function injectLayout() {
  document.body.insertAdjacentHTML("afterbegin", headerHTML());
  document.body.insertAdjacentHTML("beforeend", footerHTML());
  document.querySelector("main")?.insertAdjacentHTML("beforeend", pagerHTML());
}

/* ---------- Behaviour ---------- */

function setupHeaderScroll() {
  const header = document.querySelector(".site-header");
  const update = () => header.classList.toggle("scrolled", window.scrollY > 20);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");

  function setOpen(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.textContent = open ? "✕" : "☰";
  }

  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("menu-open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
}

// Elements with class "reveal" fade in once they scroll into view (see animations.css)
function setupScrollReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  items.forEach((el) => observer.observe(el));
}

// Any element with data-print opens the browser's print dialog (used for the printable checklist)
function setupPrintButtons() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-print]")) window.print();
  });
}

injectLayout();
setupHeaderScroll();
setupMobileMenu();
setupScrollReveal();
setupPrintButtons();
