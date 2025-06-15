import { NextRequest, NextResponse } from "next/server";
import { queueStore } from "@/lib/queueStore";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string; customerId: string } }
) {
  try {
    queueStore.removeCustomer(context.params.id, context.params.customerId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing customer:", error);
    if (error instanceof Error && error.message === "Queue not found") {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to remove customer" },
      { status: 500 }
    );
  }
}
