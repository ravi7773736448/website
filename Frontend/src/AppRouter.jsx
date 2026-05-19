import routes from "./app/routes.jsx"
import { Routes, Route } from "react-router-dom"
import PrivateRoute from "./features/auth/components/PrivateRoute.jsx"
import PublicRoute from "./features/auth/components/PublicRoute.jsx"

const AppRouter = () => {
  return (
    <Routes>
      {routes.map((route, index) => {
        let element = route.element;
        
        if (route.isPrivate) {
          element = <PrivateRoute>{element}</PrivateRoute>;
        } else if (route.isPublicOnly) {
          element = <PublicRoute>{element}</PublicRoute>;
        }
        
        return <Route key={index} path={route.path} element={element} />
      })}
    </Routes>
  )
}

export default AppRouter