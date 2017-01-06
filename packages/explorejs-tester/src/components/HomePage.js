import React from 'react';
import {Link} from 'react-router';

const HomePage = () => {
  return (
    <div>
      <h1>React Slingshot</h1>
      <div className="jumbotron">
        <h1>Hello, world!</h1>
        <p>...</p>
        <p><a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p>
      </div>

      <h2>Get Started</h2>
      <ol>
        <li>Review the <Link to="fuel-savings">demo app</Link></li>
        <li>Remove the demo and start coding: npm run remove-demo</li>
      </ol>
    </div>
  );
};

export default HomePage;
