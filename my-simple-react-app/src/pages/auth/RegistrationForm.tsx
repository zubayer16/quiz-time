import { BookOpen } from 'lucide-react';
import PasswordInput from '../../components/PasswordInput';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { REGISTER_MUTATION } from '../../graphql/mutations/user';
import { useMutation } from '@apollo/client';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface RegistrationFormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [registerMutation, { loading, error }] = useMutation(REGISTER_MUTATION);

  // Group related state together
  const [formData, setFormData] = React.useState<RegistrationFormData>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordVisibility, setPasswordVisibility] = React.useState({
    password: false,
    confirmPassword: false,
  });

  // Handle input changes with a single function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await registerMutation({
        variables: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
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
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'>
      <div className='flex text-center mb-8'>
        <BookOpen className='h-8 w-8 text-white' />
        <h2 className='ml-2 text-2xl font-bold text-white'>Welcome to Quiz Time</h2>
      </div>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Create an account</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-3'>
            {/* Email field */}
            <div className='space-y-1'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='john@example.com'
                required
              />
            </div>

            {/* Username field */}
            <div className='space-y-1'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                value={formData.username}
                onChange={handleInputChange}
                placeholder='johndoe'
                required
              />
            </div>

            {/* First Name field */}
            <div className='space-y-1'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder='John'
                required
              />
            </div>

            {/* Last Name field */}
            <div className='space-y-1'>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder='Doe'
                required
              />
            </div>

            {/* Password fields */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                {' '}
                {/* Reduced spacing */}
                <Label htmlFor='password' className='text-sm'>
                  Password
                </Label>
                <PasswordInput
                  id='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  showPassword={passwordVisibility.password}
                  onToggleVisibility={() => togglePasswordVisibility('password')}
                />
              </div>
              <div className='space-y-1'>
                {' '}
                {/* Reduced spacing */}
                <Label htmlFor='confirmPassword' className='text-sm'>
                  Confirm Password
                </Label>
                <PasswordInput
                  id='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  showPassword={passwordVisibility.confirmPassword}
                  onToggleVisibility={() => togglePasswordVisibility('confirmPassword')}
                />
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
