import React from 'react';

interface VeerSetuLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  subtitleClassName?: string;
  variant?: 'icon' | 'mark';
}

const SIZES = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
};

export const VeerSetuLogo: React.FC<VeerSetuLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  textClassName = 'text-white font-bold tracking-tight',
  subtitleClassName = 'text-[#778DA9] text-[10px] tracking-wider uppercase font-medium',
  variant = 'icon',
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZES[size] || 40;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none drop-shadow-sm"
        aria-label="VeerSetu Official Logo"
      >
        <defs>
          {/* Subtle container shading */}
          <linearGradient id="vsContainerGrad" x1="64" y1="32" x2="448" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1C2822" />
            <stop offset="50%" stopColor="#141E19" />
            <stop offset="100%" stopColor="#0E1612" />
          </linearGradient>

          {/* Bridge Saffron-to-Gold Gradient */}
          <linearGradient id="vsBridgeGold" x1="230" y1="320" x2="310" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="35%" stopColor="#EA9327" />
            <stop offset="70%" stopColor="#F5B942" />
            <stop offset="100%" stopColor="#FBD778" />
          </linearGradient>

          {/* Upper Bridge Highlight Arc */}
          <linearGradient id="vsBridgeUpper" x1="240" y1="280" x2="310" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="60%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>
        </defs>

        {variant === 'icon' && (
          <>
            {/* Squircle Dark Container */}
            <rect
              x="20"
              y="20"
              width="472"
              height="472"
              rx="124"
              fill="url(#vsContainerGrad)"
            />
            {/* Inner Border Inset */}
            <rect
              x="22"
              y="22"
              width="468"
              height="468"
              rx="122"
              stroke="#2C3D34"
              strokeWidth="3.5"
              strokeOpacity="0.75"
              fill="none"
            />
          </>
        )}

        {/* Central VeerSetu "V" & "Setu" (Bridge) Symbol */}
        <g id="veersetu-symbol" transform="translate(0, 4)">
          {/* 1. Left Wing (Clean Warm Ivory White) */}
          <path
            d="M 188 176 L 226 176 L 253 282 L 244 304 L 232 328 L 225 316 L 188 176 Z"
            fill="#F3F0E6"
          />

          {/* 2. Right Wing - Upper Olive/Sage segment */}
          <path
            d="M 296 176 L 326 176 L 305 236 C 290 238 274 245 261 254 L 274 228 L 296 176 Z"
            fill="#758850"
          />

          {/* 3. Right Wing - Lower Deep Forest Green segment */}
          <path
            d="M 244 354 L 232 328 C 248 300 274 274 294 258 L 297 248 L 244 354 Z"
            fill="#2A422F"
          />

          {/* 4. The Saffron-Gold Arching Bridge (Setu) */}
          {/* Lower body of the bridge */}
          <path
            d="M 231 292 C 240 270 262 248 306 237 C 290 248 266 276 244 330 C 238 316 234 304 231 292 Z"
            fill="url(#vsBridgeGold)"
          />

          {/* Upper luminous arc of the bridge with tapered crest */}
          <path
            d="M 246 274 C 263 253 285 242 306 237 C 283 243 260 260 246 274 Z"
            fill="url(#vsBridgeUpper)"
          />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={textClassName}>VeerSetu</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#1B263B] text-[#778DA9] border border-[#415A77]/40">
              CAPF
            </span>
          </div>
          <span className={subtitleClassName}>Counsellor Portal</span>
        </div>
      )}
    </div>
  );
};
