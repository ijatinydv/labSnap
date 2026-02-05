import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

// Initialize OpenAI client with Novita AI configuration
const openai = new OpenAI({
  baseURL: "https://api.novita.ai/openai",
  apiKey: process.env.NOVITA_API_KEY || "",
});

interface GenerateRequest {
  aim: string;
  subject: string;
  name: string;
  rollNo: string;
}

interface DBMSResponse {
  type: "dbms";
  theory: string;
  syntax: string;
  code: string;
  output_text: string;
}

interface CodingResponse {
  type: "coding";
  code: string;
  output_text: string;
}

type GenerateResponse = DBMSResponse | CodingResponse;

// Helper to determine if subject is DBMS/SQL related
function isDBMSSubject(subject: string): boolean {
  const dbmsKeywords = ["dbms", "sql"];
  return dbmsKeywords.some((keyword) =>
    subject.toLowerCase().includes(keyword)
  );
}

// Build messages array based on subject type
function buildMessages(
  aim: string,
  subject: string,
  name: string,
  rollNo: string
): { role: "system" | "user"; content: string }[] {
  if (isDBMSSubject(subject)) {
    // Scenario A: DBMS/SQL
    return [
      {
        role: "system",
        content: "You are a DBMS Lab Assistant. Return strict JSON only. Write clean code with minimal comments - only add comments where absolutely necessary.",
      },
      {
        role: "user",
        content: `Write a ${subject} program for the aim: '${aim}'.

Strict Constraints:

**Code:** Write the SQL query with minimal comments. The very first TWO lines MUST be comments:
-- Name: ${name}
-- Enrollment No.: ${rollNo}

**Output:** The output_text MUST start with these two lines:
Name: ${name}
Enrollment No.: ${rollNo}
Then show the query result using strict ASCII table formatting (using +, -, |) to look exactly like MariaDB/MySQL.

**Theory/Syntax:** Provide a short theory (2 lines) and the generic syntax for the command.

Return JSON: { "type": "dbms", "theory": "...", "syntax": "...", "code": "-- Name: ${name}\\n-- Enrollment No.: ${rollNo}\\n...", "output_text": "Name: ${name}\\nEnrollment No.: ${rollNo}\\n\\n+---...---+\\n..." }`,
      },
    ];
  } else {
    // Scenario B: C++, Java, Python, DSA
    const printExamples: Record<string, string> = {
      "c++": `cout << "Name: ${name}" << endl;\\ncout << "Enrollment No.: ${rollNo}" << endl;`,
      java: `System.out.println("Name: ${name}");\\nSystem.out.println("Enrollment No.: ${rollNo}");`,
      python: `print("Name: ${name}")\\nprint("Enrollment No.: ${rollNo}")`,
      dsa: `cout << "Name: ${name}" << endl;\\ncout << "Enrollment No.: ${rollNo}" << endl;`,
    };

    const subjectLower = subject.toLowerCase();
    const printExample =
      printExamples[subjectLower] ||
      `print("Name: ${name}")\\nprint("Enrollment No.: ${rollNo}")`;

    return [
      {
        role: "system",
        content: "You are a Coding Lab Assistant. Return strict JSON only. Write clean, efficient code with minimal comments - only add comments where absolutely necessary for understanding.",
      },
      {
        role: "user",
        content: `Write a ${subject} solution for: '${aim}'.

Strict Constraints:

**Code:** Write clean code with VERY FEW comments (only essential ones). The FIRST TWO executable lines in main() or the entry point MUST print:
Line 1: "Name: ${name}"
Line 2: "Enrollment No.: ${rollNo}"
Example for ${subject}: ${printExample}

**Output:** Generate a realistic terminal session output. The VERY FIRST TWO LINES of output MUST be exactly:
Name: ${name}
Enrollment No.: ${rollNo}
Then show the rest of the program output below it.

Return JSON: { "type": "coding", "code": "...", "output_text": "Name: ${name}\\nEnrollment No.: ${rollNo}\\n..." }`,
      },
    ];
  }
}

// Clean response by removing markdown code blocks if present
function cleanResponse(text: string): string {
  let cleaned = text.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }

  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GenerateRequest = await request.json();
    const { aim, subject, name, rollNo } = body;

    // Validate required fields
    if (!aim || !subject || !name || !rollNo) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["aim", "subject", "name", "rollNo"],
        },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.NOVITA_API_KEY) {
      return NextResponse.json(
        { error: "NOVITA_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Build the messages
    const messages = buildMessages(aim, subject, name, rollNo);

    // Call MiMo-V2-Flash via Novita AI
    const response = await openai.chat.completions.create({
      model: "xiaomimimo/mimo-v2-flash",
      messages: messages,
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Extract and parse the response
    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content returned from AI" },
        { status: 500 }
      );
    }

    // Clean and parse the response
    const cleanedContent = cleanResponse(content);
    const parsedResponse: GenerateResponse = JSON.parse(cleanedContent);

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error generating content:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate content", details: String(error) },
      { status: 500 }
    );
  }
}
