import React from "react";
import {Route, IndexRoute} from "react-router";
import App from "./components/App";
import HomePage from "./components/HomePage";
import FuelSavingsPage from "./containers/FuelSavingsPage"; // eslint-disable-line import/no-named-as-default
import AboutPage from "./components/AboutPage.js";
import NotFoundPage from "./components/NotFoundPage.js";
import ScenarioPage from "./components/pages/scenario/ScenarioPage";
import ScenarioSidebar from "./components/pages/scenario/ScenarioSidebar";
import ScenariosIndexPage from "./components/pages/scenario/ScenariosIndexPage";
import Header from './components/pages/scenario/Header.js';
import SessionPage from "./components/pages/scenario/SessionPage";

const typicalAppPage = children => ({children, pageHeader: Header, sidebar: ScenarioSidebar});

export default (
  <Route path="/" name="mainRoute" component={App} onEnter={() => console.log('root enter')}
         onLeave={() => console.log('root exit')}>
    <IndexRoute component={HomePage} onEnter={() => console.log('index enter')}
                onLeave={() => console.log('index exit')}/>
    <Route path="fuel-savings" component={FuelSavingsPage} onEnter={() => console.log('fuel enter')}
           onLeave={() => console.log('fuel exit')}/>
    <Route path="about" component={AboutPage} onEnter={() => console.log('about enter')}
           onLeave={() => console.log('about exit')}/>
    <Route path="scenario">
      <IndexRoute components={typicalAppPage(ScenariosIndexPage)}/>
      <Route path=":scenarioId">
        <IndexRoute components={typicalAppPage(ScenarioPage)}/>
        <Route path="session">
          <Route path=":sessionId" components={typicalAppPage(SessionPage)}/>
        </Route>
      </Route>
    </Route>
    <Route path="*" component={NotFoundPage} onEnter={() => console.log('* enter')} onLeave={()=>console.log('* exit')}/>
  </Route>
);
