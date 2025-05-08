import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ReportUser = ({ userId, projectId, onClose }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [evidenceUrls, setEvidenceUrls] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason || !details) {
      toast.error('Please provide a reason and details for the report');
      return;
    }

    setIsSubmitting(true);

    try {
      // Split evidence URLs by line break or comma
      const parsedEvidenceUrls = evidenceUrls
        .split(/[\n,]/)
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const response = await fetch('https://venture-xbackend.vercel.app/api/reports/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportedUserId: userId,
          reason,
          details,
          relatedProjectId: projectId || null,
          evidenceUrls: parsedEvidenceUrls
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Report submitted successfully');
        if (onClose) onClose();
      } else {
        toast.error(data.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('An error occurred while submitting the report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonOptions = [
    'Fraudulent activity',
    'Misrepresentation of project',
    'Harassment',
    'Suspicious investment activity',
    'Fake profile information',
    'Other violation'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Report User</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Reason for Report:
          </label>
          <select 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="">Select a reason</option>
            {reasonOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Details:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Please provide detailed information about the issue..."
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Evidence URLs (optional):
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="2"
            value={evidenceUrls}
            onChange={(e) => setEvidenceUrls(e.target.value)}
            placeholder="Enter URLs separated by commas or new lines"
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">Add links to screenshots or other evidence</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportUser;