import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Don't show navigation on login page
  const isLoginPage = location.pathname === '/';
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && (
        <nav className="bg-primary text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-xl">XML Form Alchemy</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/upload" className="hover:text-primary-content hover:underline">Upload</Link>
              <Link to="/form-render" className="hover:text-primary-content hover:underline">Form Preview</Link>
              <Link to="/" className="btn btn-sm btn-outline btn-accent">Logout</Link>
            </div>
          </div>
        </nav>
      )}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-neutral text-neutral-content p-4 text-center text-sm">
        <p>© 2023 XML Form Alchemy - Transform XML to beautiful forms</p>
      </footer>
    </div>
  );
};

export default Layout;