import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { jwtDecode } from 'jwt-decode';  // Update the import here

import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Workout from './pages/Workout';
import UpdateWorkout from './pages/UpdateWorkout';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Error from './pages/Error';

function App() {
    const [user, setUser] = useState({
        email: null,
    });

    const unsetUser = () => {
        localStorage.clear();
        setUser({ email: null });
    };

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            // Decode the JWT token to get user details
            const decodedToken = jwtDecode(token);  // Correct function usage
            setUser({
                email: decodedToken.email,  // Assuming the email is stored in the token
            });
        } else {
            setUser({
                email: null,
            });
        }
    }, [token]);

    useEffect(() => {
        console.log(user);
        console.log(localStorage);
    }, [user]);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router className="shadow-sm">
                <AppNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    {!token ? 
                        <Route path="/login" element={<Login />} />
                    : null}
                    {token ? 
                        <>
                            <Route path="/workout" element={<Workout />} />
                            <Route path="/update-workout/:workoutId" element={<UpdateWorkout />} />
                        </>
                    : null}
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<Error />} />
                </Routes>
                <Footer />
            </Router>
        </UserProvider>
    );
}

export default App;
