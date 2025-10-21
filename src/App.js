import './App.css';
import { useState } from 'react';
import { Steps } from './components/Steps';
import { HelpModal } from './components/HelpModal';

function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="App">
      <header>
        <h1>
          <div className="title-line-1">🎠 Professor Putterwump's</div>
          <div className="title-line-2">CURIOUS CAROUSEL</div>
          <div className="title-line-3">OF UNRETURNED NAMES</div>
        </h1>
        <button
          className="help-button"
          onClick={() => setIsHelpOpen(true)}
          aria-label="Open help"
          title="Help & Information"
        >
          ❓
        </button>
      </header>
      <main>
        <Steps />
      </main>
      <footer className="app-footer">
        <p>
          © {new Date().getFullYear()} |{' '}
          <a
            href="https://github.com/katylava/name-carousel"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;
