// src/api/mockApi.js
// Simulates backend endpoints with in-memory data

export const automations = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary'] },
  { id: 'send_sms', label: 'Send SMS', params: ['phone', 'message'] },
];

// GET /automations
export async function getAutomations() {
  await delay(120);
  return automations;
}

// POST /simulate
export async function simulateWorkflow(workflowJson) {
  await delay(300);

  const { nodes, edges } = workflowJson;

  // Validate
  const errors = [];
  const startNodes = nodes.filter(n => n.type === 'startNode');
  const endNodes = nodes.filter(n => n.type === 'endNode');

  if (startNodes.length === 0) errors.push('❌ No Start Node found.');
  if (startNodes.length > 1) errors.push('❌ Multiple Start Nodes found.');
  if (endNodes.length === 0) errors.push('❌ No End Node found.');
  if (nodes.length < 2) errors.push('❌ Workflow must have at least 2 nodes.');

  // Check for orphan nodes (no edges)
  const connectedIds = new Set([
    ...edges.map(e => e.source),
    ...edges.map(e => e.target),
  ]);
  const orphans = nodes.filter(n => !connectedIds.has(n.id) && nodes.length > 1);
  if (orphans.length > 0) {
    errors.push(`⚠️ Orphan nodes detected: ${orphans.map(o => o.data.title || o.type).join(', ')}`);
  }

  if (errors.length > 0) {
    return { success: false, errors, steps: [] };
  }

  // Build adjacency map and topological order
  const adj = {};
  nodes.forEach(n => (adj[n.id] = []));
  edges.forEach(e => adj[e.source]?.push(e.target));

  const visited = new Set();
  const order = [];

  function dfs(id) {
    if (visited.has(id)) return;
    visited.add(id);
    order.push(id);
    (adj[id] || []).forEach(dfs);
  }

  const start = startNodes[0];
  dfs(start.id);

  // Remaining unvisited (disconnected subgraphs)
  nodes.forEach(n => { if (!visited.has(n.id)) dfs(n.id); });

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const steps = order.map((id, idx) => {
    const node = nodeMap[id];
    const typeLabel = {
      startNode: '🟢 Start',
      taskNode: '📋 Task',
      approvalNode: '✅ Approval',
      automatedNode: '⚡ Automated',
      endNode: '🔴 End',
    }[node.type] || '⬜ Node';

    const detail = buildDetail(node);
    return {
      step: idx + 1,
      id,
      type: node.type,
      typeLabel,
      title: node.data?.title || node.type,
      detail,
      status: 'completed',
      duration: Math.floor(Math.random() * 400 + 80) + 'ms',
    };
  });

  return { success: true, errors: [], steps };
}

function buildDetail(node) {
  const d = node.data || {};
  switch (node.type) {
    case 'startNode': return d.metadata ? `Metadata: ${JSON.stringify(d.metadata)}` : 'Workflow initiated';
    case 'taskNode': return `Assignee: ${d.assignee || 'Unassigned'} | Due: ${d.dueDate || 'N/A'}`;
    case 'approvalNode': return `Approver: ${d.approverRole || 'Manager'} | Auto-threshold: ${d.autoApproveThreshold ?? 'N/A'}`;
    case 'automatedNode': return `Action: ${d.actionId || 'None'} | Params: ${JSON.stringify(d.actionParams || {})}`;
    case 'endNode': return d.endMessage || 'Workflow complete';
    default: return '';
  }
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
