// Lightweight inline SVG icon set (no external deps, works offline)

const paths = {
  shirt: (
    <path d="M8 3l4 2 4-2 5 4-2.5 3L17 8.5V21H7V8.5L5.5 10 3 7l5-4z" />
  ),
  flag: <path d="M5 3v18M5 4h13l-2.5 4L18 12H5" />,
  layers: (
    <path d="M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5m-18 4l9 5 9-5" />
  ),
  booth: (
    <path d="M3 8l2-4h14l2 4M4 8v12h16V8M9 20v-6h6v6" />
  ),
  needle: (
    <path d="M20 4c-6 1-11 5-14 11l-2 5 5-2C15 15 19 10 20 4zM9 15l-1 1" />
  ),
  pen: (
    <path d="M12 19l7-7 3 3-7 7-3-3zm5.5-8.5L15 8m-9.5 9.5L3 21l3.5-1L18 8.5 15.5 6 4 17.5z" />
  ),
  bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
  star: (
    <path d="M12 2l3 6.5 7 .8-5.2 4.7 1.5 7L12 17.5 5.7 21l1.5-7L2 9.3l7-.8L12 2z" />
  ),
  pencil: <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z" />,
  shield: <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />,
  phone: (
    <path d="M4 5c0 8 7 15 15 15l2-4-4.5-2-2 2A12 12 0 018 9.5l2-2L8 3 4 5z" />
  ),
  chat: (
    <path d="M21 12a8 8 0 01-8 8H4l2-3.5A8 8 0 1121 12z" />
  ),
  mail: <path d="M3 6h18v12H3V6zm0 1l9 6 9-6" />,
  pin: (
    <path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
  ),
  clock: <path d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-14v5l3.5 2" />,
  check: <path d="M4 12.5L10 18 20 6" />,
  arrowRight: <path d="M4 12h16m-6-6l6 6-6 6" />,
  arrowLeft: <path d="M20 12H4m6-6l-6 6 6 6" />,
  upload: <path d="M12 16V4m0 0L7 9m5-5l5 5M4 20h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  eye: (
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zm10 3a3 3 0 100-6 3 3 0 000 6z" />
  ),
  truck: (
    <path d="M2 6h12v10H2V6zm12 3h4l3 3v4h-7V9zM7 19a2 2 0 100-4 2 2 0 000 4zm11 0a2 2 0 100-4 2 2 0 000 4z" />
  ),
  instagram: (
    <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM17.5 6.6v.01" />
  ),
  facebook: (
    <path d="M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0114 8z" />
  ),
  tiktok: (
    <path d="M14 4v10.5a3.5 3.5 0 11-3.5-3.5M14 4c.5 2.5 2.5 4.5 5 5" />
  ),
};

export default function Icon({ name, className = "h-6 w-6", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.star}
    </svg>
  );
}
