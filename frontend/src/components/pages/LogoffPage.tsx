import React from 'react';
import {useNavigate} from 'react-router';

function LogoffPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login', {replace: true}); // eslint-disable-line @typescript-eslint/no-floating-promises
  }, [navigate]);

  return null;
}

export default LogoffPage;
