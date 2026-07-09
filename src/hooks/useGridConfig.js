import { useState, useCallback } from 'react';

let nextId = 1;
function uid() {
  return `b${nextId++}`;
}

const DEFAULT_ROWS = [
  { id: uid(), label: 'Riga 1', value: '200px' },
];

const DEFAULT_COLS = [
  { id: uid(), label: 'Colonna 1', value: '1fr' },
  { id: uid(), label: 'Colonna 2', value: '2fr' },
];

export default function useGridConfig() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [gap, setGap] = useState({ row: '16px', col: '16px' });

  const addRow = useCallback(() => {
    setRows(prev => [...prev, { id: uid(), label: `Riga ${prev.length + 1}`, value: '1fr' }]);
  }, []);

  const removeRow = useCallback((id) => {
    setRows(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateRowValue = useCallback((id, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, value } : r));
  }, []);

  const reorderRows = useCallback((fromIndex, toIndex) => {
    setRows(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const addCol = useCallback(() => {
    setCols(prev => [...prev, { id: uid(), label: `Colonna ${prev.length + 1}`, value: '1fr' }]);
  }, []);

  const removeCol = useCallback((id) => {
    setCols(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateColValue = useCallback((id, value) => {
    setCols(prev => prev.map(c => c.id === id ? { ...c, value } : c));
  }, []);

  const reorderCols = useCallback((fromIndex, toIndex) => {
    setCols(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const setRowGap = useCallback((v) => setGap(prev => ({ ...prev, row: v })), []);
  const setColGap = useCallback((v) => setGap(prev => ({ ...prev, col: v })), []);

  const gridCSS = `.grid {
  display: grid;
  grid-template-rows: ${rows.map(r => r.value).join(' ') || 'auto'};
  grid-template-columns: ${cols.map(c => c.value).join(' ') || 'auto'};
  gap: ${gap.row === gap.col ? gap.row : `${gap.row} ${gap.col}`};
}`;

  const cellCount = rows.length * cols.length;

  return {
    rows, cols, gap,
    addRow, removeRow, updateRowValue, reorderRows,
    addCol, removeCol, updateColValue, reorderCols,
    setRowGap, setColGap,
    gridCSS, cellCount,
  };
}
