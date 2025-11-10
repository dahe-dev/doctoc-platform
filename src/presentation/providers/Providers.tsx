'use client'

import { AuthProvider } from '@/infrastructure/auth/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/presentation/components/ui/sonner'
import { useState } from 'react'
import { ThemeProvider } from './ThemeProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                refetchOnWindowFocus: false,
                retry: 1,
            }
        }
    }))

  return (
    <QueryClientProvider client={queryClient}>
       <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <AuthProvider>
        {children}
       <Toaster position="top-center" richColors />
      </AuthProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}