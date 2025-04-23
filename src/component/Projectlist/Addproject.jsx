// import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';


// const Addproject = () => {
//     const [errorMsg, setErrorMsg] = useState('');

//        const handleAdd = (e) => {
//             e.preventDefault();

//             const form = new FormData(e.target);
//             const title = form.get('title');  
//             const description = form.get('description');
//             const fundingGoal = form.get('fundingGoal');
//             const deadline = form.get('deadline');
//             const productinfo = { title, description, fundingGoal, deadline}; 
//             console.log({ title, description, fundingGoal, deadline});
//             console.log(productinfo);
    
    
        
    
    
//                 fetch('http://localhost:3000/create-project', {
//                     method: 'POST',
//                     headers: {
//                         'content-type': 'application/json'
//                     },
//                     body: JSON.stringify(productinfo)
//                 })
//                 .then(res => res.json())
//                 .then(data => {
//                     if (data.insertedId) {
//                         Swal.fire({
//                             title: 'Successfully added',
//                             text: 'User has been registered',
//                             icon: 'success',
//                             confirmButtonText: 'Cool'
//                         });
//                     } else if (data.message) {
//                         setErrorMsg(data.message); // Display backend message if error
//                     }
//                 })
//                 .catch(err => {
//                     console.error('Fetch error:', err);
//                     setErrorMsg('Something went wrong during registration.');
//                 });
                
//         };


//     return (

        
//         <div>
//             {/* <h1>add</h1> */}
//             <div className="hero min-h-screen bg-base-200">
                
//                 <div className=" flex-col lg:flex-row-reverse">
                    
//                     <div className="text-center lg:align-text-top">
//                         <h1 className="text-5xl font-bold">ADD here!</h1>
//                         {/* <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p> */}
//                         {/* <h1>Add here!</h1> */}
//                     </div>
//                     <div className="">
//                         <form onSubmit={handleAdd} className="card-body space-y-4">
//                             {/* Title */}
//                             <div className="form-control">
//                                 <label className="label">
//                                     <span className="label-text">Title</span>
//                                 </label>
//                                 <input type="text" name="title" placeholder="Title" className="input input-bordered" required />
//                             </div>

//                             {/* Funding Goal & Deadline side-by-side */}
//                             <div className="flex flex-col lg:flex-row gap-4">
//                                 <div className="form-control w-full">
//                                     <label className="label">
//                                         <span className="label-text">Funding Goal</span>
//                                     </label>
//                                     <input type="number" name="fundingGoal" placeholder="$" className="input input-bordered" required />
//                                 </div>

//                                 <div className="form-control w-full">
//                                     <label className="label">
//                                         <span className="label-text">Deadline</span>
//                                     </label>
//                                     <input type="date" name="deadline" className="input input-bordered" required />
//                                 </div>
//                             </div>

//                             {/* Description (larger) */}
//                             <div className="form-control">
//                                 <label className="label">
//                                     <span className="label-text">Description</span>
//                                 </label>
//                                 <textarea
//                                     name="description"
//                                     placeholder="Tell us more about your project..."
//                                     className="textarea textarea-bordered min-h-[120px]"
//                                     required
//                                 />
//                             </div>

//                             <div className="form-control mt-6">
//                             <button className="btn btn-active btn-secondary">ADD</button>                            </div>
//                         </form>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Addproject;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Addproject = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const title = form.get('title');
    const description = form.get('description');
    const fundingGoal = form.get('fundingGoal');
    const deadline = form.get('deadline');
    const img = form.get('img');

    const projectInfo = { title, description, fundingGoal, deadline,img };
    console.log('Submitting:', projectInfo);

    fetch('http://localhost:3000/create-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(projectInfo)
    })
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server did not return valid JSON');
        }

        const data = await res.json();

        if (res.ok && data.insertedId) {
          Swal.fire({
            title: 'Project Added!',
            text: 'Your project has been successfully added.',
            icon: 'success',
            confirmButtonText: 'Awesome!'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/entrepreneur-dashboard');
            }
          });
          e.target.reset(); // reset the form
          setErrorMsg('');
        } else {
          setErrorMsg(data.message || 'Failed to add project');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setErrorMsg('Something went wrong. Please try again.');
      });
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className=" flex-col lg:flex-row-reverse w-full max-w-4xl mx-auto">
        <div className="text-center lg:align-text-top">
          <h1 className="text-5xl font-bold">ADD here!</h1>
          <p className="py-6">
            {/* Bring your idea to life. Set your goal, choose your deadline, and tell your story to the world. */}
          </p>
        </div>

        <div className="">
          <form onSubmit={handleAdd} className="card-body space-y-4">
            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input type="text" name="title" placeholder="Project Title" className="input input-bordered" required />
            </div>

            {/* Funding Goal & Deadline */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Funding Goal ($)</span>
                </label>
                <input type="number" name="fundingGoal" placeholder="1000" className="input input-bordered" required />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Deadline</span>
                </label>
                <input type="date" name="deadline" className="input input-bordered" required />
              </div>
            </div>
            {/* image */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Image</span>
              </label>
              <input type="text" name="img" placeholder="Image url" className="input input-bordered" required />
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                placeholder="Tell us about your project..."
                className="textarea textarea-bordered min-h-[120px]"
                required
              />
            </div>
            {/* <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="img"
                placeholder="Image URL"
                className="textarea textarea-bordered min-h-[120px]"
                required
              />
            </div> */}

            {/* Submit Button */}
            <div className="form-control mt-4">
              <button className="btn btn-active btn-secondary">Add Project</button>
            </div>

            {/* Error Message */}
            {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addproject;
