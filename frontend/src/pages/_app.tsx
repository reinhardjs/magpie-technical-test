import { AuthProvider } from '../contexts/AuthContext';
import { RouteGuard } from '../components/RouteGuard';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <RouteGuard>
        <Component {...pageProps} />
      </RouteGuard>
    </AuthProvider>
  );
}
