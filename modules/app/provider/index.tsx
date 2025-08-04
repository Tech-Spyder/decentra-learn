'use client'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { useToast } from '../hooks/useToast'


type QueryProviderProps = {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const toast = useToast()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        // defaultOptions: { queries: { retry: 0 } },
        mutationCache: new MutationCache({
          onMutate: (variables, mutation) => {
            toast.loading('Transaction In Process...', {
              id: mutation.mutationId,
              duration: Infinity,
            })
          },
          onSuccess: (_data, _variables, _context, mutation) => {
            // console.log('query provider success', _data, _variables, _context, mutation)

            const successMessage = mutation?.meta?.successMessage as {
              title?: string
              description: string
            }

            toast.success(
              successMessage ? successMessage.description : 'Transaction was Successful',
              {
                id: mutation.mutationId,
                duration: 5000,
              },
            )
          },
          onError: (error, _variables, _context, mutation) => {
            // console.log('query provider error: ', error)
            const errorMessage = mutation?.meta?.errorMessage as {
              title?: string
              description: string
            }

            // console.log({ errorMessage, error })

            toast.error(
              errorMessage ? `${errorMessage.description} ${error.message}` : error.message,
              {
                id: mutation.mutationId,
                duration: 5000,
              },
            )
          },
        }),
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
