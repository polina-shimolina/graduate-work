import React from 'react';

function Login() {
  return (
    <form>
      <h1>Login</h1>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />  
      <button type="submit">Login</button>
    </form>
  );
}

function Register() {
  return (
    <form>
      <h1>Create Account</h1>
      <input type="text" placeholder="Username" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>  
  );
}

export { Login, Register };