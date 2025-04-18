import  React  from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import { useState } from 'react';



const StudentDashboard = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/")
    }
    return (
        <div>
            <div>StudentDashboard</div>
            <button className='btn btn-primary' onClick={handleLogout}>Logout</button>
        </div>
    )
    }

export default StudentDashboard;