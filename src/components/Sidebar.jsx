// src/components/Sidebar.jsx
const NODE_PALETTE = [
  { type: 'startNode',    icon: '🟢', label: 'Start Node',     color: '#22c55e', desc: 'Entry point' },
  { type: 'taskNode',     icon: '📋', label: 'Task Node',      color: '#60a5fa', desc: 'Human task' },
  { type: 'approvalNode', icon: '✅', label: 'Approval Node',  color: '#a78bfa', desc: 'Manager sign-off' },
  { type: 'automatedNode',icon: '⚡', label: 'Automated Step', color: '#f59e0b', desc: 'System action' },
  { type: 'endNode',      icon: '🔴', label: 'End Node',       color: '#f87171', desc: 'Completion' },
];

export default function Sidebar({ onAddNode }) {
  return (
    <aside style={{
      width: 210,
      background: '#0d1117',
      borderRight: '1px solid #1f2937',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 0',
      gap: 4,
      flexShrink: 0,
    }}>
      <div style={{ padding: '0 16px 12px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#f97316', letterSpacing: 2, textTransform: 'uppercase' }}>Node Palette</div>
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>Click to add to canvas</div>
      </div>

      <div style={{ padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NODE_PALETTE.map(item => (
          <button
            key={item.type}
            onClick={() => onAddNode(item.type)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8,
              background: 'transparent', border: `1px solid ${item.color}22`,
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${item.color}18`; e.currentTarget.style.borderColor = item.color; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${item.color}22`; }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 1 }}>{item.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid #1f2937' }}>
        <div style={{ fontSize: 10, color: '#4b5563', fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
          Connect nodes by dragging<br />from ● to ●
        </div>
      </div>
    </aside>
  );
}
