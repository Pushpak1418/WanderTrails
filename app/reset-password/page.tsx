import React from 'react'
import ResetPasswordClient from '@/components/reset-password-client'

// Prevent static prerendering which can cause CSR bailout errors when client hooks are used.
export const dynamic = 'force-dynamic'

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}
