/**
 * Shared look for the sign-in and sign-up forms (the "Xbanka Sign-in &
 * Onboarding" design): left-aligned, labels above fields, 48px fields and
 * buttons. On wide screens the card drops its frame and sits beside the 3D
 * hero; on phones it fills the screen as before.
 */
export const AUTH_CARD =
  "space-y-7 text-left sm:max-w-[440px] max-sm:space-y-5 max-sm:px-5 max-sm:py-5 lg:border-0 lg:bg-transparent lg:px-0 lg:py-6";

/** Taller fields with room for the icon, and a visible label colour. */
export const AUTH_FIELD =
  "[&_label]:text-[13px] [&_label]:font-medium [&_input]:h-12 [&_input]:pl-10 [&_input]:text-[15px] [&_select]:h-12 [&_select]:pl-10 [&_select]:text-[15px] max-sm:[&_input]:h-13 max-sm:[&_select]:h-13";

export const AUTH_BUTTON = "h-12 w-full text-[15px] font-semibold max-sm:h-13";
