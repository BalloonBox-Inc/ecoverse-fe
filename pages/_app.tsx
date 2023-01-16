import '@styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from '@context/auth';
import WalletContextProvider from '@context/wallet';
import { store } from '@plugins/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WalletContextProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>
            <Component {...pageProps} />
            <ToastContainer
              autoClose={1500}
              limit={3}
              position="bottom-right"
              theme="colored"
            />
          </AuthProvider>
        </Provider>
      </QueryClientProvider>
    </WalletContextProvider>
  );
}
