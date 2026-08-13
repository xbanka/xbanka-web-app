/**
 * Wraps a canvas in a single-page PDF.
 *
 * The receipt's "Share as PDF" needs a real file to hand to the share sheet.
 * `window.print()` cannot provide one — the browser keeps the output — and a
 * PDF library is a large dependency for one screen, so this writes the minimal
 * PDF structure directly: a page whose only content is the canvas, embedded as
 * a JPEG via the DCTDecode filter (PDF understands JPEG natively, so no
 * re-encoding is required).
 */

const encoder = new TextEncoder();

const toBytes = (value: string) => encoder.encode(value);

const concat = (chunks: Uint8Array[]): Uint8Array => {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
};

/** Pads an xref offset to the 10 digits the format requires. */
const xrefEntry = (offset: number) =>
  `${offset.toString().padStart(10, "0")} 00000 n \n`;

export async function canvasToPdfBlob(
  canvas: HTMLCanvasElement,
  quality = 0.92,
): Promise<Blob> {
  const jpegBlob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!jpegBlob) throw new Error("Could not encode the receipt image");

  const jpeg = new Uint8Array(await jpegBlob.arrayBuffer());

  // Lay the image out at 72dpi, capped to A4 width so it prints sensibly.
  const maxWidthPt = 595.28;
  const scale = Math.min(1, maxWidthPt / canvas.width);
  const pageW = Math.round(canvas.width * scale);
  const pageH = Math.round(canvas.height * scale);

  const offsets: number[] = [];
  const chunks: Uint8Array[] = [];
  let position = 0;

  const push = (bytes: Uint8Array) => {
    chunks.push(bytes);
    position += bytes.length;
  };

  const addObject = (body: Uint8Array) => {
    offsets.push(position);
    push(body);
  };

  push(toBytes("%PDF-1.4\n"));

  addObject(toBytes("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"));
  addObject(
    toBytes("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"),
  );
  addObject(
    toBytes(
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] ` +
        `/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
    ),
  );

  // The image object: header, raw JPEG bytes, then the stream terminator.
  addObject(
    concat([
      toBytes(
        `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} ` +
          `/Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 ` +
          `/Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
      ),
      jpeg,
      toBytes("\nendstream\nendobj\n"),
    ]),
  );

  const content = `q ${pageW} 0 0 ${pageH} 0 0 cm /Im0 Do Q\n`;
  addObject(
    toBytes(
      `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`,
    ),
  );

  const xrefStart = position;
  const xref =
    `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n` +
    offsets.map(xrefEntry).join("");
  push(toBytes(xref));
  push(
    toBytes(
      `trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\n` +
        `startxref\n${xrefStart}\n%%EOF\n`,
    ),
  );

  return new Blob([concat(chunks) as unknown as BlobPart], {
    type: "application/pdf",
  });
}
