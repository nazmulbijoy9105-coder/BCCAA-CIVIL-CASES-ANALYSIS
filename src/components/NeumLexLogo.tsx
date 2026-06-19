import React from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "horizontal";
  size?: "sm" | "md" | "lg" | "xl";
}

export default function NeumLexLogo({ className = "", variant = "full", size = "md" }: LogoProps) {
  // Brand color palette (exactly matching the uploaded logo)
  const GOLD = "#C5A059";     // Triumphant gold
  const NAVY = "#0a2240";     // Premium corporate deep blue

  // Sizing configurations
  const sizes = {
    sm: { width: 44, height: 44, textClass: "text-lg", subtextClass: "text-[8px]" },
    md: { width: 88, height: 88, textClass: "text-2xl", subtextClass: "text-[11px]" },
    lg: { width: 140, height: 140, textClass: "text-4xl", subtextClass: "text-[14px]" },
    xl: { width: 220, height: 220, textClass: "text-5xl", subtextClass: "text-[18px]" },
  };

  const config = sizes[size] || sizes.md;

  // Exact reproduction of the high-fidelity Neum Lex emblem
  const renderSVGLogo = (w: number, h: number) => (
    <svg
      width={w}
      height={h}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_4px_10px_rgba(10,34,64,0.08)] select-none transition-all duration-300 hover:scale-[1.03]"
    >
      {/* 
        1. THE SHIELD (With Open/Slightly Indented Top Edge & Exact Double-Frame Boundaries)
      */}
      {/* Outer Shield Frame (Gold) */}
      <path
        d="M 45 65 
           L 45 110 
           C 45 155, 120 198, 120 198 
           C 120 198, 195 155, 195 110 
           L 195 65 
           L 145 65 
           L 145 74 
           L 95 74 
           L 95 65 
           Z"
        stroke={GOLD}
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="#FFFFFF"
      />

      {/* Inner Shield Frame (Navy) with precise margins */}
      <path
        d="M 53 73 
           L 53 110 
           C 53 148, 120 186, 120 186 
           C 120 186, 187 148, 187 110 
           L 187 73 
           L 142 73 
           L 138 82 
           L 102 82 
           L 98 73 
           Z"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 
        2. THE SCALES OF JUSTICE (Premium Gold Detailing)
      */}
      {/* Central pillar/mast */}
      <rect x="117.5" y="45" width="5" height="120" rx="1.5" fill={GOLD} />
      {/* Top ornamental orb/cap */}
      <circle cx="120" cy="40" r="5.5" fill={GOLD} />
      <circle cx="120" cy="31" r="3.5" fill={GOLD} />

      {/* Base of scales */}
      <path d="M 102 165 L 138 165 L 134 158 L 106 158 Z" fill={GOLD} />
      
      {/* Horizontal Balance Crossbar */}
      <path 
        d="M 70 60 C 90 55, 110 52, 120 52 C 130 52, 150 55, 170 60" 
        stroke={GOLD} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
      <circle cx="70" cy="60" r="3.5" fill={GOLD} />
      <circle cx="170" cy="60" r="3.5" fill={GOLD} />

      {/* Hanging Scale Pans (Left & Right) */}
      {/* Left scale suspension & dish */}
      <path d="M 70 60 L 58 108 L 82 108 Z" stroke={GOLD} strokeWidth="1.25" fill="none" strokeLinejoin="round" />
      <path d="M 52 108 C 52 108, 52 115, 70 115 C 88 115, 88 108, 88 108 Z" fill={GOLD} />

      {/* Right scale suspension & dish */}
      <path d="M 170 60 L 158 108 L 182 108 Z" stroke={GOLD} strokeWidth="1.25" fill="none" strokeLinejoin="round" />
      <path d="M 152 108 C 152 108, 152 115, 170 115 C 188 115, 188 108, 188 108 Z" fill={GOLD} />


      {/* 
        3. MONOGRAM "NL" (Perfect Intertwined Serif Layering)
      */}
      
      {/* The Gold "N" - Handcrafted Vector Path for Serif Elegance */}
      <path
        d="M 80 148 L 80 90 L 92 90 L 132 138 L 132 90 L 142 90 L 142 148 L 132 148 L 92 100 L 92 148 Z"
        fill={GOLD}
        opacity="0.95"
      />

      {/* The Royal Navy "L" - Handcrafted and Layered for Depth */}
      <path
        d="M 108 148 
           L 108 98 
           L 118 98 
           L 118 136 
           L 148 136 
           L 148 148 
           Z"
        fill={NAVY}
        opacity="0.95"
      />

      {/* Elegant overlapping flourishes for absolute monogram parity with the image */}
      <path
        d="M 141 136 C 141 136, 153 136, 162 144 C 166 148, 168 150, 165 149"
        stroke={GOLD}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} id="neum-lex-logo">
        {renderSVGLogo(config.width, config.height)}
      </div>
    );
  }

  if (variant === "horizontal") {
    const horizConfig = size === "sm" ? { width: 44, height: 44 } : { width: 60, height: 60 };
    return (
      <div className={`inline-flex items-center gap-4 ${className}`} id="neum-lex-logo">
        {renderSVGLogo(horizConfig.width, horizConfig.height)}
        <div className="flex flex-col text-left">
          <span 
            className="font-bold tracking-[0.16em] text-[#0a2240] font-serif uppercase leading-none"
            style={{ 
              fontSize: size === "sm" ? "14px" : "20px",
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            NEUM LEX
          </span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="h-[1.5px] w-4 bg-[#C5A059]"></div>
            <span 
              className="text-[#C5A059] font-bold tracking-[0.35em] font-sans uppercase leading-none"
              style={{ fontSize: size === "sm" ? "7px" : "9px" }}
            >
              COUNSEL
            </span>
            <div className="h-[1.5px] w-4 bg-[#C5A059]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Full traditional stacked logo (as requested, with precise serif typography and horizontal gold dividers)
  return (
    <div className={`flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-[#E5E1D8]/40 ${className}`} id="neum-lex-logo">
      {renderSVGLogo(config.width, config.height)}
      
      <div className="mt-4 space-y-1">
        {/* NEUM LEX Title with pristine serif styling */}
        <h2 
          className="font-bold tracking-[0.15em] text-[#0a2240] select-none"
          style={{ 
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: size === "sm" ? "18px" : size === "md" ? "26px" : size === "lg" ? "38px" : "48px",
            lineHeight: "1.1"
          }}
        >
          NEUM LEX
        </h2>
        
        {/* COUNSEL Subtitle with elegant gold rules on both sides */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#C5A059]"></div>
          <span 
            className="text-[#C5A059] font-bold tracking-[0.45em] uppercase select-none font-sans"
            style={{ 
              fontSize: size === "sm" ? "8px" : size === "md" ? "11px" : size === "lg" ? "14px" : "18px"
            }}
          >
            COUNSEL
          </span>
          <div className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#C5A059]"></div>
        </div>
      </div>
    </div>
  );
}
