import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { User, Lock, Camera, Save, Eye, EyeOff, CheckCircle, XCircle, Mail, Upload, X, Image, Loader2 } from 'lucide-react'
import { setUser } from '../../auth/state/auth.slice.js'
import axios from 'axios'

const authInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true
})

const getAvatarUrl = (avatar) => {
    if (!avatar) return null
    if (avatar.startsWith('/uploads') || avatar.startsWith('http') || avatar.startsWith('data:')) {
      return avatar
    }
    return avatar
  }

function InputField({ label, name, type = "text", placeholder, value, onChange, error, readOnly, icon: Icon }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888888' }}>
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
              color: focused ? '#f5f5f5' : '#555555'
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
          readOnly={readOnly}
          style={{
            width: '100%',
            height: '44px',
            backgroundColor: '#161616',
            color: readOnly ? '#666666' : '#f5f5f5',
            fontSize: '14px',
            fontFamily: 'inherit',
            paddingLeft: Icon ? '42px' : '14px',
            paddingRight: '14px',
            border: `1px solid ${error ? '#ef4444' : (focused ? '#333333' : '#1f1f1f')}`,
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
        />
      </div>
      {error && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0', fontWeight: '500' }}>{error}</p>}
    </div>
  )
}

export default function Profile() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    avatar: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || ''
      })
    }
  }, [user])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    setMessage({ type: '', text: '' })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await authInstance.post('/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setProfileData(prev => ({ ...prev, avatar: response.data.user.avatar }))
      dispatch(setUser(response.data.user))
      setMessage({ type: 'success', text: 'Profile image uploaded successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload image' })
    } finally {
      setUploading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setMessage({ type: '', text: '' })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await authInstance.put('/profile', {
        username: profileData.username,
        email: profileData.email,
        avatar: profileData.avatar
      })
      dispatch(setUser(response.data.user))
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await authInstance.put('/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  const isGoogleUser = user?.googleId && !user?.password

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
  ]

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#f5f5f5', marginBottom: '24px' }}>Profile Settings</h1>

      <div style={{ display: 'flex', gap: '24px', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1f1f1f', paddingBottom: '0' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #f5f5f5' : '2px solid transparent',
                color: activeTab === tab.id ? '#f5f5f5' : '#666666',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {message.text && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {message.type === 'success' ? <CheckCircle size={16} color="#22c55e" /> : <XCircle size={16} color="#ef4444" />}
            <p style={{ fontSize: '14px', color: message.type === 'success' ? '#22c55e' : '#ef4444', margin: 0 }}>
              {message.text}
            </p>
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
              <div style={{ position: 'relative' }}>
                {profileData.avatar ? (
                  <img
                    src={getAvatarUrl(profileData.avatar)}
                    alt="Profile"
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #1f1f1f' }}
                  />
                ) : (
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: '#161616',
                    border: '2px solid #1f1f1f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={40} color="#666666" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#f5f5f5',
                    border: '2px solid #0a0a0a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => { if (!uploading) e.currentTarget.style.backgroundColor = '#e0e0e0' }}
                  onMouseLeave={e => { if (!uploading) e.currentTarget.style.backgroundColor = '#f5f5f5' }}
                >
                  {uploading ? (
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Camera size={16} color="#0a0a0a" />
                  )}
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#888888', marginBottom: '12px', fontWeight: '500' }}>Profile Photo</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#f5f5f5',
                        color: '#0a0a0a',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={e => { if (!uploading) e.currentTarget.style.backgroundColor = '#e0e0e0' }}
                      onMouseLeave={e => { if (!uploading) e.currentTarget.style.backgroundColor = '#f5f5f5' }}
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Photo
                        </>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <input
                    type="text"
                    name="avatar"
                    value={profileData.avatar}
                    onChange={handleProfileChange}
                    placeholder="Or paste image URL here..."
                    style={{
                      width: '100%',
                      height: '44px',
                      backgroundColor: '#161616',
                      color: '#f5f5f5',
                      fontSize: '14px',
                      padding: '0 14px',
                      border: '1px solid #1f1f1f',
                      borderRadius: '8px',
                      outline: 'none',
                    }}
                  />
                  {profileData.avatar && (
                    <button
                      type="button"
                      onClick={() => setProfileData(prev => ({ ...prev, avatar: '' }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '13px',
                        cursor: 'pointer',
                        padding: '4px 0',
                        width: 'fit-content'
                      }}
                    >
                      <X size={14} />
                      Remove photo
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#666666', marginTop: '8px' }}>
                  {isGoogleUser ? 'Upload a custom photo to override your Google profile' : 'Or paste an image URL below'}
                </p>
              </div>
            </div>

            <InputField
              label="Username"
              name="username"
              placeholder="Enter your username"
              value={profileData.username}
              onChange={handleProfileChange}
              icon={User}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={profileData.email}
              onChange={handleProfileChange}
              icon={Mail}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '44px',
                width: 'fit-content',
                padding: '0 24px',
                backgroundColor: loading ? '#555555' : '#f5f5f5',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {isGoogleUser ? (
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(251, 191, 36, 0.05)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                borderRadius: '8px'
              }}>
                <p style={{ fontSize: '14px', color: '#fbbf24', margin: 0 }}>
                  You signed up with Google. Password management is not available for Google accounts.
                </p>
              </div>
            ) : (
              <>
                <InputField
                  label="Current Password"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  icon={Lock}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#555555', cursor: 'pointer', padding: '4px' }}
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                <InputField
                  label="New Password"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  icon={Lock}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#555555', cursor: 'pointer', padding: '4px' }}
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                <InputField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  icon={Lock}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#555555', cursor: 'pointer', padding: '4px' }}
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '44px',
                    width: 'fit-content',
                    padding: '0 24px',
                    backgroundColor: loading ? '#555555' : '#f5f5f5',
                    color: '#0a0a0a',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Lock size={16} />
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  )
}