import React, { useEffect, useState } from 'react';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch notifications for the entrepreneur
    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/notifications', {
                method: 'GET',
                credentials: 'include' // Include credentials (cookies/session) in the request
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotifications(data);
            // setLoading(false);
        } catch (err) {
            setError('Failed to fetch notifications');
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/notifications/${notificationId}`, {
                method: 'PATCH',
                credentials: 'include' // Include credentials (cookies/session) in the request
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            setNotifications(notifications.filter((notification) => notification._id !== notificationId));
        } catch (err) {
            setError('Failed to mark notification as read');
        }
    };

    // if (loading) return <div className="text-center text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-3xl px-6 py-8 mx-auto">
            <h1 className="mb-8 text-4xl font-semibold text-center text-green-600">Notifications</h1>
            
            {notifications.length === 0 ? (
                <p className="text-center text-gray-600">No notifications available.</p>
            ) : (
                <ul className="space-y-4">
                    {notifications.map((notification) => (
                        <li key={notification._id} className="p-4 transition duration-200 ease-in-out border border-gray-200 rounded-lg shadow-sm bg-slate-500 hover:bg-gray-50">
                            <p className="text-lg text-gray-800">{notification.message}</p>
                            <button
                                onClick={() => markAsRead(notification._id)}
                                className="mt-2 font-semibold text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                                Mark as Read
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notification;
