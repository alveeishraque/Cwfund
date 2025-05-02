


// new new new
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { useNavigate } from 'react-router-dom';

const EntrepreneurProfile = () => {
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [pendingUpdate, setPendingUpdate] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(null);

    useEffect(() => {
        if (!userInfo?._id) {
            console.error('User ID is missing.');
            return;
        }

        fetch(`http://localhost:3000/entrepreneur-profile/${userInfo._id}`)
            .then((response) => response.json())
            .then((data) => {
                setProfile(data);
                setPendingUpdate(data.pendingUpdate);
                setUpdateStatus(data.updateStatus);
                console.log("data", data);
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);
            });
    }, [userInfo?._id]);

    const handleMissingInfo = (value) => {
        return value ? value : 'NaN';
    };

    const handleEditClick = () => {
        navigate('/entrepreneur-edit-profile');
    };

    return (
        <div className="min-h-screen p-6 bg-base-200">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-blue-600">
                    {handleMissingInfo(profile?.name)}'s Profile
                </h1>
                {updateStatus === 'pending' && (
                    <div className="mt-4 alert alert-info">
                        <div className="flex-1">
                            <label>A profile update request is pending approval.</label>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-lg bg-slate-400">
                <div className="flex justify-center mb-6">
                    <img
                        src={handleMissingInfo(profile?.image)}
                        alt="Profile"
                        className="object-cover w-40 h-40 border-4 border-blue-600 rounded-full"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-medium text-gray-700">Name:</h2>
                        <p className="text-sm text-black">{handleMissingInfo(profile?.name)}</p>
                        {pendingUpdate?.name && (
                            <p className="text-sm text-yellow-600">(Pending: {pendingUpdate.name})</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-medium text-gray-700">Email:</h2>
                        <p className="text-sm text-black">{handleMissingInfo(profile?.email)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-medium text-gray-700">Contact Info:</h2>
                        <p className="text-sm text-black">{handleMissingInfo(profile?.contactInfo)}</p>
                        {pendingUpdate?.contactInfo && (
                            <p className="text-sm text-yellow-600">(Pending: {pendingUpdate.contactInfo})</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center mt-6 space-x-2">
                    <h2 className="text-lg font-medium text-gray-700">Documents:</h2>
                    <p className="text-sm text-black">
                        {profile?.documents ? (
                            <a
                                href={profile?.documents}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline transition-all duration-200 hover:text-blue-700"
                            >
                                View Document
                            </a>
                        ) : (
                            'NaN'
                        )}
                    </p>
                    {pendingUpdate?.documents && (
                        <p className="text-sm text-yellow-600">
                            (Pending: <a href={pendingUpdate.documents} target="_blank" rel="noopener noreferrer" className="underline">View</a>)
                        </p>
                    )}
                </div>

                <div className="flex mt-6 space-x-4">
                    <button
                        onClick={handleEditClick}
                        className="btn btn-active btn-primary"
                        disabled={updateStatus === 'pending'}
                    >
                        {updateStatus === 'pending' ? 'Update Pending' : 'Edit'}
                    </button>
                    <button
                        onClick={() => navigate('/entrepreneur-dashboard')}
                        className="btn btn-active btn-secondary"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EntrepreneurProfile;
