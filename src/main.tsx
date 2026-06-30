import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toasty } from '@cloudflare/kumo';
import '@cloudflare/kumo/styles/standalone';
import App from './App';
import './styles.css';
import { appToastManager } from './toast-manager';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toasty toastManager={appToastManager}>
      <App />
    </Toasty>
  </StrictMode>,
);
