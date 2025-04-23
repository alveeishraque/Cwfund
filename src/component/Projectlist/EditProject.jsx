import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3000/create-project/${id}`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setProject(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching project:', err);
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(project),
            });

            if (response.ok) {
                setModalMessage('Project updated successfully!');
                setModalAction('update');
                setShowModal(true);
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update project');
            }
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project: ' + error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/projects/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setModalMessage('Project deleted successfully!');
                setModalAction('delete');
                setShowModal(true);
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project: ' + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProject(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/entrepreneur/dashboard');
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    if (!project) {
        return <div className="text-center text-red-500 mt-10">Project not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-primary">Edit Project</h1>
            
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={project.title}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea
                        name="description"
                        value={project.description}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered h-24"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Image URL</span>
                    </label>
                    <input
                        type="url"
                        name="img"
                        value={project.img}
                        onChange={handleInputChange}
                        className="input input-bordered"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Funding Goal ($)</span>
                    </label>
                    <input
                        type="number"
                        name="fundingGoal"
                        value={project.fundingGoal}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                        min="0"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Deadline</span>
                    </label>
                    <input
                        type="date"
                        name="deadline"
                        value={project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                    />
                </div>

                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                                handleDelete();
                            }
                        }}
                        className="btn btn-error"
                    >
                        Delete Project
                    </button>
                    <div className="space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/entrepreneur/dashboard')}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>

            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-4 text-center">
                            {modalAction === 'update' ? 'Success!' : 'Project Deleted'}
                        </h3>
                        <p className="text-center mb-6">{modalMessage}</p>
                        <div className="text-center">
                            <button
                                onClick={handleModalClose}
                                className="btn btn-primary"
                            >
                                Awesome!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProject;
