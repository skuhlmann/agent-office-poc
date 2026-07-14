import type { Agent } from "@/types/domain";

export function shouldRunKnowledgeSearch(agent: Agent, input: string) {
  const normalized = input.toLowerCase();
  return (
    agent.toolIds.includes("knowledge-search") &&
    (normalized.includes("search") || normalized.includes("knowledge") || normalized.includes("research"))
  );
}

export function getMockAgentResponse(agent: Agent, input: string) {
  const normalized = input.toLowerCase();

  if (agent.id === "atlas") {
    if (normalized.includes("onboarding")) {
      return "Three themes recur across the approved research: unclear first-day ownership, too many setup handoffs, and a gap between the welcome flow and the user's first meaningful outcome. I would prioritize ownership clarity first because it appears in both interview notes and support summaries.";
    }
    return "The research library points to a consistent pattern: teams move faster when evidence, ownership, and the next decision are captured together. I can turn the relevant findings into a cited brief if you want to narrow the question.";
  }

  if (agent.id === "forge") {
    return "I would shape this into three phases: validate the target outcome, ship the smallest measurable workflow, and review adoption signals before expanding. The main dependency is agreeing on an owner and success metric for each phase.";
  }

  if (agent.id === "beacon") {
    return "The approved process requires an accountable owner, a documented data scope, and review before any external system receives access. I can help turn your proposed workflow into a review checklist.";
  }

  return `${agent.name} has reviewed the request against its approved context. The best next step is to define the desired outcome, the decision owner, and the evidence the team will use to evaluate the result.`;
}

export function getMeetingResponse(agent: Agent, input: string, index: number) {
  const perspectives: Record<string, string> = {
    atlas:
      "From the research side, the strongest signal is that users need to reach a meaningful outcome earlier. The evidence is stronger around reducing handoffs than adding more guidance.",
    forge:
      "I can translate that into a delivery plan: simplify the first workflow, instrument completion and time-to-value, then test it with a small cohort before expanding.",
    archive:
      "I would also consolidate the onboarding guidance. Several documents cover the same steps, which increases the chance that users and support teams follow different versions.",
    beacon:
      "The workflow is viable as long as ownership and data access are recorded before the pilot begins.",
  };

  return (
    perspectives[agent.id] ??
    `${agent.name} adds perspective ${index + 1}: align the work to “${input.slice(0, 54)}${input.length > 54 ? "…" : ""}” and make the next decision explicit.`
  );
}
