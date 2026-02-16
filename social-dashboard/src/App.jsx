import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import  MainLayout from './components/MainLayout';
import Feed from './pages/Feed';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Main Layout wraps all dashboard pages */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/feed" replace />} />
            <Route path="feed" element={<Feed />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile/:id" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
