import React from 'react';
import { format } from 'date-fns';

const PenaltyAlert = ({ penalties }) => {
  if (!penalties || (!penalties.isWalletFrozen && !penalties.isProjectRestricted && !penalties.isInvestingRestricted)) {
    return null; // No penalties to display
  }

  const formatEndDate = (date) => {
    if (!date) return 'indefinitely';
    return format(new Date(date), 'MMMM dd, yyyy');
  };

  const getRestrictionMessages = () => {
    const messages = [];
    
    if (penalties.isWalletFrozen) {
      messages.push('Your wallet is currently frozen and you cannot make deposits or withdrawals.');
    }
    
    if (penalties.isProjectRestricted) {
      messages.push('Your ability to create or modify projects has been restricted.');
    }
    
    if (penalties.isInvestingRestricted) {
      messages.push('Your ability to make investments has been restricted.');
    }
    
    return messages;
  };

  const restrictionMessages = getRestrictionMessages();

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Account Restrictions Applied</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {restrictionMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
            {penalties.restrictionReason && (
              <p className="mt-2">
                <strong>Reason:</strong> {penalties.restrictionReason}
              </p>
            )}
            {penalties.restrictionEndDate && (
              <p className="mt-2">
                <strong>Restrictions will be lifted on:</strong> {formatEndDate(penalties.restrictionEndDate)}
              </p>
            )}
          </div>
          <p className="mt-3 text-sm text-red-700">
            If you believe this was applied in error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PenaltyAlert;