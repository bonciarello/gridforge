import { useState, useCallback, useRef } from 'react';
import './ConfigPanel.css';

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h12" />
      <path d="M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4" />
      <path d="M6.667 7.333v4" />
      <path d="M9.333 7.333v4" />
      <path d="M3.333 4l.667 9.333a1.333 1.333 0 001.333 1.334h5.334a1.333 1.333 0 001.333-1.334L12.667 4" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="5" cy="3" r="1.25" fill="currentColor" />
      <circle cx="11" cy="3" r="1.25" fill="currentColor" />
      <circle cx="5" cy="8" r="1.25" fill="currentColor" />
      <circle cx="11" cy="8" r="1.25" fill="currentColor" />
      <circle cx="5" cy="13" r="1.25" fill="currentColor" />
      <circle cx="11" cy="13" r="1.25" fill="currentColor" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="8" y1="2" x2="8" y2="14" />
      <line x1="2" y1="8" x2="14" y2="8" />
    </svg>
  );
}

/* ============================================
   BlockItem
   ============================================ */

function BlockItem({ item, index, total, onRemove, onUpdate, onReorder, onDragOver, onDragLeave, onDrop }) {
  const inputRef = useRef(null);

  const handleChange = useCallback((e) => {
    onUpdate(e.target.value);
  }, [onUpdate]);

  const handleDragStart = useCallback((e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    const li = e.currentTarget.closest('.block-item');
    if (li) li.classList.add('dragging');
  }, [index]);

  const handleDragEnd = useCallback((e) => {
    const li = e.currentTarget.closest('.block-item');
    if (li) li.classList.remove('dragging');
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      onReorder(index, index - 1);
    } else if (e.key === 'ArrowDown' && index < total - 1) {
      e.preventDefault();
      onReorder(index, index + 1);
    }
  }, [index, total, onReorder]);

  return (
    <li className="block-item" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <span
        className="block-drag"
        aria-label={`Trascina per riordinare ${item.label}`}
        tabIndex={0}
        role="button"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onKeyDown={handleKeyDown}
      >
        <GripIcon />
      </span>
      <label className="block-label" htmlFor={`block-${item.id}`}>
        {item.label}
      </label>
      <input
        ref={inputRef}
        id={`block-${item.id}`}
        type="text"
        className="block-input"
        value={item.value}
        onChange={handleChange}
        placeholder="200px"
        autoComplete="off"
        spellCheck={false}
      />
      {onRemove && (
        <button
          type="button"
          className="btn-remove"
          onClick={onRemove}
          aria-label={`Rimuovi ${item.label}`}
        >
          <TrashIcon />
        </button>
      )}
    </li>
  );
}

/* ============================================
   BlockGroup
   ============================================ */

function BlockGroup({ title, items, onAdd, onRemove, onUpdate, onReorder, minItems, itemLabel }) {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const li = e.currentTarget;
    // Remove indicator classes from all siblings
    const list = li.parentElement;
    if (list) {
      list.querySelectorAll('.block-item').forEach(item => {
        if (item !== li) {
          item.classList.remove('drag-over-before', 'drag-over-after');
        }
      });
    }
    const rect = li.getBoundingClientRect();
    const mid = (rect.bottom - rect.top) / 2;
    const offset = e.clientY - rect.top;
    li.classList.toggle('drag-over-before', offset < mid);
    li.classList.toggle('drag-over-after', offset >= mid);
  }, []);

  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      const li = e.currentTarget;
      li.classList.remove('drag-over-before', 'drag-over-after');
    }
  }, []);

  const handleDrop = useCallback((e, toIndex) => {
    e.preventDefault();
    const li = e.currentTarget;
    li.classList.remove('drag-over-before', 'drag-over-after');
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex) && fromIndex !== toIndex) {
      onReorder(fromIndex, toIndex);
    }
  }, [onReorder]);

  const isRemovable = items.length > minItems;

  return (
    <fieldset className="block-group">
      <legend className="block-group-legend">{title}</legend>
      <ul className="block-list" role="list">
        {items.map((item, index) => (
          <BlockItem
            key={item.id}
            item={item}
            index={index}
            total={items.length}
            onRemove={isRemovable ? () => onRemove(item.id) : null}
            onUpdate={val => onUpdate(item.id, val)}
            onReorder={onReorder}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          />
        ))}
      </ul>
      <button type="button" className="btn-add" onClick={onAdd} aria-label={`Aggiungi ${itemLabel}`}>
        <AddIcon />
        <span>Aggiungi {itemLabel}</span>
      </button>
    </fieldset>
  );
}

/* ============================================
   GapInline
   ============================================ */

function GapInline({ label, value, onChange }) {
  const id = `gap-${label.toLowerCase()}`;
  return (
    <div className="gap-inline">
      <label htmlFor={id} className="gap-inline-label">{label}</label>
      <input
        id={id}
        type="text"
        className="gap-inline-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="16px"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}

/* ============================================
   ConfigPanel
   ============================================ */

export default function ConfigPanel({ config }) {
  const [rowGap, setRowGap] = useState(config.gap.row);
  const [colGap, setColGap] = useState(config.gap.col);

  const handleRowGap = useCallback((v) => {
    setRowGap(v);
    config.setRowGap(v);
  }, [config]);
  const handleColGap = useCallback((v) => {
    setColGap(v);
    config.setColGap(v);
  }, [config]);

  return (
    <div className="config-panel">
      <BlockGroup
        title="Righe"
        items={config.rows}
        onAdd={config.addRow}
        onRemove={config.removeRow}
        onUpdate={config.updateRowValue}
        onReorder={config.reorderRows}
        minItems={1}
        itemLabel="riga"
      />
      <BlockGroup
        title="Colonne"
        items={config.cols}
        onAdd={config.addCol}
        onRemove={config.removeCol}
        onUpdate={config.updateColValue}
        onReorder={config.reorderCols}
        minItems={1}
        itemLabel="colonna"
      />
      <fieldset className="block-group">
        <legend className="block-group-legend">Spaziatura</legend>
        <div className="gap-row">
          <GapInline label="Righe" value={rowGap} onChange={handleRowGap} />
          <GapInline label="Colonne" value={colGap} onChange={handleColGap} />
        </div>
      </fieldset>
    </div>
  );
}
