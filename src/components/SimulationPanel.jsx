// src/components/SimulationPanel.jsx
import { useState } from 'react';
import { simulateWorkflow } from '../api/mockApi';

const STATUS_COLORS = { completed: '#22c55e', error: '#f87171', warning: '#f59e0b' };

export default function SimulationPanel({ nodes, edges, onClose }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setResult(null);
    const res = await simulateWorkflow({ nodes, edges });
    setResult(res);
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        background: '#111827', border: '1px solid #1f2937',
        borderRadius: 12, width: 560, maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px #000a',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f97316', fontFamily: "'Syne', sans-serif" }}>Workflow Sandbox</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{nodes.length} nodes · {edges.length} edges</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
  <button onClick={run} disabled={loading} style={{
    background: loading ? '#1f2937' : '#f97316',
    border: 'none', borderRadius: 6, color: loading ? '#6b7280' : '#000',
    padding: '7px 16px', cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: 12, fontWeight: 700
  }}>
    {loading ? '⏳ Running…' : '▶ Run Simulation'}
  </button>

  {/* 🔽 ADD THIS BUTTON HERE */}
  <button
    onClick={() => {
      const data = JSON.stringify({ nodes, edges }, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "workflow.json";
      a.click();

      URL.revokeObjectURL(url);
    }}
    style={{
      background: '#1f2937',
      border: '1px solid #374151',
      borderRadius: 6,
      color: '#9ca3af',
      padding: '7px 14px',
      cursor: 'pointer',
      fontSize: 12
    }}
  >
    ⬇ Export JSON
  </button>

  <button onClick={onClose} style={{
    background: '#1f2937',
    border: '1px solid #374151',
    borderRadius: 6,
    color: '#9ca3af',
    padding: '7px 14px',
    cursor: 'pointer',
    fontSize: 12
  }}>
    ✕ Close
  </button>
</div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {!result && !loading && (
            <div style={{ textAlign: 'center', color: '#4b5563', padding: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🧪</div>
              <div style={{ fontSize: 12 }}>Press <b style={{ color: '#f97316' }}>Run Simulation</b> to execute<br />your workflow and see step-by-step results.</div>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>⚙️</div>
              <div style={{ fontSize: 12 }}>Executing workflow…</div>
            </div>
          )}

          {result && (
            <>
              {/* Errors */}
              {result.errors.length > 0 && (
                <div style={{ background: '#7f1d1d22', border: '1px solid #991b1b', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f87171', marginBottom: 6 }}>Validation Errors</div>
                  {result.errors.map((e, i) => (
                    <div key={i} style={{ fontSize: 12, color: '#fca5a5', marginBottom: 3 }}>{e}</div>
                  ))}
                </div>
              )}

              {/* Success banner */}
              {result.success && (
                <div style={{ background: '#14532d22', border: '1px solid #166534', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <span style={{ fontSize: 12, color: '#86efac', fontWeight: 600 }}>Workflow executed successfully — {result.steps.length} steps completed</span>
                </div>
              )}

              {/* Steps timeline */}
              {result.steps.map((step, i) => (
                <div key={step.id} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                  {/* Step number + line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 28 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#1f2937', border: `2px solid ${STATUS_COLORS[step.status]}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: STATUS_COLORS[step.status], fontWeight: 700,
                      fontFamily: "'DM Mono', monospace", flexShrink: 0,
                    }}>
                      {step.step}
                    </div>
                    {i < result.steps.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 12, background: '#1f2937', margin: '2px 0' }} />}
                  </div>

                  {/* Step info */}
                  <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 8, padding: '10px 12px', flex: 1, marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, color: '#e5e7eb', fontWeight: 600 }}>
                        {step.typeLabel} — <span style={{ color: '#f97316' }}>{step.title}</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#6b7280', fontFamily: "'DM Mono', monospace" }}>{step.duration}</div>
                    </div>
                    {step.detail && <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: "'DM Mono', monospace" }}>{step.detail}</div>}
                  </div>
                </div>
              ))}

              {/* JSON export section */}
              <details style={{ marginTop: 16 }}>
                <summary style={{ fontSize: 11, color: '#6b7280', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>View serialized workflow JSON</summary>
                <pre style={{ fontSize: 10, color: '#9ca3af', background: '#0d1117', borderRadius: 6, padding: 12, marginTop: 8, overflow: 'auto', maxHeight: 200 }}>
                  {JSON.stringify({ nodes, edges }, null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
