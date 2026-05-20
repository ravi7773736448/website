import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ForgotPasswordPage from '../pages/ForgotPassword.jsx'
import { forgotPassword } from '../services/auth.api.js'

export default function ForgotPasswordContainer() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    email: '',
  })

  const [errors, setErrors] = useState({})

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
    setErrorMsg('')
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
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

    setLoading(true)
    setErrorMsg('')

    try {
      await forgotPassword(formData.email)
      setSuccess(true)
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ForgotPasswordPage
      formData={formData}
      errors={errors}
      loading={loading}
      success={success}
      errorMsg={errorMsg}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
    />
  )
}