

import { useEffect, useState } from 'react';
import { getAutomations } from '../api/mockApi';

const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'CEO'];

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 10, color: '#9ca3af', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5, fontFamily: "'DM Mono', monospace" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '7px 10px', background: '#0d1117',
  border: '1px solid #374151', borderRadius: 6, color: '#e5e7eb',
  fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle = { ...inputStyle };

// ─── KV Editor for metadata/customFields ────────────────────────────────────
function KVEditor({ pairs = [], onChange }) {
  const add = () => onChange([...pairs, { key: '', value: '' }]);
  const remove = i => onChange(pairs.filter((_, idx) => idx !== i));
  const update = (i, field, val) => onChange(pairs.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  return (
    <div>
      {pairs.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <input style={{ ...inputStyle, flex: 1 }} placeholder="key" value={p.key} onChange={e => update(i, 'key', e.target.value)} />
          <input style={{ ...inputStyle, flex: 1 }} placeholder="value" value={p.value} onChange={e => update(i, 'value', e.target.value)} />
          <button onClick={() => remove(i)} style={{ background: '#991b1b', border: 'none', borderRadius: 4, color: '#fff', padding: '0 8px', cursor: 'pointer', fontSize: 12 }}>×</button>
        </div>
      ))}
      <button onClick={add} style={{ fontSize: 11, color: '#f97316', background: 'none', border: '1px dashed #f9731644', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>+ Add pair</button>
    </div>
  );
}

// ─── Node-specific forms ────────────────────────────────────────────────────
function StartForm({ data, update }) {
  return <>
    <Field label="Start Title">
      <input style={inputStyle} value={data.title} onChange={e => update({ title: e.target.value })} />
    </Field>
    <Field label="Metadata (key-value)">
      <KVEditor pairs={data.metadata || []} onChange={v => update({ metadata: v })} />
    </Field>
  </>;
}

function TaskForm({ data, update }) {
  return <>
    <Field label="Title *">
      <input style={inputStyle} value={data.title} onChange={e => update({ title: e.target.value })} />
    </Field>
    <Field label="Description">
      <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 56 }} value={data.description || ''} onChange={e => update({ description: e.target.value })} />
    </Field>
    <Field label="Assignee">
      <input style={inputStyle} placeholder="e.g. John Doe" value={data.assignee} onChange={e => update({ assignee: e.target.value })} />
    </Field>
    <Field label="Due Date">
      <input style={inputStyle} type="date" value={data.dueDate || ''} onChange={e => update({ dueDate: e.target.value })} />
    </Field>
    <Field label="Custom Fields">
      <KVEditor pairs={data.customFields || []} onChange={v => update({ customFields: v })} />
    </Field>
  </>;
}

function ApprovalForm({ data, update }) {
  return <>
    <Field label="Title">
      <input style={inputStyle} value={data.title || ''} onChange={e => update({ title: e.target.value })} />
    </Field>
    <Field label="Approver Role">
      <select style={selectStyle} value={data.approverRole} onChange={e => update({ approverRole: e.target.value })}>
        {APPROVER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
    </Field>
    <Field label="Auto-approve Threshold (days)">
      <input style={inputStyle} type="number" min={0} placeholder="e.g. 3" value={data.autoApproveThreshold} onChange={e => update({ autoApproveThreshold: e.target.value })} />
    </Field>
  </>;
}

function AutomatedForm({ data, update, automations }) {
  const selected = automations.find(a => a.id === data.actionId);
  const params = selected?.params || [];

  return <>
    <Field label="Title">
      <input style={inputStyle} value={data.title} onChange={e => update({ title: e.target.value })} />
    </Field>
    <Field label="Action">
      <select style={selectStyle} value={data.actionId} onChange={e => {
        update({ actionId: e.target.value, actionParams: {} });
      }}>
        <option value="">— Select action —</option>
        {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
      </select>
    </Field>
    {params.length > 0 && (
      <Field label="Action Parameters">
        {params.map(param => (
          <div key={param} style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 10, color: '#6b7280', fontFamily: "'DM Mono', monospace" }}>{param}</label>
            <input style={inputStyle} placeholder={param} value={data.actionParams?.[param] || ''}
              onChange={e => update({ actionParams: { ...data.actionParams, [param]: e.target.value } })} />
          </div>
        ))}
      </Field>
    )}
  </>;
}

function EndForm({ data, update }) {
  return <>
    <Field label="End Message">
      <input style={inputStyle} value={data.endMessage} onChange={e => update({ endMessage: e.target.value })} />
    </Field>
    <Field label="Summary Flag">
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#e5e7eb', fontFamily: "'DM Sans', sans-serif" }}>
        <input type="checkbox" checked={data.summaryEnabled} onChange={e => update({ summaryEnabled: e.target.checked })} />
        Generate summary on completion
      </label>
    </Field>
  </>;
}

// ─── Panel shell ─────────────────────────────────────────────────────────────
const NODE_COLORS = { startNode: '#22c55e', taskNode: '#60a5fa', approvalNode: '#a78bfa', automatedNode: '#f59e0b', endNode: '#f87171' };
const NODE_LABELS = { startNode: 'Start Node', taskNode: 'Task Node', approvalNode: 'Approval Node', automatedNode: 'Automated Step', endNode: 'End Node' };

export default function NodePanel({ node, updateNodeData, deleteNode }) {
  const [automations, setAutomations] = useState([]);

  useEffect(() => { getAutomations().then(setAutomations); }, []);

  if (!node) {
    return (
      <aside style={{ width: 260, background: '#0d1117', borderLeft: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center', color: '#4b5563', fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>☝️</div>
          <div style={{ fontSize: 12 }}>Select a node<br />to configure it</div>
        </div>
      </aside>
    );
  }

  const color = NODE_COLORS[node.type] || '#6b7280';
  const label = NODE_LABELS[node.type] || node.type;
  const update = patch => updateNodeData(node.id, patch);

  return (
    <aside style={{ width: 260, background: '#0d1117', borderLeft: '1px solid #1f2937', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, color, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{label}</div>
          <div style={{ fontSize: 11, color: '#6b7280', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{node.id}</div>
        </div>
        <button onClick={() => deleteNode(node.id)} title="Delete node"
          style={{ background: '#7f1d1d22', border: '1px solid #991b1b44', borderRadius: 6, color: '#f87171', padding: '4px 8px', cursor: 'pointer', fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>
          Delete
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {node.type === 'startNode'     && <StartForm    data={node.data} update={update} />}
        {node.type === 'taskNode'      && <TaskForm     data={node.data} update={update} />}
        {node.type === 'approvalNode'  && <ApprovalForm data={node.data} update={update} />}
        {node.type === 'automatedNode' && <AutomatedForm data={node.data} update={update} automations={automations} />}
        {node.type === 'endNode'       && <EndForm      data={node.data} update={update} />}
      </div>
    </aside>
  );
}
