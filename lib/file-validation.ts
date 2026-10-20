// Client-side checks for uploaded files, shared by the upload component.

/** Does this file match an `accept` string such as "image/jpeg,image/png,application/pdf"? */
export function matchesAccept(file: File, accept: string): boolean {
  const rules = accept
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean);
  if (rules.length === 0) return true;
  const type = (file.type || "").toLowerCase();
  const name = file.name.toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

export const prettyTypes = (accept: string) => {
  const names = new Set<string>();
  for (const r of accept.split(",").map((x) => x.trim().toLowerCase())) {
    if (r === "image/jpeg" || r === ".jpg" || r === ".jpeg") names.add("JPG");
    else if (r === "image/png" || r === ".png") names.add("PNG");
    else if (r === "application/pdf" || r === ".pdf") names.add("PDF");
    else if (r === "image/*") {
      names.add("JPG");
      names.add("PNG");
    }
  }
  const list = [...names];
  if (list.length === 0) return "a supported file";
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} or ${list[list.length - 1]}`;
};

/** The largest file the app accepts anywhere. The server enforces the same 5 MB. */
export const MAX_UPLOAD_MB = 5;

const formatMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

/**
 * Why a file can't be uploaded, as a message for the user, or null if it is fine.
 * One rule for every upload in the app: at most MAX_UPLOAD_MB, and the right type.
 */
export function fileProblem(
  file: File,
  opts: { maxMB?: number; accept?: string } = {},
): string | null {
  const maxMB = opts.maxMB ?? MAX_UPLOAD_MB;
  if (file.size > maxMB * 1024 * 1024) {
    return `"${file.name}" is too large (${formatMB(file.size)} MB). The maximum size is ${maxMB} MB.`;
  }
  if (opts.accept && !matchesAccept(file, opts.accept)) {
    return `"${file.name}" is not a supported file. Please upload ${prettyTypes(opts.accept)}.`;
  }
  return null;
}
