// HtmlBarChart.react.js
 
import d3 from 'd3';

import Chart from '../components/Chart.react';
import React from 'react';

class HtmlBarChart extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
		let data = [4, 8, 15, 16, 23, 42];

		let x = d3.scale.linear()
		    .domain([0, d3.max(data)])
		    .range([0, 420]);

		d3.select(".html-bar-chart")
		  .selectAll("div")
		    .data(data)
		  .enter().append("div")
		    .style("width", function(d) { return x(d) + "px"; })
		    .text(function(d) { return d; });
  }

  render() {
  	return (
  		<Chart title="HTML">
  		  <div className="html-bar-chart"></div>
      </Chart>
    );
  }

}

HtmlBarChart.propTypes = {
};

HtmlBarChart.defaultProps = {
};

module.exports = HtmlBarChart;
