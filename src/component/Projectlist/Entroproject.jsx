import React from 'react';
import image from "../../assets/shiftdiff_number1_1200x628_fb.jpg"
import { useNavigate } from 'react-router-dom';


const Entroproject = ({project}) => {
    const navigate = useNavigate();
    const {
        title,
        description,
        fundingGoal,
        deadline,
        img,
        status,
        approvalDate,
        approvedBy } = project;


        const handleEditClick = () => {
            navigate(`/edit-project/${project._id}`);
        }
    return (
        <div>
            <div className="shadow-xl card card-compact w-96 bg-base-100">
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium
                    ${status === 'approved' ? 'bg-green-100 text-green-800' :
                    status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'}`}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>

                <figure><img src={img} alt={title} className="object-cover w-full h-48" /></figure>
                <div className="card-body">
                    <h2 className="card-title">{title}</h2>
                    <p className="text-gray-600">{description}</p>
                    <div className="space-y-2">
                        <p className="text-sm">🎯 Funding Goal: ${fundingGoal?.toLocaleString()}</p>
                        <p className="text-sm">📅 Deadline: {new Date(deadline).toLocaleDateString()}</p>
                        
                        {/* Show approval information if project is approved */}
                        {status === 'approved' && approvalDate && (
                            <div className="mt-2 text-sm text-green-600">
                                ✓ Approved on {new Date(approvalDate).toLocaleDateString()}
                            </div>
                        )}
                        
                        {/* Show rejection information if project is rejected */}
                        {status === 'rejected' && approvalDate && (
                            <div className="mt-2 text-sm text-red-600">
                                ✕ Rejected on {new Date(approvalDate).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    <div className="justify-end mt-4 card-actions">
                        <button 
                            onClick={handleEditClick} 
                            className="btn btn-outline btn-primary"
                            disabled={status === 'rejected'}
                        >
                            {status === 'rejected' ? 'Rejected' : 'Edit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Entroproject;