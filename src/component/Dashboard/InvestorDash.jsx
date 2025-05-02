import React, { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import InvestmentProjectList from '../Projectlist/InvestmentProjectList';
import InvestmentHistory from './InvestmentHistory';
import PenaltyAlert from '../Notification/PenaltyAlert';
import UserReports from '../Notification/UserReports';

const InvestorDash = () => {
    const { userInfo } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('projects');
    const [showReports, setShowReports] = useState(false);

    return (
        <div className="min-h-screen p-6">
            {/* Penalty Alert - Display if penalties exist */}
            {userInfo?.penalties && (
                <div className="mb-8">
                    <PenaltyAlert penalties={userInfo.penalties} />
                </div>
            )}

            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-green-600">
                    Welcome, {userInfo?.name}!
                </h1>
                <p className="text-gray-500 mt-2">
                    {activeTab === 'projects' 
                        ? "Here's a list of available projects for investment."
                        : "View your investment history and performance."
                    }
                </p>
            </div>

            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setShowReports(!showReports)}
                    className="btn btn-outline btn-sm"
                >
                    {showReports ? 'Hide Reports' : 'View My Reports'}
                </button>
            </div>

            {/* Reports Section */}
            {showReports && (
                <div className="mb-8">
                    <UserReports />
                </div>
            )}

            <div className="tabs tabs-boxed justify-center mb-6">
                <button 
                    className={`tab ${activeTab === 'projects' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('projects')}
                >
                    Investment Opportunities
                </button>
                <button 
                    className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Investment History  
                </button>
            </div>

            {activeTab === 'projects' ? <InvestmentProjectList /> : <InvestmentHistory />}
        </div>
    );
};

export default InvestorDash;