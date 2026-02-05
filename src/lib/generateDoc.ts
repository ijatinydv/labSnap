import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  convertInchesToTwip,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";

export interface LabData {
  expNo: string;
  date: string;
  aim: string;
  subject: string;
  name: string;
  rollNo: string;
  theory?: string;
  syntax?: string;
  code: string;
  screenshotBlob: Blob | null;
}

// Helper to create a heading paragraph
function createHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        font: "Times New Roman",
        size: 24, // 12pt = 24 half-points
      }),
    ],
    spacing: { before: 240, after: 120 },
  });
}

// Helper to create body text paragraph
function createBodyText(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: 24,
      }),
    ],
    spacing: { after: 120 },
  });
}

// Helper to create code block (preserves newlines)
function createCodeBlock(code: string): Paragraph[] {
  const lines = code.split("\n");
  return lines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line || " ", // Empty lines need at least a space
            font: "Consolas",
            size: 20, // 10pt = 20 half-points
          }),
        ],
        spacing: { after: 0 },
      })
  );
}

// Convert Blob to ArrayBuffer
async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export async function generateLabRecord(data: LabData): Promise<void> {
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

  // Build document sections
  const children: Paragraph[] = [];

  // Section A: Header (Always Present)
  // Date at top-left without bold
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Date: ${date}`,
          font: "Times New Roman",
          size: 24, // 12pt
        }),
      ],
      alignment: AlignmentType.LEFT,
    })
  );

  // Blank line
  children.push(new Paragraph({ children: [] }));

  // Experiment No - Centered with larger font
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Experiment No: ${expNo}`,
          bold: true,
          font: "Times New Roman",
          size: 36, // 18pt for emphasis
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    })
  );

  // Blank line
  children.push(new Paragraph({ children: [] }));

  // Section B: Aim
  children.push(createHeading("AIM"));
  children.push(createBodyText(aim));

  // Section C: Theory & Syntax (Only for DBMS mode)
  if (theory) {
    children.push(createHeading("THEORY"));
    children.push(createBodyText(theory));
  }

  if (syntax) {
    children.push(createHeading("SYNTAX"));
    // Render syntax as code block to preserve formatting
    children.push(...createCodeBlock(syntax));
    children.push(new Paragraph({ children: [], spacing: { after: 120 } }));
  }

  // Section D: Source Code
  children.push(createHeading("SOURCE CODE"));
  children.push(...createCodeBlock(code));
  children.push(new Paragraph({ children: [], spacing: { after: 120 } }));

  // Section E: Output (Screenshot)
  children.push(createHeading("OUTPUT"));

  if (screenshotBlob) {
    try {
      const imageBuffer = await blobToArrayBuffer(screenshotBlob);

      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: {
                width: 500,
                height: 250, // Approximate aspect ratio, will be adjusted
              },
              type: "png",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 120 },
        })
      );
    } catch (error) {
      console.error("Error adding image to document:", error);
      children.push(createBodyText("[Screenshot could not be loaded]"));
    }
  } else {
    children.push(createBodyText("[No output screenshot available]"));
  }

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.5),
              right: convertInchesToTwip(0.5),
              bottom: convertInchesToTwip(0.5),
              left: convertInchesToTwip(0.5),
            },
          },
        },
        children: children,
      },
    ],
  });

  // Generate and download the document
  const blob = await Packer.toBlob(doc);
  const filename = `Lab_${subject}_Exp${expNo}_${rollNo}.docx`;
  saveAs(blob, filename);
}
