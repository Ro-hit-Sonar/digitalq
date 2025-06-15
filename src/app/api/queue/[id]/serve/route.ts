import { NextResponse } from "next/server";
import { queueStore } from "@/lib/queueStore";

export async function POST(
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

    const success = queueStore.serveCustomer(params.id, customerId);

    if (!success) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
