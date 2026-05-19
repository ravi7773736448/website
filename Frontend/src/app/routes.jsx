import LoginContainer from "../features/auth/containers/LoginContainer.jsx"
import RegisterContainer from "../features/auth/containers/RegisterContainer.jsx"
import Landing from "../features/landing/pages/Landing.jsx"
import Dashboard from "../features/dashboard/pages/Dashboard.jsx"
import DashboardLayout from "../components/layout/DashboardLayout.jsx"

const routes = [
    {path: "/", element: <Landing/>, isPublicOnly: true},
    {path: "/login", element: <LoginContainer/>, isPublicOnly: true},
    {path: "/register", element: <RegisterContainer/>, isPublicOnly: true},
    {
        path: "/dashboard",
        element: (
            <DashboardLayout title="Dashboard">
                <Dashboard />
            </DashboardLayout>
        ),
        isPrivate: true
    },
    {
        path: "/websites",
        element: (
            <DashboardLayout title="Websites">
                <div className="text-zinc-400">Websites page coming soon...</div>
            </DashboardLayout>
        ),
        isPrivate: true
    },
    {
        path: "/incidents",
        element: (
            <DashboardLayout title="Incidents">
                <div className="text-zinc-400">Incidents page coming soon...</div>
            </DashboardLayout>
        ),
        isPrivate: true
    },
    {
        path: "/analytics",
        element: (
            <DashboardLayout title="Analytics">
                <div className="text-zinc-400">Analytics page coming soon...</div>
            </DashboardLayout>
        ),
        isPrivate: true
    },
    {
        path: "/settings",
        element: (
            <DashboardLayout title="Settings">
                <div className="text-zinc-400">Settings page coming soon...</div>
            </DashboardLayout>
        ),
        isPrivate: true
    }
]

export default routes