import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import RegisterPage from '../pages/Register.jsx'
import useAuth from '../hooks/useAuth.js'

export default function RegisterContainer() {
  const navigate = useNavigate()
  const { handleRegister } = useAuth()
  const { loading } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
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
    if (!formData.name) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.agree) {
      newErrors.agree = 'You must agree to the terms'
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
      await handleRegister({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      })
      
      // Magic Onboarding Flow: Check if user entered a URL on the landing page
      const pendingUrl = sessionStorage.getItem('pendingMonitoringUrl');
      if (pendingUrl) {
        try {
          const { createWebsite } = await import('../../dashboard/services/website.api.js');
          await createWebsite({ url: pendingUrl });
          sessionStorage.removeItem('pendingMonitoringUrl');
        } catch (websiteErr) {
          console.error("Failed to automatically add website:", websiteErr);
          // We still navigate to dashboard even if auto-add fails
        }
      }

      navigate('/dashboard')
    } catch (err) {
      setErrors({
        submit: err?.message || 'Registration failed. Please try again.',
      })
    }
  }

  return (
    <RegisterPage
      formData={formData}
      errors={errors}
      loading={loading}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
    />
  )
}
