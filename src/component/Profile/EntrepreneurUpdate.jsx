


// new nw new
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { useNavigate } from 'react-router-dom';

const EntrepreneurUpdate = () => {
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [profileData, setProfileData] = useState({
        name: '',
        contactInfo: '',
        image: '',
        documents: ''
    });

    const [updateStatus, setUpdateStatus] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (userInfo?._id) {
            fetch(`https://venture-xbackend.vercel.app/entrepreneur-profile/${userInfo._id}`)
                .then(response => response.json())
                .then(data => {
                    setProfileData({
                        name: data.name,
                        contactInfo: data.contactInfo,
                        image: data.image,
                        documents: data.documents
                    });
                    if (data.pendingUpdate) {
                        setMessage('You have a pending profile update request.');
                        setUpdateStatus('pending');
                    }
                })
                .catch(error => {
                    console.error('Error fetching profile data:', error);
                });
        }
    }, [userInfo?._id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        fetch(`https://venture-xbackend.vercel.app/entrepreneur-profile/${userInfo._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) throw new Error('Update request failed');
            return response.json();
        })
        .then(data => {
            setMessage('Your profile update request has been submitted for approval.');
            setUpdateStatus('pending');
            // Don't navigate away, show the status instead
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            setMessage('Failed to submit profile update request.');
        });
    };

    return (
        <div className="min-h-screen p-6 bg-base-200">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-blue-600">
                    Update {userInfo?.name}'s Pr
                </h1>
            </div>

            {message && (
                <div className={`alert ${updateStatus === 'pending' ? 'alert-info' : 'alert-error'} mb-4`}>
                    <div className="flex-1">
                        <label>{message}</label>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl p-6 mx-auto space-y-6 rounded-lg shadow-lg bg-base-100">
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full input input-bordered"
                        disabled={updateStatus === 'pending'}
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Contact Info</label>
                    <input
                        type="text"
                        name="contactInfo"
                        value={profileData.contactInfo}
                        onChange={handleInputChange}
                        className="w-full input input-bordered"
                        disabled={updateStatus === 'pending'}
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={profileData.image}
                        onChange={handleInputChange}
                        className="w-full input input-bordered"
                        disabled={updateStatus === 'pending'}
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Documents URL</label>
                    <input
                        type="text"
                        name="documents"
                        value={profileData.documents}
                        onChange={handleInputChange}
                        className="w-full input input-bordered"
                        disabled={updateStatus === 'pending'}
                    />
                </div>

                <div className="flex justify-between">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={updateStatus === 'pending'}
                    >
                        {updateStatus === 'pending' ? 'Update Pending' : 'Submit Update Request'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/entrepreneurprofile')}
                        className="btn btn-secondary"
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EntrepreneurUpdate;

