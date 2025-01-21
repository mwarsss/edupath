import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            <Route path="/" element={<h1>Welcome to Application Tracker</h1>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
