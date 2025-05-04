import React, { useEffect, useState } from 'react';
import Entroproject from './Entroproject';

const Entroprojectlist = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/entrepreneur-projects', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProjects(data);
                    console.log('Projects:', data);
                } else {
                    console.warn('Not an array:', data);
                    setProjects([]);
                }
            })
            .catch(err => {
                console.error('Error fetching projects:', err);
                setProjects([]);
            });
    }, []);

    return (
        <div className="">
            <h2 className="text-3xl font-bold text-center mb-10 text-primary">
                 Your project({projects.length})
            </h2>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <Entroproject key={index} project={project} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-red-500 mt-10 text-lg">
                    No projects to display or you're not authorized.
                </p>
            )}
        </div>
    );
};

export default Entroprojectlist;
