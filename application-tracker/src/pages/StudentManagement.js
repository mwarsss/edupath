import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const updateStudent = async (id, updates) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://127.0.0.1:8000/api/students/update/${id}/`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/students/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Student Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
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
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => updateStudent(student.id, { application_status: "Approved" })}
                      >
                        Approve
                      </button>
                      <Link to={`/students/update/${student.id}`} className="btn btn-sm btn-secondary">
                        Update
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteStudent(student.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentManagement;
