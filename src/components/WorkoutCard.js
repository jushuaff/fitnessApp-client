import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

export default function WorkoutCard({ workoutProp, onDelete }) {

    if (!workoutProp) {
        return <div>No Workouts Available</div>;
    }

    const { _id, name, duration, status } = workoutProp || {};

    const deleteWorkout = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this workout?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${API_BASE_URL}/workouts/deleteWorkout/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                })
                .then(res => res.json())
                .then(data => {
                    if (data.message === "Workout deleted successfully") {
                        Swal.fire({
                            icon: "success",
                            title: "Workout Deleted Successfully"
                        });
                        onDelete(id); // Notify parent component to remove the card
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error deleting workout",
                            text: data.message
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "An error occurred",
                        text: error.message
                    });
                });
            }
        });
    };

    const completeWorkoutStatus = (id) => {
        Swal.fire({
            title: 'Are you sure you want to complete this workout?',
            text: "This action will change the status to completed!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, complete it',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${API_BASE_URL}/workouts/completeWorkoutStatus/${id}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                })
                .then(res => res.json())
                .then(data => {
                    if (data.message === "Workout status updated successfully") {
                        Swal.fire({
                            icon: "success",
                            title: "Workout status updated to completed"
                        });
                        // Notify parent component to refresh the workout list
                        onDelete(id); // You might want to refresh or remove the card entirely
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error updating workout status",
                            text: data.message
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "An error occurred",
                        text: error.message
                    });
                });
            }
        });
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>Duration:</Card.Subtitle>
                <Card.Text>{duration}</Card.Text>
                <Card.Subtitle>Status:</Card.Subtitle>
                <Card.Text>{status}</Card.Text>
            </Card.Body>
            {/* Render action buttons only if the workout is not completed */}
            <Card.Footer className="d-flex justify-content-around">
                <Link className="btn btn-primary btn-sm" to={`/update-workout/${_id}`}>Update Workout</Link>
                <Button className="btn btn-danger btn-sm" onClick={() => deleteWorkout(_id)}>Delete</Button>
                {status !== "completed" && (        
                    <Button className="btn btn-success btn-sm" onClick={() => completeWorkoutStatus(_id)}>Complete Workout</Button>
                )}
            </Card.Footer>
        </Card>
    );
}

// Prop validation
WorkoutCard.propTypes = {
    workoutProp: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        duration: PropTypes.string,
        status: PropTypes.string
    }),
    onDelete: PropTypes.func.isRequired
};
