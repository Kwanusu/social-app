import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext"; // 👈 Add this import
import MainLayout from './components/MainLayout';
import Feed from './pages/Feed';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import  Settings  from "./pages/Settings";

function App() {
  return (
    <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/feed" replace/>} />
                <Route path="feed" element={<Feed />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
    </Provider>
  );
}

export default App;

