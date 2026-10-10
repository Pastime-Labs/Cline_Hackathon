import type { Draft } from "./assistant-contract.ts";
export const previewListings = [
  {
    id: "preview-phone-1",
    category: "phone",
    title: "DemoPhone P1 · 128 GB",
    description:
      "Working phone with light frame scratches. Screen replaced 6 months ago; charger included.",
    location: "Pune",
    price: 7500,
    condition: "working",
    ageMonths: 18,
    quantityKg: null,
    storageGb: 128,
    cameraMp: 48,
    batteryMah: 5000,
    batteryHealthPercent: null,
    owner: "Asha",
    receipt: true,
    repairs: "Screen replacement declared",
    accessories: "Charger",
    visual: "phone",
    evidence: "Seller-declared · sample receipt availability",
  },
  {
    id: "preview-phone-2",
    category: "phone",
    title: "DemoPhone Mini · 64 GB",
    description:
      "Working phone, small scratch on screen. No repair history declared; battery health not measured.",
    location: "Pune",
    price: 4200,
    condition: "working",
    ageMonths: 30,
    quantityKg: null,
    storageGb: 64,
    cameraMp: 12,
    batteryMah: 3000,
    batteryHealthPercent: null,
    owner: "Rohan",
    receipt: false,
    repairs: "Unknown",
    accessories: "None declared",
    visual: "phone",
    evidence: "Seller-declared · no receipt",
  },
  {
    id: "preview-paper-1",
    category: "newspaper",
    title: "10 kg of clean newspaper",
    description:
      "Dry, sorted newspapers. Weight entered by the seller; pickup only. No mixed packaging.",
    location: "Pune",
    price: 120,
    condition: "recyclable",
    ageMonths: null,
    quantityKg: 10,
    storageGb: null,
    cameraMp: null,
    batteryMah: null,
    batteryHealthPercent: null,
    owner: "Asha",
    receipt: false,
    repairs: "Not applicable",
    accessories: "Not applicable",
    visual: "paper",
    evidence: "Seller-declared weight · not independently weighed",
  },
] as const;
export type PreviewListing = (typeof previewListings)[number];
export const previewNeeds = [
  {
    id: "preview-need-paper",
    category: "newspaper",
    title: "Looking for 10 kg newspaper",
    owner: "Kabir",
    location: "Pune",
    budget: 150,
    description:
      "Clean and dry newspaper, one seller with the full 10 kg. Pickup this weekend.",
    requirements: [
      "At least 10 kg from one seller",
      "Total budget ₹150",
      "Dry and sorted; confirm with seller",
    ],
  },
  {
    id: "preview-need-phone",
    category: "phone",
    title: "A phone for everyday photos",
    owner: "Meera",
    location: "Pune",
    budget: 8000,
    description:
      "A working phone under 2 years old. Prefer a charger and a receipt; they are preferences, not hard requirements.",
    requirements: [
      "Working condition",
      "At most 24 months old",
      "At least 128 GB storage and 48 MP camera",
      "Total budget ₹8,000",
      "Battery runtime must be discussed; mAh is not runtime",
    ],
  },
] as const;
// shortcut: pickup matching is exact city text, replace with Person A’s location rules in B2.
export function eligiblePreviewListings(draft: Draft): PreviewListing[] {
  return previewListings.filter(
    (item) =>
      item.category === draft.category &&
      (!draft.location.trim() ||
        item.location.toLowerCase() === draft.location.trim().toLowerCase()) &&
      (draft.maxPrice === null || item.price <= draft.maxPrice) &&
      (draft.condition === "unknown" || item.condition === draft.condition) &&
      (draft.ageMonths === null ||
        (item.ageMonths !== null && item.ageMonths <= draft.ageMonths)) &&
      (draft.quantityKg === null ||
        (item.quantityKg !== null && item.quantityKg >= draft.quantityKg)) &&
      (draft.storageGb === null ||
        (item.storageGb !== null && item.storageGb >= draft.storageGb)) &&
      (draft.cameraMp === null ||
        (item.cameraMp !== null && item.cameraMp >= draft.cameraMp)) &&
      (draft.batteryMah === null ||
        (item.batteryMah !== null && item.batteryMah >= draft.batteryMah)) &&
      (draft.batteryHealthPercent === null ||
        (item.batteryHealthPercent !== null &&
          item.batteryHealthPercent >= draft.batteryHealthPercent)),
  );
}
export const categoryQuestions = {
  phone: [
    "Does it work? List defects and repairs.",
    "What is its age, storage, camera specification and measured battery health? Leave unmeasured facts unknown.",
    "What accessories are included? Is an optional private bill available?",
  ],
  newspaper: [
    "What is the measured weight in kg? Never estimate from a photo.",
    "Is it dry, sorted and free of mixed material?",
    "Which general pickup area works? The server will use a labelled rate per kg later.",
  ],
};
export function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
