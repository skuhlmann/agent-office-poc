export type AgentStatus = "online" | "busy" | "offline";
export type AccessState = "granted" | "restricted" | "pending";

export type Role = {
  id: string;
  name: string;
  description: string;
};

export type Department = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
};

export type TokenPolicy = {
  dailyLimit: number;
};

export type Agent = {
  id: string;
  name: string;
  initials: string;
  title: string;
  summary: string;
  departmentId: string;
  allowedRoleIds: string[];
  status: AgentStatus;
  publicCapabilities: string[];
  capabilities: string[];
  toolIds: string[];
  credentialIds: string[];
  knowledgeSourceIds: string[];
  defaultTokenPolicy: TokenPolicy;
  suggestedPrompts: string[];
};

export type User = {
  id: string;
  name: string;
  initials: string;
  title: string;
  roleIds: string[];
  tokenOverrides?: Record<string, TokenPolicy>;
};

export type Tool = {
  id: string;
  name: string;
  description: string;
  risk: "low" | "moderate";
  credentialId?: string;
};

export type CredentialMetadata = {
  id: string;
  name: string;
  service: string;
  scope: string;
  availability: "available" | "approval required";
};

export type KnowledgeSource = {
  id: string;
  name: string;
  description: string;
  freshness: string;
};

export type AccessRequest = {
  id: string;
  userId: string;
  agentId: string;
  reason: string;
  status: "pending";
  createdAt: string;
};

export type ToolRun = {
  id: string;
  toolId: string;
  input: string;
  status: "running" | "completed";
  result?: string;
  sources?: string[];
};

export type Message = {
  id: string;
  senderType: "user" | "agent" | "system";
  senderId: string;
  content: string;
  createdAt: string;
  toolRun?: ToolRun;
};

export type Meeting = {
  participantAgentIds: string[];
  messages: Message[];
};
