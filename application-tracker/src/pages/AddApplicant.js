import React, { useState } from "react";
import axios from "axios";

const AddApplicant = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course_applied: "",
    application_status: "Pending",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/applicants/add/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        course_applied: "",
        application_status: "Pending",
      });
    } catch (err) {
      setMessage("Failed to add applicant. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Applicant</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Course Applied</label>
          <input
            type="text"
            name="course_applied"
            className="form-control"
            value={formData.course_applied}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Add Applicant
        </button>
      </form>
    </div>
  );
};

export default AddApplicant;
