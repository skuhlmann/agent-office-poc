import type { Department } from "@/types/domain";

export const departments: Department[] = [
  {
    id: "executive-ops",
    name: "Executive Operations",
    shortName: "EXEC OPS",
    description: "Planning, coordination, and organizational policy.",
    color: "#b866ea",
  },
  {
    id: "product-research",
    name: "Product & Research",
    shortName: "PRODUCT + R&D",
    description: "Product discovery, research, delivery, and knowledge systems.",
    color: "#2fd09a",
  },
  {
    id: "growth-marketing",
    name: "Growth & Marketing",
    shortName: "GROWTH",
    description: "Campaign strategy, content, and market intelligence.",
    color: "#ff3863",
  },
  {
    id: "finance-admin",
    name: "Finance & Administration",
    shortName: "FINANCE",
    description: "Financial reporting, controls, and administration.",
    color: "#f6b84a",
  },
];
