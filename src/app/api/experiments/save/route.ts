import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface SaveExperimentRequest {
  aim: string;
  subject: string;
  code: string;
  output_text: string;
  theory?: string;
  syntax?: string;
}

export async function POST(request: Request) {
  try {
    // 1. Authentication: Check if user is logged in
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to save experiments." },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body: SaveExperimentRequest = await request.json();
    const { aim, subject, code, output_text, theory, syntax } = body;

    if (!aim || !subject || !code || !output_text) {
      return NextResponse.json(
        { error: "Missing required fields: aim, subject, code, output_text" },
        { status: 400 }
      );
    }

    // 3. Sync user: Ensure the user exists in our database (upsert)
    const user = await db.user.upsert({
      where: { clerkId: userId },
      update: {}, // Don't update anything if user exists
      create: {
        clerkId: userId,
        email: `${userId}@clerk.user`, // Placeholder email (Clerk ID based)
        credits: 5,
      },
    });

    // 4. Check credits BEFORE saving
    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits. Please upgrade your plan." },
        { status: 403 }
      );
    }

    // 5. Save the experiment
    const experiment = await db.experiment.create({
      data: {
        aim,
        subject,
        code,
        output: output_text,
        theory: theory || null,
        syntax: syntax || null,
        user: {
          connect: { clerkId: userId },
        },
      },
    });

    // 6. Deduct 1 credit from user
    await db.user.update({
      where: { clerkId: userId },
      data: {
        credits: { decrement: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Experiment saved successfully!",
      experiment: {
        id: experiment.id,
        aim: experiment.aim,
        subject: experiment.subject,
        createdAt: experiment.createdAt,
      },
      creditsRemaining: user.credits - 1,
    });
  } catch (error) {
    console.error("Error saving experiment:", error);
    return NextResponse.json(
      { error: "Failed to save experiment. Please try again." },
      { status: 500 }
    );
  }
}
