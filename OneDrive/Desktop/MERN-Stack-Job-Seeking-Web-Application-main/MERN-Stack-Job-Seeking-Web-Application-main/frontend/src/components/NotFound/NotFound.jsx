import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="page notfound">
      <div className="content">
      <h1 style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, 0)', fontSize: '80px', fontFamily: 'Poppins'  }}>404</h1>
        <img src="/bg.gif" alt="notfound" />
        <h3 style={{ position: 'absolute', bottom: '1%', left: '50%', transform: 'translate(-50%, 0)', fontSize: '80px', fontFamily: 'Poppins', marginLeft: '20px', whiteSpace: 'nowrap' }}>looks like you're lost</h3>
        <p style={{ position: 'absolute', bottom: '-4%', left: '50%', transform: 'translate(-50%, 0)', fontFamily: 'Poppins' }}>The page you are looking for is not available.</p>
        <Link to={'/'}>RETURN TO HOME PAGE</Link>
      </div>
    </section>
  );
};

export default NotFound;