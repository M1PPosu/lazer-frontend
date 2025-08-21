
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import UserPage from './pages/UserPage';
import SettingsPage from './pages/SettingsPage';
import RankingsPage from './pages/RankingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="users/:userId" element={<UserPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="rankings" element={<RankingsPage />} />
            <Route path="beatmaps" element={<div className="p-8"><h1 className="text-2xl font-bold">谱面（即将推出）</h1></div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
