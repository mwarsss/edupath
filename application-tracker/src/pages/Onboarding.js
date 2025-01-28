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
  const [status, setStatus] = useState('Pending');
  const [submissionData, setSubmissionData] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('student', JSON.stringify({
      name,
      email,
      phone,
      date_of_birth: dateOfBirth,
      address,
      course_applied: courseApplied
    }));
    formData.append('status', status);
    formData.append('document', document);
    formData.append('submission_data', JSON.stringify({ name, email, phone, dateOfBirth, address, courseApplied }));

    try {
      const response = await axios.put('http://127.0.0.1:8000/api/applications/1/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccess('Application updated successfully!');
        // Clear form fields
        setName('');
        setEmail('');
        setPhone('');
        setDateOfBirth('');
        setAddress('');
        setCourseApplied('');
        setDocument(null);
        setStatus('Pending');
        setSubmissionData({});
      }
    } catch (err) {
      setError('Failed to update application. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Onboarding</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" className="form-control" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
        </div>
        <div className="form-group">
          <label>Course Applied</label>
          <input type="text" className="form-control" value={courseApplied} onChange={(e) => setCourseApplied(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Document</label>
          <input type="file" className="form-control" onChange={(e) => setDocument(e.target.files[0])} required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default Onboarding;