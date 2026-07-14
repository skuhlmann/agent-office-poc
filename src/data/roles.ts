import type { Role } from "@/types/domain";

export const roles: Role[] = [
  {
    id: "operations-lead",
    name: "Operations Lead",
    description: "Coordinates cross-functional work and operational systems.",
  },
  {
    id: "product-builder",
    name: "Product Builder",
    description: "Plans, ships, and improves customer-facing products.",
  },
  {
    id: "researcher",
    name: "Researcher",
    description: "Investigates company knowledge and external signals.",
  },
  {
    id: "growth-marketer",
    name: "Growth Marketer",
    description: "Creates and evaluates campaigns and growth experiments.",
  },
  {
    id: "finance-analyst",
    name: "Finance Analyst",
    description: "Works with approved financial systems and reporting data.",
  },
];
