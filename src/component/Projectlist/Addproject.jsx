




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

    fetch('https://venture-xbackend.vercel.app/create-project', {
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
