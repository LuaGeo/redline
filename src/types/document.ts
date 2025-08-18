export interface DocumentFile {
  id: string;
  name: string;
  type: "pdf" | "docx";
  content: string;
  file: File;
}

export interface DocumentDifference {
  type: "added" | "modified" | "deleted";
  text: string;
  startIndex: number;
  endIndex: number;
  context: string;
}

export interface ComparisonResult {
  originalDocument: DocumentFile;
  modifiedDocument: DocumentFile;
  differences: DocumentDifference[];
  highlightedContent: string;
  summary: {
    totalChanges: number;
    additions: number;
    modifications: number;
    deletions: number;
  };
}
