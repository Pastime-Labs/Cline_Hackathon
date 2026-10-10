import { Assistant } from "@/components/assistant";
import type { Mode } from "@/lib/assistant-contract";
export default async function AssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return (
    <Assistant
      mode={
        (["sell", "find", "wanted"].includes(mode ?? "")
          ? mode
          : "sell") as Mode
      }
    />
  );
}
