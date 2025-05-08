import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { format } from 'date-fns';
import ReportUser from '../Notification/ReportUser';

const EntrepreneurInvestments = () => {
    const { userInfo } = useContext(AuthContext);
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState('all');
    const [projects, setProjects] = useState([]);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [investorToReport, setInvestorToReport] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        fetchInvestments();
    }, [selectedProject]);

    const fetchProjects = async () => {
        try {
            const response = await fetch('https://venture-xbackend.vercel.app/api/entrepreneur-projects', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            setProjects(data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message || 'Failed to load projects');
        }
    };

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            
            // Fetch investments for either all projects or a specific project
            const url = selectedProject === 'all' 
                ? 'https://venture-xbackend.vercel.app/api/investments/entrepreneur'
                : `https://venture-xbackend.vercel.app/api/investments/project/${selectedProject}`;

            const response = await fetch(url, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch investments');
            }

            const data = await response.json();
            
            // Format the investments with additional data
            const formattedInvestments = Array.isArray(data.investments) 
                ? data.investments 
                : [];
            
            setInvestments(formattedInvestments);
        } catch (err) {
            console.error('Error fetching investments:', err);
            setError(err.message || 'Failed to load investments');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReportModal = (investor) => {
        setInvestorToReport(investor);
        setReportModalOpen(true);
    };

    const handleCloseReportModal = () => {
        setReportModalOpen(false);
        setInvestorToReport(null);
    };

    if (loading) return <div className="text-center p-4">Loading investment data...</div>;
    if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Investments Received</h2>
            
            {/* Project Selection Dropdown */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Project:</label>
                <select
                    className="w-full md:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                >
                    <option value="all">All Projects</option>
                    {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                            {project.title}
                        </option>
                    ))}
                </select>
            </div>

            {investments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No investments have been made{selectedProject !== 'all' ? ' for this project' : ''} yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Investor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Project
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {investments.map((investment) => (
                                <tr key={investment._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {investment.timestamp ? format(new Date(investment.timestamp), 'MMM dd, yyyy') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {investment.investorId?.name || 'Unknown Investor'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {investment.projectId?.title || 'Unknown Project'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${investment.amount?.toLocaleString() || '0'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleOpenReportModal(investment.investorId)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Report this investor"
                                        >
                                            Report Investor
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Report Modal */}
            {reportModalOpen && investorToReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <ReportUser 
                            userId={investorToReport._id} 
                            onClose={handleCloseReportModal} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EntrepreneurInvestments;