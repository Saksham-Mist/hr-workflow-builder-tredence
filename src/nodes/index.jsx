// src/nodes/index.jsx
import { Handle, Position } from 'reactflow';

const handleStyle = { background: '#f97316', border: 'none', width: 10, height: 10 };

// ─── Base wrapper ───────────────────────────────────────────────────────────
function NodeBase({ color, icon, label, sublabel, hasSource = true, hasTarget = true, selected }) {
  return (
    <div style={{
      background: '#111827',
      border: `2px solid ${selected ? '#f97316' : color}`,
      borderRadius: 10,
      padding: '10px 16px',
      minWidth: 160,
      boxShadow: selected ? `0 0 0 3px ${color}33` : '0 2px 12px #0008',
      transition: 'all 0.15s',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {hasTarget && <Handle type="target" position={Position.Top} style={handleStyle} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 12, color: color, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
          <div style={{ fontSize: 13, color: '#e5e7eb', fontWeight: 500, marginTop: 2 }}>{sublabel || '—'}</div>
        </div>
      </div>
      {hasSource && <Handle type="source" position={Position.Bottom} style={handleStyle} />}
    </div>
  );
}

export function StartNode({ data, selected }) {
  return <NodeBase color="#22c55e" icon="🟢" label="Start" sublabel={data.title} hasTarget={false} selected={selected} />;
}

export function TaskNode({ data, selected }) {
  const subtitle = data.assignee
    ? `${data.title} • ${data.assignee}`
    : data.title;

  return (
    <NodeBase
      color="#60a5fa"
      icon="📋"
      label="Task"
      sublabel={subtitle}
      selected={selected}
    />
  );
}

export function ApprovalNode({ data, selected }) {
  return <NodeBase color="#a78bfa" icon="✅" label="Approval" sublabel={data.title} selected={selected} />;
}

export function AutomatedNode({ data, selected }) {
  return <NodeBase color="#f59e0b" icon="⚡" label="Automated" sublabel={data.title} selected={selected} />;
}

export function EndNode({ data, selected }) {
  return <NodeBase color="#f87171" icon="🔴" label="End" sublabel={data.title} hasSource={false} selected={selected} />;
}

export const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
};
