import React, { useEffect, useState } from 'react';
import Project from './Project';

const Projectlist = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/create-project')
            .then(res => res.json())
            .then(data => {
                console.log('Projects:', data);
                setProjects(data);
            })
            .catch(err => {
                console.error('Error fetching projects:', err);
            });
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">  
       {/* <h1>total project:{projects.length}</h1> */}
       {
        projects.map((project, index)=>
        <Project
        key={index}
        project={project}>

        </Project> 
        
        )
       }
        </div>
    );
};  

export default Projectlist;
