import { diffWordsWithSpace, Change } from "diff";
import { DocumentDifference } from "../types/document";

export class JSDiffComparisonService {
  // Método público para ser chamado de fora
  static async compareText(
    original: string,
    modified: string
  ): Promise<DocumentDifference[]> {
    return this.computeDifferences(original, modified);
  }

  // Método privado estático para gerar diferenças
  private static computeDifferences(
    original: string,
    modified: string
  ): DocumentDifference[] {
    const changes: DocumentDifference[] = [];
    let index = 0; // posição no texto do documento modificado

    const diffs: Change[] = diffWordsWithSpace(original, modified);

    for (const diff of diffs) {
      const startIndex = index;
      const endIndex = startIndex + diff.value.length;

      if (diff.added) {
        changes.push({
          type: "added",
          text: diff.value,
          startIndex,
          endIndex,
          context: diff.value.slice(0, 50), // ou gerar contexto melhor
        });
      } else if (diff.removed) {
        changes.push({
          type: "deleted",
          text: diff.value,
          startIndex,
          endIndex,
          context: diff.value.slice(0, 50),
        });
      }
      // texto igual não adiciona diferença

      index += diff.value.length;
    }

    return changes;
  }
}
