import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ResetPasswordPage from '../pages/ResetPassword.jsx'
import { resetPassword } from '../services/auth.api.js'

export default function ResetPasswordContainer() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
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
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await resetPassword(token, email, formData.newPassword)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ResetPasswordPage
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