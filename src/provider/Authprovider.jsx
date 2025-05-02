// import React, { createContext, useEffect, useState } from 'react';
// import { auth } from '../firebase.init';
// import { createUserWithEmailAndPassword, onAuthStateChanged,signInWithEmailAndPassword, signOut } from 'firebase/auth';

// // Call createContext() correctly
// export const AuthContext = createContext();

// // Use lowercase 'children' for the prop
// const Authprovider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const createNewUser = (email,password, userType ) => {
//         // Function to create a new user
//         return createUserWithEmailAndPassword(auth, email, password, userType)
//     }

//     const userlogin= (email,password) => {
//         // Function to log in a user
//         return signInWithEmailAndPassword(auth, email, password)
//     } 
//     // console.log(user);
//     const logout = () => {
//         // Function to log out a user
//         return signOut(auth);
//     }
    
//     const authinfo = {
//         user,
//         setUser,
//         createNewUser,
//         userlogin,
//         logout,
//     };
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             // console.log('user inside auth state change', currentUser);
//             setUser(currentUser);
//         })
//         return () => unsubscribe();// Cleanup subscription on unmount
               
//     },[])



//     return (
//         <AuthContext.Provider value={authinfo}>
//             {children}  {/* Use lowercase 'children' */}
//         </AuthContext.Provider>
//     );
// };

// export default Authprovider;



import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const Authprovider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    // Check session on page load
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('http://localhost:3000/check-session', {
                    credentials: 'include'
                });
                const data = await res.json();

                if (data.loggedIn) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Session check failed:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // Logout function — calls backend to destroy session
    const logout = async () => {
        try {
            await fetch('http://localhost:3000/logout', {
                method: 'GET',
                credentials: 'include'
            });
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const authInfo = {
        user,
        setUser,
        loading,
        logout,
        userInfo,
        setUserInfo
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default Authprovider;
