"use client";
import { createContext, useContext, useState } from "react";
import { emptyDraft, type Draft, type Mode } from "@/lib/assistant-contract";
export const profiles = [
  { id: "asha", name: "Asha", role: "Seller demo", initials: "AS" },
  { id: "kabir", name: "Kabir", role: "Buyer demo", initials: "KA" },
  { id: "meera", name: "Meera", role: "Buyer demo", initials: "ME" },
];
type Workspace = {
  profile: (typeof profiles)[number];
  selectProfile: (id: string) => void;
  getDraft: (mode: Mode) => Draft;
  setDraft: (mode: Mode, draft: Draft) => void;
};
const WorkspaceContext = createContext<Workspace | null>(null);
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [profileId, selectProfile] = useState("asha");
  const [drafts, setDrafts] = useState<
    Record<string, Partial<Record<Mode, Draft>>>
  >({});
  const profile = profiles.find((item) => item.id === profileId) ?? profiles[0];
  return (
    <WorkspaceContext.Provider
      value={{
        profile,
        selectProfile,
        getDraft: (mode) => drafts[profile.id]?.[mode] ?? emptyDraft,
        setDraft: (mode, draft) =>
          setDrafts((previous) => ({
            ...previous,
            [profile.id]: { ...previous[profile.id], [mode]: draft },
          })),
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
export function useWorkspace() {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) throw new Error("Workspace provider required");
  return workspace;
}
