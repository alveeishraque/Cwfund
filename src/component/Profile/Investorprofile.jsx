// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../../provider/Authprovider';
// import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
// import img from "../../assets/shiftdiff_number1_1200x628_fb.jpg";  // Import default image

// const InvestorProfile = () => {
//     const { userInfo } = useContext(AuthContext);
//     const navigate = useNavigate();  // Initialize navigate function

//     const [profile, setProfile] = useState(null);  // State to store the fetched profile data
//     // const [loading, setLoading] = useState(true);  // State for loading status

//     // Fetch profile data from the backend
//     useEffect(() => {
//         if (!userInfo?._id) {
//             console.error('User ID is missing.');
//             return;
//         }

//         // Fetch user profile from the backend
//         fetch(`http://localhost:3000/investor-profile/${userInfo._id}`)
//             .then((response) => response.json())
//             .then((data) => {
//                 setProfile(data); 
//                 console.log("data",data);
//                  // Set the profile data to state
//                 // setLoading(false);  // Set loading to false after data is fetched
//             })
//             .catch((error) => {
//                 console.error('Error fetching profile data:', error);
//                 // setLoading(false);  // Set loading to false on error
//             });
//     }, [userInfo?._id]);

//     // Function to handle missing information
//     const handleMissingInfo = (value) => {
//         return value ? value : 'NaN';  // Return "NaN" if the value is missing
//     };

//     // Function to handle Edit button click
//     const handleEditClick = () => {
//         navigate('/investor-edit-profile');  // Navigate to the edit profile page
//     };

//     // if (loading) {
//     //     return <div>Loading...</div>;  // Show loading text while data is being fetched
//     // }

//     return (
//         <div className="min-h-screen p-6 bg-base-200">
//             {/* Profile Header */}
//             <div className="mb-8 text-center">
//                 <h1 className="text-4xl font-bold text-green-600">
//                     {handleMissingInfo(profile?.name)}'s Profile
//                 </h1>
//             </div>

//             {/* Profile Card */}
//             <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-lg bg-slate-400">
//                 {/* Profile Image */}
//                 <div className="flex justify-center mb-6">
//                     <img
//                         src={handleMissingInfo(profile?.image)}
//                         // src={img}
//                         alt="Profile"
//                         className="object-cover w-40 h-40 border-4 border-green-600 rounded-full"
//                     />
//                 </div>

//                 {/* User Information */}
//                 <div className="space-y-4">
//                     {/* Name */}
//                     <div className="flex items-center space-x-2">
//                         <h2 className="text-lg font-medium text-gray-700">Name:</h2>
//                         <p className="text-sm text-black">{handleMissingInfo(profile?.name)}</p>
//                     </div>

//                     {/* Email */}
//                     <div className="flex items-center space-x-2">
//                         <h2 className="text-lg font-medium text-gray-700">Email:</h2>
//                         <p className="text-sm text-black">{handleMissingInfo(profile?.email)}</p>
//                     </div>

//                     {/* Contact Info */}
//                     <div className="flex items-center space-x-2">
//                         <h2 className="text-lg font-medium text-gray-700">Contact Info:</h2>
//                         <p className="text-sm text-black">{handleMissingInfo(profile?.contactInfo)}</p>
//                     </div>
                    

//                 {/* Edit Button */}
//                 <button
//                     onClick={handleEditClick}  // Handle click to navigate to edit page
//                     className="mt-4 btn btn-active btn-accent"
//                 >
//                     Edit
//                 </button>
//                 <button
//                     onClick={() => navigate('/investor-dashboard')}
//                     className="mt-4 ml-4 btn btn-active btn-secondary"
//                 >
//                     Done
//                 </button>
//             </div>
//         </div>
//         {/* Documents */}
//         <div className="flex items-center space-x-2">
//                         <h2 className="text-lg font-medium text-gray-700">Documents:</h2>
//                         <img
//                         src={handleMissingInfo(profile?.documents)}
//                         // src={img}
//                         alt="Profile"
//                         className="object-cover w-40 h-40 border-4 border-green-600 rounded-full"
//                     />
//                     </div>
//                 </div>
//     );
// };

// export default InvestorProfile;




// new???????????????????????????????
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import img from "../../assets/shiftdiff_number1_1200x628_fb.jpg";  // Import default image

const InvestorProfile = () => {
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();  // Initialize navigate function

    const [profile, setProfile] = useState(null);  // State to store the fetched profile data

    // Fetch profile data from the backend
    useEffect(() => {
        if (!userInfo?._id) {
            console.error('User ID is missing.');
            return;
        }

        // Fetch user profile from the backend
        fetch(`http://localhost:3000/investor-profile/${userInfo._id}`)
            .then((response) => response.json())
            .then((data) => {
                setProfile(data); 
                console.log("data", data);  // Set the profile data to state
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);
            });
    }, [userInfo?._id]);

    // Function to handle missing information
    const handleMissingInfo = (value) => {
        return value ? value : 'NaN';  // Return "NaN" if the value is missing
    };

    // Function to handle Edit button click
    const handleEditClick = () => {
        navigate('/investor-edit-profile');  // Navigate to the edit profile page
    };

    return (
        <div className="min-h-screen p-6 bg-base-200">
            {/* Profile Header */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-green-600">
                    {handleMissingInfo(profile?.name)}'s Profile
                </h1>
            </div>

            {/* Profile Card */}
            <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-lg bg-slate-400">
                {/* Profile Image */}
                <div className="flex justify-center mb-6">
                    <img
                        src={handleMissingInfo(profile?.image)}
                        alt="Profile"
                        className="object-cover w-40 h-40 border-4 border-green-600 rounded-full"
                    />
                </div>

                {/* User Information */}
                <div className="space-y-4">
                    {/* Name */}
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-medium text-gray-700">Name:</h2>
                        <p className="text-sm text-black">{handleMissingInfo(profile?.name)}</p>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-medium text-gray-700">Email:</h2>
                        <p className="text-sm text-black">{handleMissingInfo(profile?.email)}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-medium text-gray-700">Contact Info:</h2>
                        <p className="text-sm text-black">{handleMissingInfo(profile?.contactInfo)}</p>
                    </div>
                </div>

                {/* Documents Section at the Bottom */}
                <div className="flex items-center mt-6 space-x-2">
                    <h2 className="text-lg font-medium text-gray-700">Documents:</h2>
                    {/* Render document URL as a clickable link */}
                    <p className="text-sm text-black">
                        {profile?.documents ? (
                            <a
                                href={profile?.documents}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline transition-all duration-200 hover:text-green-500"
                            >
                                View Document
                            </a>
                        ) : (
                            'NaN'
                        )}
                    </p>
                </div>

                {/* Edit Button */}
                <button
                    onClick={handleEditClick}  // Handle click to navigate to edit page
                    className="mt-4 btn btn-active btn-accent"
                >
                    Edit
                </button>
                <button
                    onClick={() => navigate('/investor-dashboard')}
                    className="mt-4 ml-4 btn btn-active btn-secondary"
                >
                    Back
                </button>
                
                
            </div>
        </div>
    );
};

export default InvestorProfile;
