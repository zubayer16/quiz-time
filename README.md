# quiz-time
start the react app:npm start

To login
Email: user@example.com
Password: password123

# Steps to Set Up the Frontend Application

1. Clone the Repository:
    git clone <repository-url>
    cd <repository-directory>

2. Install Project Dependencies:
    npm install

3. Set Up Environment Variables:

    Create a .env file in the root directory of the project if it doesn't exist.
    Add the necessary environment variables. For example: 
    REACT_APP_GRAPHQL_ENDPOINT=http://localhost:5001/graphql

4. Ensure Tailwind CSS is Configured:

    Make sure Tailwind CSS is properly configured in your project. You should have a tailwind.config.js file in the root of your project.
    Example tailwind.config.js:
        
        module.exports = {
        content: [
            './src/**/*.{js,jsx,ts,tsx}',
            './node_modules/@shadcn/ui/dist/**/*.{js,jsx,ts,tsx}',
        ],
        theme: {
            extend: {},
        },
        plugins: [],
        };

5. Start the Development Server:
    npm start

By following these steps, you will have the frontend application configured and running on your machine. The Apollo Client and React components will be set up to interact with the backend GraphQL API, and the development server will be running, allowing you to access the application in your browser.