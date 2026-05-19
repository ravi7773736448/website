import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'

function InputField({ label, name, type = "text", placeholder, value, onChange, error, icon: Icon, rightElement }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888888' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={16}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              transition: 'color 0.15s ease',
              color: error ? '#ef4444' : (focused ? '#f5f5f5' : '#555555')
            }}
          />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            height: '46px',
            backgroundColor: '#161616',
            color: '#f5f5f5',
            fontSize: '14px',
            fontFamily: 'inherit',
            paddingLeft: Icon ? '42px' : '14px',
            paddingRight: rightElement ? '42px' : '14px',
            border: `1px solid ${error ? '#ef4444' : (focused ? '#333333' : '#1f1f1f')}`,
            borderRadius: '9px',
            outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
        />
        {rightElement && (
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
            {rightElement}
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0', fontWeight: '500' }}>{error}</p>}
    </div>
  );
}

export default function Login({ formData, errors, loading, onFieldChange, onSubmit }) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '24px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #161616 inset !important;
            -webkit-text-fill-color: #f5f5f5 !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '400px',
        backgroundImage: 'radial-gradient(circle at top, rgba(255,255,255,0.015) 0%, transparent 80%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div 
        style={{ 
          position: 'absolute', 
          top: '32px', 
          left: '32px', 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          zIndex: 10 
        }} 
        onClick={() => navigate('/')}
      >
        <span style={{ fontSize: '20px', fontWeight: '600', color: '#f5f5f5', letterSpacing: '-0.01em' }}>PingGuard</span>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
        <div style={{
          backgroundColor: '#111111',
          border: '1px solid #1f1f1f',
          borderRadius: '12px',
          padding: '40px 32px 32px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#f5f5f5', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: '#888888', margin: 0 }}>
              Sign in to your account to continue
            </p>
          </div>

          <button
            type="button"
            onClick={() => console.log('Continue with Google clicked')}
            style={{
              height: '46px',
              width: '100%',
              backgroundColor: '#161616',
              color: '#f5f5f5',
              border: '1px solid #1f1f1f',
              borderRadius: '9px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
              e.currentTarget.style.borderColor = '#333333';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#161616';
              e.currentTarget.style.borderColor = '#1f1f1f';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.7-1.57 2.69-3.88 2.69-6.57z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.34-1.59-5.05-3.73H.95v2.3C2.43 15.89 5.5 18 9 18z"/>
              <path fill="#FBBC05" d="M3.95 10.67c-.18-.54-.28-1.12-.28-1.67s.1-1.13.28-1.67V5.03H.95C.34 6.22 0 7.57 0 9s.34 2.78.95 3.97l3-2.3z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4C13.46.99 11.43 0 9 0 5.5 0 2.43 2.11.95 5.03l3 2.3c.71-2.14 2.7-3.75 5.05-3.75z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1f1f1f' }} />
            <span style={{ fontSize: '11px', color: '#444444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1f1f1f' }} />
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} noValidate>
            {(errors.submit) && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                borderLeft: '3px solid #ef4444',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                <p style={{ fontSize: '13px', color: '#ef4444', margin: 0, fontWeight: '500' }}>{errors.submit}</p>
              </div>
            )}

            <InputField
              label="Email address"
              name="email"
              type="email"
              placeholder="alex@company.com"
              value={formData.email}
              onChange={onFieldChange}
              error={errors.email}
              icon={Mail}
            />

            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={onFieldChange}
              error={errors.password}
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#555555',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#888888'}
                  onMouseLeave={e => e.currentTarget.style.color = '#555555'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={onFieldChange}
                  style={{
                    width: '14px',
                    height: '14px',
                    backgroundColor: '#161616',
                    border: '1px solid #1f1f1f',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    accentColor: '#f5f5f5'
                  }}
                />
                <span style={{ fontSize: '13px', color: '#888888' }}>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => console.log('Forgot password clicked')}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '13px',
                  color: '#888888',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f5f5f5'}
                onMouseLeave={e => e.currentTarget.style.color = '#888888'}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                height: '46px',
                width: '100%',
                backgroundColor: loading ? '#555555' : '#f5f5f5',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '9px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => { if(!loading) e.currentTarget.style.backgroundColor = '#e0e0e0' }}
              onMouseLeave={e => { if(!loading) e.currentTarget.style.backgroundColor = '#f5f5f5' }}
            >
              {loading ? "Signing in…" : (
                <>
                  Sign in
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', fontSize: '13px', borderTop: '1px solid #1f1f1f', paddingTop: '20px' }}>
            <span style={{ color: '#555555' }}>Don't have an account?</span>
            <Link to="/register" style={{ color: '#888888', textDecoration: 'none', fontWeight: '600', transition: 'color 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f5f5f5'}
                  onMouseLeave={e => e.currentTarget.style.color = '#888888'}>
              Create account
            </Link>
          </div>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#555555', margin: 0 }}>
            &copy; {new Date().getFullYear()} PingGuard Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}