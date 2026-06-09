"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LandingAnimations() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Hero — on mount, no ScrollTrigger (above the fold)
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl
          .from("#landing-hero > span", { opacity: 0, y: 12, duration: 0.5 })
          .from("#landing-hero h1", { opacity: 0, y: 20, duration: 0.65 }, "-=0.35")
          .from("#landing-hero > p", { opacity: 0, y: 15, duration: 0.55 }, "-=0.35")
          .from("#landing-hero > a", { opacity: 0, y: 10, duration: 0.5 }, "-=0.3")
          .from("#landing-hero > div", { opacity: 0, y: 10, duration: 0.6 }, "-=0.3");

        // Features heading block
        gsap.from("#landing-features > div > :nth-child(1)", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#landing-features",
            start: "top 80%",
          },
        });

        // Primary callout
        gsap.from("#landing-features > div > :nth-child(2)", {
          opacity: 0,
          y: 25,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#landing-features > div > :nth-child(2)",
            start: "top 85%",
          },
        });

        // Secondary features — staggered
        gsap.from("#landing-features > div > :nth-child(3) > *", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: "#landing-features > div > :nth-child(3)",
            start: "top 85%",
          },
        });
      });

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return null;
}
