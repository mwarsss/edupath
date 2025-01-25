import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://127.0.0.1:8000/api/students/?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch students.");
      setLoading(false);
    }
  };

  const updateStudent = async (id, updates) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/students/${id}/`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Student updated successfully!");
      fetchStudents(); // Refresh the list
    } catch (err) {
      alert("Failed to update student.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchQuery]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="container">
      <h2>Student Management</h2>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control my-3"
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>{student.course_applied}</td>
              <td>{student.application_status}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => updateStudent(student.id, { application_status: "Approved" })}
                >
                  Approve
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => updateStudent(student.id, { application_status: "Rejected" })}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManagement;
