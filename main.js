/* Aayan Asif — digital resume
   Two small behaviours, no dependencies:
   1. a light/dark toggle that remembers the reader's choice
   2. nav links that mark the section currently on screen          */

(function () {
  "use strict";

  /* ---- 1. Theme toggle ------------------------------------------------- */
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");

  function systemPrefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function currentTheme() {
    return root.getAttribute("data-theme") ||
           (systemPrefersDark() ? "dark" : "light");
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var dark = theme === "dark";
    button.textContent = dark ? "Light mode" : "Dark mode";
    button.setAttribute("aria-pressed", String(dark));
  }

  // localStorage can throw in private browsing, so guard both reads and writes.
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* ignore */ }

  applyTheme(saved || (systemPrefersDark() ? "dark" : "light"));

  button.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });

  /* ---- 2. Highlight the section in view -------------------------------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".masthead-nav a")
  );
  var sections = links
    .map(function (link) { return document.querySelector(link.hash); })
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  function markCurrent(id) {
    links.forEach(function (link) {
      if (link.hash === "#" + id) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) markCurrent(entry.target.id);
    });
  }, {
    // Trigger when a section crosses the upper third of the viewport.
    rootMargin: "-20% 0px -70% 0px"
  });

  sections.forEach(function (section) { observer.observe(section); });
})();
