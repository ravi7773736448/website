import LoginContainer from "../features/auth/containers/LoginContainer.jsx"
import RegisterContainer from "../features/auth/containers/RegisterContainer.jsx"
import Landing from "../features/landing/pages/Landing.jsx"
import Dashboard from "../features/dashboard/pages/Dashboard.jsx"

const routes = [
    {path: "/", element: <Landing/>, isPublicOnly: true},
    {path: "/login", element: <LoginContainer/>, isPublicOnly: true},
    {path: "/register", element: <RegisterContainer/>, isPublicOnly: true},
    {path: "/dashboard", element: <Dashboard/>, isPrivate: true}
]

export default routes