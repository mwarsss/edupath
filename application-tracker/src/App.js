import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import StudentManagement from './pages/StudentManagement';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container mt-4">
          <Routes>
             {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Private Route */}
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/students" element={<StudentManagement />} />
            
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
