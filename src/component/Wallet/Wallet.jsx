import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' or 'withdraw'

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Fetch wallet balance
      const balanceRes = await axios.get('http://localhost:3000/api/wallet/balance', { withCredentials: true });
      setBalance(balanceRes.data.balance);
      
      // Fetch transaction history
      const transactionsRes = await axios.get('http://localhost:3000/api/wallet/transactions', { withCredentials: true });
      setTransactions(transactionsRes.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError(error.response?.data?.message || 'Error loading wallet data');
      setLoading(false);
    }
  };

  const handleTransaction = async (type) => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setTransactionLoading(true);
      const parsedAmount = parseFloat(amount);
      
      if (type === 'withdraw' && parsedAmount > balance) {
        toast.error('Insufficient balance for withdrawal');
        setTransactionLoading(false);
        return;
      }
      
      const endpoint = `http://localhost:3000/api/wallet/${type}`;
      const response = await axios.post(
        endpoint, 
        { amount: parsedAmount },
        { withCredentials: true }
      );
      
      setBalance(response.data.balance);
      setAmount('');
      toast.success(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
      
      // Refresh transaction history
      fetchWalletData();
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      toast.error(error.response?.data?.message || `Error processing ${type}`);
    } finally {
      setTransactionLoading(false);
    }
  };

  const getTransactionStatusBadgeColor = (type) => {
    return type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">My Wallet</h1>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchWalletData}
            className="mt-2 text-blue-500 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Wallet Balance Card */}
      <div className="bg-base-300 p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg text-gray-600">Current Balance</h2>
            <p className="text-4xl font-bold text-blue-600">${balance.toFixed(2)}</p>
          </div>
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Transaction Form */}
      <div className="bg-base-300 p-6 rounded-xl shadow-md mb-8">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'deposit' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('deposit')}
          >
            Deposit Funds
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'withdraw' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('withdraw')}
          >
            Withdraw Funds
          </button>
        </div>
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              aria-describedby="amount-currency"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm" id="amount-currency">
                USD
              </span>
            </div>
          </div>
        </div>
        
        {activeTab === 'deposit' && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Add funds to your wallet to invest in projects. Funds will be available immediately.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {[50, 100, 500, 1000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount)}
                  className={`px-3 py-1 text-sm rounded ${
                    amount === quickAmount.toString()
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-green-50'
                  }`}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleTransaction('deposit')}
              disabled={transactionLoading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {transactionLoading ? 'Processing...' : 'Deposit Funds'}
            </button>
          </div>
        )}
        
        {activeTab === 'withdraw' && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Withdraw available funds from your wallet to your bank account.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {[50, 100, balance/2, balance].map((quickAmount, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAmount(parseFloat(quickAmount).toFixed(2))}
                  disabled={quickAmount > balance}
                  className={`px-3 py-1 text-sm rounded ${
                    amount === quickAmount.toString()
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : quickAmount > balance
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-red-50'
                  }`}
                >
                  {index === 2 ? '50%' : index === 3 ? 'Max' : `$${quickAmount}`}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleTransaction('withdraw')}
              disabled={transactionLoading || parseFloat(amount) > balance}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                parseFloat(amount) > balance
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              }`}
            >
              {transactionLoading ? 'Processing...' : 'Withdraw Funds'}
            </button>
            {parseFloat(amount) > balance && (
              <p className="mt-2 text-sm text-red-600">
                Insufficient balance for this withdrawal
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Transaction History */}
      <div className="bg-base-300 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-6">Transaction History</h2>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-200 divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionStatusBadgeColor(transaction.type)}`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {transaction.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt || Date.now()).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;