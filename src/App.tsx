import React, { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { ComparisonResultComponent } from "./components/ComparisonResult";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { DocumentProcessor } from "./services/documentProcessor";
import { AIComparisonService } from "./services/aiComparison";
import { ComparisonResult } from "./types/document";
import { FileText, Zap, Shield, Download } from "lucide-react";

type AppState = "upload" | "processing" | "results" | "error";

function App() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string>("");
  const [processingStage, setProcessingStage] = useState<
    "processing" | "comparing" | "generating"
  >("processing");

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartComparison = async () => {
    if (uploadedFiles.length !== 2) {
      setError("Please upload exactly 2 documents to compare.");
      return;
    }

    setAppState("processing");
    setError("");

    try {
      // Stage 1: Process documents
      setProcessingStage("processing");
      const [originalDoc, modifiedDoc] = await Promise.all([
        DocumentProcessor.processFile(uploadedFiles[0]),
        DocumentProcessor.processFile(uploadedFiles[1]),
      ]);

      // Stage 2: Compare documents with AI
      setProcessingStage("comparing");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate AI processing time

      // Stage 3: Generate results
      setProcessingStage("generating");
      const result = await AIComparisonService.compareDocuments(
        originalDoc,
        modifiedDoc
      );

      setComparisonResult(result);
      setAppState("results");
    } catch (error) {
      console.error("Comparison error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during comparison."
      );
      setAppState("error");
    }
  };

  const handleStartOver = () => {
    setAppState("upload");
    setUploadedFiles([]);
    setComparisonResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  DocuCompare AI
                </h1>
                <p className="text-sm text-gray-600">
                  Intelligent Document Comparison Tool
                </p>
              </div>
            </div>
            {appState === "results" && (
              <button
                onClick={handleStartOver}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                New Comparison
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {appState === "upload" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Compare Documents with AI Precision
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Upload two documents and let our AI identify every difference,
                highlight changes, and generate a comprehensive comparison
                report with downloadable results.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span>AI-Powered Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Secure Processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-purple-600" />
                  <span>PDF Export</span>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FileUpload
                  label="Original Document"
                  onFilesSelected={handleFilesSelected}
                  acceptedFiles={uploadedFiles.slice(0, 1)}
                  maxFiles={1}
                />

                <FileUpload
                  label="Modified Document"
                  onFilesSelected={handleFilesSelected}
                  acceptedFiles={uploadedFiles.slice(1, 2)}
                  maxFiles={1}
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        {uploadedFiles.length} of 2 documents uploaded
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(uploadedFiles.length / 2) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleStartComparison}
                      disabled={uploadedFiles.length !== 2}
                      className={`
                        px-6 py-3 rounded-lg font-medium transition-all duration-200
                        ${
                          uploadedFiles.length === 2
                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }
                      `}
                    >
                      Start AI Comparison
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>
        )}

        {appState === "processing" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <LoadingSpinner stage={processingStage} />
          </div>
        )}

        {appState === "results" && comparisonResult && (
          <ComparisonResultComponent result={comparisonResult} />
        )}

        {appState === "error" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-red-600 mb-4">
              <FileText className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comparison Failed</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleStartOver}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 DocuCompare AI. Powered by advanced AI technology for
              precise document analysis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
