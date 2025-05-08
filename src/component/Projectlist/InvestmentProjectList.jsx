


// new



import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../provider/Authprovider';
import { toast } from 'react-toastify';

const InvestmentProjectList = () => {
    const { userInfo } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [investmentAmounts, setInvestmentAmounts] = useState({});
    const [walletBalance, setWalletBalance] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApprovedProjects();
        fetchWalletBalance();
    }, []);
    // alvee
    const fetchApprovedProjects = async () => {
        try {
            const response = await fetch('https://venture-xbackend.vercel.app/api/projects/approved', {
                credentials: 'include'
            });
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };
    // taj
    const fetchWalletBalance = async () => {
        try {
            const response = await fetch('https://venture-xbackend.vercel.app/api/wallet/balance', {
                credentials: 'include'
            });
            const data = await response.json();
            setWalletBalance(data.balance);
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };
    // ryhan
    const handleAmountChange = (projectId, amount) => {
        setInvestmentAmounts({
            ...investmentAmounts,
            [projectId]: amount
        });
    };
    // ryhan
    const handleInvest = async (projectId) => {
        try {
            const amount = Number(investmentAmounts[projectId]);
            if (!amount || amount <= 0) {
                toast.error('Please enter a valid investment amount');
                return;
            }

            if (amount > walletBalance) {
                toast.error('Insufficient wallet balance');
                return;
            }

            const response = await fetch('https://venture-xbackend.vercel.app/api/investments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    projectId,
                    amount
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Investment successful!');
                setInvestmentAmounts({
                    ...investmentAmounts,
                    [projectId]: ''
                });
                setWalletBalance(data.updatedBalance); // Update wallet balance
                fetchApprovedProjects(); // Refresh the project list
            } else {
                toast.error(data.message || 'Investment failed');
            }
        } catch (error) {
            console.error('Error making investment:', error);
            toast.error('Failed to process investment');
        }
    };
    // alvee
    const handleViewComments = (projectId) => {
        navigate(`/viewcomments/${projectId}`);
    };

    return (
        // alvee
        <div className="p-6">
            <div className="mb-6 text-lg font-semibold text-right text-primary">
                {/* Wallet Balance: ${walletBalance.toLocaleString()} */}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map(project => (
                    <div key={project._id} className="shadow-xl card bg-base-100">
                        <figure>
                            <img
                                src={project.img}
                                alt={project.title}
                                className="object-cover w-full h-48"
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="text-xl font-bold card-title text-primary">
                                {project.title}
                            </h2>
                            <p className="text-gray-600">{project.description}</p>
                            {/* alvee end */}


                            {/* ryhan start */}
                            
                            <div className="mt-4">
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>Progress:</span>
                                    <span>{((project.currentInvestment / project.fundingGoal) * 100).toFixed(1)}%</span>
                                </div>
                                <progress
                                    className="w-full progress progress-primary"
                                    value={project.currentInvestment}
                                    max={project.fundingGoal}
                                ></progress>
                            </div>

                            <div className="mt-4 space-y-2">
                                <p className="text-sm">
                                    <span className="font-semibold">Goal:</span> ${project.fundingGoal.toLocaleString()}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Raised:</span> ${project.currentInvestment.toLocaleString()}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Remaining:</span> ${project.remainingGoal.toLocaleString()}
                                </p>
                            </div>

                            <div className="mt-4 card-actions">
                                <div className="w-full form-control">
                                    <label className="label">
                                        <span className="label-text">Investment Amount ($)</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        className="w-full input input-bordered"
                                        value={investmentAmounts[project._id] || ''}
                                        onChange={(e) => handleAmountChange(project._id, e.target.value)}
                                        min="0"
                                        step="1"
                                    />
                                </div>
                                <button
                                    className="w-full mt-2 btn btn-primary"
                                    onClick={() => handleInvest(project._id)}
                                    disabled={!investmentAmounts[project._id]}
                                >
                                    Invest Now
                                </button>
                                {/* ryhan end */}

                                {/* alvee */}
                                <button
                                    className="w-full mt-2 btn btn-outline"
                                    onClick={() => handleViewComments(project._id)}
                                >
                                    View Comments
                                </button>
                                {/* alvee end */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvestmentProjectList;

