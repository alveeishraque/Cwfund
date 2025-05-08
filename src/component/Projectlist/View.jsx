import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import image from "../../assets/shiftdiff_number1_1200x628_fb.jpg";
import ReportUser from '../Notification/ReportUser';
import { toast } from 'react-hot-toast';

const View = () => {
    const project = useLoaderData();  // This will get the project data based on the ID parameter
    const [showReportModal, setShowReportModal] = useState(false);
    const [entrepreneur, setEntrepreneur] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntrepreneur = async () => {
            if (project && project.createdBy) {
                try {
                    const response = await fetch(`https://venture-xbackend.vercel.app/api/users/${project.createdBy}`, {
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setEntrepreneur(data);
                    } else {
                        console.error('Failed to fetch entrepreneur details');
                    }
                } catch (error) {
                    console.error('Error fetching entrepreneur:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchEntrepreneur();
    }, [project]);

    if (!project) {
        return <p>Project not found or failed to load.</p>; // Gracefully handle missing project data
    }

    const handleReportClick = () => {
        // Check if user is logged in before allowing to report
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to report this project');
            return;
        }
        setShowReportModal(true);
    };

    return (
        <div>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img src={project.img || image} className="max-w-sm rounded-lg shadow-2xl" alt={project.title} />
                    <div className="flex flex-col w-full">
                        {/* <div className="flex justify-between items-start">
                            <h1 className="text-5xl font-bold">{project.title}</h1>
                            <button 
                                onClick={handleReportClick}
                                className="btn btn-sm btn-outline btn-error"
                                title="Report this project"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Report
                            </button>
                        </div> */}
                        
                        <div className="py-6">
                            <p><strong>Description: </strong>{project.description}</p>
                            <p><strong>Funding Goal: </strong>${project.fundingGoal}</p>
                            <p><strong>Deadline: </strong>{project.deadline}</p>
                            
                            {entrepreneur && (
                                <p className="mt-3">
                                    <strong>Created by: </strong>{entrepreneur.name}
                                </p>
                            )}
                        </div>
                        
                        <div className="mt-4">
                            <button className="btn btn-primary">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Report modal */}
            {showReportModal && entrepreneur && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <ReportUser 
                            userId={entrepreneur._id} 
                            projectId={project._id}
                            onClose={() => setShowReportModal(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default View;

