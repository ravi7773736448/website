import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Activity, ArrowRight } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useAuth from '../hooks/useAuth.js'

function InputField({ label, name, type = "text", placeholder, value, onChange, error, icon: Icon, rightElement }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${error ? 'text-red-400' : 'text-slate-400'}`}
          />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full h-12 bg-white text-sm text-slate-900 placeholder-slate-400
            border rounded-xl outline-none transition-all duration-200
            ${Icon ? "pl-11" : "pl-4"}
            ${rightElement ? "pr-11" : "pr-4"}
            ${error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-slate-200 hover:border-slate-300 focus:border-[#2E31FF] focus:ring-4 focus:ring-[#2E31FF]/10"
            }
          `}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  const { loading, error: reduxError } = useSelector(state => state.auth)

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", remember: false })
  const [errors, setErrors] = useState({})

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
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
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
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
    console.log('Forgot password clicked')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col justify-center items-center relative overflow-hidden font-sans p-6">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#2E31FF 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* Logo Area (Top Left) */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10 flex items-center gap-2.5">
        <div className="h-10 w-10 rounded-xl bg-[#2E31FF] flex items-center justify-center shadow-lg shadow-[#2E31FF]/20">
          <Activity size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">pingGuard</span>
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {(errors.submit || reduxError) && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                <p className="text-sm text-red-700 font-medium">{errors.submit || reduxError}</p>
              </div>
            )}

            <InputField
              label="Email address"
              name="email"
              type="email"
              placeholder="alex@company.com"
              value={formData.email}
              onChange={handleFieldChange}
              error={errors.email}
              icon={Mail}
            />

            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleFieldChange}
              error={errors.password}
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleFieldChange}
                    className="peer appearance-none w-4 h-4 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E31FF]/20 checked:bg-[#2E31FF] checked:border-[#2E31FF] transition-all cursor-pointer"
                  />
                  <svg className="absolute w-2.5 h-2.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-[#2E31FF] hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                mt-2 h-12 w-full rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2
                transition-all duration-200 shadow-sm
                ${loading
                  ? "bg-indigo-400 text-white cursor-not-allowed"
                  : "bg-[#2E31FF] hover:bg-indigo-600 active:bg-indigo-700 hover:shadow-md hover:shadow-[#2E31FF]/25 text-white"
                }
              `}
            >
              {loading ? "Signing in…" : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-sm text-slate-500">Don't have an account?</span>
            <Link to="/register" className="text-sm font-bold text-[#2E31FF] hover:text-indigo-700 transition-colors">
              Create account
            </Link>
          </div>

        </div>

        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-slate-400">
            &copy; {new Date().getFullYear()} pingGuard Inc. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}