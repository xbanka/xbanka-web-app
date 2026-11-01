/**
 * Lucide icons used by the product tour, as static SVG markup.
 *
 * driver.js builds its popover from plain DOM, so the tour cannot render a
 * React icon component into it; these strings are injected instead. The path
 * data comes from lucide-react v0.577.0 (ISC licence). To change the set,
 * edit NAMES in the generator and re-run it:
 *   node <scratchpad>/gen-icons.mjs
 */
export const TOUR_ICON_NAMES = [
  "wallet",
  "banknote",
  "plus",
  "shield-check",
  "zap",
  "bitcoin",
  "bell",
  "user-round",
  "layout-grid",
  "send",
  "coins",
  "history",
  "arrow-left-right",
  "arrow-up-down",
  "sliders-horizontal",
  "lock",
  "refresh-cw",
  "list-checks",
  "search",
  "star",
  "receipt",
  "landmark",
  "shield",
  "badge-check",
  "trending-up",
  "arrow-right",
  "check",
  "compass"
] as const;

/** The Figma sidebar icons (20px grid, 1.25 stroke), for stops about a section. */
const FIGMA_PATHS = {
  "nav-dashboard": "<path d=\"M8.75 5.625C8.75 3.89911 7.35089 2.5 5.625 2.5C3.89911 2.5 2.5 3.89911 2.5 5.625C2.5 7.35089 3.89911 8.75 5.625 8.75C7.35089 8.75 8.75 7.35089 8.75 5.625Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M17.5 14.375C17.5 12.6491 16.1009 11.25 14.375 11.25C12.6491 11.25 11.25 12.6491 11.25 14.375C11.25 16.1009 12.6491 17.5 14.375 17.5C16.1009 17.5 17.5 16.1009 17.5 14.375Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M8.75 14.375C8.75 12.6491 7.35089 11.25 5.625 11.25C3.89911 11.25 2.5 12.6491 2.5 14.375C2.5 16.1009 3.89911 17.5 5.625 17.5C7.35089 17.5 8.75 16.1009 8.75 14.375Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M14.375 2.5V8.75M17.5 5.625H11.25\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>",
  "nav-wallet": "<path d=\"M11.6667 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667C2.5 5.08714 3.24619 5.83333 4.16667 5.83333H15C15 5.05836 15 4.67087 14.9148 4.35295C14.6837 3.49022 14.0097 2.81635 13.1471 2.58518C12.8292 2.5 12.4417 2.5 11.6667 2.5Z\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M2.5 4.16699V12.5003C2.5 14.8573 2.5 16.0358 3.23223 16.7681C3.96447 17.5003 5.14297 17.5003 7.5 17.5003H12.5C14.857 17.5003 16.0355 17.5003 16.7677 16.7681C17.5 16.0358 17.5 14.8573 17.5 12.5003V10.8337C17.5 8.47666 17.5 7.29813 16.7677 6.56589C16.0355 5.83366 14.857 5.83366 12.5 5.83366H5.83333\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M17.5003 10H15.8337C15.4462 10 15.2524 10 15.0935 10.0426C14.6621 10.1582 14.3252 10.4951 14.2096 10.9265C14.167 11.0854 14.167 11.2792 14.167 11.6667C14.167 12.0542 14.167 12.2479 14.2096 12.4068C14.3252 12.8382 14.6621 13.1752 15.0935 13.2908C15.2524 13.3333 15.4462 13.3333 15.8337 13.3333H17.5003\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>",
  "nav-account": "<path d=\"M14.1663 7.08366C14.1663 4.78248 12.3008 2.91699 9.99967 2.91699C7.69849 2.91699 5.83301 4.78248 5.83301 7.08366C5.83301 9.38483 7.69849 11.2503 9.99967 11.2503C12.3008 11.2503 14.1663 9.38483 14.1663 7.08366Z\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M15.8337 17.0833C15.8337 13.8617 13.222 11.25 10.0003 11.25C6.77867 11.25 4.16699 13.8617 4.16699 17.0833\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>",
  "nav-bill-payments": "<path d=\"M11.2503 12.5H5.00033C3.42898 12.5 2.6433 12.5 2.15515 12.0118C1.66699 11.5237 1.66699 10.738 1.66699 9.16667V5.83333C1.66699 4.26198 1.66699 3.47631 2.15515 2.98816C2.6433 2.5 3.42898 2.5 5.00033 2.5H15.0003C16.5717 2.5 17.3573 2.5 17.8455 2.98816C18.3337 3.47631 18.3337 4.26198 18.3337 5.83333V10C18.3337 10.7766 18.3337 11.1648 18.2068 11.4712C18.0377 11.8795 17.7132 12.204 17.3048 12.3732C16.9985 12.5 16.6102 12.5 15.8337 12.5\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M11.6663 7.49967C11.6663 8.42009 10.9202 9.16634 9.99967 9.16634C9.07917 9.16634 8.33301 8.42009 8.33301 7.49967C8.33301 6.5792 9.07917 5.83301 9.99967 5.83301C10.9202 5.83301 11.6663 6.5792 11.6663 7.49967Z\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M10.8333 14.1667C10.8333 12.7859 11.9526 11.6667 13.3333 11.6667V10C13.3333 8.61925 14.4526 7.5 15.8333 7.5V12.0833C15.8333 14.0288 15.8333 15.0016 15.4398 15.738C15.129 16.3194 14.6527 16.7957 14.0713 17.1064C13.3349 17.5 12.3622 17.5 10.4167 17.5H10C8.44683 17.5 7.67029 17.5 7.05772 17.2462C6.24096 16.9079 5.59205 16.259 5.25373 15.4423C5 14.8297 5 14.0532 5 12.5\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>",
  "nav-crypto": "<path d=\"M14.1472 16.25C16.1681 14.9063 17.5 12.6087 17.5 10C17.5 5.85787 14.1422 2.5 10 2.5C9.42717 2.5 8.86933 2.56422 8.33333 2.68585M17.0833 16.25H14.1472V13.3333M5.83333 3.76296C3.82336 5.10839 2.5 7.39965 2.5 10C2.5 14.1422 5.85787 17.5 10 17.5C10.5728 17.5 11.1307 17.4357 11.6667 17.3142M2.91667 3.76296H5.83333V6.66667\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M8.69824 12.2226V7.7781M10.0003 7.7781V6.66699M10.0003 13.3337V12.2226M8.69824 10.0003H11.3024M11.3024 10.0003C11.7339 10.0003 12.0837 10.3734 12.0837 10.8337V11.3892C12.0837 11.8495 11.7339 12.2226 11.3024 12.2226H7.91699M11.3024 10.0003C11.7339 10.0003 12.0837 9.62724 12.0837 9.16699V8.61141C12.0837 8.1512 11.7339 7.7781 11.3024 7.7781H7.91699\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>",
  "nav-market-overview": "<path d=\"M2.91699 8.33301V12.4997C2.91699 14.8567 2.91699 16.0352 3.64923 16.7675C4.38146 17.4997 5.55997 17.4997 7.91699 17.4997H12.0837C14.4407 17.4997 15.6192 17.4997 16.3514 16.7675C17.0837 16.0352 17.0837 14.8567 17.0837 12.4997V8.33301\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M6.66699 15H13.3337\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M14.167 6.25122C14.167 7.40182 13.2342 8.33301 12.0837 8.33301C10.9331 8.33301 10.0003 7.40027 10.0003 6.24967C10.0003 7.40027 9.06757 8.33301 7.91699 8.33301C6.7664 8.33301 5.83366 7.40027 5.83366 6.24967C5.83366 7.40027 4.85577 8.33301 3.64949 8.33301C3.00018 8.33301 2.41705 8.06276 2.01698 7.63376C1.32916 6.89619 1.77165 5.81138 2.34571 4.99005L2.66866 4.54846C3.40352 3.54362 3.77096 3.0412 4.30441 2.77047C4.83788 2.49976 5.46032 2.49984 6.70521 2.50001L13.2962 2.50089C14.5407 2.50105 15.163 2.50113 15.6962 2.77185C16.2295 3.04256 16.5968 3.54482 17.3315 4.54934L17.6549 4.9916C18.229 5.81294 18.6715 6.89775 17.9837 7.63531C17.5836 8.06431 17.0004 8.33457 16.3512 8.33457C15.1448 8.33457 14.167 7.40182 14.167 6.25122Z\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>",
  "nav-transactions": "<path d=\"M15.8333 8.75033V8.33362C15.8333 5.19096 15.8332 3.61958 14.857 2.64328C13.8806 1.66699 12.3093 1.66699 9.16662 1.66699C6.02403 1.66699 4.45267 1.66704 3.47636 2.64332C2.50008 3.61962 2.50006 5.19093 2.50003 8.33356L2.5 12.0837C2.49998 14.8232 2.49997 16.193 3.25657 17.1149C3.3951 17.2837 3.54988 17.4385 3.71869 17.5771C4.64064 18.3337 6.01041 18.3337 8.74995 18.3337\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M5.83301 5.83301H12.4997M5.83301 9.16634H9.16634\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M15 15.4163L13.75 14.958V12.9163M10 14.583C10 16.6541 11.6789 18.333 13.75 18.333C15.8211 18.333 17.5 16.6541 17.5 14.583C17.5 12.5119 15.8211 10.833 13.75 10.833C11.6789 10.833 10 12.5119 10 14.583Z\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"
} as const;

export type FigmaIconName = keyof typeof FIGMA_PATHS;
export type TourIconName = (typeof TOUR_ICON_NAMES)[number] | FigmaIconName;

const PATHS: Record<(typeof TOUR_ICON_NAMES)[number], string> = {
  "wallet":
    "<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\"/><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\"/>",
  "banknote":
    "<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M6 12h.01M18 12h.01\"/>",
  "plus":
    "<path d=\"M5 12h14\"/><path d=\"M12 5v14\"/>",
  "shield-check":
    "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m9 12 2 2 4-4\"/>",
  "zap":
    "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\"/>",
  "bitcoin":
    "<path d=\"M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727\"/>",
  "bell":
    "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\"/><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\"/>",
  "user-round":
    "<circle cx=\"12\" cy=\"8\" r=\"5\"/><path d=\"M20 21a8 8 0 0 0-16 0\"/>",
  "layout-grid":
    "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"/>",
  "send":
    "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\"/><path d=\"m21.854 2.147-10.94 10.939\"/>",
  "coins":
    "<path d=\"M13.744 17.736a6 6 0 1 1-7.48-7.48\"/><path d=\"M15 6h1v4\"/><path d=\"m6.134 14.768.866-.5 2 3.464\"/><circle cx=\"16\" cy=\"8\" r=\"6\"/>",
  "history":
    "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/><path d=\"M12 7v5l4 2\"/>",
  "arrow-left-right":
    "<path d=\"M8 3 4 7l4 4\"/><path d=\"M4 7h16\"/><path d=\"m16 21 4-4-4-4\"/><path d=\"M20 17H4\"/>",
  "arrow-up-down":
    "<path d=\"m21 16-4 4-4-4\"/><path d=\"M17 20V4\"/><path d=\"m3 8 4-4 4 4\"/><path d=\"M7 4v16\"/>",
  "sliders-horizontal":
    "<path d=\"M10 5H3\"/><path d=\"M12 19H3\"/><path d=\"M14 3v4\"/><path d=\"M16 17v4\"/><path d=\"M21 12h-9\"/><path d=\"M21 19h-5\"/><path d=\"M21 5h-7\"/><path d=\"M8 10v4\"/><path d=\"M8 12H3\"/>",
  "lock":
    "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>",
  "refresh-cw":
    "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"/><path d=\"M21 3v5h-5\"/><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"/><path d=\"M8 16H3v5\"/>",
  "list-checks":
    "<path d=\"M13 5h8\"/><path d=\"M13 12h8\"/><path d=\"M13 19h8\"/><path d=\"m3 17 2 2 4-4\"/><path d=\"m3 7 2 2 4-4\"/>",
  "search":
    "<path d=\"m21 21-4.34-4.34\"/><circle cx=\"11\" cy=\"11\" r=\"8\"/>",
  "star":
    "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"/>",
  "receipt":
    "<path d=\"M12 17V7\"/><path d=\"M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8\"/><path d=\"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z\"/>",
  "landmark":
    "<path d=\"M10 18v-7\"/><path d=\"M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z\"/><path d=\"M14 18v-7\"/><path d=\"M18 18v-7\"/><path d=\"M3 22h18\"/><path d=\"M6 18v-7\"/>",
  "shield":
    "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/>",
  "badge-check":
    "<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\"/><path d=\"m9 12 2 2 4-4\"/>",
  "trending-up":
    "<path d=\"M16 7h6v6\"/><path d=\"m22 7-8.5 8.5-5-5L2 17\"/>",
  "arrow-right":
    "<path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/>",
  "check":
    "<path d=\"M20 6 9 17l-5-5\"/>",
  "compass":
    "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z\"/>",
};

/** A 24px Lucide icon that takes its colour from `currentColor`. */
export const tourIconSvg = (name: TourIconName) =>
  name in FIGMA_PATHS
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">${FIGMA_PATHS[name as FigmaIconName]}</svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name as (typeof TOUR_ICON_NAMES)[number]]}</svg>`;
