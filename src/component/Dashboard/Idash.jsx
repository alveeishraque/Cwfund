import React from 'react';

const Idash = () => {
    const handleButtonClick = (action) => {
        alert(`You clicked: ${action}`);
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-green-600">
                    Welcome to Your Dashboard!
                </h1>
                <p className="text-gray-500 mt-2">
                    Choose an action below to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Button 1 */}
                <div className="flex justify-center">
                    <button
                        className="btn btn-primary w-48 h-16 text-lg font-semibold"
                        onClick={() => handleButtonClick('Investment Opportunities')}
                    >
                        Investment Opportunities
                    </button>
                </div>

                {/* Button 2 */}
                <div className="flex justify-center">
                    <button
                        className="btn btn-secondary w-48 h-16 text-lg font-semibold"
                        onClick={() => handleButtonClick('Investment History')}
                    >
                        nvestment Histor
                    </button>
                </div>

                {/* Button 3 */}
                <div className="flex justify-center">
                    <button
                        className="btn btn-accent w-48 h-16 text-lg font-semibold"
                        onClick={() => handleButtonClick('Project Management')}
                    >
                        Project Management
                    </button>
                </div>

                {/* Button 4 */}
                <div className="flex justify-center">
                    <button
                        className="btn btn-success w-48 h-16 text-lg font-semibold"
                        onClick={() => handleButtonClick('Profile Settings')}
                    >
                        Profile Settings
                    </button>
                </div>

                {/* Button 5 */}
                <div className="flex justify-center">
                    <button
                        className="btn btn-warning w-48 h-16 text-lg font-semibold"
                        onClick={() => handleButtonClick('Notifications')}
                    >
                        Notifications
                    </button>
                </div>

                {/* Button 6 */}
                <div className="flex justify-center">
                    <button
                        className="btn btn-danger w-48 h-16 text-lg font-semibold"
                        onClick={() => handleButtonClick('Logout')}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Idash;
