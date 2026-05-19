import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoginPage from '../pages/Login.jsx'
import useAuth from '../hooks/useAuth.js'

export default function LoginContainer() {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  const { loading } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const [errors, setErrors] = useState({})

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await handleLogin({
        email: formData.email,
        password: formData.password,
      })
      navigate('/dashboard')
    } catch (err) {
      setErrors({
        submit: err?.message || 'Login failed. Please try again.',
      })
    }
  }

  const handleForgotPassword = () => {
    // TODO: Implement forgot password
    console.log('Forgot password clicked')
  }

  const handleCreateAccount = () => {
    navigate('/register')
  }

  return (
    <LoginPage
      formData={formData}
      errors={errors}
      loading={loading}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onForgotPassword={handleForgotPassword}
      onCreateAccount={handleCreateAccount}
    />
  )
}
