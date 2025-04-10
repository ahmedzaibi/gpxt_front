// src/interfaces/login/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/users/authentification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        navigate('/upload'); // Redirect to XML upload page
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      // For demo purposes, allow direct navigation
      navigate('/upload');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-base-100 to-base-200">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <h1 className="text-3xl font-bold text-primary mt-2">XML Form Alchemy</h1>
          <p className="text-base-content/70 mt-2">Sign in to transform your XML documents</p>
        </div>
        
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-semibold mb-6">Sign In</h2>
            
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your username"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input input-bordered w-full"
                  required
                />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover text-primary">Forgot password?</a>
                </label>
              </div>
              
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary w-full">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
