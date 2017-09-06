import React from 'react';
import PropTypes from 'prop-types';
import {Chart, LocalBinding} from 'explorejs-react';

const ChartTestCase = ({throttleNetwork, onStats, adapter, preset, controlledViewState, statsRef}) => {
  return <div style={{minHeight: 310, maxWidth: 1000, margin: 'auto'}}>
    <LocalBinding batch="/api/batch" manifest="/api/manifest" series={['0']} preset={preset}
                  throttleNetwork={throttleNetwork}
                  onStats={onStats}
                  statsRef={statsRef}
    >
      <Chart serieId="0" adapter={adapter}
             controlledViewState={controlledViewState}
             prediction={preset.usePrediction ? ['basic', 'wider-context'] : ['basic']}/>
    </LocalBinding>
  </div>
};

ChartTestCase.propTypes = {
  throttleNetwork: PropTypes.oneOf([null, PropTypes.number]),
  onStats: PropTypes.func,
  statsRef: PropTypes.func,
  adapter: PropTypes.string,
  preset: PropTypes.object,
  controlledViewState: PropTypes.object

};
export default ChartTestCase;
