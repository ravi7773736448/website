import React, { useEffect } from 'react'
import AppRouter from '../AppRouter.jsx'
import useAuth from '../features/auth/hooks/useAuth.js'

const App = () => {
  const { handleCheckSession } = useAuth()

  useEffect(() => {
    // Perform silent authentication session check on app startup
    handleCheckSession().catch(() => {
      // User is not authenticated; keep guest status
    })
  }, [])

  return (
    <>
      <AppRouter />
    </>
  )
}

export default App