import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFiles: File[];
  maxFiles?: number;
  label: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  acceptedFiles,
  maxFiles = 2,
  label,
}) => {
  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      const validFiles = droppedFiles.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      if (validFiles.length !== droppedFiles.length) {
        alert("Please upload only PDF or Word documents.");
      }

      onFilesSelected(validFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
      maxFiles,
    });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive && !isDragReject ? "border-blue-500 bg-blue-50" : ""}
          ${isDragReject ? "border-red-500 bg-red-50" : ""}
          ${
            !isDragActive
              ? "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              : ""
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>

          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-blue-600">
                Drop the files here
              </p>
              <p className="text-sm text-gray-500">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drop documents here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF and Word documents (max {maxFiles} files)
              </p>
            </div>
          )}

          {isDragReject && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">
                Please upload valid PDF or Word documents
              </span>
            </div>
          )}
        </div>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {acceptedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <FileText className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  {file.name}
                </p>
                <p className="text-xs text-green-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
