import { BrowserRouter,Routes,Route} from "react-router-dom";
// navbar imports
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<Home/>} path="/"/>
        <Route element={<Messages/>} path="/messages"/>
        {/* Default route for 404 Not Found */}
        <Route element={<NotFound/>} path="*"/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
