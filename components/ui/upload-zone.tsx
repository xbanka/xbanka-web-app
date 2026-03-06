import { File, Trash, Upload } from "lucide-react";
import { useRef } from "react";
import { ErrorField } from "./field-error";

export const UploadZone = ({ files, onAdd, onRemove, label = "Upload ID", sub, error }) => {
  const ref = useRef();
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-semibold text-card-text">{label}</p>
        {sub && <p className="text-xs text-text mt-0.5">{sub}</p>}
      </div>
      <div
        onClick={() => ref.current.click()}
        className={`border-[1.5px] border-dashed rounded-xl p-6 flex flex-col items-center gap-1.5 cursor-pointer text-center transition-colors
          ${error ? "border-red-400 hover:border-red-400" : "border-border hover:border-border-active"}`}
      >
        <span className="text-Green mb-1"><Upload /></span>
        <p className="text-sm font-medium text-card-text">Upload screenshot, receipt, or proof document</p>
        <p className="text-xs text-text">JPG, PNG OR PDF • Max 5MB</p>
        <input ref={ref} type="file" hidden multiple onChange={(e) => onAdd(Array.from(e.target.files))} />
      </div>
      <ErrorField message={error?.message} />
      {files.map((f, i) => (
        <div key={i} className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-2.5">
          <span className="text-text"><File /></span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-text truncate">{f.name}</p>
            <p className="text-xs text-text">{(f.size / (1024 * 1024)).toFixed(1)}MB</p>
          </div>
          <button type="button" onClick={() => onRemove(i)} className="text-red-500 hover:text-red-600 transition-colors p-1 flex items-center">
            <Trash />
          </button>
        </div>
      ))}
    </div>
  );
};