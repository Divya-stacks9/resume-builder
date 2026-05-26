'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
}

export default function UploadZone({ onFileSelect, selectedFile, onClearFile }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    setError(null);
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isDocxExtension = extension === 'docx';
    const isPdfExtension = extension === 'pdf';

    if (!validTypes.includes(file.type) && !isDocxExtension && !isPdfExtension) {
      setError('Unsupported file type. Please upload a PDF or DOCX file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-primary bg-primary/5 scale-[0.99] shadow-inner'
              : 'border-border bg-card/50 hover:bg-card/80 hover:border-muted-foreground/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleChange}
          />
          <div className="p-4 bg-primary/10 rounded-2xl text-primary mb-4 transition-transform duration-300 hover:scale-110">
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Upload your resume</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            Drag and drop your resume here, or click to browse. Supports PDF or DOCX (max 5MB).
          </p>
          <span className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium border border-border bg-card rounded-lg text-foreground shadow-sm hover:bg-accent transition-colors">
            Select File
          </span>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg animate-fade-in-up">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between border border-border bg-card p-4 rounded-2xl shadow-sm hover:shadow transition-shadow animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-sm line-clamp-1 max-w-[200px] sm:max-w-xs">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(selectedFile.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Ready to analyze
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearFile();
              }}
              className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              title="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
