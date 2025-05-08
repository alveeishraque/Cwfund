import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://venture-xbackend.vercel.app/api/reports/my-reports', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error.message || 'An error occurred while fetching reports');
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
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

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'none':
        return 'bg-gray-100 text-gray-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'wallet_freeze':
        return 'bg-red-100 text-red-800';
      case 'project_restriction':
        return 'bg-orange-100 text-orange-800';
      case 'account_suspension':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatActionName = (action) => {
    switch (action) {
      case 'none':
        return 'No Action';
      case 'warning':
        return 'Warning';
      case 'wallet_freeze':
        return 'Wallet Frozen';
      case 'project_restriction':
        return 'Project Restricted';
      case 'investing_restriction':
        return 'Investing Restricted';
      case 'account_suspension':
        return 'Account Suspended';
      default:
        return action;
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading reports...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Reports</h2>
      
      {reports.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          You haven't submitted any reports yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">Report against {report.reportedUser?.name || 'User'}</h3>
                <span 
                  className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(report.status)}`}
                >
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </div>

              <div className="text-sm text-gray-700 mb-2">
                <p><span className="font-medium">Reason:</span> {report.reason}</p>
                <p><span className="font-medium">Details:</span> {report.details}</p>
                
                {report.relatedProject && (
                  <p><span className="font-medium">Project:</span> {report.relatedProject.title}</p>
                )}

                <p><span className="font-medium">Submitted:</span> {format(new Date(report.createdAt), 'MMM dd, yyyy')}</p>
              </div>

              {report.status !== 'pending' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm mb-1">
                    <span className="font-medium">Admin Response:</span>
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Action Taken:</span>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${getActionBadgeClass(report.actionTaken)}`}
                    >
                      {formatActionName(report.actionTaken)}
                    </span>
                  </div>
                  
                  {report.adminComments && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">Comments:</span> {report.adminComments}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReports;