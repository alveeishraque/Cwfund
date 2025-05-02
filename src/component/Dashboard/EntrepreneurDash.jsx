import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import Entroprojectlist from '../Projectlist/Entroprojectlist';
import PenaltyAlert from '../Notification/PenaltyAlert';
import UserReports from '../Notification/UserReports';
import EntrepreneurInvestments from './EntrepreneurInvestments';

const EntrepreneurDash = () => {
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showReports, setShowReports] = useState(false);
    const [activeTab, setActiveTab] = useState('projects');

    return (
        <div className="min-h-screen bg-base-100 px-4 sm:px-10 py-8">
            {/* Penalty Alert - Display if penalties exist */}
            {userInfo?.penalties && (
                <div className="mb-8">
                    <PenaltyAlert penalties={userInfo.penalties} />
                </div>
            )}

            {/* Welcome Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">
                    Welcome, {userInfo?.name}!
                </h1>
                <p className="text-gray-600 text-lg">
                    Manage your projects and track investments received.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/addproject')}
                    className="btn btn-primary"
                    disabled={userInfo?.penalties?.isProjectRestricted}
                >
                    Add New Project
                </button>
                <button
                    onClick={() => setShowReports(!showReports)}
                    className="btn btn-outline"
                >
                    {showReports ? 'Hide Reports' : 'View My Reports'}
                </button>
            </div>

            {/* Reports Section */}
            {showReports && (
                <div className="mb-10">
                    <UserReports />
                </div>
            )}

            {/* Tabs for Projects and Investments */}
            <div className="tabs tabs-boxed justify-center mb-6">
                <button 
                    className={`tab ${activeTab === 'projects' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('projects')}
                >
                    My Projects
                </button>
                <button 
                    className={`tab ${activeTab === 'investments' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('investments')}
                >
                    Investments Received
                </button>
            </div>

            {/* Project Tab Section */}
            {activeTab === 'projects' && (
                <>
                    <div className="bg-base-200 rounded-xl shadow-md mb-12 py-10 px-6 flex flex-col items-center text-center">
                        <h2 className="text-3xl font-semibold text-primary mb-4">Grow More</h2>
                        <p className="text-gray-700 mb-6 max-w-xl">
                            Whether you're building a product, launching a startup, or changing the world — it all starts here.
                        </p>
                        <button
                            onClick={() => navigate('/addproject')}
                            className="btn btn-primary px-6"
                            disabled={userInfo?.penalties?.isProjectRestricted}
                        >
                            {userInfo?.penalties?.isProjectRestricted ? 
                                'Project Creation Restricted' : 
                                'Add Project'}
                        </button>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                            Your Projects
                        </h3>
                        <Entroprojectlist />
                    </div>
                </>
            )}

            {/* Investments Tab Section */}
            {activeTab === 'investments' && (
                <EntrepreneurInvestments />
            )}
        </div>
    );
};

export default EntrepreneurDash;
