// OrdinalBarChart.react.js

import d3 from 'd3';

import Chart from '../components/Chart.react';
import React from 'react';

class OrdinalBarChart extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
		let margin = {top: 20, right: 30, bottom: 30, left: 40},
		    width = 960 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom;

		let x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1);

		let y = d3.scale.linear()
		    .range([height, 0]);

		let xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		let yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(10, "%");

		let chart = d3.select(".ordinal-bar-chart")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.tsv("data/alphabet.tsv", type, function(error, data) {
		  x.domain(data.map(function(d) { return d.letter; }));
		  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

		  chart.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  chart.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text("Frequency");

		  chart.selectAll(".bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.letter); })
		      .attr("y", function(d) { return y(d.frequency); })
		      .attr("height", function(d) { return height - y(d.frequency); })
		      .attr("width", x.rangeBand());
		});

		function type(d) {
		  d.frequency = +d.frequency; // coerce to number
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
