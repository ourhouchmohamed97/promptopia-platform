"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ShinyText = ({ children, className = "" }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const text = textRef.current;
      if (!text) return;

      gsap.fromTo(
        text,
        { backgroundPosition: "200% center" },
        {
          backgroundPosition: "-200% center",
          duration: 2,
          repeat: -1,
          ease: "linear",
        }
      );
    }, textRef);

    return () => ctx.revert();
  }, []);

  return (
    <span
      ref={textRef}
      className={`bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-[length:200%_auto] bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
};

export default ShinyText;
