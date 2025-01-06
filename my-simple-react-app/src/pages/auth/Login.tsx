import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from '../../graphql/mutations/user';
import { useAuth } from '../../context/AuthContext';
import { BookOpen } from 'lucide-react';

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

      if (response.data && response.data.login) {
        const { token, userId } = response.data.login;
        login(token, userId);
        navigate('/home');
      }
    } catch (err: any) {
      console.error('Error logging in:', err.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='flex text-center mb-8'>
        <BookOpen className='h-8 w-8 text-white' />
        <h2 className='ml-2 text-2xl font-bold text-white'>Welcome to Quiz Time</h2>
      </div>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md'>
        <div>
          <h1 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Login</h1>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleLogin}>
          <div className='rounded-md shadow-sm space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                required
                className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                required
                className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
              />
            </div>
          </div>

          {error && <p className='text-sm text-red-600'>{localError}</p>}

          <div className='space-y-3'>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
            >
              Login
            </button>

            <button
              type='button'
              onClick={() => navigate('/register')}
              className='group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
            >
              Need to register?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
