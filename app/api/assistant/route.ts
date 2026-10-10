import { NextResponse } from "next/server";
import {
  readAssistantRequest,
  RequestInputError,
} from "@/lib/assistant-request";
import { manualMessage, runAssistant } from "@/lib/cline-assistant";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const input = await readAssistantRequest(request);
    const completion = await runAssistant(input, request.signal);
    if (!completion)
      return NextResponse.json(
        { mode: "manual", message: manualMessage },
        { status: 503 },
      );
    return NextResponse.json({ mode: "ai", completion });
  } catch (error) {
    if (error instanceof RequestInputError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    return NextResponse.json(
      { mode: "manual", message: manualMessage },
      { status: 503 },
    );
  }
}
