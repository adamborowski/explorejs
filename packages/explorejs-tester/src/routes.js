/* eslint-disable no-console */
import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from './components/App';
import HomePage from './components/HomePage';
import FuelSavingsPage from './containers/FuelSavingsPage'; // eslint-disable-line import/no-named-as-default
import AboutPage from './components/AboutPage';
import NotFoundPage from './components/NotFoundPage';
import ScenarioPage from './components/pages/scenario/ScenarioPage';
import ScenarioSidebar from './components/pages/scenario/ScenarioSidebar';
import ScenariosIndexPage from './components/pages/scenario/ScenariosIndexPage';
import ConnectedHeader from './components/pages/scenario/Header';
import SessionPage from './components/pages/scenario/SessionPage';
import SummaryPage from './components/pages/SummaryPage';
import ResultsPage from './features/results/components/ResultsPage';
import PerftestPage from './features/results/components/PerftestPage';
import ResultsSummaryPage from './features/results/components/ResultsSummaryPage';

const typicalAppPage = children => ({children, pageHeader: ConnectedHeader, sidebar: ScenarioSidebar});



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
    <Route path="summary" component={typicalAppPage(SummaryPage)}/>
    <Route path="responses" component={{children: ResultsPage, pageHeader: ConnectedHeader}}/>
    <Route path="responses/summary" component={{children: ResultsSummaryPage, pageHeader: ConnectedHeader}}/>
    <Route path="perftests" component={{children: PerftestPage, pageHeader: ConnectedHeader}}/>
    <Route path="*" component={NotFoundPage} onEnter={() => console.log('* enter')} onLeave={()=>console.log('* exit')}/>
  </Route>
);
