import {
  DocumentFile,
  DocumentDifference,
  ComparisonResult,
} from "../types/document";

import { JSDiffComparisonService } from "./jsdiffComparison";

export class AIComparisonService {
  private static readonly API_ENDPOINT =
    "https://api.openai.com/v1/chat/completions";

  static async compareDocuments(
    originalDoc: DocumentFile,
    modifiedDoc: DocumentFile,
    apiKey?: string
  ): Promise<ComparisonResult> {
    // Chama o serviço de comparação baseado em jsdiff
    const differences: DocumentDifference[] =
      await JSDiffComparisonService.compareText(
        originalDoc.content,
        modifiedDoc.content
      );

    const highlightedContent = this.generateHighlightedContent(
      modifiedDoc.content,
      differences
    );

    const summary = {
      totalChanges: differences.length,
      additions: differences.filter((d) => d.type === "added").length,
      modifications: differences.filter((d) => d.type === "modified").length,
      deletions: differences.filter((d) => d.type === "deleted").length,
    };

    return {
      originalDocument: originalDoc,
      modifiedDocument: modifiedDoc,
      differences,
      highlightedContent,
      summary,
    };
  }

  private static generateHighlightedContent(
    content: string,
    differences: DocumentDifference[]
  ): string {
    let highlightedContent = content;
    let offset = 0;

    // Ordena as diferenças para evitar sobrescrita
    const sortedDifferences = [...differences].sort(
      (a, b) => a.startIndex - b.startIndex
    );

    for (const diff of sortedDifferences) {
      const startIndex = diff.startIndex + offset;
      const endIndex = diff.endIndex + offset;
      const originalText = highlightedContent.slice(startIndex, endIndex);

      // Classes Tailwind em vez de highlight-added/modified
      let className = "";
      if (diff.type === "added") {
        className = "bg-red-200 border-b-2 border-red-600 px-1 rounded mx-0.5";
      } else if (diff.type === "modified") {
        className =
          "bg-yellow-200 border-b-2 border-yellow-600 px-1 rounded mx-0.5";
      } else if (diff.type === "deleted") {
        className =
          "line-through bg-gray-200 text-gray-700 px-1 rounded mx-0.5";
      }

      const highlightedText = `<span class="${className}" data-diff-type="${diff.type}">${originalText}</span>`;

      highlightedContent =
        highlightedContent.slice(0, startIndex) +
        highlightedText +
        highlightedContent.slice(endIndex);

      offset += highlightedText.length - originalText.length;
    }

    return highlightedContent;
  }
}
