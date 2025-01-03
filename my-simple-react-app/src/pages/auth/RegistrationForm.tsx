import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../../graphql/mutations/user';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [registerMutation, { loading, error }] = useMutation(REGISTER_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await registerMutation({
        variables: {
          username,
          email,
          password,
        },
      });
      if (response.data.register) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account and start taking quizzes
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='john@example.com'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='johndoe'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type='button'
                  className='absolute right-1 top-1/4 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none appearance-none bg-transparent hover:bg-transparent'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className='h-4 w-4' />
                  ) : (
                    <EyeIcon className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type='button'
                  className='absolute right-1 top-1/4 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none appearance-none bg-transparent hover:bg-transparent'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className='h-4 w-4' />
                  ) : (
                    <EyeIcon className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            {error && <p className='text-red-500'>{error.message}</p>}
            <p className='text-sm text-gray-500 text-center'>
              Already have an account?{' '}
              <a href='/login' className='text-blue-600 hover:underline'>
                Sign in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegistrationForm;
