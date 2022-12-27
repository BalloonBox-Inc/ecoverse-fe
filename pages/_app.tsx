import '@styles/globals.css';

import AuthProvider from '@context/auth';
import { store } from '@plugins/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
}
