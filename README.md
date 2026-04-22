# HR Workflow Designer — Tredence Studio Case Study

A functional prototype of a visual HR Workflow Designer built with React + React Flow, demonstrating modular architecture, dynamic forms, mock API integration, and workflow simulation.

---

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

---

## Architecture

```
src/
├── api/
│   └── mockApi.js          # Mock GET /automations + POST /simulate
├── hooks/
│   └── useWorkflow.js      # Centralized graph state (nodes, edges, CRUD)
├── nodes/
│   └── index.jsx           # 5 custom React Flow node types
├── components/
│   ├── Sidebar.jsx          # Node palette (click-to-add)
│   ├── NodePanel.jsx        # Dynamic config forms per node type
│   └── SimulationPanel.jsx  # Sandbox: serialize → simulate → log
├── App.jsx                  # Layout shell + React Flow canvas
└── main.jsx                 # Entry point + global styles
```

### Key Design Decisions

**Separation of Concerns** — Canvas orchestration (`App`), graph state (`useWorkflow`), API calls (`mockApi`), and UI forms (`NodePanel`) are fully decoupled. Adding a new node type requires changes only in `nodes/`, `NodePanel.jsx`, and `mockApi.js`.

**Centralized State via Custom Hook** — `useWorkflow` is the single source of truth for the graph. Components receive only what they need. No prop-drilling beyond one level.

**Dynamic Form Architecture** — `NodePanel` renders different sub-forms per `node.type`. Each sub-form uses controlled components. Adding a new node type = add one new form component and a case in the switch.

**Mock API Abstraction** — `mockApi.js` exports async functions (`getAutomations`, `simulateWorkflow`) that return Promises with `setTimeout` delays, mimicking real latency. Swapping to a real backend requires changing only this file.

**Graph Simulation** — `simulateWorkflow` validates structure (missing start/end, orphan nodes), then topologically orders nodes via DFS to produce a step-by-step execution log.

---

## Features

### Workflow Canvas
- Drag-and-drop repositioning of nodes on canvas
- Connect nodes via handles (top/bottom)
- Select node to open config panel
- Delete via `Delete` key or panel button
- MiniMap + zoom controls

### Node Types
| Type | Color | Description |
|------|-------|-------------|
| Start Node | 🟢 Green | Entry point, optional metadata KV pairs |
| Task Node | 🔵 Blue | Human task, assignee, due date, custom fields |
| Approval Node | 🟣 Purple | Approver role dropdown, auto-approve threshold |
| Automated Step | 🟡 Amber | Action from mock API, dynamic param fields |
| End Node | 🔴 Red | End message, summary toggle |

### Node Configuration
- All forms use controlled React inputs
- KV pair editor for metadata / custom fields
- Approval node has role dropdown (Manager, HRBP, Director, VP, CEO)
- Automated node fetches action list from mock API on mount; selecting an action renders its parameter inputs dynamically

### Simulation Sandbox
- Serializes full graph to JSON
- Validates: missing Start/End, orphan nodes, too few nodes
- DFS traversal produces ordered execution steps
- Displays step timeline with node type, title, detail, and mock duration
- Shows raw JSON payload in collapsible section

---

## Data Model

```js
// Node
{ id: string, type: NodeType, position: {x,y}, data: NodeData }

// NodeData (varies by type)
StartNode:     { title, metadata: [{key, value}] }
TaskNode:      { title, description, assignee, dueDate, customFields }
ApprovalNode:  { title, approverRole, autoApproveThreshold }
AutomatedNode: { title, actionId, actionParams: {[param]: value} }
EndNode:       { title, endMessage, summaryEnabled }

// Edge
{ id, source, target, animated }
```

---

## Tech Stack
- **React 18** + **Vite**
- **React Flow 11** for canvas
- **JavaScript ES6+** (no TypeScript — time constraint)
- In-memory state only, no persistence

---

## Assumptions
- No authentication or backend persistence required
- Linear DFS simulation (not parallel branch execution)
- Click-to-add nodes (sidebar buttons); canvas handles drag-and-drop repositioning after placement
- Validation is structural only (no semantic checks)

---

## What I'd Add With More Time
- **TypeScript** — strict types for all node data shapes
- **Zustand** — for more scalable state management
- **Drag from sidebar** — `onDragStart` + `onDrop` on canvas
- **Approval/Automated nodes** — already scaffolded, forms are complete
- **Cycle detection** — DFS cycle check in validation
- **Visual error indicators** — red border on invalid nodes
- **Undo/Redo** — via `useHistoryState` wrapper
- **Export/Import JSON** — serialize to file, load from file
- **Auto-layout** — dagre-based layout on demand

---

Built as part of the Tredence Studio Full Stack Engineering Intern case study (2025 Cohort).
