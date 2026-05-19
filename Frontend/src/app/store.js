import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/state/auth.slice.js'
import dashboardReducer from '../features/dashboard/state/dashboard.slice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
})

export default store
