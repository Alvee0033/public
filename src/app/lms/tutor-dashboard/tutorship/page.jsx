"use client"
import React, { useState } from 'react';

const MentorshipPage = () => {
    const [plans, setPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({ title: '', description: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlan({ ...newPlan, [name]: value });
    };

    const addPlan = () => {
        setPlans([...plans, newPlan]);
        setNewPlan({ title: '', description: '' });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Mentorship Plans</h1>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Add New Plan</h2>
                <input
                    type="text"
                    name="title"
                    value={newPlan.title}
                    onChange={handleInputChange}
                    placeholder="Plan Title"
                    className="border p-2 mb-2 w-full"
                />
                <textarea
                    name="description"
                    value={newPlan.description}
                    onChange={handleInputChange}
                    placeholder="Plan Description"
                    className="border p-2 mb-2 w-full"
                />
                <button onClick={addPlan} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add Plan
                </button>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">All Plans</h2>
                {plans.length === 0 ? (
                    <p>No plans available.</p>
                ) : (
                    <ul className="list-disc pl-5">
                        {plans.map((plan, index) => (
                            <li key={index} className="mb-2">
                                <h3 className="font-bold">{plan.title}</h3>
                                <p>{plan.description}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MentorshipPage;