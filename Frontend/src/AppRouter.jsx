import routes from "./app/routes.jsx"
import {Routes,Route} from "react-router-dom"

routes
const AppRouter = () => {
  return (

    <Routes>
        {routes.map((route,index) => <Route key={index} path={route.path} element={route.element}/>)}
    </Routes>
    
  )
}

export default AppRouter