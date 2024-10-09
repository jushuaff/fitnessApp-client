import { useEffect, useState, useContext } from 'react';
import WorkoutCard from '../components/WorkoutCard'; // Import the WorkoutCard component
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Workout() {
    const { user } = useContext(UserContext);
    const [workouts, setWorkouts] = useState([]);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [error, setError] = useState('');

    // Fetch workouts
    const fetchWorkouts = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/getMyWorkouts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch workouts');
            return res.json();
        })
        .then(data => {
            setWorkouts(data.workouts || []);
            setError('');
        })
        .catch(err => setError(err.message));
    };

    useEffect(() => {
        if (user) {
            fetchWorkouts();
        }
    }, [user]);

    // Handle workout addition
    const handleAddWorkout = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/addWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name, duration })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to add workout");
            }
            return res.json();
        })
        .then(newWorkout => {
            setWorkouts(prev => [...prev, newWorkout]);
            setName('');
            setDuration('');
            setError('');
        })
        .catch(err => setError(err.message));
    };

    // Handle workout deletion
    const handleDeleteWorkout = (id) => {
        setWorkouts((prevWorkouts) => prevWorkouts.filter(workout => workout._id !== id));
    };

    return (
        <Container fluid className="banner-section">
            <Container>
                {user ? (
                    <>
                    <Row className="mt-3">
                        <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <h1>Workout Catalog</h1>
                        </div>
                    </Row>
                    <Row>
                        <Col md={12} className="mb-4">
                            <Form.Group controlId="addWorkout">
                                <Form.Label>Add New Workout</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Workout Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="Duration"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                                <Button variant="primary" onClick={handleAddWorkout} className="mt-2">
                                    Add Workout
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        {workouts.length > 0 ? (
                            workouts.map(workout => (
                                <Col md={3} key={workout._id} className="mb-4">
                                    <WorkoutCard 
                                        workoutProp={workout} 
                                        onDelete={handleDeleteWorkout} // Pass onDelete prop
                                    />
                                </Col>
                            ))
                        ) : (
                            <Col md={12}>
                                <h4>{error || 'No workouts available'}</h4>
                            </Col>
                        )}
                    </Row>
                    </>
                ) : (
                    <>
                    <h1>You are not logged in</h1>
                    <Link className="btn btn-primary" to={"/login"}>Login to View</Link>
                    </>
                )}
            </Container>
        </Container>
    );
}
