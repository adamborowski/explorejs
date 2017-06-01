/**
 * A component which renders dom element for chart and instantiates adapter based on given type
 * We can set different type and serie cache at any time - it should reinitialize whole chart and adapter
 */
import React, {PropTypes} from 'react';
import AdapterFactory from "../../../utils/AdapterFactory";

export class Chart extends React.Component {
  render() {
    return <div className="a-chart" ref={chart => this.chart = chart}/>
  }

  componentDidMount() {
    this._createAdapter();
  }

  /**
   * If adapterType or serieCache will change - destroy previous adapter and create new
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.adapterType !== nextProps.adapterType || this.props.serieCache !== nextProps.serieCache) {
      this._createAdapter();
    }
  }

  componentWillUnmount() {
    this.adapter.destroy();
  }

  _createAdapter() {
    if (this.adapter) {
      this.adapter.destroy();
    }
    const {serieCache, adapterType} = this.props;
    if (serieCache == null || adapterType == null) {
      return;
    }
    this.adapter = AdapterFactory(adapterType, serieCache, this.chart);
  }
}

Chart.propTypes = {
  someData: PropTypes.string,
  serieCache: PropTypes.object,
  adapterType: PropTypes.object
};
