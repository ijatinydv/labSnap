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
        content: "You are a DBMS Lab Assistant. Return strict JSON only.",
      },
      {
        role: "user",
        content: `Write a ${subject} program for the aim: '${aim}'.

Strict Constraints:

**Code:** Write the SQL query. The very first line MUST be a comment: -- Student: ${name} | Roll: ${rollNo}

**Output:** Generate a text block representing the query result. Use strict ASCII table formatting (using +, -, |) to look exactly like MariaDB/MySQL.

**Theory/Syntax:** Provide a short theory (2 lines) and the generic syntax for the command.

Return JSON: { "type": "dbms", "theory": "...", "syntax": "...", "code": "...", "output_text": "..." }`,
      },
    ];
  } else {
    // Scenario B: C++, Java, Python, DSA
    const printExamples: Record<string, string> = {
      "c++": `cout << "Student: ${name} | Roll: ${rollNo}" << endl;`,
      java: `System.out.println("Student: ${name} | Roll: ${rollNo}");`,
      python: `print("Student: ${name} | Roll: ${rollNo}")`,
      dsa: `cout << "Student: ${name} | Roll: ${rollNo}" << endl;`,
    };

    const subjectLower = subject.toLowerCase();
    const printExample =
      printExamples[subjectLower] ||
      `print("Student: ${name} | Roll: ${rollNo}")`;

    return [
      {
        role: "system",
        content: "You are a Coding Lab Assistant. Return strict JSON only.",
      },
      {
        role: "user",
        content: `Write a ${subject} solution for: '${aim}'.

Strict Constraints:

**Code:** The first line of execution MUST print: 'Student: ${name} | Roll: ${rollNo}'.
Example for ${subject}: ${printExample}

**Output:** Generate a realistic terminal session. The first line of output MUST be that specific print statement.

Return JSON: { "type": "coding", "code": "...", "output_text": "..." }`,
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
