import { NextResponse } from "next/server";
import { queueStore } from "@/lib/queueStore";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { customerId } = await request.json();

    if (!customerId || typeof customerId !== "string") {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    queueStore.removeCustomer(params.id, customerId);
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
