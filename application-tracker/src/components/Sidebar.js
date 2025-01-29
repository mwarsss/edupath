import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css"; // Import custom CSS for sidebar

const Sidebar = () => {
    return (
        <div className="sidebar bg-light">
            <ul className="list-unstyled">
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/students">Students</Link>
                </li>
                <li>
                    <Link to="/analytics">Analytics</Link>
                </li>
                <li>
                    <Link to="/notifications">Notifications</Link>
                </li>
                <li>
                    <Link to="/add-applicant">Add Applicant</Link>
                </li>
                <li>
                    <Link to="/staff-dashboard">Staff Dashboard</Link>
                </li>
                <li>
                    <Link to="/add-application">Add Application</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
