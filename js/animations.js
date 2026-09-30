export function initAnimations() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const counter = { value: 0 };
  const loader = document.querySelector(".preloader");
  const percent = document.querySelector(".preloader__percent");
  const progress = document.querySelector(".preloader__track span");
  const heroImage = document.querySelector(".hero__image");
  const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });

  entrance.to(counter, {
    value: 100,
    duration: reduceMotion ? 0.12 : 0.95,
    ease: "power2.inOut",
    onUpdate: () => {
      const value = Math.round(counter.value).toString().padStart(2, "0");
      percent.textContent = value;
      progress.style.width = `${value}%`;
    },
  });

  if (reduceMotion) {
    entrance.set(loader, { autoAlpha: 0 });
    gsap.set(heroImage, { scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(".wordmark, .desktop-nav a, .header-note, .menu-toggle, .hero__eyebrow, .hero__topline, .hero__scroll, .hero__index", { y: 0, autoAlpha: 1 });
    gsap.set(".hero__title-prefix, .hero__title-vision, .hero__title-portfolio", { yPercent: 0, autoAlpha: 1 });
  } else {
    entrance.to(loader, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
    entrance.fromTo(heroImage, { clipPath: "inset(0% 0% 100% 0%)", autoAlpha: 0 }, {
      clipPath: "inset(0% 0% 0% 0%)",
      autoAlpha: 1,
      duration: 1.05,
      ease: "power3.inOut",
    });
    entrance.fromTo(heroImage, { scale: 1.08 }, {
      scale: 1,
      duration: 1.8,
      ease: "power2.out",
    }, "<");
    entrance.fromTo(".wordmark, .desktop-nav a, .header-note, .menu-toggle", {
      y: -10,
      autoAlpha: 0,
    }, {
      y: 0,
      autoAlpha: 1,
      duration: 0.58,
      stagger: 0.055,
      ease: "power3.out",
    }, "-=0.04");
    entrance.fromTo(".hero__title-prefix", { yPercent: 110, autoAlpha: 0 }, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.55,
      ease: "power3.out",
    });
    entrance.fromTo(".hero__title-vision", { yPercent: 110, autoAlpha: 0 }, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.62,
      ease: "power3.out",
    }, "-=0.12");
    entrance.fromTo(".hero__title-portfolio", { yPercent: 110, autoAlpha: 0 }, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.7,
      ease: "power3.out",
    }, "-=0.12");
    entrance.fromTo(".hero__eyebrow, .hero__topline, .hero__scroll, .hero__index", {
      y: 8,
      autoAlpha: 0,
    }, {
      y: 0,
      autoAlpha: 1,
      duration: 0.58,
      stagger: 0.07,
      ease: "power2.out",
    }, "-=0.04");
  }

  const revealClip = {
    left: "inset(0% 100% 0% 0%)",
    bottom: "inset(100% 0% 0% 0%)",
    center: "inset(50% 50% 50% 50%)",
  };
  const revealImage = (frame, direction, revealTrigger, parallaxTrigger = revealTrigger) => {
    const image = frame.querySelector("img");
    if (reduceMotion || !image) return;

    gsap.fromTo(frame, {
      clipPath: revealClip[direction] || revealClip.bottom,
      autoAlpha: 0,
    }, {
      clipPath: "inset(0% 0% 0% 0%)",
      autoAlpha: 1,
      duration: 1.05,
      ease: "power3.out",
      scrollTrigger: { ...revealTrigger, once: true },
    });

    gsap.fromTo(image, { scale: 1.08 }, {
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      onComplete: () => gsap.set(image, { clearProps: "transform" }),
      scrollTrigger: { ...revealTrigger, once: true },
    });

    gsap.fromTo(image, { objectPosition: "50% 44%" }, {
      objectPosition: "50% 56%",
      ease: "none",
      scrollTrigger: { ...parallaxTrigger, scrub: 0.45 },
    });
  };

  if (reduceMotion) {
    gsap.set(".reveal-up", { y: 0, autoAlpha: 1 });
  } else {
    gsap.utils.toArray(".reveal-up").forEach((element) => {
      gsap.to(element, {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      });
    });
  }

  gsap.utils.toArray(".project__visual, .contact-image").forEach((frame) => {
    revealImage(frame, frame.dataset.reveal, { trigger: frame, start: "top 84%" }, {
      trigger: frame,
      start: "top bottom",
      end: "bottom top",
    });
  });

  gsap.utils.toArray(".fact__number").forEach((element) => {
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    if (reduceMotion) {
      element.textContent = `${target}${suffix}`;
      return;
    }
    const value = { current: 0 };
    gsap.to(value, {
      current: target,
      duration: 1.6,
      ease: "power2.out",
      snap: { current: 1 },
      onUpdate: () => { element.textContent = `${Math.round(value.current)}${suffix}`; },
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
    });
  });

  if (!reduceMotion) {
    gsap.to(".contact-title", {
      xPercent: -5,
      ease: "none",
      scrollTrigger: { trigger: ".contact-section", start: "top bottom", end: "bottom top", scrub: 0.45 },
    });

    gsap.utils.toArray(".work-intro h2, .services-heading h2, .faq-heading h2").forEach((heading) => {
      gsap.fromTo(heading, { y: 10 }, {
        y: -10,
        ease: "none",
        scrollTrigger: { trigger: heading, start: "top bottom", end: "bottom top", scrub: 0.4 },
      });
    });
  }

  const horizontalSection = document.querySelector(".horizontal-section");
  const horizontalTrack = document.querySelector(".horizontal__track");
  if (horizontalSection && horizontalTrack && !reduceMotion) {
    const horizontalMedia = gsap.matchMedia();
    horizontalMedia.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
      const travelDistance = () => Math.max(0, horizontalTrack.scrollWidth - window.innerWidth);
      const horizontalTween = gsap.to(horizontalTrack, {
        x: () => -travelDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalSection,
          start: "top top",
          end: () => `+=${travelDistance()}`,
          pin: true,
          scrub: 0.45,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      gsap.utils.toArray(".horizontal-card").forEach((card, index) => {
        const imageFrame = card.querySelector(".horizontal-card__image");
        const image = card.querySelector(".horizontal-card__image img");
        const title = card.querySelector(".horizontal-card__caption h3");
        const panelReveal = index === 0
          ? { trigger: imageFrame, start: "top 84%" }
          : { trigger: imageFrame, containerAnimation: horizontalTween, start: "left 84%", end: "left 58%" };
        const panelParallax = {
          trigger: card,
          containerAnimation: horizontalTween,
          start: "left right",
          end: "right left",
        };

        revealImage(imageFrame, imageFrame.dataset.reveal, panelReveal, panelParallax);

        const titleReveal = index === 0
          ? { trigger: horizontalSection, start: "top 84%" }
          : { trigger: card, containerAnimation: horizontalTween, start: "left 84%", end: "left 58%" };
        gsap.fromTo(title, { y: 16, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          ease: "power2.out",
          scrollTrigger: {
            ...titleReveal,
            once: true,
          },
        });
      });

      return () => gsap.set(horizontalTrack, { clearProps: "transform" });
    });

    horizontalMedia.add("(max-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray(".horizontal-card").forEach((card) => {
        const imageFrame = card.querySelector(".horizontal-card__image");
        const title = card.querySelector(".horizontal-card__caption h3");

        revealImage(imageFrame, imageFrame.dataset.reveal, {
          trigger: imageFrame,
          start: "top 84%",
        }, {
          trigger: imageFrame,
          start: "top bottom",
          end: "bottom top",
        });

        gsap.fromTo(title, { y: 16, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: { trigger: title, start: "top 88%", once: true },
        });
      });
    });
  }

  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        document.querySelectorAll(".faq-item[open]").forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
      ScrollTrigger.refresh();
    });
  });

  const header = document.querySelector(".site-header");
  const sections = document.querySelectorAll("main section[data-theme]");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) header.dataset.theme = entry.target.dataset.theme;
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));

  const refreshLayout = () => ScrollTrigger.refresh();
  if (document.readyState === "complete") requestAnimationFrame(refreshLayout);
  else window.addEventListener("load", refreshLayout, { once: true });
  document.fonts.ready.then(refreshLayout);
}