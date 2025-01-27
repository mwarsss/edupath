import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login/", {
                username,
                password,
            });

            // Save token and role in local storage
            localStorage.setItem("token", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            localStorage.setItem("username", response.data.username);

            // Redirect to dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            if (error.response && error.response.data) {
                setError(error.response.data.error || "Invalid credentials");
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleLogin} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">
                    Login
                </button>
            </form>
            <div className="text-center mt-3">
                <p>Don't have an account?</p>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/register')}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Login;