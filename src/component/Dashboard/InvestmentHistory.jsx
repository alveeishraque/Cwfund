import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { toast } from 'react-toastify';
import ReportUser from '../Notification/ReportUser';

const InvestmentHistory = () => {
    const { userInfo } = useContext(AuthContext);
    const [investments, setInvestments] = useState([]);
    const [totalInvested, setTotalInvested] = useState(0);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [entrepreneurToReport, setEntrepreneurToReport] = useState(null);
    const [projectIdForReport, setProjectIdForReport] = useState(null);
    const [projectCreators, setProjectCreators] = useState({});

    useEffect(() => {
        if (userInfo?._id) {
            fetchInvestments();
        }
    }, [userInfo]);

    const fetchInvestments = async () => {
        try {
            const response = await fetch(
                `https://venture-xbackend.vercel.app/api/investments/investor/${userInfo._id}`,
                { credentials: 'include' }
            );
            const data = await response.json();
            setInvestments(data.investments);
            setTotalInvested(data.totalInvested);
            
            // Fetch project creator details for each project
            const projectIds = data.investments.map(inv => inv.projectId._id);
            await fetchProjectCreators(projectIds);
        } catch (error) {
            console.error('Error fetching investments:', error);
            toast.error('Failed to load investment history');
        }
    };

    const fetchProjectCreators = async (projectIds) => {
        try {
            const uniqueIds = [...new Set(projectIds)];
            const creatorData = {};
            
            // Fetch project details one by one to get creator information
            for (const projectId of uniqueIds) {
                const response = await fetch(`https://venture-xbackend.vercel.app/create-project/${projectId}`, {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const project = await response.json();
                    
                    if (project.createdBy) {
                        // Get creator details
                        const userResponse = await fetch(`https://venture-xbackend.vercel.app/user/${project.createdBy}`, {
                            credentials: 'include'
                        });
                        
                        if (userResponse.ok) {
                            const creator = await userResponse.json();
                            creatorData[projectId] = creator;
                        }
                    }
                }
            }
            
            setProjectCreators(creatorData);
        } catch (error) {
            console.error('Error fetching project creators:', error);
        }
    };

    const handleOpenReportModal = (entrepreneurId, projectId) => {
        setEntrepreneurToReport(entrepreneurId);
        setProjectIdForReport(projectId);
        setReportModalOpen(true);
    };

    const handleCloseReportModal = () => {
        setReportModalOpen(false);
        setEntrepreneurToReport(null);
        setProjectIdForReport(null);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary">Investment History</h2>
                <p className="text-gray-600 mt-2">
                    Total Amount Invested: ${totalInvested.toLocaleString()}
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Entrepreneur</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {investments.map(investment => {
                            const projectId = investment.projectId._id;
                            const entrepreneur = projectCreators[projectId];
                            
                            return (
                                <tr key={investment._id}>
                                    <td>{investment.projectId.title}</td>
                                    <td>
                                        {entrepreneur ? entrepreneur.name : 'Loading...'}
                                    </td>
                                    <td>${investment.amount.toLocaleString()}</td>
                                    <td>{new Date(investment.timestamp).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${
                                            investment.status === 'completed' ? 'badge-success' :
                                            investment.status === 'pending' ? 'badge-warning' :
                                            'badge-error'
                                        }`}>
                                            {investment.status || 'active'}
                                        </span>
                                    </td>
                                    <td>
                                        {entrepreneur && (
                                            <button
                                                onClick={() => handleOpenReportModal(entrepreneur._id, projectId)}
                                                className="text-red-600 hover:text-red-900 text-sm"
                                                title="Report this entrepreneur"
                                            >
                                                Report
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {investments.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No investments made yet.
                    </div>
                )}
            </div>
            
            {/* Report Modal */}
            {reportModalOpen && entrepreneurToReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <ReportUser 
                            userId={entrepreneurToReport} 
                            projectId={projectIdForReport}
                            onClose={handleCloseReportModal} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentHistory;