const handleLogout = ({ onLogout }) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    localStorage.removeItem('lastName');
    localStorage.removeItem('firstName');
    onLogout()
  };
  
  export default handleLogout;