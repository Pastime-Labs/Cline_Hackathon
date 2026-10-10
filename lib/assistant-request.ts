import { assistantRequestSchema } from "./assistant-contract.ts";
export class RequestInputError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export async function readAssistantRequest(request: Request) {
  const url = new URL(request.url);
  // Next may normalize request.url to localhost; validate the actual Host as well.
  const host = request.headers.get("host") ?? url.host;
  if (
    !/^(?:127\.0\.0\.1|localhost|\[::1\])(?::\d{1,5})?$/.test(host) ||
    request.headers.get("origin") !== url.protocol + "//" + host
  )
    throw new RequestInputError("Same-origin localhost requests only.", 403);
  if (
    !/^application\/json(?:;|$)/i.test(
      request.headers.get("content-type") ?? "",
    )
  )
    throw new RequestInputError("Expected JSON.", 415);
  if (!request.body) throw new RequestInputError("Invalid JSON.", 400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 40000) throw new RequestInputError("Message too large.", 413);
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
    reader.releaseLock();
  }
  let body: unknown;
  try {
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new RequestInputError("Invalid JSON.", 400);
  }
  const parsed = assistantRequestSchema.safeParse(body);
  if (!parsed.success)
    throw new RequestInputError("Check the message and draft fields.", 400);
  return parsed.data;
}
