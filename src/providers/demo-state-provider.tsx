"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { agents } from "@/data/agents";
import { departments } from "@/data/departments";
import { currentUser } from "@/data/users";
import { canAccessAgent, canSendMessage } from "@/lib/access-policy";
import {
  getMeetingResponse,
  getMockAgentResponse,
  shouldRunKnowledgeSearch,
} from "@/lib/mock-chat";
import {
  clearDemoState,
  loadDemoState,
  saveDemoState,
  type PersistedDemoState,
} from "@/lib/storage";
import { createId } from "@/lib/utils";
import type { AccessRequest, Message } from "@/types/domain";

const initialState: PersistedDemoState = {
  requests: [
    {
      id: "request-pulse-demo",
      userId: currentUser.id,
      agentId: "pulse",
      reason: "Collaborate on the onboarding launch campaign.",
      status: "pending",
      createdAt: "2026-07-14T15:20:00.000Z",
    },
  ],
  usage: {
    atlas: 3240,
    forge: 1870,
    archive: 420,
    beacon: 760,
  },
  conversations: {},
  meeting: {
    participantAgentIds: [],
    messages: [],
  },
};

type DemoContextValue = PersistedDemoState & {
  selectedAgentId: string | null;
  busyAgentId: string | null;
  busyMeetingAgentId: string | null;
  isHydrated: boolean;
  selectAgent: (agentId: string | null) => void;
  requestAccess: (agentId: string, reason: string) => void;
  sendAgentMessage: (agentId: string, input: string) => Promise<void>;
  toggleMeetingParticipant: (agentId: string) => void;
  inviteDepartment: (departmentId: string) => number;
  sendMeetingMessage: (input: string) => Promise<void>;
  endMeeting: () => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function estimateTokens(input: string, output: string) {
  return Math.max(80, Math.ceil((input.length + output.length) / 3.5));
}

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<AccessRequest[]>(initialState.requests);
  const [usage, setUsage] = useState<Record<string, number>>(initialState.usage);
  const [conversations, setConversations] = useState<Record<string, Message[]>>(
    initialState.conversations,
  );
  const [meeting, setMeeting] = useState(initialState.meeting);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [busyAgentId, setBusyAgentId] = useState<string | null>(null);
  const [busyMeetingAgentId, setBusyMeetingAgentId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = loadDemoState();
    if (saved) {
      setRequests(saved.requests ?? initialState.requests);
      setUsage(saved.usage ?? initialState.usage);
      setConversations(saved.conversations ?? initialState.conversations);
      setMeeting(saved.meeting ?? initialState.meeting);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveDemoState({ requests, usage, conversations, meeting });
  }, [requests, usage, conversations, meeting, isHydrated]);

  function requestAccess(agentId: string, reason: string) {
    if (requests.some((request) => request.agentId === agentId)) return;
    setRequests((current) => [
      ...current,
      {
        id: createId("request"),
        userId: currentUser.id,
        agentId,
        reason,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  async function sendAgentMessage(agentId: string, input: string) {
    const agent = agents.find((candidate) => candidate.id === agentId);
    const cleanInput = input.trim();
    if (!agent || !cleanInput || busyAgentId) return;
    if (!canSendMessage(currentUser, agent, usage[agent.id] ?? 0)) return;

    const userMessage: Message = {
      id: createId("message"),
      senderType: "user",
      senderId: currentUser.id,
      content: cleanInput,
      createdAt: new Date().toISOString(),
    };

    setConversations((current) => ({
      ...current,
      [agentId]: [...(current[agentId] ?? []), userMessage],
    }));
    setBusyAgentId(agentId);

    const response = getMockAgentResponse(agent, cleanInput);
    const runsTool = shouldRunKnowledgeSearch(agent, cleanInput);
    const responseId = createId("message");

    if (runsTool) {
      await wait(450);
      const runningMessage: Message = {
        id: responseId,
        senderType: "agent",
        senderId: agent.id,
        content: "Searching approved company knowledge…",
        createdAt: new Date().toISOString(),
        toolRun: {
          id: createId("tool-run"),
          toolId: "knowledge-search",
          input: cleanInput.slice(0, 120),
          status: "running",
        },
      };
      setConversations((current) => ({
        ...current,
        [agentId]: [...(current[agentId] ?? []), runningMessage],
      }));
      await wait(850);
      setConversations((current) => ({
        ...current,
        [agentId]: (current[agentId] ?? []).map((message) =>
          message.id === responseId
            ? {
                ...message,
                content: response,
                toolRun: {
                  ...message.toolRun!,
                  status: "completed" as const,
                  result: "Found 7 relevant entries across approved research and handbook sources.",
                  sources: ["Research Library", "Company Handbook"],
                },
              }
            : message,
        ),
      }));
    } else {
      await wait(700);
      setConversations((current) => ({
        ...current,
        [agentId]: [
          ...(current[agentId] ?? []),
          {
            id: responseId,
            senderType: "agent",
            senderId: agent.id,
            content: response,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    }

    setUsage((current) => ({
      ...current,
      [agentId]: (current[agentId] ?? 0) + estimateTokens(cleanInput, response),
    }));
    setBusyAgentId(null);
  }

  function toggleMeetingParticipant(agentId: string) {
    const agent = agents.find((candidate) => candidate.id === agentId);
    if (!agent || !canAccessAgent(currentUser, agent) || agent.status === "offline") return;

    setMeeting((current) => ({
      ...current,
      participantAgentIds: current.participantAgentIds.includes(agentId)
        ? current.participantAgentIds.filter((id) => id !== agentId)
        : [...current.participantAgentIds, agentId],
    }));
  }

  function inviteDepartment(departmentId: string) {
    const eligible = agents
      .filter(
        (agent) =>
          agent.departmentId === departmentId &&
          canAccessAgent(currentUser, agent) &&
          agent.status !== "offline",
      )
      .map((agent) => agent.id);

    setMeeting((current) => ({
      ...current,
      participantAgentIds: Array.from(new Set([...current.participantAgentIds, ...eligible])),
    }));
    return eligible.length;
  }

  async function sendMeetingMessage(input: string) {
    const cleanInput = input.trim();
    if (!cleanInput || busyMeetingAgentId || meeting.participantAgentIds.length === 0) return;

    const participantIds = [...meeting.participantAgentIds];
    setMeeting((current) => ({
      ...current,
      messages: [
        ...current.messages,
        {
          id: createId("meeting-message"),
          senderType: "user",
          senderId: currentUser.id,
          content: cleanInput,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    for (const [index, agentId] of participantIds.entries()) {
      const agent = agents.find((candidate) => candidate.id === agentId);
      if (!agent) continue;
      setBusyMeetingAgentId(agent.id);
      await wait(600 + index * 150);
      const response = getMeetingResponse(agent, cleanInput, index);
      setMeeting((current) => ({
        ...current,
        messages: [
          ...current.messages,
          {
            id: createId("meeting-message"),
            senderType: "agent",
            senderId: agent.id,
            content: response,
            createdAt: new Date().toISOString(),
            toolRun:
              agent.id === "atlas" && shouldRunKnowledgeSearch(agent, cleanInput)
                ? {
                    id: createId("meeting-tool-run"),
                    toolId: "knowledge-search",
                    input: cleanInput.slice(0, 120),
                    status: "completed",
                    result: "Reviewed 7 approved knowledge entries before responding.",
                    sources: ["Research Library", "Company Handbook"],
                  }
                : undefined,
          },
        ],
      }));
      setUsage((current) => ({
        ...current,
        [agent.id]: (current[agent.id] ?? 0) + estimateTokens(cleanInput, response),
      }));
    }
    setBusyMeetingAgentId(null);
  }

  function endMeeting() {
    setMeeting({ participantAgentIds: [], messages: [] });
    setBusyMeetingAgentId(null);
  }

  function resetDemo() {
    clearDemoState();
    setRequests(initialState.requests);
    setUsage(initialState.usage);
    setConversations(initialState.conversations);
    setMeeting(initialState.meeting);
    setSelectedAgentId(null);
    setBusyAgentId(null);
    setBusyMeetingAgentId(null);
  }

  const value = useMemo<DemoContextValue>(
    () => ({
      requests,
      usage,
      conversations,
      meeting,
      selectedAgentId,
      busyAgentId,
      busyMeetingAgentId,
      isHydrated,
      selectAgent: setSelectedAgentId,
      requestAccess,
      sendAgentMessage,
      toggleMeetingParticipant,
      inviteDepartment,
      sendMeetingMessage,
      endMeeting,
      resetDemo,
    }),
    // Action functions intentionally close over current demo state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requests, usage, conversations, meeting, selectedAgentId, busyAgentId, busyMeetingAgentId, isHydrated],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoStateProvider");
  return context;
}

export const demoDepartments = departments;
