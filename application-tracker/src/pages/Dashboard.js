import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/applications/", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            status: statusFilter,
            search: searchQuery,
            ordering: sortField ? `${sortOrder === "asc" ? "" : "-"}${sortField}` : "",
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
  }, [statusFilter, searchQuery, sortField, sortOrder]);

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
      <div className="d-flex justify-content-between mb-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/students')}
        >
          View Students
        </button>
        <button
          className="btn btn-success"
          onClick={() => navigate('/onboarding')}
        >
          Add Applicant
        </button>
      </div>
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <input
            type="text"
            placeholder="Search applications"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-3 mb-2">
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
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="status">Status</option>
            <option value="student__name">Student Name</option>
            <option value="created_at">Created At</option>
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
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
          {applications && applications.length > 0 ? (
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
              <td colSpan="4" className="text-center">
                No applications found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
