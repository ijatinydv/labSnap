import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ credits: null }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { credits: true },
    });

    return NextResponse.json({ credits: user?.credits ?? null });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json({ credits: null }, { status: 500 });
  }
}
