import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure your styles accommodate both forms

function Login() {
    const [isLoginView, setIsLoginView] = useState(true); // Toggle between login and registration
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Needed for registration
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        // Mock login logic
        if (email === 'user@example.com' && password === 'password123') {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/'); // Redirect to home page after login
        } else {
            setError('Invalid email or password');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        // Mock registration logic
        console.log('Register with:', { username, email, password });
        // Here you would typically connect to your backend to register the user
        navigate('/'); // Optionally navigate after registration
    };

    return (
        <div className="login-container">
            <h1>{isLoginView ? 'Login' : 'Register'}</h1>
            <form onSubmit={isLoginView ? handleLogin : handleRegister}>
                {!isLoginView && (
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                )}
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">{isLoginView ? 'Login' : 'Register'}</button>
                <button type="button" onClick={() => setIsLoginView(!isLoginView)}>
                    {isLoginView ? 'Need to register?' : 'Have an account? Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;
