// import React from 'react';
// import image from "../../assets/shiftdiff_number1_1200x628_fb.jpg"
// import { useNavigate } from 'react-router-dom';


// const Project = ({ project }) => {
//     const navigate = useNavigate();
//     return (
//         <div>
//             <div className="card card-compact w-96 bg-base-100 shadow-xl">
//                 <figure><img src={image} alt="Shoes" /></figure>
//                 <div className="card-body">
//                     <h2 className="card-title">{project.title}!</h2>
//                     <p>{project.description}</p>
//                     <p>🎯 Funding Goal {project.fundingGoal}</p>
//                     <p>📅 Deadline{project.deadline}</p>
//                     <div className="card-actions justify-end">
//                         {/* <button className="btn btn-primary">View</button> */}
//                         <button
//                     onClick={() => navigate(`/view/${project._id}`)}
//                     className="btn btn-outline btn-primary"
//                 >
//                     View
//                 </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Project;


import React, { useContext } from 'react';
import image from "../../assets/shiftdiff_number1_1200x628_fb.jpg"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../provider/Authprovider';  // Assuming you have AuthContext

const Project = ({ project }) => {
    const navigate = useNavigate();
    const { userInfo } = useContext(AuthContext); // Accessing the user info from the context

    const handleViewClick = () => {
        if (!userInfo) {
            // If no user is logged in, redirect to login
            navigate('/login');
        } else {
            // If user is logged in, navigate to the view page for the project
            navigate(`/view/${project._id}`);
        }
    };

    return (
        <div>
            <div className="card card-compact w-96 bg-base-100 shadow-xl">
                <figure><img src={project.img} alt="Project" /></figure>
                <div className="card-body">
                    <h2 className="card-title">{project.title}!</h2>
                    <p>{project.description}</p>
                    <p>🎯 Funding Goal {project.fundingGoal}</p>
                    <p>📅 Deadline {project.deadline}</p>
                    <div className="card-actions justify-end">
                        <button
                            onClick={handleViewClick}
                            className="btn btn-outline btn-primary"
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Project;
