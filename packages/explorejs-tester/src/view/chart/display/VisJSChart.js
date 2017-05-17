import React, {PropTypes} from 'react';
import {VisJsAdapter} from "explorejs-adapters";

/**
 * A component which is able to display a VisJS chart and works with data adapter
 */
export class VisJSChart extends React.Component {
  render() {
    return <div>I am VisJS chart!!!! {this.props.someData}
      <div className="a-chart" ref={(chart) => {
        this.chart = chart;
      }}/>
    </div>
  }

  componentDidMount() {
    this.adapter = new VisJsAdapter(this.chart);
  }
}

VisJSChart.propTypes = {
  someData: PropTypes.string,
  adapter: PropTypes.object
};
