

// export default Register;

import React, { useContext, useState } from 'react';
import { auth } from '../../firebase.init';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../provider/Authprovider';
import Swal from 'sweetalert2'

const Register = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // new state for success
    const [userType, setUserType] = useState('entrepreneur'); // state to hold user type
    const { createNewUser, user, setUser } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const name = form.get('name');  // Get username
        const email = form.get('email');
        const password = form.get('password');
        const info = { name, email, password, role:userType }; // Create an object to send to the server
        // console.log({ name, email, password, userType });
        console.log(info);


        // Pass username and userType to createNewUser
        // createNewUser(email, password, userType)
        //     .then((result) => {
        //         const user = result.user;
        //         setUser(user);
        //         setErrorMsg('');
        //         setIsSuccess(true); // show success
        //     })
        //     .catch((error) => {
        //         console.error('error', error);
        //         setErrorMsg(error.message);
        //         setIsSuccess(false); // hide success on error
        //     });


            fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(info)
            })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    Swal.fire({
                        title: 'Successfully added',
                        text: 'User has been registered',
                        icon: 'success',
                        confirmButtonText: 'Cool'
                    });
                } else if (data.message) {
                    setErrorMsg(data.message); // Display backend message if error
                }
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setErrorMsg('Something went wrong during registration.');
            });
            
    };

    return (
        <div>
            <div>
                {/* <h1>Register</h1> */}
                <div className="hero min-h-screen bg-base-200">
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                            <h3 className="text-2xl font-bold text-center mt-4">Register</h3>
                            <form onSubmit={handleSubmit} className="card-body">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Username</span>
                                    </label>
                                    <input type="text" name="name" placeholder="Username" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="email" name="email" placeholder="email" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                                    <label className="label">
                                        <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                    </label>
                                </div>
                                {/* Add User Type Selection */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Register As</span>
                                    </label>
                                    <select 
                                        name="userType"
                                        className="input input-bordered"
                                        value={userType} 
                                        onChange={(e) => setUserType(e.target.value)}
                                    >
                                        <option value="entrepreneur">Entrepreneur</option>
                                        <option value="investor">Investor</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                </div>
                                <div className="form-control mt-6">
                                    <button className="btn btn-primary">Register</button>
                                </div>
                                <div>
                                    {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
                                    {isSuccess && <p className="text-green-500 mt-2">Successful</p>}
                                </div>
                            </form>
                            <p>Already have an account? {''}
                                <Link to='/login'>Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
