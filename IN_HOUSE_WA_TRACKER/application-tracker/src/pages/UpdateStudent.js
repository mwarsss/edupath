import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateStudent = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    course_applied: '',
    program: '',
    application_status: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/students/list/');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      date_of_birth: student.date_of_birth,
      address: student.address,
      course_applied: student.course_applied,
      program: student.program,
      application_status: student.application_status
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/students/update/${selectedStudent.id}/`, formData);
      fetchStudents(); // Refresh the student list
      setSelectedStudent(null); // Clear the form
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Update Student</h2>
      <div className="row">
        <div className="col-md-6">
          <h3>Student List</h3>
          <ul className="list-group">
            {students.map((student) => (
              <li
                key={student.id}
                className="list-group-item"
                onClick={() => handleSelectStudent(student)}
              >
                {student.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          {selectedStudent && (
            <div>
              <h3>Update Student Details</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Course Applied</label>
                  <input
                    type="text"
                    className="form-control"
                    name="course_applied"
                    value={formData.course_applied}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Program</label>
                  <input
                    type="text"
                    className="form-control"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Application Status</label>
                  <input
                    type="text"
                    className="form-control"
                    name="application_status"
                    value={formData.application_status}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Student
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateStudent;