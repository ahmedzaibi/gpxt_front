import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail'); 
    localStorage.clear(); 
    if (rememberedEmail) {
      localStorage.setItem('rememberedEmail', rememberedEmail); 
    }
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;
