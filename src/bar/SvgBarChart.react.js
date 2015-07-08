// SvgBarChart.react.js

import d3 from 'd3';

import Chart from '../components/Chart.react';
import React from 'react';

class SvgBarChart extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
		let data = [4, 8, 15, 16, 23, 42];

		let x = d3.scale.linear()
		    .domain([0, d3.max(data)])
		    .range([0, 420]);

		let width = 420,
		    barHeight = 20;

		let chart = d3.select(".svg-bar-chart")
		    .attr("width", width)
		    .attr("height", barHeight * data.length);

		let bar = chart.selectAll("g")
		    .data(data)
		  .enter().append("g")
		    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

		bar.append("rect")
		    .attr("width", x)
		    .attr("height", barHeight - 1);

		bar.append("text")
		    .attr("x", function(d) { return x(d) - 3; })
		    .attr("y", barHeight / 2)
		    .attr("dy", ".35em")
		    .text(function(d) { return d; });
  }

  render() {
  	return (
  		<Chart title="SVG Bar Chart">
  		  <svg className="svg-bar-chart"></svg>
      </Chart>
    );
  }

}

SvgBarChart.propTypes = {
};

SvgBarChart.defaultProps = {
};

module.exports = SvgBarChart;
