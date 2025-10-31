import { BrowserRouter,Routes,Route} from "react-router-dom";
// import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

function App() {
  
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route element={<Home/>} path="/"/>
        {/* Default route for 404 Not Found */}
        <Route element={<NotFound/>} path="*"/>
        {/* Other pages */}
        <Route element={<Messages/>} path="/messages"/>
        <Route element={<Notifications/>} path="/notifications"/>
        <Route element={<Settings/>} path="/settings"/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
