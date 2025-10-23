import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeErrorSuppression } from './utils/errorSuppression'

// Initialize error suppression for benign auth errors
initializeErrorSuppression();

createRoot(document.getElementById("root")!).render(<App />);
