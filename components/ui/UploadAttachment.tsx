"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_UPLOAD_MB, fileProblem, prettyTypes } from "@/lib/file-validation";

export interface AttachmentFile {
  file: File;
  previewUrl?: string;
}

interface AttachmentUploadProps {
  value?: AttachmentFile[];
  onChange: (files: AttachmentFile[]) => void;
  maxSizeMB?: number;
  accept?: string;
  /** Headline inside the upload box. */
  title?: string;
  className?: string;
}

export function AttachmentUpload({
  value = [],
  onChange,
  maxSizeMB = MAX_UPLOAD_MB,
  accept = "image/*,application/pdf",
  title = "Upload screenshot, receipt, or proof document",
  className,
}: AttachmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rejection, setRejection] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: AttachmentFile[] = [];
    let rejected: string | null = null;

    Array.from(files).forEach((file) => {
      // Tell the person why a file was refused. It used to be dropped silently.
      const problem = fileProblem(file, { maxMB: maxSizeMB, accept });
      if (problem) {
        rejected = problem;
        return;
      }

      const isImage = file.type.startsWith("image/");
      newFiles.push({
        file,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      });
    });

    // Shown inline under the upload box, next to the file it is about.
    setRejection(rejected);

    // Keep what was already chosen when the new file is refused.
    if (newFiles.length > 0) onChange(newFiles.slice(0, 1));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const updated = [...value];
    const removed = updated.splice(index, 1)[0];
    if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
    onChange(updated);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload box */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border border-input rounded-lg py-4 px-12 bg-input-background text-center cursor-pointer hover:bg-input-background/80 transition max-sm:px-4 max-sm:py-5"
      >
        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2 max-sm:mb-3" />
        <p className="text-[12px] font-normal leading-4 text-gray-600 max-sm:text-[16px] max-sm:font-medium max-sm:leading-6 max-sm:text-card-text">
          {title}
        </p>
        <p className="text-xs text-gray-400 mt-1 max-sm:text-[13px] max-sm:leading-5">
          {prettyTypes(accept).replace(" or ", ", OR ").toUpperCase()} • Max {maxSizeMB}MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {rejection && (
        <p role="alert" className="text-xs text-[#991B1B] font-medium">
          {rejection}
        </p>
      )}

      {/* Preview list */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-md py-2 px-4 border-input bg-input-background max-sm:rounded-lg max-sm:bg-disabled-background max-sm:py-3"
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
                  <p className="font-medium text-[14px] leading-5 text-card-text max-sm:text-[16px] max-sm:leading-6">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-[#585859] font-medium leading-4 max-sm:text-text">
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
