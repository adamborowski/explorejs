import React from 'react';
import {Link} from 'react-router';

const HomePage = () => {
  return (
    <div>
      <h1 className="page-header">ExploreJS</h1>
      <div className="jumbotron">

        <h1 className="display-3">Hello!</h1>
        <p className="lead">
          This application is the part of my <strong>thesis research</strong> whose title is <em><q>
          Adaptation of web-based user interfaces to explore measurement data at scale for interactive visual
          analysis
        </q></em>
        </p>
        <hr className="my-4"/>
        <p>
          The purpose of this work is to gather your assesment of the solution proposed in the thesis which is
        </p>
        <p>
          The solution itself is the library which allow your charts to explore infinite time series data.
        </p>
        <p>
          This interactive survey will ask you to explore some data using time series charts.
          There are many configurations to test against you and you are asked to pick the one which you think is the
          best.
        </p>
        <p>
          You can score each configuration using <strong>0-10 scale</strong>.
          You have only <strong>10 points</strong> to distribute across all configurations so that way you can tell us how much
          one is better than others for example by putting all <strong>10 points</strong> on the best configuration or
          giving one
          point on every configration if you think they don't differ so much.
        </p>
        <p>
          <Link className="btn btn-primary btn-lg" to="/scenario/">Begin survey</Link>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
