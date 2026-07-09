import { useMemo } from 'react';
import './LivePreview.css';

const CELL_COLORS = [
  '#DBEAFE', '#BFDBFE', '#93C5FD', '#BAE6FD', '#C7D2FE',
  '#DDD6FE', '#E9D5FF', '#FCE7F3', '#FEE2E2', '#FFEDD5',
  '#FEF3C7', '#FEF9C3', '#ECFCCB', '#D1FAE5', '#CCFBF1',
  '#CFFAFE', '#E0E7FF', '#EDE9FE', '#FAE8FF', '#FFE4E6',
];

function getColor(index) {
  return CELL_COLORS[index % CELL_COLORS.length];
}

function getLabel(index) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const row = Math.floor(index / 26);
  return row > 0 ? `${alphabet[row - 1]}${alphabet[index % 26]}` : alphabet[index];
}

export default function LivePreview({ config }) {
  const { rows, cols, gap, cellCount } = config;

  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateRows: rows.map(r => r.value).join(' ') || 'auto',
    gridTemplateColumns: cols.map(c => c.value).join(' ') || 'auto',
    gap: `${gap.row} ${gap.col}`,
  }), [rows, cols, gap]);

  const cells = useMemo(() => {
    const items = [];
    for (let i = 0; i < cellCount; i++) {
      items.push({
        id: i,
        color: getColor(i),
        label: getLabel(i),
      });
    }
    return items;
  }, [cellCount]);

  if (rows.length === 0 || cols.length === 0) {
    return (
      <div className="preview-card">
        <div className="preview-header">
          <h2 className="preview-title">Anteprima</h2>
        </div>
        <div className="preview-empty">
          <p>Aggiungi almeno una riga e una colonna per vedere l&rsquo;anteprima.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-card">
      <div className="preview-header">
        <h2 className="preview-title">Anteprima</h2>
        <span className="preview-badge">{rows.length}×{cols.length}</span>
      </div>
      <div className="preview-stage">
        <div className="preview-grid" style={gridStyle}>
          {cells.map(cell => (
            <div
              key={cell.id}
              className="preview-cell"
              style={{ backgroundColor: cell.color }}
            >
              <span className="preview-cell-label">{cell.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
