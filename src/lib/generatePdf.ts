import jsPDF from "jspdf";
import { LabData } from "./generateDoc";

// Helper to parse "YYYY-MM-DD" to "DD/MM/YYYY"
function formatDate(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}

// Convert Blob to base64 data URL
async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateLabPdf(data: LabData): Promise<void> {
  const {
    expNo,
    date,
    aim,
    subject,
    name,
    rollNo,
    theory,
    syntax,
    code,
    screenshotBlob,
  } = data;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 15;
  const marginRight = 15;
  const marginTop = 15;
  const marginBottom = 15;
  const contentWidth = pageWidth - marginLeft - marginRight;
  let y = marginTop;

  // Check if we need a new page
  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - marginBottom) {
      doc.addPage();
      y = marginTop;
    }
  };

  // --- Date ---
  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.text(`Date: ${formatDate(date)}`, marginLeft, y);
  y += 10;

  // --- Experiment No (centered, larger) ---
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  const expText = `Experiment No: ${expNo}`;
  const expTextWidth = doc.getTextWidth(expText);
  doc.text(expText, (pageWidth - expTextWidth) / 2, y);
  y += 14;

  // --- Student Info ---
  doc.setFont("times", "normal");
  doc.setFontSize(12);
  if (name) {
    doc.text(`Name: ${name}`, marginLeft, y);
    y += 6;
  }
  if (rollNo) {
    doc.text(`Roll No: ${rollNo}`, marginLeft, y);
    y += 6;
  }
  if (subject) {
    doc.text(`Subject: ${subject}`, marginLeft, y);
    y += 6;
  }
  y += 4;

  // --- AIM ---
  ensureSpace(20);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("AIM", marginLeft, y);
  y += 2;
  // Underline
  doc.setLineWidth(0.5);
  doc.line(marginLeft, y, marginLeft + doc.getTextWidth("AIM"), y);
  y += 6;

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  const aimLines = doc.splitTextToSize(aim, contentWidth);
  for (const line of aimLines) {
    ensureSpace(7);
    doc.text(line, marginLeft, y);
    y += 6;
  }
  y += 4;

  // --- THEORY (DBMS only) ---
  if (theory) {
    ensureSpace(20);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("THEORY", marginLeft, y);
    y += 2;
    doc.setLineWidth(0.5);
    doc.line(marginLeft, y, marginLeft + doc.getTextWidth("THEORY"), y);
    y += 6;

    doc.setFont("times", "normal");
    doc.setFontSize(12);
    const theoryLines = doc.splitTextToSize(theory, contentWidth);
    for (const line of theoryLines) {
      ensureSpace(7);
      doc.text(line, marginLeft, y);
      y += 6;
    }
    y += 4;
  }

  // --- SYNTAX (DBMS only) ---
  if (syntax) {
    ensureSpace(20);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("SYNTAX", marginLeft, y);
    y += 2;
    doc.setLineWidth(0.5);
    doc.line(marginLeft, y, marginLeft + doc.getTextWidth("SYNTAX"), y);
    y += 6;

    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    const syntaxLines = syntax.split("\n");
    for (const rawLine of syntaxLines) {
      const wrappedLines = doc.splitTextToSize(rawLine || " ", contentWidth);
      for (const wLine of wrappedLines) {
        ensureSpace(6);
        doc.text(wLine, marginLeft, y);
        y += 5;
      }
    }
    y += 4;
  }

  // --- SOURCE CODE ---
  ensureSpace(20);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("SOURCE CODE", marginLeft, y);
  y += 2;
  doc.setLineWidth(0.5);
  doc.line(marginLeft, y, marginLeft + doc.getTextWidth("SOURCE CODE"), y);
  y += 6;

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  const codeLines = code.split("\n");
  for (const rawLine of codeLines) {
    const wrappedLines = doc.splitTextToSize(rawLine || " ", contentWidth);
    for (const wLine of wrappedLines) {
      ensureSpace(5);
      doc.text(wLine, marginLeft, y);
      y += 4.5;
    }
  }
  y += 6;

  // --- OUTPUT ---
  ensureSpace(20);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("OUTPUT", marginLeft, y);
  y += 2;
  doc.setLineWidth(0.5);
  doc.line(marginLeft, y, marginLeft + doc.getTextWidth("OUTPUT"), y);
  y += 6;

  if (screenshotBlob) {
    try {
      const dataUrl = await blobToDataURL(screenshotBlob);

      // Get image dimensions to calculate aspect ratio
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = dataUrl;
      });

      const imgAspect = img.width / img.height;
      let imgWidth = contentWidth;
      let imgHeight = imgWidth / imgAspect;

      // Cap height to fit on page
      const maxImgHeight = pageHeight - marginBottom - y - 5;
      if (imgHeight > maxImgHeight) {
        // If image is too tall for remaining space, start new page
        if (maxImgHeight < 40) {
          doc.addPage();
          y = marginTop;
        }
        const availableHeight = pageHeight - marginBottom - y - 5;
        if (imgHeight > availableHeight) {
          imgHeight = availableHeight;
          imgWidth = imgHeight * imgAspect;
        }
      }

      // Center the image
      const imgX = marginLeft + (contentWidth - imgWidth) / 2;
      doc.addImage(dataUrl, "PNG", imgX, y, imgWidth, imgHeight);
      y += imgHeight + 6;
    } catch (error) {
      console.error("Error adding image to PDF:", error);
      doc.setFont("times", "italic");
      doc.setFontSize(11);
      doc.text("[Screenshot could not be loaded]", marginLeft, y);
      y += 8;
    }
  } else {
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.text("[No output screenshot available]", marginLeft, y);
    y += 8;
  }

  // Save the PDF
  const filename = `Lab_${subject}_Exp${expNo}_${rollNo}.pdf`;
  doc.save(filename);
}
