import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (!token || !storedRole) {
      navigate('/login');
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div>
      {role === 'admin' && <h1>Welcome to the Admin Dashboard</h1>}
      {role === 'user' && <h1>Welcome to the User Dashboard</h1>}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
