import React from "react";
import { Loader2, FileSearch } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  stage?: "processing" | "comparing" | "generating";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Processing documents...",
  stage = "processing",
}) => {
  const getStageIcon = () => {
    switch (stage) {
      case "comparing":
        return <FileSearch className="w-8 h-8 text-blue-600 animate-pulse" />;
      default:
        return <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />;
    }
  };

  const getStageMessage = () => {
    switch (stage) {
      case "processing":
        return "Extracting text from documents...";
      case "comparing":
        return "AI is analyzing differences...";
      case "generating":
        return "Generating comparison results...";
      default:
        return message;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="flex items-center justify-center">{getStageIcon()}</div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900">{getStageMessage()}</p>
        <p className="text-sm text-gray-600 mt-2">
          This may take a few moments...
        </p>
      </div>
      <div className="w-64 bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full animate-pulse w-1/2"></div>
      </div>
    </div>
  );
};
