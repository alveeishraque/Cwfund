

import React from 'react';
import { useLoaderData } from 'react-router-dom';
import image from "../../assets/shiftdiff_number1_1200x628_fb.jpg"

const View = () => {
    const project = useLoaderData();  // This will get the project data based on the ID parameter

    if (!project) {
        return <p>Project not found or failed to load.</p>; // Gracefully handle missing project data
    }

    return (
        <div>
            {/* <h1>View Project</h1>
            <p><strong>Title: </strong>{project.title}</p>
            <p><strong>Description: </strong>{project.description}</p>
            <p><strong>Funding Goal: </strong>${project.fundingGoal}</p>
            <p><strong>Deadline: </strong>{project.deadline}</p> */}




            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img src={image} className="max-w-sm rounded-lg shadow-2xl" />
                    <div>
                        <h1 className="text-5xl font-bold">{project.title}!</h1>
                        <p className="py-6"><p><strong>Description: </strong>{project.description}</p>
                            <p><strong>Funding Goal: </strong>${project.fundingGoal}</p>
                            <p><strong>Deadline: </strong>{project.deadline}</p></p>
                        <button className="btn btn-primary">Apply</button>
                    </div>
                </div>
            </div>
            {/* Render other project details */}
        </div>
    );
};

export default View;

