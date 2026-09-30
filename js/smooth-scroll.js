import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.20/+esm";

export function initSmoothScroll() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) return null;

  const { gsap, ScrollTrigger } = window;
  const lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    anchors: { offset: -72 },
  });

  const heroImage = document.querySelector(".hero__image");
  const moveHeroWithVelocity = heroImage
    ? gsap.quickTo(heroImage, "y", { duration: 0.42, ease: "power2.out" })
    : null;

  lenis.on("scroll", ({ velocity }) => {
    ScrollTrigger.update();
    if (!moveHeroWithVelocity) return;

    const bounds = heroImage.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) {
      moveHeroWithVelocity(0);
      return;
    }

    moveHeroWithVelocity(gsap.utils.clamp(-14, 14, velocity * -0.35));
  });

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}