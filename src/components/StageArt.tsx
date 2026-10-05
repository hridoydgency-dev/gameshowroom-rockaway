import type { ReactElement } from 'react';
/**
 * Original vector illustration of a game-show set (podiums, buzzers, marquee lights).
 * Inline SVG = zero network requests, crisp at any size, good LCP.
 * Replace/augment with real venue photography via <Photo> when the owner supplies it.
 */
export function StageArt({ className, title = 'Illustration of a game show stage with contestant podiums, buzzers and marquee lights' }: { className?: string; title?: string }) {
  const bulbs = Array.from({ length: 15 }, (_, i) => i);
  return (
    <svg viewBox="0 0 640 440" role="img" aria-labelledby="stageart-t" className={className}>
      <title id="stageart-t">{title}</title>
      <defs>
        <linearGradient id="sa-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2a9a" />
          <stop offset="1" stopColor="#15102f" />
        </linearGradient>
        <linearGradient id="sa-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6d6" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff6d6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sa-pod" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e5336b" />
          <stop offset="1" stopColor="#8f1239" />
        </linearGradient>
        <linearGradient id="sa-pod2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3fd8d4" />
          <stop offset="1" stopColor="#13807d" />
        </linearGradient>
        <linearGradient id="sa-pod3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc53d" />
          <stop offset="1" stopColor="#c48a00" />
        </linearGradient>
      </defs>
      <rect width="640" height="440" rx="28" fill="url(#sa-bg)" />
      {/* spotlights */}
      <path d="M90 0 L20 440 L220 440 Z" fill="url(#sa-beam)" />
      <path d="M550 0 L420 440 L620 440 Z" fill="url(#sa-beam)" />
      <path d="M320 0 L250 440 L390 440 Z" fill="url(#sa-beam)" opacity=".6" />
      {/* marquee arch */}
      <rect x="120" y="36" width="400" height="92" rx="18" fill="#15102f" stroke="#ffc53d" strokeWidth="5" />
      {bulbs.map((i) => (
        <circle key={`t${i}`} cx={138 + i * 26} cy="36" r="6" fill={i % 2 ? '#ffc53d' : '#fff6d6'} />
      ))}
      {bulbs.map((i) => (
        <circle key={`b${i}`} cx={138 + i * 26} cy="128" r="6" fill={i % 2 ? '#fff6d6' : '#ffc53d'} />
      ))}
      <text x="320" y="78" textAnchor="middle" fontFamily="Arial Black, Impact, sans-serif" fontSize="30" fill="#ffc53d">GAME SHOW</text>
      <text x="320" y="110" textAnchor="middle" fontFamily="Arial Black, Impact, sans-serif" fontSize="20" fill="#fff" letterSpacing="6">ROOM</text>
      {/* scoreboard */}
      <rect x="248" y="150" width="144" height="54" rx="10" fill="#0c0920" stroke="#3fd8d4" strokeWidth="3" />
      <text x="282" y="186" textAnchor="middle" fontFamily="Courier New, monospace" fontWeight="700" fontSize="26" fill="#e5336b">420</text>
      <text x="358" y="186" textAnchor="middle" fontFamily="Courier New, monospace" fontWeight="700" fontSize="26" fill="#3fd8d4">380</text>
      <line x1="320" y1="158" x2="320" y2="196" stroke="#2b2266" strokeWidth="2" />
      {/* stage floor */}
      <ellipse cx="320" cy="410" rx="300" ry="34" fill="#0c0920" opacity=".7" />
      <path d="M40 395 Q320 350 600 395 L600 440 L40 440 Z" fill="#231a57" />
      {/* podiums */}
      {[
        { x: 92, g: 'sa-pod', label: 'A' },
        { x: 262, g: 'sa-pod3', label: 'B' },
        { x: 432, g: 'sa-pod2', label: 'C' },
      ].map((p) => (
        <g key={p.label}>
          <path d={`M${p.x} 285 h116 l-10 110 h-96 z`} fill={`url(#${p.g})`} stroke="#15102f" strokeWidth="4" />
          <rect x={p.x - 6} y="270" width="128" height="22" rx="6" fill="#15102f" />
          <ellipse cx={p.x + 58} cy="266" rx="24" ry="9" fill="#8f1239" />
          <ellipse cx={p.x + 58} cy="260" rx="24" ry="10" fill="#ff4d7e" stroke="#15102f" strokeWidth="3" />
          <rect x={p.x + 30} y="315" width="56" height="34" rx="6" fill="#15102f" opacity=".55" />
          <text x={p.x + 58} y="341" textAnchor="middle" fontFamily="Arial Black, Impact, sans-serif" fontSize="24" fill="#fff">{p.label}</text>
        </g>
      ))}
      {/* sparkles */}
      {[
        [70, 170], [585, 190], [200, 230], [455, 228], [610, 300], [30, 300],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 9} L${x + 3} ${y - 3} L${x + 9} ${y} L${x + 3} ${y + 3} L${x} ${y + 9} L${x - 3} ${y + 3} L${x - 9} ${y} L${x - 3} ${y - 3} Z`} fill="#ffc53d" />
      ))}
    </svg>
  );
}

/** Simple icon set (inline, decorative). */
export const Icon = ({ name, className = 'h-6 w-6' }: { name: 'clock' | 'users' | 'cake' | 'pin' | 'ticket' | 'star' | 'phone' | 'buzzer' | 'brain' | 'trophy' | 'parking' | 'access' | 'mail'; className?: string }) => {
  const p: Record<string, ReactElement> = {
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14.6c2.6.2 4.4 1.9 5 5.4" /></>,
    cake: <><path d="M4 21h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z" /><path d="M4 16c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 4 0" /><path d="M12 12V8" /><path d="M12 5.5c-.8-.8-.8-1.8 0-3 .8 1.2.8 2.2 0 3z" /></>,
    pin: <><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
    ticket: <><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" /><path d="M14 6v12" strokeDasharray="2 2" /></>,
    star: <path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z" />,
    phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />,
    buzzer: <><ellipse cx="12" cy="10" rx="7" ry="3" /><path d="M5 10v3c0 1.7 3.1 3 7 3s7-1.3 7-3v-3" /><path d="M3 20h18" /><path d="M12 16v4" /></>,
    brain: <><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z" /><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" /></>,
    trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4" /><path d="M12 13v4M8 21h8M9 17h6v4H9z" /></>,
    parking: <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M10 17V8h3a2.5 2.5 0 0 1 0 5h-3" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5l8.5 6.5 8.5-6.5" /></>,
    access: <><circle cx="12" cy="4.5" r="1.8" /><path d="M6 8.5l6 1 6-1M12 9.5v5l-3 6M12 14.5l3 6" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {p[name]}
    </svg>
  );
};
