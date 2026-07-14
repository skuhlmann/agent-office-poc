import type { AccessRequest, Meeting, Message } from "@/types/domain";

export const STORAGE_KEY = "agent-office-demo-v1";

export type PersistedDemoState = {
  requests: AccessRequest[];
  usage: Record<string, number>;
  conversations: Record<string, Message[]>;
  meeting: Meeting;
};

export function loadDemoState(): PersistedDemoState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedDemoState) : null;
  } catch {
    return null;
  }
}

export function saveDemoState(state: PersistedDemoState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The demo continues in memory if browser storage is unavailable.
  }
}

export function clearDemoState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // No-op when browser storage is unavailable.
  }
}
