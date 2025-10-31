import { BrowserRouter,Routes,Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";



function App() {
  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<Home/>} path="/"/>
        <Route element={<Messages/>} path="/messages"/>
        <Route element={<Notifications/>} path="/notifications"/>
        <Route element={<Settings/>} path="/settings"/>
        {/* Default route for 404 Not Found */}
        <Route element={<NotFound/>} path="*"/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
