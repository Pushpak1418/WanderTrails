import React from 'react'
import ForgotPasswordClient from '@/components/forgot-password-client'

// Prevent static prerendering which can cause CSR bailout errors when client hooks are used.
export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
  return (
    <React.Suspense fallback={null}>
      <ForgotPasswordClient />
    </React.Suspense>
  )
}
