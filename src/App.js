import "./App.css";
import Navbar from "./components/Navbar";

import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./contexts/Auth";
import PrivateRoute from "./PrivateRoute";
import Home from "./pages/Home";
import CategoryDetail from "./pages/CategoryDetail";
import { BagProvider } from "./contexts/Bag";
import Bag from "./pages/Bag";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile";
function App() {
  return (
    <AuthProvider>
      <BagProvider>
      
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/bag" element={<Bag />}></Route>
            <Route path="/category" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route
              path="/category/:catName"
              element={<CategoryDetail />}
            ></Route>
          </Route>

          <Route path="/auth/login" element={<Login />}></Route>
          <Route path="/auth/register" element={<Signup />}></Route>
        </Routes>
      </BagProvider>
    </AuthProvider>
  );
}

export default App;
