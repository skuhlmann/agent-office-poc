"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  MarkerType,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Bot, Building2, DoorOpen, UserRound } from "lucide-react";
import { departments } from "@/data/departments";
import { roles } from "@/data/roles";
import { currentUser } from "@/data/users";
import { getAccessState } from "@/lib/access-policy";
import { cn } from "@/lib/utils";
import { useDemo } from "@/providers/demo-state-provider";
import type { AccessState, Agent, Department } from "@/types/domain";
import { AccessStatus } from "@/components/access/access-status";
import { Badge } from "@/components/ui/badge";

type AgentNodeData = { agent: Agent; accessState: AccessState };
type AgentFlowNode = Node<AgentNodeData, "agent">;
type DepartmentNodeData = { department: Department; count: number };
type DepartmentFlowNode = Node<DepartmentNodeData, "department">;
type UserNodeData = { name: string; title: string; roleNames: string[] };
type UserFlowNode = Node<UserNodeData, "user">;

function AgentNode({ data, selected }: NodeProps<AgentFlowNode>) {
  const { agent, accessState } = data;
  const role = roles.find((candidate) => agent.allowedRoleIds.includes(candidate.id));

  return (
    <div
      className={cn(
        "group relative w-[224px] border bg-card/95 p-3.5 text-left shadow-[0_12px_30px_-20px_rgba(0,0,0,.9)] transition-all",
        accessState === "granted" && "border-primary/35 hover:border-primary/70",
        accessState === "pending" && "border-amber-400/30 hover:border-amber-300/60",
        accessState === "restricted" && "border-border hover:border-muted-foreground/50",
        selected && "ring-1 ring-primary",
      )}
    >
      <Handle type="target" position={Position.Top} className="!size-1.5 !border-0 !bg-muted-foreground" />
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "relative flex size-9 shrink-0 items-center justify-center border font-heading text-xs font-semibold",
            accessState === "granted" && "border-primary/30 bg-primary/10 text-primary",
            accessState === "pending" && "border-amber-400/30 bg-amber-400/10 text-amber-300",
            accessState === "restricted" && "border-border bg-muted/60 text-muted-foreground",
          )}
        >
          {agent.initials}
          <span
            className={cn(
              "absolute -bottom-1 -right-1 size-2 border border-card",
              agent.status === "online" && "bg-primary",
              agent.status === "busy" && "bg-amber-400",
              agent.status === "offline" && "bg-muted-foreground",
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-heading text-sm font-semibold">{agent.name}</h3>
            <AccessStatus state={accessState} compact />
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{agent.title}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t pt-2.5">
        <Badge variant="outline" className="max-w-[145px] truncate">{role?.name}</Badge>
        <DoorOpen className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <Handle type="source" position={Position.Bottom} className="!size-1.5 !border-0 !bg-primary/50" />
    </div>
  );
}

function DepartmentNode({ data }: NodeProps<DepartmentFlowNode>) {
  const { department, count } = data;
  return (
    <div className="w-[250px] border bg-background/95 px-4 py-3">
      <Handle type="target" position={Position.Top} className="!size-1.5 !border-0" style={{ background: department.color }} />
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center border bg-card" style={{ borderColor: `${department.color}55`, color: department.color }}>
          <Building2 className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-heading text-xs font-semibold uppercase tracking-wider">{department.name}</h2>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{count} deployed agent{count === 1 ? "" : "s"}</p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${department.color}88, transparent)` }} />
      <Handle type="source" position={Position.Bottom} className="!size-1.5 !border-0" style={{ background: department.color }} />
    </div>
  );
}

function UserNode({ data }: NodeProps<UserFlowNode>) {
  return (
    <div className="group relative w-[270px] border border-secondary/35 bg-card/95 p-4 shadow-[0_0_30px_-20px_#ff3863] transition-colors hover:border-secondary/70">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center border border-secondary/30 bg-secondary/10 font-heading text-xs font-semibold text-secondary">
          {currentUser.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-secondary">
            <UserRound className="size-3" /> My office
          </div>
          <h2 className="mt-1 font-heading text-sm font-semibold">{data.name}</h2>
          <p className="truncate text-[10px] text-muted-foreground">{data.title}</p>
        </div>
        <DoorOpen className="size-4 text-muted-foreground transition-colors group-hover:text-secondary" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1 border-t pt-2.5">
        {data.roleNames.map((roleName) => (
          <Badge key={roleName} variant="secondary">{roleName}</Badge>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} className="!size-2 !border-0 !bg-secondary" />
    </div>
  );
}

const nodeTypes = {
  agent: AgentNode,
  department: DepartmentNode,
  user: UserNode,
};

export function OrganizationChart({ agents: visibleAgents }: { agents: Agent[] }) {
  const router = useRouter();
  const { requests, selectAgent } = useDemo();

  const { nodes, edges } = useMemo(() => {
    const visibleDepartments = departments.filter((department) =>
      visibleAgents.some((agent) => agent.departmentId === department.id),
    );
    const departmentSpacing = 520;
    const totalWidth = Math.max(0, (visibleDepartments.length - 1) * departmentSpacing);

    const nextNodes: Node[] = [
      {
        id: "my-office",
        type: "user",
        position: { x: totalWidth / 2, y: 0 },
        data: {
          name: currentUser.name,
          title: currentUser.title,
          roleNames: roles.filter((role) => currentUser.roleIds.includes(role.id)).map((role) => role.name),
        },
      },
    ];
    const nextEdges: Edge[] = [];

    visibleDepartments.forEach((department, departmentIndex) => {
      const departmentAgents = visibleAgents.filter((agent) => agent.departmentId === department.id);
      const departmentX = departmentIndex * departmentSpacing;
      nextNodes.push({
        id: `department-${department.id}`,
        type: "department",
        position: { x: departmentX + 10, y: 185 },
        data: { department, count: departmentAgents.length },
        draggable: false,
      });
      nextEdges.push({
        id: `office-${department.id}`,
        source: "my-office",
        target: `department-${department.id}`,
        type: "smoothstep",
        style: { stroke: `${department.color}77`, strokeWidth: 1.25 },
        markerEnd: { type: MarkerType.ArrowClosed, color: `${department.color}99`, width: 12, height: 12 },
      });

      departmentAgents.forEach((agent, agentIndex) => {
        const offset = (agentIndex - (departmentAgents.length - 1) / 2) * 244;
        nextNodes.push({
          id: `agent-${agent.id}`,
          type: "agent",
          position: { x: departmentX + 22 + offset, y: 385 + (agentIndex % 2) * 148 },
          data: { agent, accessState: getAccessState(currentUser, agent, requests) },
        });
        nextEdges.push({
          id: `${department.id}-${agent.id}`,
          source: `department-${department.id}`,
          target: `agent-${agent.id}`,
          type: "smoothstep",
          style: { stroke: `${department.color}66`, strokeWidth: 1 },
        });
      });
    });

    return { nodes: nextNodes, edges: nextEdges };
  }, [visibleAgents, requests]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.22, maxZoom: 1 }}
      minZoom={0.38}
      maxZoom={1.35}
      nodesConnectable={false}
      nodesDraggable={false}
      onNodeClick={(_, node) => {
        if (node.id === "my-office") router.push("/office");
        if (node.type === "agent") selectAgent(node.id.replace("agent-", ""));
      }}
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={32} size={1} color="hsl(240 10% 16%)" />
      <Controls position="bottom-left" showInteractive={false} />
      <MiniMap
        position="bottom-right"
        pannable
        zoomable
        nodeStrokeWidth={2}
        nodeColor={(node) => {
          if (node.type === "user") return "#ff3863";
          if (node.type === "department") return "#b866ea";
          return "#2fd09a";
        }}
        maskColor="rgba(6, 6, 9, .72)"
      />
    </ReactFlow>
  );
}
