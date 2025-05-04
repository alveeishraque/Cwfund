




// new
import React from 'react';
import { useLoaderData } from 'react-router-dom';

const ViewEntroProject = () => {
    const project = useLoaderData();
    const { title, description, fundingGoal, deadline, img } = project;

    if (!project) {
        return <p>Project not found or failed to load.</p>;
    }

    return (
        <div className="flex flex-col items-center p-5">
            {/* Image Section */}
            <div className="w-full flex justify-center mb-8">
                <img src={img} alt="Project Image" className="max-w-[100%] rounded-xl shadow-lg" />
            </div>

            {/* Info Section */}
            <div className="w-full max-w-[90%] h-auto rounded-xl shadow-lg object-cover">
                <h1 className="text-3xl font-bold text-purple-700 mb-4">{title}</h1>
                <p className="text-xl mb-4"><strong>Description: </strong>{description}</p>
                <p className="text-xl mb-4"><strong>Funding Goal: </strong>${fundingGoal}</p>
                <p className="text-xl mb-4"><strong>Deadline: </strong>{new Date(deadline).toLocaleDateString()}</p>
                <button className="mt-4 px-6 py-2 bg-green-500 text-white text-lg font-semibold rounded-md hover:bg-green-600 transition duration-300">
                    Edit Project
                </button>
            </div>
        </div>
    );
};

export default ViewEntroProject;
