// The ScrapThatPage brand mark: an indigo app tile showing structured rows
// being extracted off a page into a collected data list. Kept in sync with
// src/assets/logo.svg (the source used to generate the app icons and favicon).
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      role="img"
      aria-label="ScrapThatPage"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="stp-logo-bg"
          x1="0"
          y1="0"
          x2="512"
          y2="512"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill="url(#stp-logo-bg)" />
      <rect x="80" y="128" width="188" height="256" rx="26" fill="#FFFFFF" />
      <rect x="112" y="180" width="124" height="26" rx="13" fill="#6366F1" />
      <rect x="112" y="228" width="124" height="20" rx="10" fill="#C7D2FE" />
      <rect x="112" y="266" width="124" height="20" rx="10" fill="#C7D2FE" />
      <rect x="112" y="304" width="88" height="20" rx="10" fill="#C7D2FE" />
      <path
        d="M286 193 H396"
        stroke="#EEF2FF"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M368 165 L402 193 L368 221"
        stroke="#EEF2FF"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="300" y="268" width="132" height="26" rx="13" fill="#FFFFFF" />
      <rect x="300" y="312" width="100" height="26" rx="13" fill="#A5B4FC" />
    </svg>
  );
}
