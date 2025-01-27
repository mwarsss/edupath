import React, { useState } from 'react';
import axios from 'axios';

const Onboarding = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [courseApplied, setCourseApplied] = useState('');
  const [document, setDocument] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOnboarding = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('date_of_birth', dateOfBirth);
    formData.append('address', address);
    formData.append('course_applied', courseApplied);
    formData.append('document', document);
    formData.append('submission_data', JSON.stringify({ name, email, phone, dateOfBirth, address, courseApplied }));  // Add this line

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/applications/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setSuccess('Application submitted successfully!');
        // Clear form fields
        setName('');
        setEmail('');
        setPhone('');
        setDateOfBirth('');
        setAddress('');
        setCourseApplied('');
        setDocument(null);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Submission failed');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Onboarding</h2>
      <form onSubmit={handleOnboarding} className="mt-4">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="date_of_birth" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            id="date_of_birth"
            className="form-control"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <textarea
            id="address"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="course_applied" className="form-label">
            Course Applied
          </label>
          <input
            type="text"
            id="course_applied"
            className="form-control"
            value={courseApplied}
            onChange={(e) => setCourseApplied(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="document" className="form-label">
            Supporting Document
          </label>
          <input
            type="file"
            id="document"
            className="form-control"
            onChange={(e) => setDocument(e.target.files[0])}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default Onboarding;