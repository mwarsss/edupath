import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/students/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchQuery },
      });
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch students.");
      setLoading(false);
    }
  }, [searchQuery]);

  const updateStudent = async (id, updates) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
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
  }, [searchQuery, fetchStudents]);

  if (loading) return <h2>Loading...</h2>;

  if (error) {
    return <h2 className="text-danger">{error}</h2>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Student Management</h2>
      <input
        type="text"
        placeholder="Search students"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control mb-2"
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>Course Applied</th>
            <th>Application Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.date_of_birth}</td>
                <td>{student.address}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManagement;
