const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; // Перенаправление на страницу входа
  };
  
  export default handleLogout;