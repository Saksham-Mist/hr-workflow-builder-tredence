// src/App.jsx
import { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Panel } from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from './nodes';
import { useWorkflow } from './hooks/useWorkflow';
import Sidebar from './components/Sidebar';
import NodePanel from './components/NodePanel';
import SimulationPanel from './components/SimulationPanel';

export default function App() {
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    addNode, updateNodeData, deleteNode,
    selectedNodeId, setSelectedNodeId,
    selectedNode,
  } = useWorkflow();

  const [showSim, setShowSim] = useState(false);

  const onNodeClick = useCallback((_, node) => setSelectedNodeId(node.id), [setSelectedNodeId]);
  const onPaneClick = useCallback(() => setSelectedNodeId(null), [setSelectedNodeId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#090d14', color: '#e5e7eb' }}>
      {/* Top bar */}
      <header style={{
        height: 52, background: '#0d1117', borderBottom: '1px solid #1f2937',
        display: 'flex', alignItems: 'center', padding: '0 20px',
        justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: '#f97316', letterSpacing: 1 }}>TREDENCE</span>
          <span style={{ color: '#374151', fontSize: 14 }}>|</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#9ca3af', fontWeight: 400 }}>HR Workflow Designer</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#4b5563' }}>
            {nodes.length} nodes · {edges.length} edges
          </span>
          <button
            onClick={() => setShowSim(true)}
            style={{
              background: '#f97316', border: 'none', borderRadius: 7,
              color: '#000', padding: '7px 18px', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              letterSpacing: 0.5,
            }}
          >
            ▶ Run Workflow
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar onAddNode={addNode} />

        {/* Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode="Delete"
            style={{ background: '#090d14' }}
          >
            <Background color="#1f2937" gap={20} size={1} />
            <Controls style={{ background: '#111827', border: '1px solid #1f2937' }} />
            <MiniMap
              nodeColor={n => ({
                startNode: '#22c55e', taskNode: '#60a5fa',
                approvalNode: '#a78bfa', automatedNode: '#f59e0b', endNode: '#f87171',
              }[n.type] || '#374151')}
              style={{ background: '#0d1117', border: '1px solid #1f2937' }}
            />

            {nodes.length === 0 && (
              <Panel position="top-center">
                <div style={{
                  marginTop: 80, textAlign: 'center', color: '#374151',
                  fontFamily: "'DM Sans', sans-serif", pointerEvents: 'none',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🗂️</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#6b7280' }}>Canvas is empty</div>
                  <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>Add nodes from the sidebar to start building your workflow</div>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>

        <NodePanel node={selectedNode} updateNodeData={updateNodeData} deleteNode={deleteNode} />
      </div>

      {showSim && (
        <SimulationPanel nodes={nodes} edges={edges} onClose={() => setShowSim(false)} />
      )}
    </div>
  );
}
