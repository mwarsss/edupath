import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
    return (
        <Router>
            <div>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/login" element={<h1>Login</h1>} />
                        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
                        <Route path="/" element={<h1>Home</h1>} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;