import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/applications/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data.applications || []);
        setIsStaff(response.data.is_staff); // Assuming the backend sends `is_staff`
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch applications.");
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://127.0.0.1:8000/api/applications/${id}/`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2 className="text-danger">{error}</h2>;
  }

  return (
    <div className="container mt-4">
      {isStaff ? (
        <h2 className="mb-4">Welcome, Staff! Here's the list of all applications</h2>
      ) : (
        <h2 className="mb-4">Welcome! Here are your applications:</h2>
      )}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Student Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.student.name}</td>
                <td>
                  {app.status}
                  {isStaff && (
                    <select
                      className="form-select form-select-sm"
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                    >
                      <option disabled selected>
                        Update Status
                      </option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-primary">View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No applications found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
