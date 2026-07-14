# Agent Office POC

Agent Office is a frontend-only proof of concept for discovering and collaborating with the AI agents deployed across an organization. It demonstrates the employee experience: browsing an agent org chart, understanding role-based access, requesting access, chatting with an authorized agent, and inviting agents or departments into a meeting.

All authentication, authorization, conversations, token usage, access requests, and tool execution are simulated. No organizational data or secrets leave the browser.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production validation:

```bash
npm run lint
npm run build
npm start
```

## Recommended demo

1. Start on the organization map and point out the department hierarchy, agent status, role label, and access state.
2. Open **Atlas**, switch to **Capabilities**, and review Maya's token budget, tools, knowledge context, and credential metadata.
3. Open **Chat** and select “Search our knowledge base for onboarding friction.” Atlas simulates an approved knowledge-base tool run and returns a cited synthesis.
4. Open **Ledger**, explain the safe public summary, and submit an access request. The office and chart change to a pending state.
5. Open **My Office** and review Maya's roles, per-agent usage, and pending requests.
6. Invite **Product & Research** to the meeting. Atlas and Forge join; Archive remains unavailable because it is offline.
7. Use the suggested onboarding prompt. The agents respond sequentially and visibly hand the work from research to planning.
8. Use **Reset demo** to restore the initial state.

## Mock policy

- Maya has the `Product Builder` and `Researcher` roles.
- Possessing any role allowed by an agent grants access to that agent.
- The agent then defines the tools, credential scopes, knowledge context, and daily token budget available to Maya.
- Token budgets are per user, per agent, per day, with an optional override.
- Restricted users see only the safe public brief and may create a pending request.
- Credential metadata is visible to authorized users, but secret values are never modeled or displayed.
- Offline agents remain visible but cannot chat or join meetings.

Demo state is persisted in `localStorage` under `agent-office-demo-v1`.

## Project structure

```text
src/
  app/                   # Organization and My Office routes
  components/
    access/              # Access indicators
    agent-office/        # Agent control panel and one-to-one chat
    app-shell/           # Global navigation
    chat/                # Shared message and tool-run UI
    org-chart/           # React Flow graph and mobile list
    ui/                  # Reusable shadcn-style primitives
  data/                  # Typed mock organization fixtures
  lib/                   # Policy, mock chat/tool, and persistence helpers
  providers/             # Shared demo state and interactions
  types/                 # Domain model
```

## Intentional limitations

- No real authentication or security boundary
- No admin or approval workflow
- No role, policy, or agent configuration editor
- No model, agent, tool, knowledge-base, or credential integrations
- No database or server-side persistence
- No production usage metering, audit log, or billing

See [PLAN.md](./PLAN.md) for the complete product and implementation plan.
