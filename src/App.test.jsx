import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App.jsx';

describe('GridForge', () => {
  it('renders the header with app name', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('GridForge');
  });

  it('renders the configurazione panel with row and column controls', () => {
    render(<App />);
    const righeElements = screen.getAllByText('Righe');
    expect(righeElements.length).toBeGreaterThanOrEqual(2);
    const colonneElements = screen.getAllByText('Colonne');
    expect(colonneElements.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Spaziatura')).toBeInTheDocument();
  });

  it('renders the live preview section', () => {
    render(<App />);
    expect(screen.getByText('Anteprima')).toBeInTheDocument();
  });

  it('renders the code panel with copy button', () => {
    render(<App />);
    expect(screen.getByText('CSS generato')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copia/i })).toBeInTheDocument();
  });

  it('shows default grid info (1 row × 2 cols)', () => {
    render(<App />);
    expect(screen.getByText('1×2')).toBeInTheDocument();
  });

  it('displays the correct default row and column values', () => {
    render(<App />);
    // Row 1: 200px
    const rowInput = document.getElementById('block-b1');
    expect(rowInput).toHaveValue('200px');
    // Col 1: 1fr
    const col1Input = document.getElementById('block-b2');
    expect(col1Input).toHaveValue('1fr');
    // Col 2: 2fr
    const col2Input = document.getElementById('block-b3');
    expect(col2Input).toHaveValue('2fr');
  });

  it('generates valid CSS with the default grid', () => {
    render(<App />);
    const codeBlock = document.querySelector('.code-block');
    expect(codeBlock).not.toBeNull();
    const css = codeBlock.textContent;
    expect(css).toContain('display: grid');
    expect(css).toContain('grid-template-rows: 200px');
    expect(css).toContain('grid-template-columns: 1fr 2fr');
    expect(css).toContain('gap:');
  });

  it('has a footer with key information', () => {
    render(<App />);
    expect(screen.getByText(/GridForge/i, { selector: '.app-footer p' })).toBeInTheDocument();
  });
});
