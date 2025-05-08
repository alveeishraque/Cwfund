import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReportsManagement from './ReportsManagement';

const StaffDash = () => {
    const [pendingProjects, setPendingProjects] = useState([]);
    const [pendingProfiles, setPendingProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('projects');
    const navigate = useNavigate();

    const fetchPendingProjects = async () => {
        try {
            const response = await axios.get('https://venture-xbackend.vercel.app/api/staff/pending-projects', {
                withCredentials: true
            });
            setPendingProjects(response.data);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 403) {
                navigate('/login');
            }
            setError('Failed to fetch pending projects');
            setLoading(false);
        }
    };

    const fetchPendingProfiles = async () => {
        try {
            const response = await axios.get('https://venture-xbackend.vercel.app/profile-updates/pending', {
                withCredentials: true
            });
            setPendingProfiles(response.data);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 403) {
                navigate('/login');
            }
            setError('Failed to fetch pending profile updates');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'projects') {
            fetchPendingProjects();
        } else if (activeTab === 'profiles') {
            fetchPendingProfiles();
        } else {
            setLoading(false); // For reports tab, loading is handled within the component
        }
    }, [activeTab]);

    const handleProjectApproval = async (projectId, action) => {
        try {
            await axios.patch(
                `https://venture-xbackend.vercel.app/api/staff/${action}-project/${projectId}`,
                {},
                { withCredentials: true }
            );
            fetchPendingProjects();
        } catch (err) {
            setError(`Failed to ${action} project`);
        }
    };

    const handleProfileApproval = async (requestId, status, reviewNotes = '') => {
        try {
            await axios.patch(
                `https://venture-xbackend.vercel.app/profile-updates/${requestId}`,
                {
                    status,
                    reviewNotes
                },
                { withCredentials: true }
            );
            fetchPendingProfiles();
        } catch (err) {
            setError(`Failed to ${status} profile update`);
        }
    };

    if (loading && activeTab !== 'reports') return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center mt-5 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>

            <div className="tabs tabs-boxed justify-center mb-6">
                <button 
                    className={`tab ${activeTab === 'projects' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('projects')}
                >
                    Pending Projects
                </button>
                <button 
                    className={`tab ${activeTab === 'profiles' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('profiles')}
                >
                    Profile Updates
                </button>
                <button 
                    className={`tab ${activeTab === 'reports' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    User Reports
                </button>
            </div>
            
            {activeTab === 'projects' && (
                // Projects Section
                pendingProjects.length === 0 ? (
                    <p className="text-gray-600">No pending projects to review.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingProjects.map((project) => (
                            <div key={project._id} className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                                <p className="text-gray-600 mb-4">{project.description}</p>
                                
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">
                                        <strong>Entrepreneur:</strong> {project.createdBy?.name || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Contact:</strong> {project.createdBy?.email || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Funding Goal:</strong> ${project.fundingGoal?.toLocaleString() || '0'}
                                    </p>
                                </div>

                                {project.img && (
                                    <img 
                                        src={project.img} 
                                        alt={project.title}
                                        className="w-full h-48 object-cover rounded-md mb-4"
                                    />
                                )}
                                
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => handleProjectApproval(project._id, 'reject')}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleProjectApproval(project._id, 'approve')}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {activeTab === 'profiles' && (
                // Profile Updates Section
                pendingProfiles.length === 0 ? (
                    <p className="text-gray-600">No pending profile updates to review.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingProfiles.map((request) => (
                            <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-2">
                                    Profile Update Request
                                </h2>
                                
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">
                                        <strong>User:</strong> {request.userId?.name || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Email:</strong> {request.userId?.email || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Role:</strong> {request.userId?.role || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Submitted:</strong> {new Date(request.submittedAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className="mb-4 bg-gray-50 p-4 rounded">
                                    <h3 className="font-semibold mb-2">Requested Changes:</h3>
                                    {request.newProfileData.name && (
                                        <p className="text-sm">
                                            <strong>Name:</strong> {request.newProfileData.name}
                                        </p>
                                    )}
                                    {request.newProfileData.contactInfo && (
                                        <p className="text-sm">
                                            <strong>Contact Info:</strong> {request.newProfileData.contactInfo}
                                        </p>
                                    )}
                                    {request.newProfileData.image && (
                                        <div>
                                            <p className="text-sm mb-1"><strong>New Profile Image:</strong></p>
                                            <img 
                                                src={request.newProfileData.image} 
                                                alt="New profile" 
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                    {request.newProfileData.documents && (
                                        <p className="text-sm">
                                            <strong>Documents:</strong>{' '}
                                            <a 
                                                href={request.newProfileData.documents}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                View Documents
                                            </a>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <textarea
                                        placeholder="Add review notes (optional)"
                                        className="w-full p-2 border rounded"
                                        id={`notes-${request._id}`}
                                    />
                                    
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => {
                                                const notes = document.getElementById(`notes-${request._id}`).value;
                                                handleProfileApproval(request._id, 'rejected', notes);
                                            }}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => {
                                                const notes = document.getElementById(`notes-${request._id}`).value;
                                                handleProfileApproval(request._id, 'approved', notes);
                                            }}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {activeTab === 'reports' && <ReportsManagement />}
        </div>
    );
};

export default StaffDash;