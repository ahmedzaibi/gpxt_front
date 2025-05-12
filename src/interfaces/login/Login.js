import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedEmail');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true); 
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/users/authentification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);

        // Save token and user info
        localStorage.setItem('user', JSON.stringify(jwtDecode(data.token)));
        localStorage.setItem('token', data.token);

        // Manage remember me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', username);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        navigate('/upload');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <section className="min-h-screen flex items-stretch text-white">
      <div
        className="lg:flex w-1/2 hidden bg-no-repeat bg-center bg-cover relative items-center"
        style={{ backgroundImage: 'url(/images/bg_login.png)' }}
      >
        <div className="absolute bg-black opacity-60 "></div>
      </div>

      <div
        className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0"
        style={{ backgroundColor: '#161616' }}
      >
        <div
          className="absolute lg:hidden z-10 inset-0 bg-no-repeat bg-center bg-cover items-center"
          style={{ backgroundImage: 'url(/images/bg_login.png)' }}
        >
          <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        </div>

        <div className="w-full py-6 z-20">
          <div className="w-full z-10 flex items-center justify-end">
            <h1 className="text-2xl font-semibold tracking-wide pl-2 hover:text-[#FFCA23]" style={{ fontFamily: 'Hurme Geometric Sans 3, sans-serif', fontWeight: 300 }}>
              Together, we shape the future.
            </h1>
            <img src="/images/logosopra.png" alt="Logo" className="h-16" />
          </div>

          <div className="py-6 space-x-2"></div>

          {error && (
            <div className="text-sm text-red-500 mb-3 text-center">{error}</div>
          )}

          <div className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="pb-2 pt-4">
                <input
                  
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="pb-2 pt-4">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-center items-center text-white-400 background-white hover:text-gray-100">
                <input
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  type="checkbox"
                  className="toggle border-white bg-white checked:border-white checked:bg-white-600 checked:text-black"
                />
                <p className="pl-2">Remember me</p>
              </div>

              <div className="pb-2 pt-4">
                <button
                  type="submit"
                  className="btn btn-neutral w-full text-white text-lg btn-outline bg-black hover:bg-white hover:text-black transition duration-200 ease-in-out"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
