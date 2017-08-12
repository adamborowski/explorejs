import React from 'react';

import fig1_too_dense from './img/1-too-dense.png';
import fig2_almost_ok from './img/2-almost-ok.png';
import fig3_ok from './img/3-ok.png';
import fig4_too_sparse from './img/4-too-sparse.png';
import perPixel from './img/per-pixel.png';
import sparse from './img/sparse.png';
import './intro.scss';

export default (slide) => [
  <div className="text-justify">
    <h3 className="display-3">Hello!</h3>
    <p>
      I encourage you to participate in this unusual interactive survey.
      The purpose of the survey is to gain subjective opinions about solutions of some software engineering problem.
    </p>
    <p>
      The survey is an integral part of my <strong>MA thesis</ strong>, entitled:
    </p>
    <blockquote>
      Adaptation of web-based user interfaces for visual exploration of measurement data at scale.
    </blockquote>
    <p>
      I highly encourage you to read carefully the introduction to the problem and to familiarize with descriptions of
      every version of given solution.
      This survey should take not longer than 15 minutes.
    </p>
  </div>,
  <div className="text-justify">
    <h3 className="display-3">Introduction
      <small> to the issue</small>
    </h3>
    <p>
      The problem touches four different computer engineering fields: visual exploration, Big Data, internet
      applications and User Experience:
    </p>
    <ul>
      <li><em>Visual exploration</em> because it's about browsing interactive time series charts, for example: density
        of
        <em> Sulphur dioxide</em> or sick patient heartbeats.
      </li>
      <li><em>Big Data</em> because the amount of data is so large that it's difficult to process in technical and
        analitycal
        manner.
      </li>
      <li><em>internet applications</em>, because the charts are presented on user's browser, which downloads data from
        web server through a computer network.
      </li>
      <li><em>User Experience</em>, that is, the usability aspect and the effectiveness of using interactive
        interface.
      </li>
    </ul>

  </div>,
  <div className="text-justify">
    <h3 className="display-3">Use case </h3>
    <p>
      Imagine that you are working on the analysis of weather phenomena in the last few decades.
      You want to view five parameters measured on a specialistic device: humidity, temperature, wind speed, carbon
      dioxide and
      ozone in your web browser, in the form of a line graph.
    </p>
    <p>
      Assume that from the research point of view it is reasonable to take into account the last fifty years of
      measurements performed every 10 seconds.
      In addition, let's assume that it is valuable to look at larger ranges to get general conclusions as well as at
      smaller
      ranges to review individual incidents.
    </p>
    <p>
      Let's count how much data is to be processed:
    </p>
    <pre>
        5 parameters &times; 50 years &times; 1/(10s) = 788.4 million measurement data points
    </pre>
    <p>
      If we assume that each point needs to record the date of the sample and the measured value, then 12 bytes are
      required for writing a single point (8 bytes for the date in <strong>long</strong> format and 4 bytes for the
      floating point value).
    </p>
    <p>
      Given the number of points and the size of single point's data, we need to process up to <strong>9.5 GB of
      data</strong>.
    </p>
    <p>
      With a good (100Mbps) connection, loading this data into your browser will take about <strong>13 minutes</strong>.
      Even if the user waits for such time to retrieve this data from the network into the computer's cache, drawing one
      billion points on the graph will undoubtedly crash the browser.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Identify the problem</h3>
    <p>
      Perhaps you are wondering why we need to load all this data? After all, the human brain is not able to analyze
      each of the billions of points individually.
    </p>
    <p>
      Here we need to recall one important aspect of the problem.
      We want to give the user the freedom to navigate the graph so that he can see data of any range, at any zoom
      level.
      This navigation should be done in a <strong>fluent and unlimited way</strong>, as it does in modern mapping
      systems.
    </p>
    <p>
      Actually, for the aforementioned reasons it is not possible to build an application that gets all the data at the
      beginning, and then displays them.
      Drawing millions of points also takes up a large part of the user computer's computing power.
      This solution simply does not scale with increasing data size.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Existing solutions</h3>
    <p>
      The popular approach that addresses the scalability problem is to retrieve only the amount of data from the server
      that is needed to be displayed on screen, each time the user navigates a chart.
    </p>
    <p>
      You may be wondering what happens when the user wants to view data over a large time range.
      Or maybe he would like to see all the data "from the bird's eye view"?
      In this situation the problem reappears - you have to load all the data into the browser.
    </p>
    <p>
      It is worth to mention that, due to the pixel structure of the graphic monitors, the number of points needed to
      display the data is limited in some sense by the number of pixels in the display.
      In fact, the resolution of the human eye is also limited.

      He is not even fully aware of this due to his abstraction and generalization abilities.

    </p>
    <p>
      As an example, if on a typical monitor we want to view one year range of our data, then the number of measurement
      points (about 3 million) far exceeds the number of pixels horizontally (about 2 thousand).
      The density of points on one pixel will be several thousand.
      Such density of data points on the screen is completely unnecessary due to the just mentioned limitations of
      screen and
      human eye resolution.
    </p>
    <p>
      This natural limitation is used to optimize the aforementioned problem.
      In addition to the fact that only the pieces of data that are temporarily needed are downloaded from the server,
      they are retrieved in the most simplified form.
      Not so simple that it could be noticed by the human eye, but as simple as possible to minimize the
      amount of data being sent.
      So the size of data to be loaded will be related to the number of pixels horizontally &mdash; thus independent of
      the actual length of the viewed time range.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Existing solutions
      <small> &raquo; aggregations</small>
    </h3>
    <p>
      To create a simplified form of measurement data, the concept of <strong>data aggregation </ strong> is introduced.
    </p>
    <p>
      In this case, aggregation is a certain data structure describing the general characteristics of a range of data.
      In order to calculate aggregations, <em> aggregates </ em> are used - mathematical functions that compute specific
      statistics.
      In such systems, the most common aggregates are minimum, maximum, and average.
    </p>
    <p>
      Example of aggregation:
    </p>
    <blockquote>
      In August 2017 the maximum temperature was 33&deg;C, the minimum was 15&deg;C, and the average was 21.34&deg;C.
    </blockquote>
    <p>
      This is a collection of numbers that in a simple and concise manner describes the most important general features
      of the range of measurements made in August 2017.
    </p>
    <p>
      This sort of aggregation is just a simplified form of data. However, this does not mean that it can be used at any
      time.
      It is best to use for a scale that it fits one pixel (horizontally) of the screen.
      If it takes more - the simplification will unfortunately be noticeable to the human eye.
    </p>
    <figure className="my-fig">
      <img src={sparse}/>
      <figcaption>example of min, max (shaded area) and average (a spline inside) aggregations - simplified form is noticeable</figcaption>
    </figure>
    <figure className="my-fig">
      <img src={perPixel}/>
      <figcaption>example of properly fitted aggregations - simplification is not noticeable</figcaption>
    </figure>
    <p>
      In conclusion - this is a popular solution that minimizes communication between the browser and the server and
      this is not noticeable by the human eye.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Existing solutions
      <small> &raquo; web server</small>
    </h3>
    <p>
      The prerequisite for this solution is that the server can respond immediately to each request.
      For this purpose, the server must calculate aggregations (simplified forms) before being asked for it, because
      aggregation calculation can take a long time.
    </p>
    <p>
      The data server holds the original data (generated every 10 seconds &mdash; here 9.5GB) and the calculated
      aggregations of different lengths, for example
      <em> 30s</em>,
      <em> 1m</em>,
      <em> 3m</em>,
      <em> 10m</em>,
      <em> 30m</em>,
      <em> 1h</em>,
      <em> 4h</em>,
      <em> 8h</em>,
      <em> 12h</em>,
      <em> 1d</em>,
      <em> 7d</em>,
      <em> 30d</em>,
      <em> 90d</em>,
      <em> 1y</em>
      .
    </p>
    <p>
      It is important to collect aggregations of various lengths so that for each possible zoom level (scale) of the
      graph you can
      request aggregations which length fits close to does not exceed one pixel horizontally.
      Otherwise, you would need to request for smaller aggregations, resulting in unnecessarily high density of data to
      be drawn on the screen.
      On the other hand &mdash; if the aggregation exceeds one pixel on the screen horizontally, this will be perceived
      as a low-resolution presentation of data.

    </p>
    <figure className="my-fig">
      <img src={fig1_too_dense} alt="missing"/>
      <figcaption>too small aggregations - too many data points per pixel</figcaption>
    </figure>
    <figure className="my-fig">
      <img src={fig2_almost_ok} alt="missing"/>
      <figcaption>almost ok, but there are still two points per pixel</figcaption>
    </figure>
    <figure className="my-fig">
      <img src={fig3_ok} alt="missing"/>
      <figcaption>this aggregation is ok, because we have one point in every pixel</figcaption>
    </figure>
    <figure className="my-fig">
      <img src={fig4_too_sparse} alt="missing"/>
      <figcaption>too sparse aggregations - not every pixel contains data point - the low resolution is noticeable</figcaption>
    </figure>
  </div>
  ,
  <div>
    <h3 className="display-3">Existing solutions
      <small> &raquo; challenges</small>
    </h3>
    <p>
      So we can assume that this solution fully addresses the problem of smooth and unlimited visual exploration of
      large-scale measurement data in a web browser.
      Unfortunately, we did not take into account one important factor - the communication through the network.
    </p>
    <p>
      Since pieces of data are loaded on the user's request, he will be forced to wait for this data before it is
      delivered over the network from the server to the browser.
      He will not be able to smoothly explore the data.
      It is worth mentioning that according to
      <a href="https://www.nngroup.com/articles/response-times-3-important-limits/" target="blank"> Nielsen</a>,
      system response time more than 0.1 seconds is noticeable and when it gets longer &mdash; the
      efficiency of using the system is considerably reduced.
    </p>
    <p>
      It is why my thesis discusses the problem of visual data exploration efficiency.
      As part of this work I have suggested the solution, which further improved versions are demonstrated in this
      survey for subjective assessment.
    </p>
  </div>
  ,
  <div>
    <h3 className="display-3">Proposed solution</h3>
    <p>
      The solution's purpose is to allow users to explore visual data without experiencing the negative effects of
      network
      delays,
      to hide the fact that the data is located on a remote server.

      This way, users who perform visual analysis of data will be able to do their job more efficiently.
      This also will improve users satisfaction of the entire systems.
    </p>
    <p>
      The solution was designed as a universal module (library) running in the browser
      (in <em>JavaScript</em> language), which easily integrates with existing browser applications, also written
      in JavaScript language.
    </p>
    <p>
      This library, named <em>"ExploreJS"</ em>, is built on four pillars:
    </p>
    <ul>
      <li>aggregation cache,</li>
      <li>cache projection,</li>
      <li>prediction engine,</li>
      <li>queries optimization.</li>
    </ul>
    <p>
      In this survey, you will be asked to explore certain data presented on an interactive line chart.
      There will be five versions of the solution presented.
      The first is so-called existing solution, the rest are improved solutions with further pillars.
      Your task will be to express your subjective satisfaction of each version against the previous one.
    </p>
  </div>
][slide]
