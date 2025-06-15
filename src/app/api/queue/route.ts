import { NextResponse } from "next/server";
import { queueStore } from "@/lib/queueStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Queue name is required" },
        { status: 400 }
      );
    }

    const queue = queueStore.createQueue(name);
    return NextResponse.json(queue);
  } catch (error) {
    console.error("Error creating queue:", error);
    return NextResponse.json(
      { error: "Failed to create queue" },
      { status: 500 }
    );
  }
}
