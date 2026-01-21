import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Info, RefreshCw, Calculator, Layers, LayoutGrid } from 'lucide-react'

// Math Helpers
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

const getPermutations = (n: number, r: number) => factorial(n) / factorial(n - r);
const getCombinations = (n: number, r: number) => factorial(n) / (factorial(r) * factorial(n - r));

export default function App() {
  const [n, setN] = useState(5);
  const [r, setR] = useState(3);
  const [mode, setMode] = useState<'P' | 'C'>('C');
  const [items, setItems] = useState<number[]>(Array.from({ length: 5 }, (_, i) => i + 1));

  const result = useMemo(() => {
    if (r > n) return 0;
    return mode === 'P' ? getPermutations(n, r) : getCombinations(n, r);
  }, [n, r, mode]);

  const handleNChange = (val: number) => {
    const newN = Math.max(1, Math.min(10, val));
    setN(newN);
    setItems(Array.from({ length: newN }, (_, i) => i + 1));
    if (r > newN) setR(newN);
  };

  const selectedIndices = useMemo(() => {
    // Just a preview of "one" possible selection
    return Array.from({ length: r }, (_, i) => i);
  }, [r]);

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <Layers className="accent-icon" />
          <h1 className="gradient-text">ComboViz</h1>
        </div>
        <p className="subtitle">Visualizing Combinatorics • Understanding Probability</p>
      </header>

      <main className="main-content">
        <section className="control-panel glass-panel">
          <div className="control-group">
            <label>Total Items (n)</label>
            <div className="input-stepper">
              <button onClick={() => handleNChange(n - 1)}>-</button>
              <span className="value">{n}</span>
              <button onClick={() => handleNChange(n + 1)}>+</button>
            </div>
          </div>

          <div className="control-group">
            <label>Choose (r)</label>
            <div className="input-stepper">
              <button onClick={() => setR(Math.max(0, r - 1))}>-</button>
              <span className="value">{r}</span>
              <button onClick={() => setR(Math.min(n, r + 1))}>+</button>
            </div>
          </div>

          <div className="toggle-group">
            <button
              className={mode === 'C' ? 'active' : ''}
              onClick={() => setMode('C')}
            >
              Combination (C)
            </button>
            <button
              className={mode === 'P' ? 'active' : ''}
              onClick={() => setMode('P')}
            >
              Permutation (P)
            </button>
          </div>
        </section>

        <section className="visualization-area card">
          <div className="viz-header">
            <h3>Visual Preview</h3>
            <p className="viz-hint">
              {mode === 'C'
                ? `Picking ${r} items where order DOES NOT matter`
                : `Picking ${r} items where order DOES matter`}
            </p>
          </div>

          <div className="items-grid">
            {items.map((item, idx) => (
              <motion.div
                key={item}
                layout
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  opacity: idx < r ? 1 : 0.4,
                  border: idx < r ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                  boxShadow: idx < r ? '0 0 15px rgba(124, 58, 237, 0.4)' : 'none'
                }}
                className={`item-circle ${idx < r ? 'selected' : ''}`}
              >
                {item}
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={result}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="result-banner"
            >
              <span className="result-label">Total Possibilities:</span>
              <span className="result-value">{result.toLocaleString()}</span>
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="formula-section glass-panel">
          <div className="formula-box">
            <div className="formula-header">
              <Calculator size={18} />
              <span>Formula</span>
            </div>
            <div className="formula-display">
              {mode === 'C' ? (
                <>
                  <span className="formula-symbol">C({n}, {r}) = </span>
                  <span className="formula-math">
                    {n}! / ({r}! × ({n}-{r})!)
                  </span>
                </>
              ) : (
                <>
                  <span className="formula-symbol">P({n}, {r}) = </span>
                  <span className="formula-math">
                    {n}! / ({n}-{r})!
                  </span>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .app-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
          min-height: 100vh;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .logo h1 {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .accent-icon {
          color: var(--accent-primary);
          width: 40px;
          height: 40px;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .main-content {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 24px;
        }

        .control-panel {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .control-group label {
          display: block;
          color: var(--text-secondary);
          margin-bottom: 12px;
          font-weight: 500;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-stepper {
          display: flex;
          align-items: center;
          background: var(--bg-primary);
          border-radius: 12px;
          padding: 8px;
          border: 1px solid var(--glass-border);
        }

        .input-stepper button {
          background: var(--bg-tertiary);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s;
        }

        .input-stepper button:hover {
          background: var(--accent-primary);
        }

        .input-stepper .value {
          flex: 1;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          font-family: var(--font-display);
        }

        .toggle-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .toggle-group button {
          background: var(--bg-tertiary);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .toggle-group button.active {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
        }

        .visualization-area {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          min-height: 400px;
        }

        .viz-header h3 {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .viz-hint {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .items-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          padding: 20px;
          min-height: 150px;
        }

        .item-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          background: var(--bg-tertiary);
          color: var(--text-primary);
          cursor: default;
        }

        .result-banner {
          margin-top: auto;
          text-align: center;
          padding: 24px;
          background: rgba(124, 58, 237, 0.1);
          border-radius: 16px;
          border: 1px solid rgba(124, 58, 237, 0.2);
        }

        .result-label {
          display: block;
          color: var(--text-secondary);
          font-size: 0.9rem;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .result-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--accent-secondary);
          font-family: var(--font-display);
        }

        .formula-section {
          grid-column: 1 / -1;
          padding: 24px;
        }

        .formula-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .formula-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--accent-primary);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .formula-display {
          font-size: 1.5rem;
          font-family: 'Courier New', Courier, monospace;
          background: var(--bg-primary);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          text-align: center;
        }

        .formula-math {
          color: var(--accent-secondary);
        }

        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
