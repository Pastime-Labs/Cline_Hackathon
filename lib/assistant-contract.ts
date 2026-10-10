import { z } from "zod";

// shortcut: B1-only assistant draft, align with Person A before backend integration.
const draftFieldsSchema = z
  .object({
    category: z.enum(["phone", "newspaper"]),
    title: z.string().max(120),
    description: z.string().max(2000),
    location: z.string().max(100),
    condition: z.enum(["unknown", "working", "nonworking", "recyclable"]),
    ageMonths: z.number().int().min(0).max(1200).nullable(),
    purchaseDate: z
      .string()
      .max(10)
      .refine(
        (v) =>
          !v ||
          (/^\d{4}-\d{2}-\d{2}$/.test(v) &&
            !Number.isNaN(Date.parse(v + "T00:00:00Z")) &&
            new Date(v + "T00:00:00Z").toISOString().slice(0, 10) === v),
        "Use a valid YYYY-MM-DD date",
      ),
    repairs: z.string().max(1000),
    accessories: z.string().max(500),
    quantityKg: z.number().positive().max(100000).nullable(),
    storageGb: z.number().positive().max(10000).nullable(),
    cameraMp: z.number().positive().max(1000).nullable(),
    batteryMah: z.number().positive().max(100000).nullable(),
    batteryHealthPercent: z.number().min(0).max(100).nullable(),
    maxPrice: z.number().min(0).max(10000000).nullable(),
  })
  .strict();
export const draftSchema = draftFieldsSchema.superRefine((draft, context) => {
  if (
    draft.category === "phone" &&
    (draft.condition === "recyclable" || draft.quantityKg !== null)
  )
    context.addIssue({
      code: "custom",
      message: "Phone draft cannot contain newspaper condition or weight",
    });
  if (
    draft.category === "newspaper" &&
    ([
      draft.storageGb,
      draft.cameraMp,
      draft.batteryMah,
      draft.batteryHealthPercent,
    ].some((value) => value !== null) ||
      ["working", "nonworking"].includes(draft.condition))
  )
    context.addIssue({
      code: "custom",
      message: "Newspaper draft cannot contain phone requirements",
    });
});
export type Draft = z.infer<typeof draftSchema>;
export type Mode = "sell" | "find" | "wanted";
export const emptyDraft: Draft = {
  category: "phone",
  title: "",
  description: "",
  location: "",
  condition: "unknown",
  ageMonths: null,
  purchaseDate: "",
  repairs: "",
  accessories: "",
  quantityKg: null,
  storageGb: null,
  cameraMp: null,
  batteryMah: null,
  batteryHealthPercent: null,
  maxPrice: null,
};
export const assistantRequestSchema = z
  .object({
    mode: z.enum(["sell", "find", "wanted"]),
    message: z.string().trim().min(1).max(2000),
    draft: draftSchema,
    history: z
      .array(
        z
          .object({
            role: z.enum(["user", "assistant"]),
            text: z.string().max(2500),
          })
          .strict(),
      )
      .max(8),
  })
  .strict();
export type AssistantRequest = z.infer<typeof assistantRequestSchema>;
export const completionSchema = z
  .object({
    message: z.string().min(1).max(2500),
    patch: draftFieldsSchema.partial(),
    resultIds: z.array(z.string().max(80)).max(10),
  })
  .strict();
export type Completion = z.infer<typeof completionSchema>;
export function validateCompletion(
  raw: unknown,
  request: AssistantRequest,
  allowedIds: readonly string[],
): Completion {
  const result = completionSchema.parse(raw);
  if (request.mode === "sell" && result.patch.maxPrice !== undefined)
    throw new Error("AI cannot set seller prices");
  if (result.patch.category && result.patch.category !== request.draft.category)
    throw new Error("Category change requires the form");
  draftSchema.parse({ ...request.draft, ...result.patch });
  if (result.resultIds.some((id) => !allowedIds.includes(id)))
    throw new Error("Untrusted inventory ID");
  return { ...result, resultIds: [...new Set(result.resultIds)] };
}
export function reviewIssues(mode: Mode, draft: Draft): string[] {
  const issues: string[] = [];
  if (mode !== "find" && !draft.title.trim()) issues.push("Add a title.");
  if (!draft.location.trim()) issues.push("Add a general pickup area.");
  if (draft.category === "newspaper" && draft.quantityKg === null)
    issues.push("Enter the measured or required newspaper weight in kg.");
  if (draft.category === "phone" && draft.condition === "recyclable")
    issues.push("Choose working, non-working, or unknown for a phone.");
  if (mode === "sell" && draft.condition === "unknown")
    issues.push("Declare the item condition.");
  if (mode === "sell" && !draft.description.trim())
    issues.push("Describe defects and what is included.");
  if (mode !== "sell" && draft.maxPrice === null)
    issues.push("Set your maximum total budget.");
  return issues;
}
