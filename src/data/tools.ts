import type { CredentialMetadata, KnowledgeSource, Tool } from "@/types/domain";

export const tools: Tool[] = [
  {
    id: "knowledge-search",
    name: "Search Knowledge Base",
    description: "Searches approved internal documents and returns cited excerpts.",
    risk: "low",
    credentialId: "company-knowledge",
  },
  {
    id: "issue-planner",
    name: "Draft Project Plan",
    description: "Creates a draft project breakdown without publishing it.",
    risk: "low",
    credentialId: "project-workspace",
  },
  {
    id: "roadmap-reader",
    name: "Read Product Roadmap",
    description: "Reads current roadmap themes, milestones, and ownership.",
    risk: "low",
    credentialId: "project-workspace",
  },
  {
    id: "policy-check",
    name: "Check Operating Policy",
    description: "Checks a proposed action against approved operating policies.",
    risk: "moderate",
    credentialId: "company-knowledge",
  },
  {
    id: "campaign-draft",
    name: "Draft Campaign",
    description: "Creates campaign concepts in the marketing sandbox.",
    risk: "moderate",
    credentialId: "marketing-sandbox",
  },
  {
    id: "finance-query",
    name: "Query Finance Reports",
    description: "Runs read-only queries against approved reporting views.",
    risk: "moderate",
    credentialId: "finance-readonly",
  },
];

export const credentials: CredentialMetadata[] = [
  {
    id: "company-knowledge",
    name: "Company Knowledge Reader",
    service: "Knowledge Hub",
    scope: "Read approved internal documents",
    availability: "available",
  },
  {
    id: "project-workspace",
    name: "Product Workspace",
    service: "Project Tracker",
    scope: "Read projects and create private drafts",
    availability: "available",
  },
  {
    id: "marketing-sandbox",
    name: "Campaign Sandbox",
    service: "Growth Studio",
    scope: "Create drafts; publishing disabled",
    availability: "approval required",
  },
  {
    id: "finance-readonly",
    name: "Finance Reporting Reader",
    service: "Finance Warehouse",
    scope: "Read monthly reporting views",
    availability: "approval required",
  },
];

export const knowledgeSources: KnowledgeSource[] = [
  {
    id: "company-handbook",
    name: "Company Handbook",
    description: "Policies, operating principles, and team practices.",
    freshness: "Updated 2 days ago",
  },
  {
    id: "research-library",
    name: "Research Library",
    description: "Interview notes, market research, and discovery reports.",
    freshness: "Synced 18 min ago",
  },
  {
    id: "product-roadmap",
    name: "Product Roadmap",
    description: "Approved themes, milestones, and current initiatives.",
    freshness: "Synced 1 hour ago",
  },
  {
    id: "finance-reports",
    name: "Finance Reports",
    description: "Monthly reporting views and approved forecast summaries.",
    freshness: "Updated yesterday",
  },
];
