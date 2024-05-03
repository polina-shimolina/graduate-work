const handleLogout = ({ onLogout }) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    onLogout()
  };
  
  export default handleLogout;