import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Debug logging for production
console.log('Environment check:', {
  isDev: import.meta.env.DEV,
  mode: import.meta.env.MODE,
  hasKey: !!PUBLISHABLE_KEY,
  keyPrefix: PUBLISHABLE_KEY ? PUBLISHABLE_KEY.substring(0, 10) + '...' : 'undefined'
})

// Fallback component when Clerk fails
const ErrorFallback = ({ error }) => (
  <div className="min-h-screen bg-red-900 flex items-center justify-center p-4">
    <div className="bg-red-800 text-white p-6 rounded-lg max-w-md">
      <h1 className="text-xl font-bold mb-4">Configuration Error</h1>
      <p className="mb-4">The application failed to load due to missing configuration.</p>
      <details className="mb-4">
        <summary className="cursor-pointer font-medium">Technical Details</summary>
        <pre className="mt-2 text-sm bg-red-900 p-2 rounded overflow-auto">
          {error.message}
        </pre>
      </details>
      <p className="text-sm text-red-200">
        Please check the environment variables and try again.
      </p>
    </div>
  </div>
)

// Main render function
const renderApp = () => {
  if (!PUBLISHABLE_KEY) {
    console.error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
    console.error('Available env vars:', Object.keys(import.meta.env))

    const error = new Error("Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY environment variable.")

    return (
      <StrictMode>
        <ErrorFallback error={error} />
      </StrictMode>
    )
  }

  return (
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(renderApp())
