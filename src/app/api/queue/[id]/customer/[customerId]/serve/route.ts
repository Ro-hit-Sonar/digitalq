import { NextResponse } from "next/server";
import { queueStore } from "@/lib/queueStore";

export async function PUT(
  request: Request,
  context: { params: { id: string; customerId: string } }
) {
  try {
    queueStore.markCustomerAsServed(
      context.params.id,
      context.params.customerId
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking customer as served:", error);
    if (error instanceof Error && error.message === "Queue not found") {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "Customer not found") {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to mark customer as served" },
      { status: 500 }
    );
  }
}
