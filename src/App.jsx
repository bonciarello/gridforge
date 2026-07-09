import useGridConfig from './hooks/useGridConfig.js';
import Header from './components/Header.jsx';
import ConfigPanel from './components/ConfigPanel.jsx';
import LivePreview from './components/LivePreview.jsx';
import CodePanel from './components/CodePanel.jsx';
import './App.css';

export default function App() {
  const config = useGridConfig();

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <div className="app-layout">
          <aside className="app-sidebar" aria-label="Configurazione griglia">
            <ConfigPanel config={config} />
          </aside>
          <section className="app-center" aria-label="Anteprima e codice">
            <LivePreview config={config} />
            <CodePanel css={config.gridCSS} cellCount={config.cellCount} />
          </section>
        </div>
      </main>
      <footer className="app-footer">
        <p>GridForge — genera griglie CSS valide da copiare e incollare direttamente nel tuo foglio di stile.</p>
      </footer>
    </div>
  );
}
