import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated');  // Check if user is authenticated

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('isAuthenticated'); // Clear authentication
            navigate('/login'); // Redirect to login page
        }
    };

    return (
        <header style={styles.header}>
            <h1 style={styles.logo}>Quiz Time</h1>
            <nav>
                <ul style={styles.navList}>
                    <li style={styles.navItem}>
                        <Link to="/" style={styles.navLink}>Home</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/quiz" style={styles.navLink}>Quiz</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/results" style={styles.navLink}>Results</Link>
                    </li>
                </ul>
            </nav>
            {isAuthenticated ? (
                <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
            ) : (
                <Link to="/login" style={{...styles.logoutButton, textDecoration: 'none'}}>Login</Link>
            )}
        </header>
    );
}

const styles = {
    header: {
        backgroundColor: '#282c34',
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    navList: {
        listStyleType: 'none',
        display: 'flex',
        margin: 0,
        padding: 0,
    },
    navItem: {
        margin: '0 10px',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
        transition: 'color 0.3s',
    },
    navLinkHover: {
        color: '#61dafb',
    },
    logoutButton: {
        backgroundColor: '#ff4d4f',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        textDecoration: 'none'
    },
    logoutButtonHover: {
        backgroundColor: '#e60000',
    },
};

export default Header;
