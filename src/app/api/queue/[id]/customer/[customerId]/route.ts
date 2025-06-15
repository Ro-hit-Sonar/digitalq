import { NextRequest } from "next/server";
import { queueStore } from "@/lib/queueStore";

type RouteContext = {
  params: {
    id: string;
    customerId: string;
  };
};

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<Response> {
  try {
    queueStore.removeCustomer(context.params.id, context.params.customerId);
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
