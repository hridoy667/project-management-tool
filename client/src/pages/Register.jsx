import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: string }
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    try {
      const res = await axios.post("/register", { name, email, password });
      setAlert({ type: "success", message: res.data.message || "Registration successful!" });
      // Redirect after a short delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Registration failed" });
    }
  };

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{ width: "400px", background: "#c9d5e9" }}
      >
        <div className="text-center mb-4">
          <h1 className="fw-bold" style={{ color: "#1e3c72" }}>
            Taskly
          </h1>
          <p className="text-muted">Create a new account</p>
        </div>

        {/* Alert Card */}
        {alert && (
          <div
            className={`alert mb-3 p-2 text-center ${
              alert.type === "success" ? "alert-success" : "alert-danger"
            }`}
            role="alert"
            style={{
              borderRadius: "6px",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
              fontWeight: "500",
            }}
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-black">Name</label>
            <input
              type="text"
              className="form-control border-0"
              style={{ backgroundColor: "rgb(69, 102, 167)", color: "#fff" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-black">Email</label>
            <input
              type="email"
              className="form-control border-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-black">Password</label>
            <input
              type="password"
              className="form-control border-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-100 mb-2 p-2"
            style={{
              backgroundColor: "#1e3c72",
              color: "#fff",
              border: "none",
            }}
          >
            Register
          </button>
          <button
            type="button"
            className="btn text-black btn-outline-light w-100"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
