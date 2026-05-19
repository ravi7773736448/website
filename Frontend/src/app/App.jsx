import { useEffect, useState } from 'react'
import AppRouter from '../AppRouter.jsx'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/auth/state/auth.slice.js'

const App = () => {
  const dispatch = useDispatch()
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    setInitialCheckDone(true)
  }, [])

  if (!initialCheckDone) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' }}>
        <div style={{ width: '30px', height: '30px', border: '3px solid #333', borderTopColor: '#f5f5f5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <>
      <AppRouter />
    </>
  )
}

export default App