import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                email,
                password,
            });
            localStorage.setItem("token", response.data.token); //Save token
            alert("Login successful");    
            } catch (error) {
            alert("Login failed");
        }  
    }
}

return (
    <form onSubmit={handleLogin}>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            requires
        />
        .0.
        </form>
    )