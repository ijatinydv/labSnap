import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

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
  mode?: "full" | "theory_only";
}

interface DBMSResponse {
  type: "dbms";
  theory: string;
  syntax: string;
  code: string;
  output_text: string;
}

interface TheoryOnlyResponse {
  type: "dbms";
  theory: string;
  syntax: string;
}

interface CodingResponse {
  type: "coding";
  code: string;
  output_text: string;
}

type GenerateResponse = DBMSResponse | CodingResponse | TheoryOnlyResponse;

// Helper to determine if subject is DBMS/SQL related
function isDBMSSubject(subject: string): boolean {
  const dbmsKeywords = ["dbms", "sql"];
  return dbmsKeywords.some((keyword) =>
    subject.toLowerCase().includes(keyword)
  );
}

// Build messages for theory-only mode (DBMS subjects in Smart Formatter)
function buildTheoryOnlyMessages(
  aim: string,
  subject: string
): { role: "system" | "user"; content: string }[] {
  return [
    {
      role: "system",
      content: "You are a DBMS Lab Assistant. Return strict JSON only.",
    },
    {
      role: "user",
      content: `For the ${subject} experiment aim: '${aim}'

Provide ONLY:
1. A short theory (2-3 sentences explaining the concept)
2. The generic syntax for the SQL command(s) used

Return JSON: { "type": "dbms", "theory": "...", "syntax": "..." }`,
    },
  ];
}

// Build messages array based on subject type
function buildMessages(
  aim: string,
  subject: string,
  name?: string,
  rollNo?: string
): { role: "system" | "user"; content: string }[] {
  const hasIdentity = name && rollNo;

  const identityInstruction = hasIdentity
    ? `1. Code: Start with comments '-- Name: ${name} | Roll: ${rollNo}'\n2. Output: First line must be '-- Name: ${name} | Roll: ${rollNo}'`
    : `1. Code: Do NOT include any Name/Roll No comments at the top.\n2. Output: Do NOT include Name/Roll No in the output.`;

  if (isDBMSSubject(subject)) {
    // Scenario A: DBMS/SQL
    return [
      {
        role: "system",
        content:
          "You are a DBMS Lab Assistant. Return strict JSON only. Write clean code with minimal comments - only add comments where absolutely necessary.",
      },
      {
        role: "user",
        content: `Write a ${subject} program for the aim: '${aim}'.

Strict Constraints:

**Identity:**
${identityInstruction}

**Output:** 
Show the query result using strict ASCII table formatting (using +, -, |) to look exactly like MariaDB/MySQL.

**Theory/Syntax:** Provide a short theory (2 lines) and the generic syntax for the command.

Return JSON: { "type": "dbms", "theory": "...", "syntax": "...", "code": "...", "output_text": "..." }`,
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
    
    // Only use print example if we have identity
    const printExample = hasIdentity
      ? (printExamples[subjectLower] || `print("Name: ${name}")\\nprint("Enrollment No.: ${rollNo}")`)
      : "No identity print needed.";

    const codingIdentityInstruction = hasIdentity
        ? `1. Code: The FIRST TWO executable lines in main() or the entry point MUST print:\n   Line 1: "Name: ${name}"\n   Line 2: "Enrollment No.: ${rollNo}"\n   Example: ${printExample}\n2. Output: The VERY FIRST TWO LINES of output MUST be exactly:\n   Name: ${name}\n   Enrollment No.: ${rollNo}`
        : `1. Code: Do NOT print Name or Enrollment No.\n2. Output: Do NOT include Name or Enrollment No.`;

    return [
      {
        role: "system",
        content:
          "You are a Coding Lab Assistant. Return strict JSON only. Write clean, efficient code with minimal comments - only add comments where absolutely necessary for understanding.",
      },
      {
        role: "user",
        content: `Write a ${subject} solution for: '${aim}'.

Strict Constraints:

**Identity:**
${codingIdentityInstruction}

**Output:** 
Show the rest of the program output below it.

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

// Extract the first complete JSON object from free-form text
function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = start; index < text.length; index++) {
    const char = text[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return null;
}

function parseGenerateResponse(content: string): GenerateResponse {
  const cleaned = cleanResponse(content);

  const candidates: string[] = [cleaned];
  const extractedFromCleaned = extractFirstJsonObject(cleaned);
  if (extractedFromCleaned) candidates.push(extractedFromCleaned);
  const extractedFromRaw = extractFirstJsonObject(content);
  if (extractedFromRaw) candidates.push(extractedFromRaw);

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as GenerateResponse;
    } catch {
      // Try next candidate
    }
  }

  throw new SyntaxError("Failed to parse model JSON response");
}

// Get client IP from request headers
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    // === HYBRID AUTH: Check if user is logged in ===
    const { userId } = await auth();

    if (userId) {
      // === LOGGED-IN USER FLOW ===
      // Sync user to database
      const user = await db.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: `${userId}@clerk.user`,
          credits: 20, // New users get 20 credits
        },
      });

      // Check credits
      if (user.credits <= 0) {
        return NextResponse.json(
          { error: "Insufficient Credits. Please upgrade your plan." },
          { status: 403 }
        );
      }

      // Deduct 1 credit immediately
      await db.user.update({
        where: { clerkId: userId },
        data: { credits: { decrement: 1 } },
      });
    } else {
      // === GUEST USER FLOW ===
      const clientIP = getClientIP(request);

      // Check guest usage
      const guestUsage = await db.guestUsage.findUnique({
        where: { ip: clientIP },
      });

      if (guestUsage && guestUsage.count >= 5) {
        return NextResponse.json(
          { error: "Guest limit reached. Login to get 20 credits!" },
          { status: 403 }
        );
      }

      // Increment guest usage count
      await db.guestUsage.upsert({
        where: { ip: clientIP },
        update: { count: { increment: 1 } },
        create: { ip: clientIP, count: 1 },
      });
    }

    // === CONTINUE WITH GENERATION ===
    // Parse request body
    const body: GenerateRequest = await request.json();
    const { aim, subject, name, rollNo, mode = "full" } = body;

    // Theory-only mode: only need aim and subject
    if (mode === "theory_only") {
      if (!aim || !subject) {
        return NextResponse.json(
          {
            error: "Missing required fields for theory_only mode",
            required: ["aim", "subject"],
          },
          { status: 400 }
        );
      }
    } else {
      // Full mode: validate all required fields
      // Name and RollNo are now OPTIONAL
      if (!aim || !subject) {
        return NextResponse.json(
          {
            error: "Missing required fields",
            required: ["aim", "subject"],
          },
          { status: 400 }
        );
      }
    }

    // Check for API key
    if (!process.env.NOVITA_API_KEY) {
      return NextResponse.json(
        { error: "NOVITA_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Build the messages based on mode
    const messages = mode === "theory_only"
      ? buildTheoryOnlyMessages(aim, subject)
      : buildMessages(aim, subject, name, rollNo);

    const maxAttempts = 2;
    let lastContent = "";

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await openai.chat.completions.create({
        model: "xiaomimimo/mimo-v2-flash",
        messages,
        response_format: { type: "json_object" },
        max_tokens: mode === "theory_only" ? 700 : 1600,
        temperature: attempt === 1 ? 0.7 : 0.2,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        continue;
      }

      lastContent = content;

      try {
        const parsedResponse = parseGenerateResponse(content);
        return NextResponse.json(parsedResponse);
      } catch (parseError) {
        console.warn(`AI JSON parse failed (attempt ${attempt}/${maxAttempts})`, parseError);
      }
    }

    console.error("Unable to parse AI JSON response after retries", {
      preview: lastContent.slice(0, 300),
    });

    return NextResponse.json(
      { error: "Failed to parse AI response as JSON" },
      { status: 502 }
    );
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
