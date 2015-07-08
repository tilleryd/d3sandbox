// OrdinalBarChart.react.js

import d3 from 'd3';

import Chart from '../components/Chart.react';
import React from 'react';

class OrdinalBarChart extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
		let width = 960,
		    height = 500;

		let x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1);

		let y = d3.scale.linear()
		    .range([height, 0]);

		let chart = d3.select(".ordinal-bar-chart")
		    .attr("width", width)
		    .attr("height", height);

		d3.csv("barchartdata.csv", type, function(error, data) {
		  x.domain(data.map(function(d) { return d.name; }));
		  y.domain([0, d3.max(data, function(d) { return d.value; })]);

		  let bar = chart.selectAll("g")
		      .data(data)
		    .enter().append("g")
		      .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

		  bar.append("rect")
		      .attr("y", function(d) { return y(d.value); })
		      .attr("height", function(d) { return height - y(d.value); })
		      .attr("width", x.rangeBand());

		  bar.append("text")
		      .attr("x", x.rangeBand() / 2)
		      .attr("y", function(d) { return y(d.value) + 3; })
		      .attr("dy", ".75em")
		      .text(function(d) { return d.value; });
		});

		function type(d) {
		  d.value = +d.value; // coerce to number
		  return d;
		}
  }

  render() {
  	return (
  		<Chart title="OrdinalBarChart">
  		  <svg className="ordinal-bar-chart"></svg>
      </Chart>
    );
  }

}

OrdinalBarChart.propTypes = {
};

OrdinalBarChart.defaultProps = {
};

module.exports = OrdinalBarChart;
