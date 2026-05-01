"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios';


const Page = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await axios.get('/students');
            setStudents(response.data.data);
            setLoading(false);
        };

        fetchStudents();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Student List</h1>
            <ul>
                {students.map(student => (
                    <li key={student.id}>{student.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Page