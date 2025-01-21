import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/applications/", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            search: search,
            status: statusFilter,
          },
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
  }, [search, statusFilter]);

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
      <h2 className="mb-4">Dashboard</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search applications"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control mb-2"
        />
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
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
