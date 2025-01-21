import React, { useState, useEffect } from "react";
import axios from 'axios';

const CustomerDashboard = () => {
    const [applications, setApplications] = useState([]);

    //Fetch applications form Django API
    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/applications/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setApplications(response.data);
            } catch (error) {
                console.error("Ërror fetching applications", error);
            }
        };
        
        fetchApplications();
    }, []);

    return (
        <div>
            <h2>Your Applications</h2>
            <ul>
                {applications.map((app) => (
                    <li key={app.id}>
                        {app.name} - Status: {app.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerDashboard;