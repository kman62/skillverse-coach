import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error boundary wrapper
const root = document.getElementById("root");
if (!root) {
  document.body.innerHTML = '<div style="padding: 20px; font-family: system-ui;">Error: Root element not found</div>';
} else {
  try {
    createRoot(root).render(<App />);
  } catch (error) {
    console.error('Failed to render app:', error);
    root.innerHTML = `<div style="padding: 20px; font-family: system-ui;">
      <h1>Application Error</h1>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>`;
  }
}
