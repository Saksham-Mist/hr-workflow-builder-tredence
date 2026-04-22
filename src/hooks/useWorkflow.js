// src/hooks/useWorkflow.js
import { useState, useCallback } from 'react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

let nodeIdCounter = 100;
const genId = () => `node_${++nodeIdCounter}`;

const DEFAULT_NODE_DATA = {
  startNode:     { title: 'Start', metadata: [] },
  taskNode:      { title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
  approvalNode:  { title: 'Approval', approverRole: 'Manager', autoApproveThreshold: '' },
  automatedNode: { title: 'Automated Step', actionId: '', actionParams: {} },
  endNode:       { title: 'End', endMessage: 'Workflow complete', summaryEnabled: false },
};

export function useWorkflow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const onNodesChange = useCallback(changes => setNodes(ns => applyNodeChanges(changes, ns)), []);
  const onEdgesChange = useCallback(changes => setEdges(es => applyEdgeChanges(changes, es)), []);
  const onConnect = useCallback(params => setEdges(es => addEdge({ ...params, animated: true }, es)), []);

  const addNode = useCallback((type, position) => {
    const id = genId();
    const newNode = {
      id,
      type,
      position: position || { x: 200 + Math.random() * 300, y: 100 + Math.random() * 200 },
      data: { ...DEFAULT_NODE_DATA[type] },
    };
    setNodes(ns => [...ns, newNode]);
    setSelectedNodeId(id);
    return id;
  }, []);

  const updateNodeData = useCallback((id, patch) => {
    setNodes(ns =>
      ns.map(n => n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)
    );
  }, []);

  const deleteNode = useCallback(id => {
    setNodes(ns => ns.filter(n => n.id !== id));
    setEdges(es => es.filter(e => e.source !== id && e.target !== id));
    setSelectedNodeId(prev => prev === id ? null : prev);
  }, []);

  const deleteEdge = useCallback(id => {
    setEdges(es => es.filter(e => e.id !== id));
  }, []);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  return {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    addNode, updateNodeData, deleteNode, deleteEdge,
    selectedNodeId, setSelectedNodeId,
    selectedNode,
  };
}
