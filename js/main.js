import { initAnimations } from "./animations.js";
import { initCursor } from "./cursor.js";
import { initSmoothScroll } from "./smooth-scroll.js";

function initNavigation() {
  const button = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-menu");
  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open navigation");
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  };

  button.addEventListener("click", () => {
    const opening = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(opening));
    button.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
    menu.classList.toggle("is-open", opening);
    menu.setAttribute("aria-hidden", String(!opening));
    document.body.classList.toggle("menu-open", opening);
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.querySelector(".back-top").addEventListener("click", () => {
    if (window.lenis) window.lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

initNavigation();
window.lenis = initSmoothScroll();
initCursor();
initAnimations();