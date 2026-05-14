import React from 'react';

export function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Steering Wheel (Behind Shield) */}
      <circle cx="100" cy="65" r="35" stroke="#1E293B" strokeWidth="6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={100 + Math.cos((angle * Math.PI) / 180) * 35}
          y1={65 + Math.sin((angle * Math.PI) / 180) * 35}
          x2={100 + Math.cos((angle * Math.PI) / 180) * 50}
          y2={65 + Math.sin((angle * Math.PI) / 180) * 50}
          stroke="#1E293B"
          strokeWidth="6"
          strokeLinecap="round"
        />
      ))}

      {/* Shield Base */}
      <path
        d="M100 170C100 170 160 145 160 85V45H40V85C40 145 100 170 100 170Z"
        fill="white"
        stroke="#1E3A8A"
        strokeWidth="4"
      />

      {/* Union Jack Style Background inside Shield */}
      <mask id="shield-mask">
        <path d="M100 170C100 170 160 145 160 85V45H40V85C40 145 100 170 100 170Z" fill="white" />
      </mask>
      
      <g mask="url(#shield-mask)">
        <rect x="40" y="45" width="120" height="125" fill="#1E40AF" />
        
        {/* White Saltire */}
        <line x1="40" y1="45" x2="160" y2="170" stroke="white" strokeWidth="12" />
        <line x1="160" y1="45" x2="40" y2="170" stroke="white" strokeWidth="12" />
        
        {/* Red Saltire */}
        <line x1="40" y1="45" x2="160" y2="170" stroke="#DC2626" strokeWidth="4" />
        <line x1="160" y1="45" x2="40" y2="170" stroke="#DC2626" strokeWidth="4" />
        
        {/* White Cross */}
        <line x1="100" y1="45" x2="100" y2="170" stroke="white" strokeWidth="20" />
        <line x1="40" y1="100" x2="160" y2="100" stroke="white" strokeWidth="20" />
        
        {/* Red Cross */}
        <line x1="100" y1="45" x2="100" y2="170" stroke="#DC2626" strokeWidth="12" />
        <line x1="40" y1="100" x2="160" y2="100" stroke="#DC2626" strokeWidth="12" />
      </g>

      {/* Letters E C T */}
      <text x="100" y="65" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="serif">E</text>
      <text x="100" y="85" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="serif">C</text>
      <text x="100" y="105" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="serif">T</text>

      {/* Banner */}
      <path
        d="M45 115H155V130H45V115Z"
        fill="#DC2626"
      />
      <text 
        x="100" 
        y="125" 
        textAnchor="middle" 
        fill="white" 
        fontSize="6" 
        fontWeight="bold" 
        fontFamily="sans-serif"
      >
        VISION WITHOUT EXECUTION IS NOT US
      </text>

      {/* Anchor (At bottom) */}
      <path
        d="M100 135V165M85 155C85 155 90 165 100 165C110 165 115 155 115 155"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line x1="90" x2="110" y1="140" y2="140" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
