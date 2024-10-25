import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Context } from '../../main';
import { Navigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import PopularCategories from './PopularCategories';
import PopularCompanies from './PopularCompanies';
import Loader from '../Loader/Loader';

const Home = () => {
  const { isAuthorized } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay to demonstrate the loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div style={{ backgroundColor: 'white', height: '100vh', width: '100vw' }}>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Loader />
        </div>
      ) : (
        <section className="homePage page">
          <HeroSection />
          <HowItWorks />
          <PopularCategories />
          <PopularCompanies />
        </section>
      )}
    </div>
  );
};

export default Home;