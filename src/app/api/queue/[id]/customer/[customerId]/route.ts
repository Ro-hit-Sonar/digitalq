import { NextRequest } from "next/server";
import { queueStore } from "@/lib/queueStore";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; customerId: string } }
): Promise<Response> {
  try {
    queueStore.removeCustomer(params.id, params.customerId);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error removing customer:", error);
    if (error instanceof Error && error.message === "Queue not found") {
      return Response.json({ error: "Queue not found" }, { status: 404 });
    }
    return Response.json(
      { error: "Failed to remove customer" },
      { status: 500 }
    );
  }
}
