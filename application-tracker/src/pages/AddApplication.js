import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddApplication = () => {
  const [formData, setFormData] = useState({
    student: '',
    status: 'Pending',
    document: null,
    submission_data: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      document: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    const data = new FormData();
    data.append('student', formData.student);
    data.append('status', formData.status);
    data.append('document', formData.document);
    data.append('submission_data', formData.submission_data);

    try {
      await axios.post('http://127.0.0.1:8000/api/applications/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to submit application.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Application</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student</label>
          <input
            type="text"
            className="form-control"
            name="student"
            value={formData.student}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            className="form-control"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="form-group">
          <label>Document</label>
          <input
            type="file"
            className="form-control"
            name="document"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Submission Data</label>
          <textarea
            className="form-control"
            name="submission_data"
            value={formData.submission_data}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useState(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }
        const response = await axios.get('http://127.0.0.1:8000/api/applications/', {
          headers: { Authorization: `Bearer ${token}` },
          params: { search: searchQuery, status: statusFilter, sort: sortField, order: sortOrder },
        });
        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch applications.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [searchQuery, statusFilter, sortField, sortOrder]);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8000/api/applications/${id}/`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      setError('Failed to update status.');
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
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <input
            type="text"
            placeholder="Search applications"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <th>Submission Data</th>
            <th>Document</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.student.name}</td>
                <td>{JSON.stringify(application.submission_data)}</td>
                <td>
                  {application.document ? (
                    <a href={application.document} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  ) : (
                    'No Document'
                  )}
                </td>
                <td>{application.status}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => updateStatus(application.id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger ml-2"
                      onClick={() => updateStatus(application.id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No applications found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export { Dashboard, AddApplication };