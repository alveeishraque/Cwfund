import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [action, setAction] = useState('none');
  const [penaltyDuration, setPenaltyDuration] = useState(30);
  const [processingReport, setProcessingReport] = useState(false);
  const [filter, setFilter] = useState('all'); // Filter options: all, pending, resolved, dismissed

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://venture-xbackend.vercel.app/api/reports/all', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessReport = async (reportId, status) => {
    if (!adminComment && status === 'resolved') {
      toast.error('Please add a comment when resolving a report');
      return;
    }

    setProcessingReport(true);
    try {
      const response = await fetch(`https://venture-xbackend.vercel.app/api/reports/${reportId}/process`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          actionTaken: status === 'dismissed' ? 'none' : action,
          adminComments: adminComment,
          penaltyDuration: parseInt(penaltyDuration)
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to process report');
      }

      toast.success(`Report ${status === 'resolved' ? 'resolved' : 'dismissed'} successfully`);
      setActiveReport(null);
      setAdminComment('');
      setAction('none');
      setPenaltyDuration(30);

      // Refresh reports list
      fetchReports();
    } catch (error) {
      console.error('Error processing report:', error);
      toast.error('Failed to process report');
    } finally {
      setProcessingReport(false);
    }
  };

  const handleRemovePenalties = async (userId) => {
    try {
      const response = await fetch(`https://venture-xbackend.vercel.app/api/reports/penalties/remove/${userId}`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to remove penalties');
      }

      toast.success('Penalties removed successfully');
      
      // Refresh reports list
      fetchReports();
    } catch (error) {
      console.error('Error removing penalties:', error);
      toast.error('Failed to remove penalties');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'entrepreneur':
        return 'bg-blue-100 text-blue-800';
      case 'investor':
        return 'bg-green-100 text-green-800';
      case 'staff':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPenaltyInfo = (user) => {
    if (!user || !user.penalties) return null;
    
    const penalties = [];
    
    if (user.penalties.isWalletFrozen) {
      penalties.push('Wallet Frozen');
    }
    
    if (user.penalties.isProjectRestricted) {
      penalties.push('Project Restricted');
    }
    
    if (user.penalties.isInvestingRestricted) {
      penalties.push('Investing Restricted');
    }
    
    return penalties.length > 0 ? penalties.join(', ') : 'No active penalties';
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  if (loading) {
    return <div className="text-center p-4">Loading reports...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Reports Management</h2>
      
      {activeReport ? (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="mb-4">
            <button 
              onClick={() => setActiveReport(null)}
              className="text-blue-500 hover:text-blue-700 mb-4 inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to reports list
            </button>
            
            <h3 className="text-xl font-semibold">Report Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-sm">Reported By</p>
              <p className="font-medium">{activeReport.reportedBy?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500">{activeReport.reportedBy?.email}</p>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleBadgeClass(activeReport.reportedBy?.role)}`}>
                {activeReport.reportedBy?.role || 'Unknown Role'}
              </span>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Reported User</p>
              <p className="font-medium">{activeReport.reportedUser?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500">{activeReport.reportedUser?.email}</p>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleBadgeClass(activeReport.reportedUser?.role)}`}>
                {activeReport.reportedUser?.role || 'Unknown Role'}
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 text-sm">Report Reason</p>
            <p className="font-medium">{activeReport.reason}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 text-sm">Details</p>
            <p className="bg-white p-3 rounded border">{activeReport.details}</p>
          </div>
          
          {activeReport.relatedProject && (
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Related Project</p>
              <p className="font-medium">{activeReport.relatedProject.title}</p>
              {activeReport.relatedProject.description && (
                <p className="text-sm text-gray-500 mt-1">{activeReport.relatedProject.description.substring(0, 100)}...</p>
              )}
            </div>
          )}
          
          {activeReport.evidenceUrls && activeReport.evidenceUrls.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-1">Evidence Links</p>
              <ul className="list-disc list-inside">
                {activeReport.evidenceUrls.map((url, index) => (
                  <li key={index}>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <hr className="my-4" />
          
          <div className="mb-4">
            <p className="text-gray-600 font-medium mb-2">Admin Action</p>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Type
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="none">No Action</option>
                <option value="warning">Warning Only</option>
                <option value="wallet_freeze">Freeze Wallet</option>
                <option value="project_restriction">Restrict Project Creation</option>
                <option value="investing_restriction">Restrict Investing</option>
                <option value="account_suspension">Full Suspension (All Features)</option>
              </select>
            </div>
            
            {action !== 'none' && action !== 'warning' && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Penalty Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={penaltyDuration}
                  onChange={(e) => setPenaltyDuration(e.target.value)}
                />
              </div>
            )}
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Comments
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                rows="3"
                placeholder="Add your comments here..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              onClick={() => handleProcessReport(activeReport._id, 'dismissed')}
              disabled={processingReport}
            >
              Dismiss Report
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              onClick={() => handleProcessReport(activeReport._id, 'resolved')}
              disabled={processingReport}
            >
              {processingReport ? 'Processing...' : 'Resolve and Apply Action'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div>
              <label className="mr-2 font-medium">Filter by Status:</label>
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
            
            <button 
              onClick={fetchReports}
              className="text-blue-500 hover:text-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh List
            </button>
          </div>
          
          {filteredReports.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              No {filter !== 'all' ? filter : ''} reports to display.
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold">
                  {filter === 'all' 
                    ? 'All Reports' 
                    : filter === 'pending' 
                      ? 'Pending Reports' 
                      : filter === 'resolved' 
                        ? 'Resolved Reports' 
                        : 'Dismissed Reports'
                  } ({filteredReports.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reported User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Penalties
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {report.reportedUser?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.reportedUser?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(report.reportedUser?.role)}`}>
                            {report.reportedUser?.role || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{report.reason}</div>
                          {report.relatedProject && (
                            <div className="text-xs text-gray-500">
                              Project: {report.relatedProject.title}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(report.status)}`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {getPenaltyInfo(report.reportedUser)}
                          </div>
                          {report.reportedUser?.penalties?.restrictionEndDate && (
                            <div className="text-xs text-gray-500">
                              Until: {format(new Date(report.reportedUser.penalties.restrictionEndDate), 'MMM dd, yyyy')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setActiveReport(report)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View Details
                          </button>
                          
                          {report.reportedUser?.penalties && (
                            report.reportedUser.penalties.isWalletFrozen || 
                            report.reportedUser.penalties.isProjectRestricted || 
                            report.reportedUser.penalties.isInvestingRestricted
                          ) && (
                            <button
                              onClick={() => handleRemovePenalties(report.reportedUser._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove Penalties
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsManagement;