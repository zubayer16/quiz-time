import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from '../../graphql/mutations/user';
import { useAuth } from '../../context/AuthContext';

//function Login() {
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION);
  const [localError, setLocalError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginMutation({
        variables: { email, password },
      });

      console.log('Login response:', response);

      if (response.data && response.data.login) {
        const { token, userId } = response.data.login; // Destructure token and userId
        login(token, userId); // Pass both arguments to the AuthContext login function
        navigate('/home');
      }
    } catch (err: any) {
      console.error('Error logging in:', err.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  /*return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};*/
if (loading) return <div>Loading...</div>;

  return (
    <div className='login-container'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          required
        />
        <label>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your password'
          required
        />
        {error && <p className='error'>{localError}</p>}
        <button type='submit'>Login</button>
        <button type='button' onClick={() => navigate('/register')}>
          Need to register?
        </button>
      </form>
    </div>
  );
}
export default Login;
