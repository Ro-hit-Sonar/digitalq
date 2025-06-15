import { NextResponse } from "next/server";
import { queueStore } from "@/lib/queueStore";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const customer = queueStore.addCustomer(context.params.id, name);
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error joining queue:", error);
    if (error instanceof Error && error.message === "Queue not found") {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to join queue" },
      { status: 500 }
    );
  }
}
