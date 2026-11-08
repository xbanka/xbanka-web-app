/**
 * Xbanka's public contact details, shared by Help & Support and the Privacy
 * Policy so the two never drift apart. The WhatsApp line lives in
 * `supportWhatsApp.ts`.
 */
export const SUPPORT_EMAIL = "support@xbankang.com";
export const INFO_EMAIL = "info@xbankang.com";
export const WEBSITE_URL = "https://www.xbankang.com";
export const WEBSITE_LABEL = "www.xbankang.com";
export const OFFICE_ADDRESS = "25 Maya Street, Yaba, Lagos, Nigeria";

/** A mailto link with the subject and body filled in. */
export const mailtoLink = (
  email: string,
  { subject, body }: { subject?: string; body?: string } = {},
) => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  // URLSearchParams encodes spaces as "+", which mail apps show literally.
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${email}${query ? `?${query}` : ""}`;
};

/** Digits as wa.me wants them → "+234 903 971 6418" for people to read. */
export const formatPhoneNumber = (digits: string) => {
  const ng = /^234(\d{3})(\d{3})(\d{4})$/.exec(digits);
  return ng ? `+234 ${ng[1]} ${ng[2]} ${ng[3]}` : `+${digits}`;
};
