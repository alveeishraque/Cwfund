import React from 'react';
import { Link } from 'react-router-dom';
import Projectlist from '../Projectlist/Projectlist';
import image from '../../assets/KSR_Blog_July15_Crowdfunding-for-Startups.png'

const Home = () => {
  return (
    <div>
      {/* <h3>this is Home</h3> */}
      <div className="hero min-h-screen" style={{backgroundImage: `url(${image})`}}>
  <div className="hero-overlay bg-opacity-60"></div>
  <div className="hero-content text-center text-neutral-content">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
      <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
      <button className="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
      <div>

        <Projectlist></Projectlist>

      </div>
    </div>
  );
};

export default Home;