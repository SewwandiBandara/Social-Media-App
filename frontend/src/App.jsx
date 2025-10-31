import { BrowserRouter,Routes,Route} from "react-router-dom";
// navbar imports
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";



function App() {
  
  return (
    <BrowserRouter>
    <Routes>
        <Route element={<Home/>} path="/"/>
         {/* Default route for 404 Not Found */}
        <Route element={<NotFound/>} path="*"/> 
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
