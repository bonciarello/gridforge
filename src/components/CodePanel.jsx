import { useState, useCallback } from 'react';
import './CodePanel.css';

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5.5" y="5.5" width="9" height="9" rx="1.5" />
      <path d="M10.5 5.5V3.5A1.5 1.5 0 009 2H3.5A1.5 1.5 0 002 3.5V9A1.5 1.5 0 003.5 10.5H5.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2.5,8 6,11.5 13.5,4" />
    </svg>
  );
}

export default function CodePanel({ css, cellCount }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / non-HTTPS
      const ta = document.createElement('textarea');
      ta.value = css;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [css]);

  return (
    <div className="code-panel">
      <div className="code-header">
        <h2 className="code-title">CSS generato</h2>
        <button
          type="button"
          className={`btn-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Codice copiato' : 'Copia codice CSS'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? 'Copiato!' : 'Copia'}</span>
        </button>
      </div>
      <pre className="code-block">
        <code>{css}</code>
      </pre>
      {cellCount > 0 && (
        <p className="code-hint">
          Incolla questo CSS nel tuo foglio di stile. La griglia ha {cellCount} celle.
        </p>
      )}
    </div>
  );
}
