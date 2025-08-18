import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComparisonResult } from '../types/document';

export class PDFExportService {
  static async exportToPDF(comparisonResult: ComparisonResult, element: HTMLElement): Promise<void> {
    try {
      // Create a temporary container for the content
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif; line-height: 1.6;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Document Comparison Report</h1>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
            <h2 style="color: #374151; font-size: 18px; margin-bottom: 10px;">Summary</h2>
            <p><strong>Original Document:</strong> ${comparisonResult.originalDocument.name}</p>
            <p><strong>Modified Document:</strong> ${comparisonResult.modifiedDocument.name}</p>
            <p><strong>Total Changes:</strong> ${comparisonResult.summary.totalChanges}</p>
            <p><strong>Additions:</strong> <span style="color: #dc2626;">${comparisonResult.summary.additions}</span></p>
            <p><strong>Modifications:</strong> <span style="color: #d97706;">${comparisonResult.summary.modifications}</span></p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #374151; font-size: 18px; margin-bottom: 10px;">Legend</h2>
            <div style="display: flex; gap: 20px; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 20px; height: 20px; background-color: #fecaca; border: 1px solid #dc2626; border-radius: 4px;"></div>
                <span>Added Content</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 20px; height: 20px; background-color: #fde68a; border: 1px solid #d97706; border-radius: 4px;"></div>
                <span>Modified Content</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">Document with Highlights</h2>
            <div style="border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; background-color: white;">
              ${comparisonResult.highlightedContent}
            </div>
          </div>
        </div>
      `;
      
      // Add CSS for highlights
      const style = document.createElement('style');
      style.textContent = `
        .highlight-added {
          background-color: #fecaca !important;
          border-bottom: 2px solid #dc2626;
          padding: 2px 4px;
          border-radius: 3px;
        }
        .highlight-modified {
          background-color: #fde68a !important;
          border-bottom: 2px solid #d97706;
          padding: 2px 4px;
          border-radius: 3px;
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(tempContainer);
      
      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      
      // Add pages if content is longer than one page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      // Clean up
      document.body.removeChild(tempContainer);
      document.head.removeChild(style);
      
      // Download PDF
      const fileName = `comparison_${comparisonResult.modifiedDocument.name.replace(/\.[^/.]+$/, '')}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error('Failed to export PDF. Please try again.');
    }
  }
}