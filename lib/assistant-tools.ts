import { createTool } from "@cline/sdk";
import { z } from "zod";
import {
  completionSchema,
  validateCompletion,
  type AssistantRequest,
  type Completion,
} from "./assistant-contract.ts";
import { categoryQuestions, eligiblePreviewListings } from "./preview-data.ts";
export function assistantTools(
  request: AssistantRequest,
  onComplete: (result: Completion) => void,
) {
  const listings =
    request.mode === "sell" ? [] : eligiblePreviewListings(request.draft);
  return [
    createTool({
      name: "read_public_preview",
      description:
        "Read category questions and B1 public PREVIEW inventory matching the current explicit hard filters. Fixtures are not actual offers or market prices. This tool never reads private bills or contact information.",
      inputSchema: z.object({}).strict(),
      execute: async () => ({
        previewOnly: true,
        category: request.draft.category,
        questions: categoryQuestions[request.draft.category],
        listings,
      }),
    }),
    createTool({
      name: "submit_assistant_result",
      description:
        "Finish with an editable suggested patch, a brief explanation or follow-up question, and only IDs returned by read_public_preview. Never change category, set seller prices, publish or claim verification.",
      inputSchema: completionSchema,
      lifecycle: { completesRun: true },
      execute: async (input) => {
        const result = validateCompletion(
          input,
          request,
          listings.map((item) => item.id),
        );
        onComplete(result);
        return result;
      },
    }),
  ] as const;
}
