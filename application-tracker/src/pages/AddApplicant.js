import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddApplicant = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [courseApplied, setCourseApplied] = useState('');
  const [program, setProgram] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:8000/api/applicants/add/', {
        name,
        email,
        phone,
        date_of_birth: dateOfBirth,
        address,
        course_applied: courseApplied,
        program,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to add applicant.');
      setMessage('');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Applicant</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Course Applied</label>
          <input
            type="text"
            className="form-control"
            value={courseApplied}
            onChange={(e) => setCourseApplied(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Program</label>
          <input
            type="text"
            className="form-control"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Applicant</button>
      </form>
    </div>
  );
};

export default AddApplicant;