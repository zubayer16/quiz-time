import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure your styles accommodate both forms
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../graphql/mutations/user';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [loginMutatation, { loading, error }] = useMutation(LOGIN_MUTATION);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginMutatation({
        variables: {
          email: email,
          password: password,
        },
      });
      // Handle successful login
      console.log('Login token:', response.data.login);
      if (response.data.login) {
        login(response.data.login);
        navigate('/home');
      }
    } catch (err) {
      // Handle error
      setLocalError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

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
