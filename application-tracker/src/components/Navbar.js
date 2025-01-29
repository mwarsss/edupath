import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css"; // Import custom CSS

const Navbar = () => {
    const isLoggedIn = !!localStorage.getItem("token");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm" style={{ padding: "10px 0" }}>
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Application Tracker
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <button className="nav-link btn btn-link text-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Login
                                </Link>
                            </li>
                        )}
                        {!isLoggedIn && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">
                                    Register
                                </Link>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link" to="/onboarding">
                                Onboarding
                            </Link>
                        </li>
                        {!isLoggedIn && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/unauthorized">
                                    Unauthorized
                                </Link>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/students">
                                Students
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/analytics">
                                Analytics
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/notifications">
                                Notifications
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/add-applicant">
                                Add Applicant
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/staff-dashboard">
                                Staff 
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/add-application">
                                Add Application
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
