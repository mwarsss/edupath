import React, { useState, useEffect } from "react";
import axios from 'axios';


const StaffDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //Fetch all applications
    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/applications', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setApplications(response.data);
            } catch (error) {
                console.error("Error fetching applications", error);
            }
        };

        fetchApplications();
    }, []);

    //Filter applications based on search term
    const filteredApplications = applications.filter((app) =>
        app.student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>All Applications</h2>
            <input
                type="text"
                placeholder="Search by student name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Application Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApplications.map((app) => (
                        <tr key={app.id}>
                            <td>{app.student.name}</td>
                            <td>{app.status}</td>
                            <td>
                                <button className="btn btn-sm btn-primary">Edit</button>
                            </td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
        </div>
    );
};

export default StaffDashboard;