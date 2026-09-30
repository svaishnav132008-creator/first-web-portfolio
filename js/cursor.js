export function initCursor() {
  const cursor = document.querySelector(".custom-cursor");
  const desktopPointer = window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasTouch = navigator.maxTouchPoints > 0;
  if (!cursor || !window.gsap || !desktopPointer.matches || hasTouch || reducedMotion.matches) return;

  const gsap = window.gsap;
  const body = document.body;
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  const move = gsap.quickTo(cursor, "x", { duration: 0.28, ease: "power3.out" });
  const moveY = gsap.quickTo(cursor, "y", { duration: 0.28, ease: "power3.out" });
  const projectSelector = ".project, .horizontal-card";
  const linkSelector = "a, button, [role='button']";

  const clearState = () => {
    body.classList.remove("has-custom-cursor");
    cursor.classList.remove("is-view", "is-link");
  };

  const updateState = (target) => {
    const element = target instanceof Element ? target : null;
    const isProject = Boolean(element?.closest(projectSelector));
    const isLink = Boolean(element?.closest(linkSelector));
    cursor.classList.toggle("is-view", isProject);
    cursor.classList.toggle("is-link", !isProject && isLink);
  };

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || !desktopPointer.matches || hasTouch || reducedMotion.matches) {
      clearState();
      return;
    }
    body.classList.add("has-custom-cursor");
    move(event.clientX);
    moveY(event.clientY);
    updateState(event.target);
  }, { passive: true });

  document.addEventListener("pointerover", (event) => {
    if (body.classList.contains("has-custom-cursor")) updateState(event.target);
  });
  document.addEventListener("pointerout", (event) => {
    if (event.relatedTarget instanceof Element) updateState(event.relatedTarget);
    else clearState();
  });

  const syncDeviceState = () => {
    if (!desktopPointer.matches || hasTouch || reducedMotion.matches) clearState();
  };
  desktopPointer.addEventListener("change", syncDeviceState);
  reducedMotion.addEventListener("change", syncDeviceState);
  window.addEventListener("blur", clearState);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") clearState();
  });
}