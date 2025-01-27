import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import StudentManagement from './pages/StudentManagement';
import Analytics from './pages/Analytics';
import Onboarding from './pages/Onboarding';
import Notifications from './pages/Notifications'; // Import the Notifications component

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Private Routes */}
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/students" element={<PrivateRoute component={StudentManagement} />} />
            <Route path="/analytics" element={<PrivateRoute component={Analytics} />} />
            <Route path="/notifications" element={<PrivateRoute component={Notifications} />} /> {/* Add the Notifications route */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
