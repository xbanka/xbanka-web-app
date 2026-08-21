"use client";

import { Button } from "./button";
import { CloseBtn } from "./close-btn";
import { Modal } from "./Modal";
import { FileText, ImageIcon } from "lucide-react";
import { useState } from "react";
import { canvasToPdfBlob } from "@/lib/canvasToPdf";
import { toast } from "sonner";

export interface ReceiptRow {
  label: string;
  value: string;
  accent?: boolean;
}

const BRAND = "#0c9a8e";
const INK = "#1b1d20";
const MUTED = "#6b7280";
const HAIRLINE = "#e5e7eb";

/**
 * Shrinks `text` from the middle until it fits `maxWidth` at the context's
 * current font. Canvas text does not wrap or clip on its own, so without this a
 * long value (an account id, a reference) runs straight over its own label.
 */
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let head = Math.ceil(text.length / 2);
  let tail = text.length - head;

  while (head + tail > 2) {
    if (head > tail) head -= 1;
    else tail -= 1;

    const candidate = `${text.slice(0, head)}\u2026${text.slice(text.length - tail)}`;
    if (ctx.measureText(candidate).width <= maxWidth) return candidate;
  }

  return "\u2026";
}

/**
 * Renders the receipt onto a canvas so it can be saved as a PNG.
 *
 * Drawn by hand rather than rasterising the DOM: Tailwind v4 emits `oklch()`
 * colours, which html2canvas cannot parse, and this keeps the feature free of
 * any new dependency.
 */
async function drawReceipt(
  rows: ReceiptRow[],
  heading: string,
  headlineAmount: string,
): Promise<HTMLCanvasElement> {
  const scale = 2; // render at 2x so the PNG stays crisp
  const width = 800;
  const padding = 56;
  const rowHeight = 64;
  const headerHeight = 250;
  const footerHeight = 130;
  const height = headerHeight + rows.length * rowHeight + footerHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable in this browser");
  ctx.scale(scale, scale);

  // Card
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Brand bar
  ctx.fillStyle = BRAND;
  ctx.fillRect(0, 0, width, 8);

  // Logo — falls back to a wordmark if the asset can't be loaded.
  let logoDrawn = false;
  try {
    const logo = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "/xbanka_logo.png";
    });
    const logoHeight = 34;
    const logoWidth = (logo.width / logo.height) * logoHeight;
    ctx.drawImage(logo, padding, 46, logoWidth, logoHeight);
    logoDrawn = true;
  } catch {
    logoDrawn = false;
  }

  if (!logoDrawn) {
    ctx.fillStyle = INK;
    ctx.font = "700 28px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Xbanka", padding, 74);
  }

  // Status pill, right-aligned against the logo
  const pillText = "Successful";
  ctx.font = "600 14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  const pillWidth = ctx.measureText(pillText).width + 32;
  const pillX = width - padding - pillWidth;
  ctx.fillStyle = "#e6f6f4";
  ctx.beginPath();
  // roundRect is unsupported on older Safari — fall back to a square pill
  // rather than letting the whole export throw.
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(pillX, 46, pillWidth, 34, 17);
  } else {
    ctx.rect(pillX, 46, pillWidth, 34);
  }
  ctx.fill();
  ctx.fillStyle = BRAND;
  ctx.textAlign = "center";
  ctx.fillText(pillText, pillX + pillWidth / 2, 68);

  // Heading + headline amount
  ctx.textAlign = "left";
  ctx.fillStyle = MUTED;
  ctx.font = "500 15px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(heading, padding, 140);

  ctx.fillStyle = INK;
  ctx.font = "700 38px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(headlineAmount, padding, 188);

  // Divider under the header
  ctx.strokeStyle = HAIRLINE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, headerHeight - 34);
  ctx.lineTo(width - padding, headerHeight - 34);
  ctx.stroke();

  // Detail rows
  rows.forEach((row, index) => {
    const y = headerHeight + index * rowHeight;

    ctx.fillStyle = MUTED;
    ctx.font = "500 15px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(row.label, padding, y);
    const labelWidth = ctx.measureText(row.label).width;

    ctx.fillStyle = row.accent ? BRAND : INK;
    ctx.font = "600 16px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "right";
    // Whatever is left of the row once the label and a 24px gutter are taken.
    const valueWidth = width - padding * 2 - labelWidth - 24;
    ctx.fillText(fitText(ctx, row.value, valueWidth), width - padding, y);

    if (index < rows.length - 1) {
      ctx.strokeStyle = HAIRLINE;
      ctx.beginPath();
      ctx.moveTo(padding, y + 22);
      ctx.lineTo(width - padding, y + 22);
      ctx.stroke();
    }
  });

  // Footer
  const footerY = headerHeight + rows.length * rowHeight + 30;
  ctx.fillStyle = "#f9fafb";
  ctx.fillRect(0, footerY - 26, width, height - footerY + 26);

  ctx.fillStyle = MUTED;
  ctx.font = "400 13px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "This is a computer-generated receipt and does not require a signature.",
    width / 2,
    footerY + 14,
  );
  ctx.fillText("Thank you for using Xbanka.", width / 2, footerY + 40);

  return canvas;
}

export function TransactionReceiptModal({
  heading,
  headlineAmount,
  rows,
  reference,
  onClose,
}: {
  /** Label above the large amount, e.g. "Amount sent". */
  heading: string;
  /** The figure shown large at the top of the receipt. */
  headlineAmount: string;
  rows: ReceiptRow[];
  /** Used for the download filename; usually the transaction reference. */
  reference?: string;
  onClose: () => void;
}) {
  const [sharingPdf, setSharingPdf] = useState(false);
  const [sharingImage, setSharingImage] = useState(false);

  const baseName = `xbanka-receipt-${reference || "transaction"}`;

  const buildPng = async (): Promise<Blob> => {
    const canvas = await drawReceipt(rows, heading, headlineAmount);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) throw new Error("Could not generate the image");
    return blob;
  };

  /**
   * Hands a generated file to the OS share sheet, falling back to a download
   * where file sharing is unavailable (common on desktop browsers).
   */
  const shareFile = async (blob: Blob, name: string, type: string) => {
    const file = new File([blob], name, { type });

    // Feature-detect the file payload specifically: several browsers expose
    // navigator.share but reject files.
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Xbanka transaction receipt",
        text: `Xbanka receipt \u2014 ${headlineAmount}`,
      });
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
    toast.info("Sharing isn't supported here \u2014 the receipt was downloaded.");
  };

  const handleSharePdf = async () => {
    setSharingPdf(true);
    try {
      const canvas = await drawReceipt(rows, heading, headlineAmount);
      const blob = await canvasToPdfBlob(canvas);
      await shareFile(blob, `${baseName}.pdf`, "application/pdf");
    } catch (err) {
      // Dismissing the share sheet rejects with AbortError, which is a normal
      // cancel rather than a failure.
      if ((err as Error)?.name === "AbortError") return;
      toast.error("Could not share the receipt as PDF");
    } finally {
      setSharingPdf(false);
    }
  };

  const handleShareImage = async () => {
    setSharingImage(true);
    try {
      const blob = await buildPng();
      await shareFile(blob, `${baseName}.png`, "image/png");
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      toast.error("Could not share the receipt as image");
    } finally {
      setSharingImage(false);
    }
  };

  return (
    <Modal
      className="pb-8 px-8 pt-6 max-sm:pb-6 max-sm:px-5 max-sm:pt-4"
      onClose={onClose}
    >
      <div className="no-print flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-text">Receipt</h3>
        <CloseBtn onClose={onClose} />
      </div>

      {/* The receipt keeps a light palette in both themes — it is a document,
          and it is what gets printed and exported. */}
      <div
        id="transaction-receipt"
        className="receipt-printable overflow-hidden rounded-2xl bg-white text-[#1b1d20] ring-1 ring-black/5"
      >
        <div className="h-2 w-full bg-Green" />

        <div className="space-y-6 p-6 max-sm:p-5">
          <div className="flex items-start justify-between gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/xbanka_logo.png"
              alt="Xbanka"
              className="h-8 w-auto object-contain"
            />
            <span className="rounded-full bg-[#e6f6f4] px-3 py-1 text-xs font-semibold text-[#0c9a8e]">
              Successful
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-[#6b7280]">{heading}</p>
            <p className="mt-1 text-3xl font-bold text-[#1b1d20] max-sm:text-2xl">
              {headlineAmount}
            </p>
          </div>

          <div className="divide-y divide-[#e5e7eb] border-t border-[#e5e7eb]">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4 py-3"
              >
                <span className="shrink-0 text-sm font-medium text-[#6b7280]">
                  {row.label}
                </span>
                <span
                  className={`break-all text-right text-sm font-semibold ${
                    row.accent ? "text-[#0c9a8e]" : "text-[#1b1d20]"
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-[#f9fafb] p-3 text-center">
            <p className="text-xs text-[#6b7280]">
              This is a computer-generated receipt and does not require a
              signature.
            </p>
            <p className="mt-1 text-xs text-[#6b7280]">
              Thank you for using Xbanka.
            </p>
          </div>
        </div>
      </div>

      <div className="no-print mt-6 flex gap-3 max-sm:flex-col">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleSharePdf}
          disabled={sharingPdf}
        >
          <FileText className="h-4 w-4" />
          {sharingPdf ? "Preparing..." : "Share as PDF"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1 text-card-text"
          onClick={handleShareImage}
          disabled={sharingImage}
        >
          <ImageIcon className="h-4 w-4" />
          {sharingImage ? "Preparing..." : "Share as image"}
        </Button>
      </div>
    </Modal>
  );
}
