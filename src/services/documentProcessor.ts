import * as mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { DocumentFile } from "../types/document";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export class DocumentProcessor {
  static async processFile(file: File): Promise<DocumentFile> {
    const fileType = file.type;
    const fileName = file.name;
    const fileId = crypto.randomUUID();

    let content = "";
    let docType: "pdf" | "docx";

    if (fileType === "application/pdf") {
      content = await this.extractPdfText(file);
      docType = "pdf";
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      content = await this.extractWordText(file);
      docType = "docx";
    } else {
      throw new Error(
        "Unsupported file type. Please upload PDF or Word documents only."
      );
    }

    return {
      id: fileId,
      name: fileName,
      type: docType,
      content: content.trim(),
      file,
    };
  }

  private static async extractPdfText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  }

  private static async extractWordText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
}
