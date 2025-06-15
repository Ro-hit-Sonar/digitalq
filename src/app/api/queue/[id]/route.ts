import { NextResponse } from "next/server";
import { queueStore } from "@/lib/queueStore";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const queue = queueStore.getQueue(context.params.id);
    if (!queue) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }
    return NextResponse.json(queue);
  } catch (error) {
    console.error("Error fetching queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue" },
      { status: 500 }
    );
  }
}
