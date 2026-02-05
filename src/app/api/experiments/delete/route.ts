import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface DeleteExperimentRequest {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication: Check if user is logged in
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body: DeleteExperimentRequest = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing experiment ID" },
        { status: 400 }
      );
    }

    // 3. Get the user from our database to get their internal ID
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4. Delete experiment - Using deleteMany for security check
    // This ensures the experiment belongs to the user before deleting
    const result = await db.experiment.deleteMany({
      where: {
        id: id,
        userId: user.id, // Security: Only delete if user owns it
      },
    });

    // 5. Check if anything was deleted
    if (result.count === 0) {
      return NextResponse.json(
        { error: "Experiment not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Experiment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting experiment:", error);
    return NextResponse.json(
      { error: "Failed to delete experiment" },
      { status: 500 }
    );
  }
}
