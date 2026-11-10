(function () {
  var root = document.documentElement;

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var buttons = document.querySelectorAll("[data-set-theme]");
  function syncButtons() {
    var cur = currentTheme();
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-set-theme") === cur));
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var next = b.getAttribute("data-set-theme");
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncButtons();
    });
  });
  syncButtons();
  // Follow the system setting until the visitor picks a theme explicitly.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncButtons);

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    return;
  }

  // Fade sections in as they enter the viewport.
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  document.querySelectorAll(".reveal").forEach(function (el) { reveal.observe(el); });

  // Mark the nav link of the section currently in view.
  var links = {};
  document.querySelectorAll("nav a[href^='#']").forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); });
      if (links[e.target.id]) links[e.target.id].classList.add("active");
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  Object.keys(links).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });
})();
