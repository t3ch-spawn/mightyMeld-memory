import React, { useEffect } from "react";
import gsap from "gsap";

export function runTransition(color, fn) {
  if (color == "pink") {
    gsap
      .timeline()
      .to(".pink-bg", {
        scaleY: 100,
        ease: "power2.in",
        transformOrigin: "bottom",
        duration: 1.5,
      })
      .to(".pink-bg", {
        scaleY: 0,
        ease: "power3.out",
        transformOrigin: "top",
        duration: 1,
        delay: -1,
        onComplete: () => {
          if (fn) {
            fn();
          }
        },
      });
  } else if (color == "blue") {
    gsap
      .timeline()
      .to(".blue-bg", {
        scaleY: 100,
        ease: "power2.in",
        transformOrigin: "bottom",
        duration: 1.5,
      })
      .to(".blue-bg", {
        scaleY: 0,
        ease: "power3.out",
        transformOrigin: "top",
        duration: 1,
        delay: -1,
        onComplete: () => {
          if (fn) {
            fn();
          }
        },
      });
  }
}

export function Transition() {
  return (
    <>
      <div className="blue-bg fixed w-full h-full top-0 left-0 bg-[#595BEF] z-[200] scale-y-0 pointer-events-none"></div>
      <div className="pink-bg fixed w-full h-full top-0 left-0 bg-[#E4458F] z-[200] scale-y-0 pointer-events-none"></div>
    </>
  );
}
