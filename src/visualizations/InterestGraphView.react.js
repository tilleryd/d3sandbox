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
    d3.json("data/call_me_al.json", function(json) {
      interestGraph(".interest-graph", json);
    });
  }

  render() {
  	return (
  		<Chart title="Interest Graph">
  		  <div className="interest-graph"></div>
      </Chart>
    );
  }

}

InterestGraphView.propTypes = {
};

InterestGraphView.defaultProps = {
};

module.exports = InterestGraphView;
