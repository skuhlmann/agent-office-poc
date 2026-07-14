import type { AccessRequest, AccessState, Agent, TokenPolicy, User } from "@/types/domain";

export function canAccessAgent(user: User, agent: Agent) {
  return agent.allowedRoleIds.some((roleId) => user.roleIds.includes(roleId));
}

export function getAccessState(
  user: User,
  agent: Agent,
  requests: AccessRequest[],
): AccessState {
  if (canAccessAgent(user, agent)) return "granted";
  if (requests.some((request) => request.userId === user.id && request.agentId === agent.id)) {
    return "pending";
  }
  return "restricted";
}

export function getEffectiveTokenPolicy(user: User, agent: Agent): TokenPolicy {
  return user.tokenOverrides?.[agent.id] ?? agent.defaultTokenPolicy;
}

export function canSendMessage(user: User, agent: Agent, usage: number) {
  return (
    canAccessAgent(user, agent) &&
    agent.status !== "offline" &&
    usage < getEffectiveTokenPolicy(user, agent).dailyLimit
  );
}
