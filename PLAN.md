# Agent Office — Proof of Concept Plan

## Product goal

Build a frontend-only proof of concept that shows how an employee discovers and interacts with AI agents deployed across their organization.

The application will visualize agents in an organizational chart, explain how roles govern access, let an employee inspect an agent's capabilities, and demonstrate both one-to-one agent chat and a multi-agent meeting from the employee's own office.

The POC will mock authentication, authorization, token usage, access requests, chat responses, and tool execution. It will not implement real security, credentials, model APIs, or a database.

## Confirmed product decisions

- The POC covers the employee experience only. Administrative role editing, policy management, and access-request approval are out of scope.
- A user may have multiple roles.
- An agent may be accessible to multiple roles; having any permitted role grants access.
- Roles grant access to agents.
- Each agent defines the capabilities, tools, knowledge context, credential scopes, and token budget available to a particular user when using that agent.
- Effective access and capabilities are the intersection of the user's roles and the selected agent's configuration.
- Token limits are modeled per user, per agent, per day, with optional user-specific overrides.
- Users without access can see a safe summary of an agent's capabilities, but not sensitive context or credential details.
- Credential displays include metadata such as service, name, scope, and availability, but never secret values.
- Access requests are simulated and move from `restricted` to `pending`; no approval interface is required.
- Tool execution will include one simple mocked example to illustrate the experience.
- Agent groups behave like organizational departments.
- The organizational chart uses departments as its hierarchy and may use subtle secondary connections to show common agent collaboration.
- The graph experience is optimized for desktop and tablet. Mobile uses a searchable list rather than the full graph canvas.

## Technical approach

### Foundation

Create a new Next.js App Router application in this directory using:

- Next.js 15, React, and TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide icons
- `@xyflow/react` for the interactive organization chart
- Browser `localStorage` for persisting mocked demo state

Reuse the visual foundation from:

`/home/skuhl/Documents/ody/raidguild/ai-solutions-website`

Specifically reuse or adapt:

- Global color tokens and utility classes from `src/index.css`
- Space Grotesk, Inter, and JetBrains Mono typography
- Tailwind configuration and path aliases
- The dark, technical, neon-accented design direction
- Selected shadcn components rather than copying the entire marketing application

Likely shadcn components include `Button`, `Card`, `Badge`, `Avatar`, `Sheet`, `Tabs`, `Progress`, `Tooltip`, `ScrollArea`, `Dialog`, `Textarea`, `Input`, `Select`, `Checkbox`, `Separator`, and `Sonner`.

### Application state

Use a React context/provider for:

- Current mock user
- Selected agent
- Access requests
- Token usage
- Agent conversations
- Meeting participants and messages
- Mock tool execution state

Persist access requests, usage, and conversations to `localStorage` so the demo survives refreshes. Include a reset-demo action.

No state-management library, server API, authentication system, or database is needed.

## Core demo flows

### 1. Explore the organization

1. The employee enters Agent Office.
2. They see agents organized by department in an interactive org chart.
3. Each agent node shows its name, purpose, department, status, governing role labels, and the employee's access state.
4. The employee can pan, zoom, search, and filter the chart.
5. Selecting an agent opens that agent's office in a right-side control panel.

### 2. Inspect an accessible agent

1. The employee opens an agent for which they hold an allowed role.
2. The control panel shows the agent's purpose, capabilities, tools, token budget and usage, knowledge sources, and credential metadata.
3. The employee opens the Chat tab and sends a message.
4. The agent returns a deterministic mocked response.
5. One suggested prompt triggers a simulated tool call with visible progress and a result card.
6. Token usage increases after the response.

### 3. Request access to a restricted agent

1. The employee opens an agent they cannot access.
2. They see a safe summary of what the agent does and which role is required.
3. Chat, sensitive context, and credential details remain unavailable.
4. The employee enters a reason and submits an access request.
5. The interface changes the agent and control panel to a `pending` state.

The POC does not include approval or automatic access granting.

### 4. Hold a meeting in My Office

1. The employee opens their own office.
2. They review their roles, accessible agents, token allowances, and pending requests.
3. They invite an individual agent or select a department as a group.
4. The meeting workspace displays the invited participants.
5. The employee sends a prompt to the meeting.
6. Agents respond sequentially with visible handoffs.
7. One agent may show the simple mocked tool execution as part of its response.
8. The employee ends or clears the meeting.

## Main application surfaces

### Organization view

A full-height application shell containing:

- Organization name and Agent Office branding
- Current employee identity and role summary
- Link or button for My Office
- Interactive agent organization chart
- Search by agent, department, or role
- Filters for department, access state, and online status
- Legend for accessible, restricted, pending, busy, and offline states
- Pan, zoom, and fit-to-screen controls
- Reset-demo action

Agent nodes should use teal for accessible/active states, restrained magenta for secondary emphasis, and muted treatments for restricted or offline states.

### Agent office control panel

Open the selected agent in a shadcn `Sheet` or persistent right-side panel with three tabs:

#### Overview

- Agent identity, purpose, department, and status
- Governing/access roles
- Employee access state
- Safe capability summary
- Suggested prompts

#### Capabilities

- Token allowance and mocked daily usage meter
- Available tools
- Knowledge sources
- Credential names, services, scopes, and availability
- Restricted messaging where details are unavailable

#### Chat

- Available only when the employee has access
- Conversation history
- Suggested prompts
- Deterministic mocked responses
- Simulated response delay
- Mock tool-call activity card
- Token usage updates
- Disabled state once the mocked daily limit is reached

### My Office

A dedicated employee workspace containing:

- Employee profile
- Assigned roles
- Accessible agents grouped by department
- Per-agent token allowances and usage
- Pending access requests
- Agent and department invitation picker
- Meeting participant list
- Shared meeting chat
- Mock agent handoffs and tool activity
- End-meeting and clear-session controls

### Mobile experience

Replace the graph canvas with a searchable and filterable agent list. Selecting an item opens the same agent office panel used on larger screens.

## Mock domain model

```ts
type Role = {
  id: string;
  name: string;
  description: string;
};

type Department = {
  id: string;
  name: string;
  description: string;
  leadAgentId?: string;
};

type Agent = {
  id: string;
  name: string;
  title: string;
  summary: string;
  departmentId: string;
  allowedRoleIds: string[];
  status: "online" | "busy" | "offline";
  capabilities: string[];
  toolIds: string[];
  credentialIds: string[];
  knowledgeSourceIds: string[];
  defaultTokenPolicy: TokenPolicy;
  suggestedPrompts: string[];
};

type User = {
  id: string;
  name: string;
  title: string;
  roleIds: string[];
  tokenOverrides?: Record<string, TokenPolicy>;
};

type TokenPolicy = {
  dailyLimit: number;
};

type AccessRequest = {
  id: string;
  userId: string;
  agentId: string;
  reason: string;
  status: "pending";
  createdAt: string;
};
```

Also define types for `Tool`, `CredentialMetadata`, `KnowledgeSource`, `Conversation`, `Message`, `Meeting`, and `ToolRun`.

Centralize policy calculations in pure functions:

```ts
canAccessAgent(user, agent)
getEffectiveTokenPolicy(user, agent)
getVisibleAgentDetails(user, agent)
getAvailableTools(user, agent)
```

Even though authorization is mocked, UI components should use these policy functions consistently instead of duplicating access conditions.

## Suggested demo dataset

Create enough data to exercise every state without making the chart difficult to scan:

- 1 primary employee persona
- 4 departments
- 6–8 agents
- 5 roles
- 6–8 tools
- 4 knowledge sources
- 3 credential scopes

Suggested departments:

- Executive Operations
- Product and Research
- Growth and Marketing
- Finance and Administration

The primary employee should have access to several agents, lack access to at least two, and have one existing pending request. Include agents that are online, busy, and offline.

Example simple tool demonstration:

- A Research Agent exposes a `Search Knowledge Base` tool.
- A suggested prompt triggers a simulated tool run.
- The UI shows the tool name, sanitized input, progress state, and a short mocked result with source labels.
- No external service or real organizational data is used.

## Proposed project structure

```text
src/
  app/
    layout.tsx
    page.tsx
    office/
      page.tsx
  components/
    app-shell/
    org-chart/
    agent-office/
    user-office/
    chat/
    access/
    ui/
  data/
    agents.ts
    departments.ts
    users.ts
    roles.ts
    tools.ts
    knowledge.ts
  lib/
    access-policy.ts
    mock-chat.ts
    mock-tool-runner.ts
    storage.ts
    utils.ts
  providers/
    demo-state-provider.tsx
  types/
    domain.ts
  index.css
```

## Implementation phases

### Phase 1: Scaffold and design foundation — 0.5 day

- Scaffold the Next.js App Router project.
- Port the reference app's Tailwind theme, global styles, fonts, aliases, and selected shadcn components.
- Add `@xyflow/react`.
- Build the responsive application shell.
- Establish lint and production-build commands.

### Phase 2: Mock data and policy layer — 0.5 day

- Define domain types.
- Create the employee, role, department, agent, tool, credential, and knowledge-source fixtures.
- Implement access, visibility, and token-policy functions.
- Add the demo state provider and `localStorage` persistence.

### Phase 3: Organization chart — 1 day

- Build custom department, agent, and employee nodes.
- Add hierarchy and restrained collaboration edges.
- Add access and status treatments.
- Add search, filters, legend, pan, zoom, and fit-to-screen controls.
- Add the mobile list alternative.
- Open the selected agent's office from a node or list item.

### Phase 4: Agent office — 1 day

- Build Overview, Capabilities, and Chat tabs.
- Display access state, tools, token allowance, knowledge, and credential metadata.
- Enforce restricted and token-limit UI states through the policy helpers.
- Implement the mocked access-request form and pending state.
- Implement deterministic chat responses and token-use updates.
- Add the single mocked tool-run example.

### Phase 5: My Office and meetings — 1 day

- Display the employee's profile, roles, accessible agents, usage, and pending requests.
- Build individual-agent and department invitation controls.
- Implement the multi-agent meeting chat.
- Simulate sequential responses, handoffs, and optional tool activity.
- Add end-meeting, clear-session, and reset-demo actions.

### Phase 6: Demo polish and validation — 0.5–1 day

- Add loading, empty, failure, busy, offline, restricted, and token-exhausted states.
- Add restrained motion and selected-node highlighting.
- Check keyboard navigation, focus management, and color contrast.
- Validate desktop, tablet, and mobile layouts.
- Run lint and a production build.
- Add a README with setup instructions, a demo script, and POC limitations.

Estimated implementation time: 4–5 focused development days.

## Acceptance criteria

The proof of concept is complete when:

- The organization view clearly communicates agents, departments, roles, status, and employee access.
- The employee can search and filter agents.
- Every agent opens a populated office control panel.
- The policy layer consistently determines accessible and restricted states.
- Restricted employees cannot chat, run tools, or see sensitive metadata.
- An access request changes an agent from restricted to pending and persists after refresh.
- Authorized employees can chat with an agent and see deterministic mocked responses.
- The Research Agent can demonstrate one mocked knowledge-base tool run.
- Chat and tool use update the agent's mocked daily token usage.
- Reaching a token limit disables further interaction and explains why.
- My Office displays the employee's roles, accessible agents, usage, and requests.
- The employee can invite one agent or an entire department to a meeting.
- A meeting visibly demonstrates multiple agent responses and handoffs.
- Mobile users receive a usable searchable list in place of the graph.
- Demo state can be reset.
- `npm run lint` and `npm run build` pass.

## Explicitly out of scope

- Real authentication or authorization enforcement
- Admin dashboards or access-request approval
- Role, policy, or agent configuration editors
- Real LLM or agent API calls
- Real tools, knowledge bases, or credentials
- Database or server persistence
- Production audit logging
- Production security guarantees
- Usage billing or accurate token accounting

## Demo narrative

The recommended presentation should tell one continuous employee story:

1. Begin on the organization chart and explain that every deployed agent has a visible place in the organization.
2. Open an accessible Research Agent and inspect its role requirements, tools, context, and token allowance.
3. Chat with it and trigger the mocked knowledge-base search to demonstrate governed tool use.
4. Open a restricted Finance Agent and submit an access request, showing that discovery does not imply access.
5. Enter My Office, review the employee's roles, and invite the Product and Research department to a meeting.
6. Ask the group a question and show agents responding and handing work to one another.
7. End by emphasizing that Agent Office makes organizational agents, permissions, capabilities, and collaboration legible from the employee's point of view.
