import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from './App.tsx'
import './index.css'
import {AuthProvider} from "./context/auth/auth-context.tsx";
import { registerSW } from 'virtual:pwa-register';

const queryClient = new QueryClient();


registerSW({
    onNeedRefresh() {
        // prompt user to refresh
    },
    onOfflineReady() {
        console.log('App is ready for offline use');
    }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <QueryClientProvider client={queryClient}>
              <AuthProvider>
                  <App />
              </AuthProvider>
              <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
      </BrowserRouter>
  </StrictMode>,
)
