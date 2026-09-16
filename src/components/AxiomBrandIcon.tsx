import React from "react";

export const AxiomBrandIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-6 h-6",
  size = 24
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="axiomBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="axiomInnerGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id="axiomGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Outer subtle geometric guide circle */}
      <circle
        cx="16"
        cy="16"
        r="14.5"
        stroke="url(#axiomBrandGrad)"
        strokeWidth="0.8"
        strokeDasharray="2 3"
        opacity="0.35"
      />

      {/* 4-Cusp Astroid / Harmonograph Rosette */}
      <path
        d="M16 2.5C18.5 9 23 13.5 29.5 16C23 18.5 18.5 23 16 29.5C13.5 23 9 18.5 2.5 16C9 13.5 13.5 9 16 2.5Z"
        stroke="url(#axiomBrandGrad)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.85"
      />

      {/* Continuous Phase Space Attractor Orbit Loop */}
      <path
        d="M9.5 11.5C12 9 15 10.5 16 16C17 21.5 20 23 22.5 20.5C25 18 23.5 15 16 16C8.5 17 7 14 9.5 11.5Z"
        stroke="url(#axiomInnerGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#axiomGlow)"
      />

      {/* Diagonal Harmonic Cross Filaments */}
      <circle
        cx="16"
        cy="16"
        r="7.5"
        stroke="url(#axiomBrandGrad)"
        strokeWidth="0.75"
        strokeDasharray="1.5 2.5"
        opacity="0.5"
      />

      {/* Central Singularity Node */}
      <circle cx="16" cy="16" r="2.2" fill="#38bdf8" />
      <circle cx="16" cy="16" r="4.2" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
};
