import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' }); // success or error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' }); // reset alert
    try {
      const res = await axios.post('/login', { email, password });
      setAlert({ type: 'success', message: res.data.message });
      setTimeout(() => navigate('/dashboard'), 1500); // redirect after showing alert
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Login failed',
      });
    }
  };

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
      }}
    >
      <div className="card shadow-lg border-0 p-4" style={{ width: '400px', background: '#c9d5e9' }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold" style={{ color: '#1e3c72' }}>Taskly</h1>
          <p className="text-muted">Login to your account</p>
        </div>

        {/* Alert */}
        {alert.message && (
          <div className={`alert alert-${alert.type} shadow-sm`} role="alert">
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-black">Email</label>
            <input
              type="email"
              className="form-control border-0"
              style={{ backgroundColor: '#2a3b5c', color: '#fff' }}
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
              style={{ backgroundColor: '#2a3b5c', color: '#fff' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-100 mb-2 p-2"
            style={{
              backgroundColor: '#1e3c72',
              color: '#fff',
              border: 'none',
            }}
          >
            Login
          </button>
          <button
            type="button"
            className="btn text-black btn-outline-light w-100"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
