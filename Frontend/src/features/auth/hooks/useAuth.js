
import { setError, setLoading, setUser } from "../state/auth.slice.js"
import { login, register, authMe } from "../services/auth.api.js"

import { useDispatch } from 'react-redux'


export const useAuth = () => {
  
    const dispatch = useDispatch();


    async function handleRegister({ username, email, password }) {
        dispatch(setLoading(true))
        dispatch(setError(null))
        
        try {
            console.log({ username, email, password })

            const data = await register({ username, email, password })

            console.log(data)
            dispatch(setUser(data.user))
            return data
        }
        catch(err) {
            console.error(err)
            dispatch(setError(err?.message || 'Registration failed'))
            throw err
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        dispatch(setLoading(true))
        dispatch(setError(null))
        
        try {
            console.log({ email, password })
            const data = await login({ email, password })

            console.log(data)

            dispatch(setUser(data.user))
            return data
        }
        catch(err) {
            console.error(err)
            dispatch(setError(err?.message || 'Login failed'))
            throw err
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function handleCheckSession() {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const data = await authMe()
            dispatch(setUser(data.user))
            return data
        }
        catch(err) {
            console.error("Session verification failed:", err)
            dispatch(setUser(null))
            throw err
        }
        finally {
            dispatch(setLoading(false))
        }
    }
    
    return { handleRegister, handleLogin, handleCheckSession }
}

export default useAuth