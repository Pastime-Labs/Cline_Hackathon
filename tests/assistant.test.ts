import assert from "node:assert/strict";
import { test } from "node:test";
import { Agent } from "@cline/sdk";
import {
  assistantRequestSchema,
  draftSchema,
  emptyDraft,
  reviewIssues,
  validateCompletion,
} from "../lib/assistant-contract.ts";
import { assistantTools } from "../lib/assistant-tools.ts";
import { eligiblePreviewListings } from "../lib/preview-data.ts";
import {
  readAssistantRequest,
  RequestInputError,
} from "../lib/assistant-request.ts";
import { aiConfiguration } from "../lib/ai-configuration.ts";
const input = {
  mode: "find" as const,
  message: "Find a working phone",
  history: [],
  draft: {
    ...emptyDraft,
    condition: "working" as const,
    location: "Pune",
    maxPrice: 8000,
    storageGb: 128,
    cameraMp: 48,
    ageMonths: 24,
  },
};
function request(body: string, headers: Record<string, string> = {}) {
  return new Request("http://127.0.0.1:3000/api/assistant", {
    method: "POST",
    headers: {
      origin: "http://127.0.0.1:3000",
      "content-type": "application/json",
      ...headers,
    },
    body,
  });
}
test("hard filters use known facts and require one seller with the full quantity", () => {
  assert.deepEqual(
    eligiblePreviewListings(input.draft).map((item) => item.id),
    ["preview-phone-1"],
  );
  assert.equal(
    eligiblePreviewListings({ ...input.draft, batteryHealthPercent: 80 })
      .length,
    0,
  );
  assert.equal(
    eligiblePreviewListings({ ...input.draft, maxPrice: 7000 }).length,
    0,
  );
  assert.equal(
    eligiblePreviewListings({
      ...emptyDraft,
      category: "newspaper",
      quantityKg: 11,
    }).length,
    0,
  );
  assert.equal(
    eligiblePreviewListings({
      ...emptyDraft,
      category: "newspaper",
      quantityKg: 10,
    }).length,
    1,
  );
  assert.equal(
    eligiblePreviewListings({ ...input.draft, location: "Mumbai" }).length,
    0,
  );
});
test("request and completion validation reject invented IDs, prices and extra fields", () => {
  assert.equal(
    assistantRequestSchema.safeParse({ ...input, message: "x".repeat(2001) })
      .success,
    false,
  );
  assert.equal(
    draftSchema.safeParse({ ...emptyDraft, batteryHealthPercent: 101 }).success,
    false,
  );
  assert.equal(
    draftSchema.safeParse({ ...emptyDraft, verified: true }).success,
    false,
  );
  assert.equal(
    draftSchema.safeParse({ ...emptyDraft, purchaseDate: "2026-02-30" })
      .success,
    false,
  );
  assert.equal(
    draftSchema.safeParse({
      ...emptyDraft,
      category: "newspaper",
      cameraMp: 48,
    }).success,
    false,
  );
  assert.throws(() =>
    validateCompletion(
      { message: "Weight", patch: { quantityKg: 10 }, resultIds: [] },
      input,
      [],
    ),
  );
  assert.throws(() =>
    validateCompletion(
      { message: "Here", patch: {}, resultIds: ["invented"] },
      input,
      ["preview-phone-1"],
    ),
  );
  assert.throws(() =>
    validateCompletion(
      { message: "Price", patch: { maxPrice: 500 }, resultIds: [] },
      { ...input, mode: "sell" },
      [],
    ),
  );
  assert.throws(() =>
    validateCompletion(
      { message: "Paper", patch: { category: "newspaper" }, resultIds: [] },
      input,
      [],
    ),
  );
  assert.throws(() =>
    validateCompletion(
      { message: "Verified", patch: { verified: true }, resultIds: [] },
      input,
      [],
    ),
  );
});
test("draft review requires seller transparency and explicit measured weight", () => {
  assert.ok(reviewIssues("sell", emptyDraft).length);
  assert.deepEqual(
    reviewIssues("sell", {
      ...emptyDraft,
      category: "newspaper",
      title: "Dry newspaper",
      location: "Pune",
      condition: "recyclable",
      description: "Dry and sorted",
      quantityKg: 10,
    }),
    [],
  );
  assert.ok(
    reviewIssues("wanted", {
      ...emptyDraft,
      category: "newspaper",
      title: "Need paper",
      location: "Pune",
      maxPrice: 150,
    }).some((issue) => issue.includes("weight")),
  );
});
test("HTTP boundary checks origin, media type, body size and malformed JSON", async () => {
  assert.deepEqual(
    await readAssistantRequest(request(JSON.stringify(input))),
    input,
  );
  for (const [req, status] of [
    [request(JSON.stringify(input), { origin: "https://evil.example" }), 403],
    [request(JSON.stringify(input), { "content-type": "text/plain" }), 415],
    [request("{"), 400],
    [request("x".repeat(40001)), 413],
    [
      request(
        JSON.stringify({ ...input, draft: { ...emptyDraft, quantityKg: -1 } }),
      ),
      400,
    ],
  ] as const)
    await assert.rejects(
      readAssistantRequest(req),
      (error: unknown) =>
        error instanceof RequestInputError && error.status === status,
    );
  const normalized = new Request("http://localhost:3000/api/assistant", {
    method: "POST",
    headers: {
      host: "127.0.0.1:3000",
      origin: "http://127.0.0.1:3000",
      "content-type": "application/json",
    },
    body: JSON.stringify(input),
  });
  assert.deepEqual(await readAssistantRequest(normalized), input);
  const rebound = new Request("http://evil.example:3000/api/assistant", {
    method: "POST",
    headers: {
      origin: "http://evil.example:3000",
      "content-type": "application/json",
    },
    body: JSON.stringify(input),
  });
  await assert.rejects(
    readAssistantRequest(rebound),
    (error: unknown) =>
      error instanceof RequestInputError && error.status === 403,
  );
});
test("configuration requires a provider/model/key tuple and accepts no vendor default", () => {
  assert.equal(aiConfiguration({}), null);
  assert.equal(aiConfiguration({ REVALUE_AI_KEY: "test-key" }), null);
  assert.deepEqual(
    aiConfiguration({
      REVALUE_AI_PROVIDER: " example-provider ",
      REVALUE_AI_MODEL: "example-model",
      REVALUE_AI_KEY: "test-key",
      REVALUE_AI_BASE_URL: "http://localhost:1234",
    }),
    {
      providerId: "example-provider",
      modelId: "example-model",
      apiKey: "test-key",
      baseUrl: "http://localhost:1234",
    },
  );
});
test("actual Cline Agent executes read tool then validated completion with an offline test model", async () => {
  let turn = 0;
  let readInvoked = false;
  let completed: unknown;
  const tools = assistantTools(input, (value) => {
    completed = value;
  });
  const originalRead = tools[0].execute;
  tools[0].execute = async (value, context) => {
    readInvoked = true;
    return originalRead(value, context);
  };
  const model = {
    async *stream() {
      turn++;
      yield {
        type: "tool-call-delta" as const,
        toolCallId: "test-" + turn,
        toolName:
          turn === 1 ? "read_public_preview" : "submit_assistant_result",
        input:
          turn === 1
            ? {}
            : {
                message: "One sample phone fits your current filters.",
                patch: {},
                resultIds: ["preview-phone-1"],
              },
      };
      yield { type: "finish" as const, reason: "tool-calls" as const };
    },
  };
  const agent = new Agent({
    model,
    tools,
    systemPrompt: "Offline SDK smoke test",
    maxIterations: 3,
    completionPolicy: { requireCompletionTool: true },
  });
  const result = await agent.run("Find a phone");
  assert.equal(result.status, "completed");
  assert.equal(readInvoked, true);
  assert.equal(turn, 2);
  assert.deepEqual(completed, {
    message: "One sample phone fits your current filters.",
    patch: {},
    resultIds: ["preview-phone-1"],
  });
});

test("Cline provider failure cannot produce a completed suggestion", async () => {
  let completed = false;
  const model = {
    async *stream() {
      yield {
        type: "finish" as const,
        reason: "error" as const,
        error: "Offline auth failure",
        errorClass: "auth" as const,
        errorRetryable: false,
      };
    },
  };
  const agent = new Agent({
    model,
    tools: assistantTools(input, () => {
      completed = true;
    }),
    maxIterations: 1,
  });
  const result = await agent.run("Find a phone");
  assert.equal(result.status, "failed");
  assert.equal(completed, false);
});
