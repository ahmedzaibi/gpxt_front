import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

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
        localStorage.setItem("user",JSON.stringify(jwtDecode(data.token)));
        navigate('/upload');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div
    className="hero min-h-screen"
    style={{
      backgroundImage: 'url("/images/bg1.jpg")',
    }}
  >
  
      <div className="hero-content text-neutral-content text-center flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-base-100 shadow-xl p-6 rounded-lg">
          
          {<h2 className="text-2xl font-semibold card-title mb-1 text-black">
              Welcome back!
            </h2>}
          <div className="flex flex-col items-center w-full">
            
            <h3 className="text-sm text-gray-500 text-center mb-4">
              Please enter your credentials
            </h3>
          </div>

          {error && (
            <div className="text-sm text-red-500 mb-3 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="#000000">
                <path d="M16 12A4 4 0 1 1 8 12a4 4 0 0 1 8 0Z" />
                <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z" />
              </svg>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username"
                className="grow"
                required
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="black">
                <path d="M12 15c.88 0 1.3-.5 2-1.5.7-1 1-2 1-2.5a3 3 0 1 0-6 0c0 .5.3 1.5 1 2.5s1.12 1.5 2 1.5Z" />
                <path d="M17 10V8a5 5 0 0 0-10 0v2M5 10h14v10H5V10Z" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="grow"
                required
              />
            </label>

            <div className="form-control">
              <label className="cursor-pointer label justify-start gap-3">
                <input type="checkbox" className="toggle toggle-sm" />
                <span className="label-text text-sm text-gray-500">Remember me</span>
              </label>
            </div>

            <button type="submit" className="btn btn-neutral btn-outline w-full">
              Login
            </button>
          </form>

          <div className="divider"></div>

          <button className="btn bg-black text-white border-black w-full">
            <svg aria-label="GitHub logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="white" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path>
            </svg>
            Login with GitHub
          </button>

          <button className="btn bg-white text-black border-[#e5e5e5] w-full">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
              </g>
            </svg>
            Login with Google
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/register" className="text-primary font-semibold">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
