import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "linear-gradient(135deg, #1e3c72, #2a5298)" }}>
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center px-5 py-3 text-white">
        <h1 className="fw-bold">Taskly</h1>
        <div>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-light text-primary me-2"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="btn btn-outline-light"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center text-center px-3">
        <h2 className="display-4 fw-bold text-white mb-3">
          Organize. Track. Achieve.
        </h2>
        <p className="lead text-light mb-4" style={{ maxWidth: "700px" }}>
          Taskly is your modern project management system. Assign tasks, track
          progress, collaborate with your team, and get things done efficiently.
        </p>
        <div>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-light btn-lg me-2"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/register")}
            className="btn btn-outline-light btn-lg"
          >
            Sign Up
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h3 className="mb-5 text-primary fw-bold">Features of Taskly</h3>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title fw-semibold">Task Management</h5>
                  <p className="card-text">Organize your tasks, set priorities, and never miss a deadline.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title fw-semibold">Team Collaboration</h5>
                  <p className="card-text">Assign tasks to teammates, track progress, and communicate efficiently.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title fw-semibold">Progress Tracking</h5>
                  <p className="card-text">Monitor task status, see what’s done, and focus on what matters most.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-white" style={{ background: "#0f2145" }}>
        &copy; 2025 Taskly. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
