import AuthProviders from "@/contexts/AuthProviders";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviders>
        <Component {...pageProps} />
        <Toaster position="top-center" />
      </AuthProviders>
    </QueryClientProvider>
  );
}
