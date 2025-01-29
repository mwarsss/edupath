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
import Notifications from './pages/Notifications'; 
import AddApplicant from './pages/AddApplicant';
import UpdateStudent from './pages/UpdateStudent';
import Unauthorized from './pages/Unauthorized';
import StaffDashboard from './pages/StaffDashboard';
import { AddApplication } from './pages/AddApplication';

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
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Private Routes */}
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/students" element={<PrivateRoute component={StudentManagement} />} />
            <Route path="/analytics" element={<PrivateRoute component={Analytics} />} />
            <Route path="/notifications" element={<PrivateRoute component={Notifications} />} />
            <Route path="/add-applicant" element={<PrivateRoute component={AddApplicant} />} />
            <Route path='/staff-dashboard' element={<PrivateRoute component={StaffDashboard} />} />
            <Route path="/students/update/:id" element={<PrivateRoute component={UpdateStudent} />} />
            <Route path="/add-application" element={<PrivateRoute component={AddApplication} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
