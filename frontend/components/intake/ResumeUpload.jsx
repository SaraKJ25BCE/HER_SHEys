"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cx } from "@/lib/utils";
import Button from "@/components/ui/Button";

const ACCEPTED = [".pdf", ".doc", ".docx"];

export default function ResumeUpload({ onSubmit, loading }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState(null);
  const inputRef = useRef(null);

  const validate = (f) => {
    if (!f) return "Please choose a file.";
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ACCEPTED.includes(ext)) return "Please upload a PDF or Word document.";
    if (f.size > 8 * 1024 * 1024) return "File is larger than 8MB — try a smaller file.";
    return null;
  };

  const handleFiles = useCallback((files) => {
    const f = files?.[0];
    const err = validate(f);
    if (err) {
      setFileError(err);
      setFile(null);
      return;
    }
    setFileError(null);
    setFile(f);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={cx(
          "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
          dragOver ? "border-primary bg-primary-light" : "border-border hover:border-primary/50"
        )}
      >
        <UploadCloud className="mx-auto text-muted" size={28} />
        <p className="mt-3 text-sm text-ink font-medium">
          Drag your résumé here, or click to browse
        </p>
        <p className="mt-1 text-xs text-muted">PDF or DOCX, up to 8MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {fileError && <p className="text-sm text-brick mt-3">{fileError}</p>}

      {file && !fileError && (
        <div className="mt-4 flex items-center justify-between border border-border rounded px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText size={18} className="text-primary shrink-0" />
            <span className="text-sm text-ink truncate">{file.name}</span>
            <span className="text-xs text-muted shrink-0">
              {(file.size / 1024).toFixed(0)} KB
            </span>
          </div>
          <button
            aria-label="Remove file"
            onClick={() => setFile(null)}
            className="text-muted hover:text-brick shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <Button
        className="mt-5"
        variant="primary"
        disabled={!file || loading}
        onClick={() => file && onSubmit(file)}
      >
        {loading ? "Analyzing your résumé…" : "Analyze my skills"}
      </Button>
    </div>
  );
}
