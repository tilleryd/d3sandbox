// InterestGraphView.react.js

import d3 from 'd3';

import Chart from '../components/Chart.react';
import InterestGraph from 'visualizations/InterestGraph';
import React from 'react';

class InterestGraphView extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let interestGraph = InterestGraph();
    d3.json("data/interestGraph.json", function(json) {
      interestGraph("#forceDirected1", json);
    });
  }

  render() {
  	return (
  		<Chart title="Graph 1">
  		  <div id="forceDirected1" className="force-directed-graph"></div>
      </Chart>
    );
  }

}

InterestGraphView.propTypes = {
};

InterestGraphView.defaultProps = {
};

module.exports = InterestGraphView;
