import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';

export default function UpdateWorkout() {
    const { workoutId } = useParams(); // Get workoutId from URL
    const navigate = useNavigate();

    const [workout, setWorkout] = useState({
        name: '',
        duration: '',
        status: ''
    });
    const [loading, setLoading] = useState(true);

    // Fetch the existing workout details when the component loads
    useEffect(() => {
        fetch(`${API_BASE_URL}/workouts/getWorkout/${workoutId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error
                });
                navigate('/'); // Redirect user if there's an error fetching workout
            } else {
                setWorkout({
                    name: data.name,
                    duration: data.duration,
                    status: data.status
                });
                setLoading(false);
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load workout details'
            });
            setLoading(false);
        });
    }, [workoutId, navigate]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setWorkout({ ...workout, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${API_BASE_URL}/workouts/updateWorkout/${workoutId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(workout)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Workout updated successfully') {
                Swal.fire({
                    icon: 'success',
                    title: 'Workout Updated',
                    text: 'Workout updated successfully!'
                });
                navigate('/workout'); // Redirect to another page after successful update
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Failed to update workout'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update workout'
            });
        });
    };

    if (loading) {
        return <div>Loading workout details...</div>;
    }

    return (
        <div className="container-fluid banner-section">
            <div class="container">
                <div className="update-workout">
                    <h1>Update Workout</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Workout Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={workout.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="duration">Duration (in minutes)</label>
                            <input
                                type="text"
                                id="duration"
                                name="duration"
                                className="form-control"
                                value={workout.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                className="form-control"
                                value={workout.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary mt-3">
                            Update Workout
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
