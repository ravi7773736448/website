import Login from "../features/auth/pages/Login.jsx"
import Register from "../features/auth/pages/Register.jsx"
import Landing from "../features/landing/pages/Landing.jsx"
import Dashboard from "../features/dashboard/pages/Dashboard.jsx"

const routes = [
    {path: "/", element: <Landing/>},
    {path: "/login", element: <Login/>},
    {path: "/register", element: <Register/>},
    {path: "/dashboard", element: <Dashboard/>}
]

export default routes