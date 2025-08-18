import React, { useRef } from "react";
import { Download, FileText, BarChart3, Plus, Edit, Trash } from "lucide-react";
import { ComparisonResult } from "../types/document";
import { PDFExportService } from "../services/pdfExport";

interface ComparisonResultProps {
  result: ComparisonResult;
}

export const ComparisonResultComponent: React.FC<ComparisonResultProps> = ({
  result,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (contentRef.current) {
      try {
        await PDFExportService.exportToPDF(result, contentRef.current);
      } catch (error) {
        alert("Failed to export PDF. Please try again.");
      }
    }
  };

  const scrollToDifference = (index: number) => {
    const highlights = document.querySelectorAll("[data-diff-type]");
    if (highlights[index]) {
      highlights[index].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {result.summary.totalChanges}
              </p>
              <p className="text-sm text-gray-600">Total Changes</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Plus className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {result.summary.additions}
              </p>
              <p className="text-sm text-gray-600">Additions</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Edit className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {result.summary.modifications}
              </p>
              <p className="text-sm text-gray-600">Modifications</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-full">
              <Trash className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {result.summary.deletions}
              </p>
              <p className="text-sm text-gray-600">Deletions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Comparison Results
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                <span>Added Content</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
                <span>Modified Content</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {result.modifiedDocument.name} (with highlights)
            </h3>
          </div>
        </div>

        <div
          ref={contentRef}
          className="p-6 max-h-96 overflow-y-auto prose max-w-none"
          style={{
            lineHeight: "1.8",
            fontSize: "16px",
          }}
        >
          {/* ⚡ Aqui o HTML gerado já deve incluir spans com classes Tailwind */}
          <div
            dangerouslySetInnerHTML={{ __html: result.highlightedContent }}
          />
        </div>
      </div>

      {/* Differences List */}
      {result.differences.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Change Details
            </h3>
          </div>

          <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {result.differences.map((diff, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => scrollToDifference(index)}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`
                      w-2 h-2 rounded-full mt-2 flex-shrink-0
                      ${diff.type === "added" ? "bg-red-500" : ""}
                      ${diff.type === "modified" ? "bg-yellow-500" : ""}
                      ${diff.type === "deleted" ? "bg-gray-500" : ""}
                    `}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`
                          text-xs font-medium px-2 py-1 rounded-full
                          ${
                            diff.type === "added"
                              ? "bg-red-100 text-red-800"
                              : ""
                          }
                          ${
                            diff.type === "modified"
                              ? "bg-yellow-100 text-yellow-800"
                              : ""
                          }
                          ${
                            diff.type === "deleted"
                              ? "bg-gray-100 text-gray-800"
                              : ""
                          }
                        `}
                      >
                        {diff.type.charAt(0).toUpperCase() + diff.type.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium mb-1">
                      "{diff.text}"
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Context: ...{diff.context}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
