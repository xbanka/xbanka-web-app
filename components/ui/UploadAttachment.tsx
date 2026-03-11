"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utis";

export interface AttachmentFile {
  file: File;
  previewUrl?: string;
}

interface AttachmentUploadProps {
  value?: AttachmentFile[];
  onChange: (files: AttachmentFile[]) => void;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

export function AttachmentUpload({
  value = [],
  onChange,
  maxSizeMB = 5,
  accept = "image/*,application/pdf",
  className,
}: AttachmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: AttachmentFile[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) return;

      const isImage = file.type.startsWith("image/");
      newFiles.push({
        file,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      });
    });

    onChange(newFiles.slice(0, 1));
  };

  const removeFile = (index: number) => {
    const updated = [...value];
    const removed = updated.splice(index, 1)[0];
    if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
    onChange(updated);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload box */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-[#E5E7EB] rounded-lg py-4 px-[48px] text-center cursor-pointer hover:bg-gray-50 transition"
      >
        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
        <p className="text-[12px] font-[400] leading-[16px] text-gray-600">
          Upload screenshot, receipt, or proof document
        </p>
        <p className="text-xs text-gray-400 mt-1">
          JPG, PNG, OR PDF • Max {maxSizeMB}MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Preview list */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-md py-2 px-4 border-border bg-[#F9FAFB]"
            >
              <div className="flex items-center gap-3">
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt="preview"
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <FileText className="h-8 w-8 text-gray-400" />
                )}

                <div className="text-sm">
                  <p className="font-medium text-[14px] leading-[20px]">{item.file.name}</p>
                  <p className="text-xs text-[#585859] font-[500] leading-[16px]">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-[#991B1B] hover:text-[#991B1B] cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
