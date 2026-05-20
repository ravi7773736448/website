import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Link, useSearchParams, useNavigate } from 'react-router-dom'

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

export default function ResetPassword({ formData, errors, loading, success, errorMsg, onFieldChange, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
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
        <div style={{
          backgroundColor: '#111111',
          border: '1px solid #1f1f1f',
          borderRadius: '12px',
          padding: '40px 32px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <XCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 12px' }}>Invalid Reset Link</h2>
          <p style={{ fontSize: '14px', color: '#888888', margin: '0 0 24px' }}>
            This password reset link is invalid or has expired.
          </p>
          <Link 
            to="/forgot-password" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#f5f5f5', 
              backgroundColor: '#f5f5f5',
              color: '#0a0a0a',
              padding: '12px 24px',
              borderRadius: '9px',
              textDecoration: 'none', 
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={14} />
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

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
        onClick={() => window.location.href = '/'}
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
              Reset password
            </h1>
            <p style={{ fontSize: '14px', color: '#888888', margin: 0 }}>
              Create a new password for your account.
            </p>
          </div>

          {success ? (
            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(34, 197, 94, 0.05)',
              border: '1px solid rgba(34, 197, 94, 0.15)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle size={20} color="#22c55e" />
              <div>
                <p style={{ fontSize: '14px', color: '#22c55e', margin: 0, fontWeight: '500' }}>Password reset!</p>
                <p style={{ fontSize: '13px', color: '#888888', margin: '4px 0 0' }}>
                  Your password has been updated. You can now sign in.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} noValidate>
              {(errorMsg) && (
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
                  <XCircle size={16} color="#ef4444" />
                  <p style={{ fontSize: '13px', color: '#ef4444', margin: 0, fontWeight: '500' }}>{errorMsg}</p>
                </div>
              )}

              <InputField
                label="New password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Create a new password"
                value={formData.newPassword}
                onChange={onFieldChange}
                error={errors.newPassword}
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

              <InputField
                label="Confirm password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={onFieldChange}
                error={errors.confirmPassword}
                icon={Lock}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
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
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

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
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>
          )}

          {!success && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link 
                to="/login" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: '#888888', 
                  textDecoration: 'none', 
                  fontSize: '13px',
                  fontWeight: '600', 
                  transition: 'color 0.15s ease' 
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f5f5f5'}
                onMouseLeave={e => e.currentTarget.style.color = '#888888'}
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </div>
          )}
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